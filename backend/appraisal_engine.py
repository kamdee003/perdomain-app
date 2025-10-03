# backend/appraisal_engine.py
import os
import re
import joblib
import numpy as np
from typing import Dict, List, Any, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model", "domain_valuation_model.pkl")
FEATURE_NAMES_PATH = os.path.join(BASE_DIR, "model", "feature_names.pkl")

# قائمة الفئات الرسمية من Atom (للاستخدام في حالة فشل AI)
ATOM_CATEGORIES = [
    "Travel & Hotel", "Tech, Internet, Software", "E-Commerce & Retail",
    "Outdoor & Adventure", "Food & Drink", "Agency & Consulting",
    "Transportation", "Fashion & Clothing", "Video, Books & Magazines",
    "Entertainment & Arts", "Health & Wellness", "Professional Services",
    "Real Estate", "Event Planning & Services", "Events & Conferences",
    "Education & Training", "Green & Organic", "Beauty & Cosmetics",
    "Social & Networking", "Food Delivery & Meal Kits", "Automotive",
    "Property Management", "Finance", "Restaurants", "Life Coach, Motivational",
    "Fitness & Gym", "Marketing & Advertising", "Home & Garden", "Sports",
    "Non-Profit & Community", "Virtual Reality", "Home", "Location Specific, GEO",
    "Catering", "Interior Design", "News & Media", "Ride-Sharing", "Aerospace",
    "Sales & Marketing", "Games & Recreational", "Music & Audio",
    "Construction & Architecture", "Bots & AI", "Venture Capital & Investment",
    "Gaming", "Beer, Wine & Spirits", "Coffee & Tea", "Security", "Metaverse",
    "Furniture & Home Furnishings", "Community Organization", "Recruitment & Staffing",
    "Solar & Clean Energy", "Cryptocurrency, Blockchain", "Politics, Government",
    "Analytics", "Startup Incubator", "Bar & Brewery", "Medical & Dental",
    "Tutoring & Test Prep", "Dating & Relationship", "Spas & Salons", "Mobile App",
    "Agriculture Company", "Weddings & Bridal", "Manufacturing & Industrial", "Drone",
    "Cleaning", "Bikes Brand", "Fintech (Finance Technology)", "Insurance", "Kids & Baby",
    "Senior Living and Care", "Cannabis, Marijuana & CBD", "Science & Engineering",
    "Legal, Attorney, Law", "Photography", "Payment", "Video Streaming", "Jewelry",
    "Pets", "Internet of Things (IOT)", "NFT", "Website & Graphic Design", "Landscaping",
    "Movies & TV", "Biotech", "Food Trucks", "Something Else", "Co Working Space",
    "Footwear", "Vitamins and Supplements", "Storage", "Crowdfunding",
    "Pharma", "Office & Business Supplies", "Podcast", "Oil and Gas"
]

