FROM python:3.9-slim

WORKDIR /app

# نسخ ملف المتطلبات أولاً
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ ملفات الـ backend
COPY backend/ .

# نسخ مجلد model إذا كان موجوداً (باستخدام .dockerignore للتحكم)
COPY model/ ./model/ || echo "Model directory not found, continuing..."

# نسخ مجلد config
COPY config/ ./config/ || echo "Config directory not found, continuing..."

# إنشاء مجلد model إذا لم يكن موجوداً
RUN mkdir -p model

# المنفذ
EXPOSE 8080

# أمر التشغيل
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
