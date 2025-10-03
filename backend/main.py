# backend/main.py
import json
import os
from fastapi import FastAPI, HTTPException, Query, Request  # ← أضف Request هنا
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

# استيراد المكونات المحلية
from config_loader import get_settings
from sales_loader import load_sales_from_google_sheets
from atom_loader import load_atom_listings
from appraisal_engine import AppraisalEngine, ATOM_CATEGORIES
from ai_enhancer import AIEnhancer
from usage_tracker import usage_tracker  

# إنشاء التطبيق
app = FastAPI(title="Domain Appraisal API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# نموذج الطلب
class AppraiseRequest(BaseModel):
    domain: str
    use_ai: bool = False

@app.post("/appraise")
async def appraise_domain(request: Request, appraisal_request: AppraiseRequest):  # ← تغيير هنا
    try:
        # ← أضف هذا الجزء الجديد للتحقق من الحد اليومي
        client_ip = request.client.host
        user_agent = request.headers.get("user-agent", "")
        
        usage_check = usage_tracker.can_make_request(client_ip, user_agent)
        
        if not usage_check["allowed"]:
            raise HTTPException(
                status_code=429, 
                detail={
                    "error": "DAILY_LIMIT_EXCEEDED",
                    "message": usage_check["message"],
                    "remaining": usage_check["remaining"],
                    "reset_time": usage_check["reset_time"]
                }
            )
        # ← نهاية الجزء المضاف
        
        settings = get_settings()
        domain = appraisal_request.domain.lower().strip()  # ← تغيير هنا

        # 1. تحميل المبيعات التاريخية
        sales = load_sales_from_google_sheets(
            spreadsheet_id=settings['google_sheets_spreadsheet_id'],
            sheet_name=settings.get('google_sheets_sheet_name', 'Domains'),
            cache_ttl=settings.get('sales_cache_ttl_seconds', 300)
        )
        if not sales:
            raise HTTPException(status_code=500, detail="No historical sales data available")

        # 2. تحميل عروض Atom
        atom_listings = load_atom_listings(
            spreadsheet_id=settings['atom_spreadsheet_id'],
            sheet_name=settings.get('atom_sheet_name', 'Atom'),
            cache_ttl=settings.get('atom_cache_ttl_seconds', 3600)
        )

        # 3. إعداد محرك الذكاء الاصطناعي (للاستخدام في التصنيف والرؤى)
        ai_engine = None
        ai_enabled = settings.get("ai_enabled", False) and bool(settings.get("ai_api_key"))
        if ai_enabled:
            ai_engine = AIEnhancer(api_key=settings["ai_api_key"], provider="deepseek")

        # 4. تقييم النطاق (مع دعم Atom + تصنيف AI)
        engine = AppraisalEngine()
        result = engine.appraise(
            domain=domain,
            all_sales=sales,
            atom_listings=atom_listings,
            ai_engine=ai_engine  # قد يستخدمه للتصنيف
        )

        # 5. إضافة رؤية ذكية (AI Insight) إذا طُلب
        ai_insight = ""
        if appraisal_request.use_ai and ai_enabled:  # ← تغيير هنا
            ai_insight = ai_engine.get_insight(result)

        # 6. بناء الاستجابة النهائية
        response = {
            "domain": result["domain"],
            "estimated_price": result["estimated_price"],
            "confidence": result["confidence"],
            "reasons": result["reasons"],
            "category": result.get("category", "Generic"),
            "comparables": result.get("comparables", []),
            "atom_listings": result.get("atom_listings", []),
            "ai_insight": ai_insight,
            "usage_info": {  # ← أضف هذا الجزء الجديد
                "remaining_requests": usage_check["remaining"],
                "daily_limit": 3,
                "message": usage_check["message"]
            }
        }

        return response

    except HTTPException:  # ← أضف هذا لمعالجة HTTPException بشكل منفصل
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Appraisal failed: {str(e)}")

# ← أضف هذه ال endpoints الجديدة
@app.get("/usage")
async def get_usage_info(request: Request):
    """الحصول على معلومات الاستخدام الحالية"""
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "")
    
    stats = usage_tracker.get_usage_stats(client_ip, user_agent)
    return stats

@app.get("/sales")
async def get_sales(page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200)):
    try:
        from .sales_loader import get_latest_sales
        return get_latest_sales(page=page, size=size)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sales loading error: {str(e)}")

@app.get("/health")
async def health_check():
    # تنظيف السجلات القديمة عند كل فحص صحة
    usage_tracker.cleanup_old_records()
    return {"status": "ok", "message": "Domain appraisal API is running"}

# endpoint جديد لإعادة تعيين الحدود (للاستخدام الداخلي فقط)
@app.post("/admin/reset-limits")
async def reset_limits(secret_key: str = Query(...)):
    """إعادة تعيين جميع حدود الاستخدام (للتطوير فقط)"""
    if secret_key != "YOUR_SECRET_ADMIN_KEY":  # ← غيّر هذا إلى كود سري قوي
        raise HTTPException(status_code=403, detail="Forbidden")
    
    # هذا مثال بسيط - يمكنك تطويره حسب الحاجة
    import sqlite3
    conn = sqlite3.connect("usage.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usage_records")
    conn.commit()
    conn.close()
    
    return {"message": "All usage limits have been reset"}