# نظام الكلمات المفتاحية المحسن
KEYWORD_CATEGORY_MAP = {
    # Tech & AI
    'ai': 'Bots & AI', 'bot': 'Bots & AI', 'tech': 'Tech, Internet, Software',
    'app': 'Mobile App', 'cloud': 'Tech, Internet, Software', 'data': 'Analytics',
    'code': 'Tech, Internet, Software', 'dev': 'Tech, Internet, Software',
    'software': 'Tech, Internet, Software', 'digital': 'Tech, Internet, Software',
    'compute': 'Tech, Internet, Software', 'net': 'Tech, Internet, Software',
    'web': 'Tech, Internet, Software', 'api': 'Tech, Internet, Software',
    'io': 'Tech, Internet, Software', 'it': 'Tech, Internet, Software',
    
    # Health & Wellness
    'health': 'Health & Wellness', 'med': 'Medical & Dental', 'well': 'Health & Wellness',
    'care': 'Health & Wellness', 'clinic': 'Medical & Dental', 'hospital': 'Medical & Dental',
    'dental': 'Medical & Dental', 'therapy': 'Health & Wellness', 'fitness': 'Fitness & Gym',
    'gym': 'Fitness & Gym', 'yoga': 'Fitness & Gym', 'wellness': 'Health & Wellness',
    'medical': 'Medical & Dental', 'doctor': 'Medical & Dental', 'pharma': 'Pharma',
    'clinic': 'Medical & Dental',
    
    # E-commerce & Retail
    'shop': 'E-Commerce & Retail', 'store': 'E-Commerce & Retail', 'market': 'E-Commerce & Retail',
    'buy': 'E-Commerce & Retail', 'sale': 'E-Commerce & Retail', 'deal': 'E-Commerce & Retail',
    'mart': 'E-Commerce & Retail', 'mall': 'E-Commerce & Retail', 'cart': 'E-Commerce & Retail',
    'trade': 'E-Commerce & Retail', 'commerce': 'E-Commerce & Retail', 'retail': 'E-Commerce & Retail',
    
    # Finance & Crypto
    'finance': 'Finance', 'bank': 'Finance', 'pay': 'Payment', 'coin': 'Cryptocurrency, Blockchain',
    'crypto': 'Cryptocurrency, Blockchain', 'bitcoin': 'Cryptocurrency, Blockchain',
    'cryptocurrency': 'Cryptocurrency, Blockchain', 'blockchain': 'Cryptocurrency, Blockchain',
    'wallet': 'Cryptocurrency, Blockchain', 'token': 'Cryptocurrency, Blockchain',
    'nft': 'NFT', 'defi': 'Cryptocurrency, Blockchain', 'ether': 'Cryptocurrency, Blockchain',
    'fintech': 'Fintech (Finance Technology)', 'invest': 'Venture Capital & Investment',
    'capital': 'Venture Capital & Investment', 'wealth': 'Finance',
    
    # Food & Drink
    'food': 'Food & Drink', 'restaurant': 'Restaurants', 'coffee': 'Coffee & Tea',
    'brew': 'Bar & Brewery', 'wine': 'Beer, Wine & Spirits', 'beer': 'Beer, Wine & Spirits',
    'tea': 'Coffee & Tea', 'bistro': 'Restaurants', 'cafe': 'Restaurants',
    'pizza': 'Restaurants', 'burger': 'Restaurants', 'kitchen': 'Restaurants',
    'bar': 'Bar & Brewery', 'spirits': 'Beer, Wine & Spirits',
    
    # Real Estate
    'realestate': 'Real Estate', 'property': 'Real Estate', 'home': 'Home & Garden',
    'house': 'Real Estate', 'estate': 'Real Estate', 'rent': 'Real Estate',
    'realtor': 'Real Estate', 'properties': 'Real Estate', 'homes': 'Home & Garden',
    'villa': 'Real Estate', 'apartment': 'Real Estate',
    
    # Automotive
    'auto': 'Automotive', 'car': 'Automotive', 'vehicle': 'Automotive',
    'drive': 'Automotive', 'motor': 'Automotive', 'cars': 'Automotive',
    'auto': 'Automotive', 'bike': 'Bikes Brand', 'bikes': 'Bikes Brand',
    
    # Education
    'edu': 'Education & Training', 'learn': 'Education & Training', 'course': 'Education & Training',
    'school': 'Education & Training', 'academy': 'Education & Training', 'study': 'Education & Training',
    'training': 'Education & Training', 'tutor': 'Tutoring & Test Prep', 'class': 'Education & Training',
    
    # Travel & Hospitality
    'travel': 'Travel & Hotel', 'hotel': 'Travel & Hotel', 'tour': 'Travel & Hotel',
    'vacation': 'Travel & Hotel', 'flight': 'Travel & Hotel', 'booking': 'Travel & Hotel',
    'trip': 'Travel & Hotel', 'holiday': 'Travel & Hotel',
    
    # Marketing & Business
    'market': 'Marketing & Advertising', 'ad': 'Marketing & Advertising', 
    'agency': 'Agency & Consulting', 'consult': 'Agency & Consulting',
    'business': 'Professional Services', 'consulting': 'Agency & Consulting',
    'brand': 'Marketing & Advertising', 'media': 'News & Media',
    
    # Home & Garden
    'garden': 'Home & Garden', 'decor': 'Home & Garden', 'furniture': 'Furniture & Home Furnishings',
    'home': 'Home & Garden', 'interior': 'Interior Design', 'design': 'Website & Graphic Design',
    
    # Entertainment
    'game': 'Gaming', 'gaming': 'Gaming', 'play': 'Gaming', 'music': 'Music & Audio',
    'audio': 'Music & Audio', 'video': 'Video Streaming', 'stream': 'Video Streaming',
    'tv': 'Movies & TV', 'movie': 'Movies & TV', 'film': 'Movies & TV',
    'entertainment': 'Entertainment & Arts',
    
    # Sports & Fitness
    'sport': 'Sports', 'fitness': 'Fitness & Gym', 'workout': 'Fitness & Gym',
    'gym': 'Fitness & Gym', 'fit': 'Fitness & Gym',
}

