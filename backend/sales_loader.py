import time
import os
import re
from typing import List, Dict, Optional
from datetime import datetime

# Google API
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# متغيرات للتخزين المؤقت
_cached_sales: Optional[List[Dict]] = None
_cache_timestamp: float = 0

def load_sales_from_google_sheets(spreadsheet_id: str, sheet_name: str = "Sheet1", cache_ttl: int = 300) -> List[Dict]:
    """
    يحمل بيانات المبيعات من Google Sheets باستخدام Sheets API.
    """
    global _cached_sales, _cache_timestamp
    
    current_time = time.time()
    if _cached_sales is not None and (current_time - _cache_timestamp) < cache_ttl:
        return _cached_sales.copy()
    
    try:
        # تحميل بيانات الاعتماد
        creds_path = os.path.join(os.path.dirname(__file__), "..", "config", "credentials.json")
        creds = Credentials.from_service_account_file(
            creds_path, 
            scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
        )
        service = build("sheets", "v4", credentials=creds)
        
        # قراءة البيانات
        sheet = service.spreadsheets()
        range_name = f"'{sheet_name}'!A:F"  # ← الآن نقرأ 6 أعمدة (A إلى F)
        values_result = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
        values = values_result.get("values", [])
        
        if not values:
            raise ValueError("لا توجد بيانات في Google Sheets")
        
        # التحقق من العناوين
        headers = values[0]
        expected_headers = ["Domain", "Price", "Date", "Venue", "Source", "Source_Url"]
        if headers != expected_headers:
            raise ValueError(f"الأعمدة غير متوافقة. المتوقع: {expected_headers}")
        
        sales = []
        for row in values[1:]:
            if len(row) < 6:
                # ملء القيم المفقودة بقيم افتراضية
                row += [""] * (6 - len(row))
            
            domain = str(row[0]).strip().lower()
            price = _parse_price(row[1])
            date = _parse_date(row[2])
            venue = str(row[3]).strip()
            source_text = str(row[4]).strip() if row[4] else "Source"
            source_url = str(row[5]).strip() if row[5] else ""
            
            if price and date and _is_valid_domain(domain):
                sales.append({
                    'domain': domain,
                    'price': price,
                    'date': date,
                    'venue': venue,
                    'source_text': source_text,
                    'source_url': source_url
                })
        
        sales.sort(key=lambda x: x['date'], reverse=True)
        _cached_sales = sales
        _cache_timestamp = current_time
        return sales.copy()
        
    except Exception as e:
        print(f"خطأ في تحميل المبيعات: {e}")
        return _cached_sales or []

def get_latest_sales(page: int = 1, size: int = 10) -> Dict:
    from .config_loader import get_settings
    settings = get_settings()
    spreadsheet_id = settings['google_sheets_spreadsheet_id']
    sheet_name = settings.get('google_sheets_sheet_name', 'Sheet1')
    sales = load_sales_from_google_sheets(spreadsheet_id, sheet_name)
    # فرز إضافي لضمان الترتيب
    sales.sort(key=lambda x: x['date'], reverse=True)
    total_sales = len(sales)
    total_pages = (total_sales + size - 1) // size
    start = (page - 1) * size
    end = start + size
    page_sales = sales[start:end]
    return {
        'data': page_sales,
        'page': page,
        'size': size,
        'total_pages': total_pages,
        'total_sales': total_sales
    }

# --- الدوال المساعدة (كما هي) ---
def _is_valid_domain(domain: str) -> bool:
    if not domain or '.' not in domain:
        return False
    if domain.startswith('-') or domain.endswith('-'):
        return False
    if not re.match(r'^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$', domain):
        return False
    return True

def _parse_price(price) -> Optional[float]:
    if not price:
        return None
    if isinstance(price, (int, float)):
        return float(price)
    if isinstance(price, str):
        cleaned = re.sub(r'[^\d.,]', '', price)
        if not cleaned:
            return None
        if ',' in cleaned and '.' not in cleaned:
            cleaned = cleaned.replace(',', '.')
        elif ',' in cleaned and '.' in cleaned:
            cleaned = cleaned.replace(',', '')
        try:
            return float(cleaned)
        except:
            return None
    return None

def _parse_date(date_value) -> Optional[str]:
    if not date_value:
        return None
    if isinstance(date_value, str):
        for fmt in ['%m/%d/%Y', '%d/%m/%Y', '%Y-%m-%d']:
            try:
                dt = datetime.strptime(date_value.strip(), fmt)
                return dt.strftime('%Y-%m-%d')
            except ValueError:
                continue
    elif isinstance(date_value, datetime):
        return date_value.strftime('%Y-%m-%d')
    return None