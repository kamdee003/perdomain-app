# backend/usage_tracker.py
import sqlite3
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import hashlib

class UsageTracker:
    def __init__(self, db_path: str = "usage.db"):
        # تأكد من أن المسار مطلق أو في المجلد الحالي
        if not os.path.isabs(db_path):
            # استخدم المسار الحالي للمشروع
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.db_path = os.path.join(base_dir, db_path)
        else:
            self.db_path = db_path
        
        self._init_db()
    
    def _init_db(self):
        """تهيئة قاعدة البيانات"""
        try:
            # إنشاء المجلد إذا لزم الأمر
            db_dir = os.path.dirname(self.db_path)
            if db_dir and not os.path.exists(db_dir):
                os.makedirs(db_dir, exist_ok=True)
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS usage_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_hash TEXT NOT NULL,
                    date TEXT NOT NULL,
                    request_count INTEGER DEFAULT 0,
                    last_request TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_user_date 
                ON usage_records(user_hash, date)
            ''')
            
            conn.commit()
            conn.close()
            print(f"✅ قاعدة بيانات الاستخدام جاهزة: {self.db_path}")
            
        except Exception as e:
            print(f"❌ خطأ في تهيئة قاعدة البيانات: {e}")
            # استخدم قاعدة بيانات في الذاكرة كبديل
            self.db_path = ":memory:"
    
    def _get_user_hash(self, ip: str, user_agent: str) -> str:
        """إنشاء hash فريد للمستخدم"""
        unique_string = f"{ip}-{user_agent}"
        return hashlib.md5(unique_string.encode()).hexdigest()
    
    def can_make_request(self, ip: str, user_agent: str, daily_limit: int = 3) -> Dict[str, Any]:
        """التحقق مما إذا كان يمكن للمستخدم إجراء طلب"""
        try:
            user_hash = self._get_user_hash(ip, user_agent)
            today = datetime.now().strftime("%Y-%m-%d")
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # البحث عن السجل اليومي
            cursor.execute('''
                SELECT request_count, last_request 
                FROM usage_records 
                WHERE user_hash = ? AND date = ?
            ''', (user_hash, today))
            
            result = cursor.fetchone()
            
            if result:
                request_count, last_request = result
                remaining = daily_limit - request_count
                
                if request_count >= daily_limit:
                    conn.close()
                    return {
                        "allowed": False,
                        "remaining": 0,
                        "reset_time": "tomorrow",
                        "message": "You have used all your daily requests (3/3). Please come back tomorrow."
                    }
                
                # تحديث العداد
                cursor.execute('''
                    UPDATE usage_records 
                    SET request_count = request_count + 1, last_request = ?
                    WHERE user_hash = ? AND date = ?
                ''', (datetime.now().isoformat(), user_hash, today))
                
            else:
                # إنشاء سجل جديد
                cursor.execute('''
                    INSERT INTO usage_records (user_hash, date, request_count, last_request)
                    VALUES (?, ?, 1, ?)
                ''', (user_hash, today, datetime.now().isoformat()))
                remaining = daily_limit - 1
            
            conn.commit()
            conn.close()
            
            return {
                "allowed": True,
                "remaining": remaining,
                "reset_time": "tomorrow",
                "message": f"Your remaining requests today: {remaining}/3"
            }
            
        except Exception as e:
            print(f"⚠️ خطأ في تتبع الاستخدام: {e}")
            # في حالة الخطأ، اسمح بالطلب لتجنب تعطيل الخدمة
            return {
                "allowed": True,
                "remaining": 2,  # قيمة افتراضية آمنة
                "reset_time": "unknown",
                "message": "Usage tracking is temporarily disabled"
            }
    
    def get_usage_stats(self, ip: str, user_agent: str) -> Dict[str, Any]:
        """الحصول على إحصائيات الاستخدام"""
        try:
            user_hash = self._get_user_hash(ip, user_agent)
            today = datetime.now().strftime("%Y-%m-%d")
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT request_count, last_request 
                FROM usage_records 
                WHERE user_hash = ? AND date = ?
            ''', (user_hash, today))
            
            result = cursor.fetchone()
            conn.close()
            
            if result:
                request_count, last_request = result
                return {
                    "today_usage": request_count,
                    "remaining": max(0, 3 - request_count),
                    "last_request": last_request,
                    "limit": 3
                }
            else:
                return {
                    "today_usage": 0,
                    "remaining": 3,
                    "last_request": None,
                    "limit": 3
                }
                
        except Exception as e:
            print(f"⚠️ خطأ في جلب إحصائيات الاستخدام: {e}")
            return {
                "today_usage": 0,
                "remaining": 3,
                "last_request": None,
                "limit": 3
            }
    
    def cleanup_old_records(self, days: int = 30):
        """تنظيف السجلات القديمة"""
        try:
            cutoff_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                DELETE FROM usage_records 
                WHERE date < ?
            ''', (cutoff_date,))
            
            conn.commit()
            conn.close()
            print(f"✅ تم تنظيف السجلات الأقدم من {days} يوم")
            
        except Exception as e:
            print(f"⚠️ خطأ في تنظيف السجلات القديمة: {e}")

# إنشاء instance عالمي
usage_tracker = UsageTracker()