class AppraisalEngine:
    def __init__(self):
        self.model = None
        self.feature_names = None
        self._load_model()

    def _load_model(self):
        """تحميل النموذج المدرب - يبقى كما هو"""
        if os.path.exists(MODEL_PATH) and os.path.exists(FEATURE_NAMES_PATH):
            self.model = joblib.load(MODEL_PATH)
            self.feature_names = joblib.load(FEATURE_NAMES_PATH)
        else:
            print("Warning: Model not found.")

    def get_realistic_tld_scores(self) -> Dict[str, float]:
        """إرجاع TLD scores معدلة بشكل واقعي"""
        return {
            'com': 1.0,    # الأساس
            'ai': 0.65,    # تخفيض من 0.95
            'io': 0.6,     # تخفيض من 0.9
            'co': 0.55,    # تخفيض من 0.85
            'app': 0.5,    # تخفيض من 0.85
            'net': 0.45,   # تخفيض من 0.7
            'org': 0.4,    # تخفيض من 0.6
            'tech': 0.35,  # تخفيض من 0.8
            'xyz': 0.2,    # تخفيض من 0.4
            'top': 0.15,   # تخفيض من 0.35
            'og': 0.25     # تخفيض من 0.6
        }

    def extract_features(self, domain: str) -> Dict[str, Any]:
        """استخراج الميزات - معدل مع TLD الجديد"""
        name, tld = self._split_domain(domain)
        tld_scores = self.get_realistic_tld_scores()
        
        high_value_keywords = {
            'ai', 'agent', 'cloud', 'medic', 'lean', 'glitch', 'content',
            'digital', 'smart', 'tech', 'app', 'crypto', 'nft', 'blockchain'
        }
        keyword_score = sum(1 for kw in high_value_keywords if kw.lower() in name.lower())
        vowel_ratio = len([c for c in name if c.lower() in 'aeiou']) / max(len(name), 1)
        has_hyphen = 1 if '-' in name else 0
        has_digits = 1 if any(c.isdigit() for c in name) else 0
        digit_count = sum(c.isdigit() for c in name)
        length = len(name)
        
        return {
            'length': length,
            'tld_score': tld_scores.get(tld.lower(), 0.1),  # قيمة افتراضية أقل
            'has_hyphen': has_hyphen,
            'has_digits': has_digits,
            'digit_count': digit_count,
            'vowel_ratio': vowel_ratio,
            'keyword_score': keyword_score,
            'is_brandable': 1 if (5 <= length <= 12 and not name.isdigit()) else 0,
            'tld': tld.lower()
        }

    def _split_domain(self, domain: str) -> tuple:
        """تقسيم النطاق - يبقى كما هو"""
        parts = domain.lower().rsplit('.', 1)
        if len(parts) == 2:
            return parts[0], parts[1]
        return domain, ''

    def _extract_keywords(self, domain: str) -> List[str]:
        """استخراج الكلمات المفتاحية من النطاق"""
        name = self._split_domain(domain)[0].lower()
        keywords_found = []
        
        for keyword in KEYWORD_CATEGORY_MAP.keys():
            if keyword in name:
                keywords_found.append(keyword)
        
        return keywords_found

    def _calculate_keyword_similarity(self, keywords1: List[str], keywords2: List[str]) -> float:
        """حساب تشابه الكلمات المفتاحية"""
        if not keywords1 and not keywords2:
            return 0.0
        if not keywords1 or not keywords2:
            return 0.0
        
        set1, set2 = set(keywords1), set(keywords2)
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        
        return intersection / union if union > 0 else 0.0

    def enhanced_classification(self, domain: str, use_ai: bool = True, ai_engine=None) -> str:
        """تصنيف محسن يجمع بين الكلمات المفتاحية والذكاء الاصطناعي"""
        name = self._split_domain(domain)[0].lower()
        
        # البحث في الكلمات المفتاحية أولاً
        for keyword, category in KEYWORD_CATEGORY_MAP.items():
            if keyword in name:
                return category
        
        # إذا فشل الكلمات المفتاحية، نستخدم الذكاء الاصطناعي (إذا متوفر)
        if use_ai and ai_engine:
            ai_category = ai_engine.classify_domain(domain, ATOM_CATEGORIES)
            if ai_category != "Generic":
                return ai_category
        
        # Fallback نهائي
        return "Generic"

    def find_comparable_sales_enhanced(self, domain: str, all_sales: List[Dict], top_k: int = 5) -> List[Dict]:
        """بحث محسن في المبيعات التاريخية يستخدم الكلمات المفتاحية"""
        domain_features = self.extract_features(domain)
        domain_keywords = self._extract_keywords(domain)
        
        comparables = []
        for sale in all_sales:
            try:
                sale_features = self.extract_features(sale['domain'])
                
                # التشابه الأساسي (50%)
                basic_similarity = self._calculate_similarity(domain_features, sale_features)
                
                # تشابه الكلمات المفتاحية (50%)
                sale_keywords = self._extract_keywords(sale['domain'])
                keyword_similarity = self._calculate_keyword_similarity(domain_keywords, sale_keywords)
                
                # الدمج
                total_similarity = (basic_similarity * 0.5) + (keyword_similarity * 0.5)
                
                if total_similarity > 0.4:  # عتبة أقل لتحسين التغطية
                    comparables.append({
                        'domain': sale['domain'],
                        'price': sale['price'],
                        'similarity': total_similarity,
                        'venue': sale['venue'],
                        'keyword_match': keyword_similarity > 0.6
                    })
            except Exception as e:
                continue
        
        comparables.sort(key=lambda x: x['similarity'], reverse=True)
        return comparables[:top_k]

    def find_comparable_listings_enhanced(self, domain: str, atom_listings: List[Dict], category: str, top_k: int = 5) -> List[Dict]:
        """بحث محسن في أتوم مع شبكة أمان بالكلمات المفتاحية"""
        domain_features = self.extract_features(domain)
        
        # المرحلة 1: البحث في نفس الفئة
        same_category = [l for l in atom_listings if l['category'] == category]
        comparables = []
        
        for listing in same_category:
            try:
                listing_features = self.extract_features(listing['domain'])
                similarity = self._calculate_similarity(domain_features, listing_features)
                if similarity > 0.4:
                    comparables.append({
                        'domain': listing['domain'],
                        'price': listing['price'],
                        'page_url': listing['page_url'],
                        'similarity': similarity,
                        'category': listing['category'],
                        'match_type': 'same_category'
                    })
            except:
                continue
        
        # إذا لم نجد كفاية في نفس الفئة، نبحث في فئات مشابهة بالكلمات المفتاحية
        if len(comparables) < 3:
            domain_keywords = self._extract_keywords(domain)
            similar_categories = self._find_categories_by_keywords(domain_keywords, atom_listings)
            
            for listing in similar_categories:
                if listing['category'] != category:  # نتجنب التكرار
                    try:
                        listing_features = self.extract_features(listing['domain'])
                        similarity = self._calculate_similarity(domain_features, listing_features)
                        if similarity > 0.4:
                            comparables.append({
                                'domain': listing['domain'],
                                'price': listing['price'],
                                'page_url': listing['page_url'],
                                'similarity': similarity * 0.8,  # تخفيض لأن الفئة مختلفة
                                'category': listing['category'],
                                'match_type': 'keyword_category'
                            })
                    except:
                        continue
        
        comparables.sort(key=lambda x: x['similarity'], reverse=True)
        return comparables[:top_k]

    def _find_categories_by_keywords(self, keywords: List[str], atom_listings: List[Dict]) -> List[Dict]:
        """إيجاد فئات مشابهة بناءً على الكلمات المفتاحية"""
        if not keywords:
            return []
        
        relevant_categories = set()
        for keyword in keywords:
            category = KEYWORD_CATEGORY_MAP.get(keyword)
            if category:
                relevant_categories.add(category)
        
        return [l for l in atom_listings if l['category'] in relevant_categories]

    def _calculate_similarity(self, feat1: Dict, feat2: Dict) -> float:
        """خوارزمية التشابه الحالية (محفوظة مع تعديل الأوزان)"""
        weights = {
            'length': 0.2,        # زيادة وزن الطول
            'tld_score': 0.15,    # تقليل وزن TLD
            'has_hyphen': 0.1,
            'has_digits': 0.1,
            'keyword_score': 0.2,  # تقليل وزن الكلمات
            'vowel_ratio': 0.15,   # زيادة وزن النطق
            'is_brandable': 0.1   # زيادة وزن القابلية للبرندة
        }
        similarity = 0.0
        total_weight = 0.0
        for feature, weight in weights.items():
            val1 = feat1.get(feature, 0)
            val2 = feat2.get(feature, 0)
            if isinstance(val1, (int, float)) and isinstance(val2, (int, float)):
                max_val = max(abs(val1), abs(val2), 1)
                diff = abs(val1 - val2) / max_val
                similarity += weight * (1 - diff)
                total_weight += weight
        if total_weight == 0:
            return 0.0
        return min(1.0, max(0.0, similarity / total_weight))

    def calculate_enhanced_confidence(self, sales_comparables: List[Dict], atom_comparables: List[Dict]) -> float:
        """ثقة محسنة تأخذ في الاعتبار جودة المماثلات"""
        base = 0.3
        
        if sales_comparables:
            avg_similarity = np.mean([s['similarity'] for s in sales_comparables])
            base += 0.3 * avg_similarity  # ثقة متدرجة بناءً على التشابه
        
        if atom_comparables:
            avg_similarity = np.mean([s['similarity'] for s in atom_comparables])
            base += 0.2 * avg_similarity
            
        # مكافأة وجود مماثلات من كلا المصدرين
        if sales_comparables and atom_comparables:
            base += 0.1
            
        return min(0.95, max(0.1, round(base, 2)))

    def calculate_final_price_enhanced(self, base_price: float, sales_comparables: List[Dict], 
                                     atom_comparables: List[Dict]) -> float:
        """حساب سعر نهائي محسن يأخذ في الاعتبار جميع المصادر"""
        
        if sales_comparables and atom_comparables:
            # دمج من كلا المصدرين
            sales_avg = sum(s['price'] * s['similarity'] for s in sales_comparables) / sum(s['similarity'] for s in sales_comparables)
            atom_avg = sum(s['price'] * s['similarity'] for s in atom_comparables) / sum(s['similarity'] for s in atom_comparables)
            
            # أوزان ذكية بناءً على جودة المماثلات
            sales_quality = np.mean([s['similarity'] for s in sales_comparables])
            atom_quality = np.mean([s['similarity'] for s in atom_comparables])
            
            total_quality = sales_quality + atom_quality
            sales_weight = sales_quality / total_quality
            atom_weight = atom_quality / total_quality
            
            final_price = (sales_avg * sales_weight * 0.7 + 
                          atom_avg * atom_weight * 0.5 + 
                          base_price * 0.3)
                          
        elif sales_comparables:
            # استخدام المبيعات التاريخية فقط
            weighted_avg = sum(s['price'] * s['similarity'] for s in sales_comparables) / sum(s['similarity'] for s in sales_comparables)
            final_price = 0.7 * weighted_avg + 0.3 * base_price
            
        elif atom_comparables:
            # استخدام عروض أتوم فقط
            weighted_avg = sum(s['price'] * s['similarity'] for s in atom_comparables) / sum(s['similarity'] for s in atom_comparables)
            final_price = 0.5 * weighted_avg + 0.5 * base_price  # وزن أقل لعروض أتوم
            
        else:
            # استخدام النموذج فقط مع تخفيض
            final_price = base_price * 0.7
            
        return max(50, round(final_price))

    def generate_enhanced_reasons(self, features: Dict, sales_comparables: List[Dict], 
                                atom_comparables: List[Dict], category: str) -> List[str]:
        """توليد أسباب محسنة للتقييم"""
        reasons = []
        
        # أسباب بناءً على الميزات
        if features['keyword_score'] > 0:
            reasons.append("Contains high-value keywords")
        if features['length'] <= 8:
            reasons.append("Short and memorable domain")
        elif features['length'] <= 12:
            reasons.append("Good domain length")
        if features['tld_score'] >= 0.6:
            reasons.append("Premium TLD extension")
        if features['has_hyphen'] == 0:
            reasons.append("No hyphens (better for branding)")
        if features['has_digits'] == 0:
            reasons.append("No numbers (clearer brand identity)")
        if features['is_brandable']:
            reasons.append("High brandability potential")
            
        # أسباب بناءً على المماثلات
        if sales_comparables:
            best_sale = sales_comparables[0]
            reasons.append(f"Similar to {best_sale['domain']} (sold for ${best_sale['price']:,})")
            
        if atom_comparables:
            same_category_listings = [l for l in atom_comparables if l.get('match_type') == 'same_category']
            if same_category_listings:
                best_listing = same_category_listings[0]
                reasons.append(f"Listed in '{category}' category on Atom (similar to {best_listing['domain']})")
            else:
                best_listing = atom_comparables[0]
                reasons.append(f"Similar to {best_listing['domain']} in related category on Atom")
                
        return reasons[:5]

    # الحفاظ على الدوال القديمة للتتوافق مع main.py
    def find_comparable_sales(self, domain: str, all_sales: List[Dict], top_k: int = 5) -> List[Dict]:
        """الدالة القديمة للحفاظ على التوافق - تستخدم النظام المحسن"""
        return self.find_comparable_sales_enhanced(domain, all_sales, top_k)

    def find_comparable_listings(self, domain: str, atom_listings: List[Dict], category: str, top_k: int = 3) -> List[Dict]:
        """الدالة القديمة للحفاظ على التوافق - تستخدم النظام المحسن"""
        return self.find_comparable_listings_enhanced(domain, atom_listings, category, top_k)

    def calculate_confidence(self, sales_comparables: List[Dict], atom_comparables: List[Dict]) -> float:
        """الدالة القديمة للحفاظ على التوافق - تستخدم النظام المحسن"""
        return self.calculate_enhanced_confidence(sales_comparables, atom_comparables)

    def generate_reasons(self, features: Dict, sales_comparables: List[Dict], atom_comparables: List[Dict], category: str) -> List[str]:
        """الدالة القديمة للحفاظ على التوافق - تستخدم النظام المحسن"""
        return self.generate_enhanced_reasons(features, sales_comparables, atom_comparables, category)

    def appraise(self, domain: str, all_sales: List[Dict], atom_listings: List[Dict], ai_engine=None) -> Dict[str, Any]:
        """الدالة الرئيسية المحسنة مع الحفاظ على التوافق"""
        features = self.extract_features(domain)
        
        # التصنيف المحسن
        category = self.enhanced_classification(domain, use_ai=True, ai_engine=ai_engine)
        
        # البحث عن مماثلات محسن
        sales_comparables = self.find_comparable_sales_enhanced(domain, all_sales)
        atom_comparables = self.find_comparable_listings_enhanced(domain, atom_listings, category)

        # السعر الأساسي من النموذج
        if self.model and self.feature_names:
            X = [features.get(name, 0) for name in self.feature_names]
            base_price = float(self.model.predict([X])[0])
        else:
            base_price = 100.0

        # السعر النهائي المحسن
        final_price = self.calculate_final_price_enhanced(base_price, sales_comparables, atom_comparables)
        
        # الثقة المحسنة
        confidence = self.calculate_enhanced_confidence(sales_comparables, atom_comparables)
        
        # الأسباب المحسنة
        reasons = self.generate_enhanced_reasons(features, sales_comparables, atom_comparables, category)

        return {
            "domain": domain,
            "estimated_price": final_price,
            "confidence": confidence,
            "reasons": reasons,
            "category": category,
            "atom_listings": atom_comparables,
            "comparables": sales_comparables,
            "features": features
        }