// frontend/config/features.js
export const FEATURES = {
  // --- الوظائف الجديدة (مفعلة الآن) ---
  NEW_APPRAISAL: true,        // تقييم النطاق من Python API
  SALES_TABLE: true,          // جدول المبيعات

  // --- الوظائف القديمة (معطلة مؤقتًا) ---
  DOMAIN_AVAILABILITY: false, // لوحة التوفر
  DOMAIN_SALES: false,        // البحث في المبيعات التاريخية
  LEAD_GENERATOR: false,
  CPC_SEARCH_VOLUME: false,
  BACKLINK_CHECKER: false,
  ALTERNATIVE_SPELLINGS: false,
  DOMAIN_GENERATOR: false,
  TRADEMARK_CHECKS: false,
  NEW_REGISTRATIONS: false,
  DOMAIN_HISTORY: false,      // Wayback Machine
  ONE_WORD_DOMAINS: false,
  TWO_WORD_DOMAINS: false,
  SUGGESTED_SALE_PRICE: false, // مُزال من العرض (لكن الكود باقٍ)
  DOMAIN_PROVIDERS: false,     // معطّل حتى تحصل على روابط الأفلييت
};