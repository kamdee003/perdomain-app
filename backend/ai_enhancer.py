# backend/ai_enhancer.py
import requests
from typing import List

class AIEnhancer:
    def __init__(self, api_key: str, provider: str = "deepseek"):
        self.api_key = api_key
        self.provider = provider.lower()

    def _get_classification_prompt(self, domain: str, categories: List[str]) -> str:
        categories_str = "\n".join(f"- {cat}" for cat in categories)
        return f"""You are a domain name expert in 2025.
Given the domain name: "{domain}"

Choose the SINGLE most appropriate category from the following list:

{categories_str}

Respond ONLY with the exact category name. Do not add explanations, punctuation, or extra text.
If none match perfectly, choose the closest one."""

    def classify_domain(self, domain: str, categories: List[str]) -> str:
        if not self.api_key:
            return "Generic"
        try:
            prompt = self._get_classification_prompt(domain, categories)
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            json_body = {
                "model": "deepseek-chat",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.0,
                "max_tokens": 30
            }
            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers=headers,
                json=json_body,
                timeout=8
            )
            if response.status_code == 200:
                content = response.json()["choices"][0]["message"]["content"].strip()
                # تنظيف الإجابة بشكل أفضل
                cleaned = content.strip('"\'').strip('.,!?;:').strip()
                if cleaned in categories:
                    return cleaned
                else:
                    # محاولة مطابقة جزئية
                    for category in categories:
                        if cleaned.lower() in category.lower() or category.lower() in cleaned.lower():
                            return category
                    return "Generic"
            else:
                return "Generic"
        except Exception as e:
            print(f"⚠️ AI Classification failed: {e}")
            return "Generic"

    def get_insight(self, appraisal_result: dict) -> str:
        """نفس الكود الحالي - يبقى دون تغيير"""
        try:
            atom_context = ""
            if appraisal_result.get("atom_listings"):
                listings = appraisal_result["atom_listings"][:2]
                names = [f"{l['domain']} (${l['price']:,})" for l in listings]
                atom_context = f" Similar domains are currently listed on Atom: {', '.join(names)}."
            
            prompt = f"""You are a domain name valuation expert in 2025.
The domain "{appraisal_result['domain']}" belongs to the "{appraisal_result.get('category', 'General')}" category.
Key factors: {', '.join(appraisal_result['reasons'])}.{atom_context}
Provide a short paragraph (30–50 words) explaining:
- Why this domain might be attractive to buyers
- Which industry or use case it best fits
- Do not mention the price. Be realistic and professional.
"""
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            json_body = {
                "model": "deepseek-chat",
                "messages": [{"role": "user", "content": prompt.strip()}],
                "temperature": 0.7,
                "max_tokens": 100
            }
            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers=headers,
                json=json_body,
                timeout=10
            )
            if response.status_code == 200:
                return response.json()['choices'][0]['message']['content'].strip()
            else:
                return "Insight not available at this time."
        except Exception as e:
            return "Failed to load AI insight."