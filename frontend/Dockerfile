FROM node:18-alpine

WORKDIR /app

# نسخ package files أولاً
COPY package*.json ./
RUN npm install

# نسخ باقي الملفات
COPY . .

# بناء التطبيق
RUN npm run build

# المنفذ
EXPOSE 3000

# أمر التشغيل
CMD ["npm", "start"]