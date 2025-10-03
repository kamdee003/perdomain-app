import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
from appraisal_engine import AppraisalEngine

# مسارات المشروع
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")
CONFIG_PATH = os.path.join(BASE_DIR, "config", "app_settings.json")

def load_settings():
    """تحميل إعدادات Google Sheets."""
    import json
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def prepare_training_data(sales_data):
    """تحضير بيانات التدريب من قائمة المبيعات."""
    engine = AppraisalEngine()
    features_list = []
    prices = []
    
    for sale in sales_data:
        try:
            domain = sale['domain']
            price = sale['price']
            
            # استخراج الميزات
            features = engine.extract_features(domain)
            features['price'] = price
            features_list.append(features)
            prices.append(price)
        except Exception as e:
            print(f"تخطي النطاق {sale.get('domain', 'Unknown')}: {e}")
            continue
    
    df = pd.DataFrame(features_list)
    
    # إزالة الأعمدة النصية (غير العددية)
    numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
    if 'price' not in numeric_columns:
        numeric_columns.append('price')
    
    return df[numeric_columns]
def train_and_save_model():
    """تدريب النموذج وحفظه."""
    print("جارٍ تحميل الإعدادات...")
    settings = load_settings()
    
    print("جارٍ تحميل بيانات المبيعات من Google Sheets...")
    from sales_loader import load_sales_from_google_sheets
    sales = load_sales_from_google_sheets(
        settings['google_sheets_csv_url'],
        cache_ttl=0  # لا تستخدم التخزين المؤقت للتدريب
    )
    
    if len(sales) < 100:
        raise ValueError(f"بيانات غير كافية للتدريب. العدد الحالي: {len(sales)}")
    
    print(f"تم تحميل {len(sales)} سجل مبيعات.")
    
    # تحضير البيانات
    df = prepare_training_data(sales)
    if df.empty:
        raise ValueError("فشل في استخراج الميزات من البيانات.")
    
    # فصل الميزات عن الهدف
    X = df.drop('price', axis=1)
    y = df['price']
    
    # حفظ أسماء الميزات
    feature_names = list(X.columns)
    
    # تقسيم البيانات
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print("جارٍ تدريب النموذج...")
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    # تقييم الأداء
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"متوسط الخطأ المطلق (MAE): ${mae:,.0f}")
    print(f"معامل التحديد (R²): {r2:.3f}")
    
    # إنشاء مجلد النموذج إذا لم يكن موجودًا
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # حفظ النموذج وأسماء الميزات
    joblib.dump(model, os.path.join(MODEL_DIR, "domain_valuation_model.pkl"))
    joblib.dump(feature_names, os.path.join(MODEL_DIR, "feature_names.pkl"))
    
    print(f"تم حفظ النموذج في: {MODEL_DIR}")
    print("التدريب اكتمل بنجاح!")

if __name__ == "__main__":
    train_and_save_model()