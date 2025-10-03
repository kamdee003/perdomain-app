# backend/atom_loader.py
import time
import os
import re
from typing import List, Dict, Optional
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# كاش عالمي
_cached_atom_listings: Optional[List[Dict]] = None
_cache_timestamp: float = 0

def load_atom_listings(
    spreadsheet_id: str,
    sheet_name: str = "Atom",
    cache_ttl: int = 3600  # ساعة واحدة
) -> List[Dict]:
    """
    يحمل عروض النطاقات من جدول Atom في Google Sheets.
    الأعمدة المتوقعة: Category, Domain, Price, PageURL
    """
    global _cached_atom_listings, _cache_timestamp
    current_time = time.time()
    if _cached_atom_listings is not None and (current_time - _cache_timestamp) < cache_ttl:
        return _cached_atom_listings.copy()

    try:
        creds_path = os.path.join(os.path.dirname(__file__), "..", "config", "credentials.json")
        creds = Credentials.from_service_account_file(
            creds_path,
            scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
        )
        service = build("sheets", "v4", credentials=creds)
        sheet = service.spreadsheets()
        range_name = f"'{sheet_name}'!A:D"  # 4 أعمدة: A=Category, B=Domain, C=Price, D=PageURL
        result = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
        values = result.get("values", [])

        if not values or len(values) < 2:
            print("⚠️ Atom sheet is empty or missing headers.")
            return []

        headers = values[0]
        expected = ["Category", "Domain", "Price", "PageURL"]
        if headers != expected:
            raise ValueError(f"Atom sheet headers mismatch. Expected: {expected}, Got: {headers}")

        listings = []
        for row in values[1:]:
            # ملء الصفوف الناقصة
            while len(row) < 4:
                row.append("")
            category = str(row[0]).strip()
            domain = str(row[1]).strip().lower()
            price = _parse_price(row[2])
            page_url = str(row[3]).strip()

            if price and _is_valid_domain(domain):
                listings.append({
                    "category": category,
                    "domain": domain,
                    "price": price,
                    "page_url": page_url
                })

        _cached_atom_listings = listings
        _cache_timestamp = current_time
        return listings.copy()

    except Exception as e:
        print(f"❌ Error loading Atom listings: {e}")
        return _cached_atom_listings or []


def _is_valid_domain(domain: str) -> bool:
    if not domain or '.' not in domain:
        return False
    if domain.startswith('-') or domain.endswith('-'):
        return False
    if not re.match(r'^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$', domain):
        return False
    return True


def _parse_price(price) -> Optional[float]:
    if not price:
        return None
    if isinstance(price, (int, float)):
        return float(price)
    if isinstance(price, str):
        cleaned = re.sub(r'[^\d.,]', '', price)
        if not cleaned:
            return None
        if ',' in cleaned and '.' not in cleaned:
            cleaned = cleaned.replace(',', '.')
        elif ',' in cleaned and '.' in cleaned:
            cleaned = cleaned.replace(',', '')
        try:
            return float(cleaned)
        except:
            return None
    return None