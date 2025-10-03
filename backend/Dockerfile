FROM python:3.9-slim

WORKDIR /app

# نسخ ملف المتطلبات أولاً (لتحسين caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ باقي الملفات
COPY . .

# إنشاء مجلد model إذا لم يكن موجوداً
RUN mkdir -p model

# المنفذ الذي سيعمل عليه التطبيق
EXPOSE 8000

# أمر التشغيل
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]