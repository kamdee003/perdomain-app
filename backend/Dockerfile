FROM python:3.9-slim

WORKDIR /app

# نسخ ملف المتطلبات أولاً من المسار الصحيح
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# نسخ باقي ملفات الـ backend
COPY backend/ .

# نسخ مجلد model من الجذر
COPY model/ ./model/

# نسخ مجلد config من الجذر
COPY config/ ./config/

# إنشاء مجلد model إذا لم يكن موجوداً
RUN mkdir -p model

# المنفذ
EXPOSE 8000

# أمر التشغيل
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
