// frontend/next.config.js
const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  // تمكين ISR للصفحات الثابتة
  async rewrites() {
    return [];
  },
  // تحسين الصور (اختياري لكن مفيد)
  images: {
    remotePatterns: [],
  },
  // تمكين SSG تلقائيًا عند الإمكان
  output: 'standalone', // أو احذفه إذا كنت تستخدم server.js
};
