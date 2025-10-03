# backend/test_atom_loader.py
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from atom_loader import load_atom_listings
from config_loader import get_settings

def test_atom_loading():
    print("🧪 جارٍ تحميل إعدادات التطبيق...")
    try:
        settings = get_settings()
    except Exception as e:
        print(f"❌ فشل تحميل الإعدادات: {e}")
        return

    print("⚙️  جارٍ تحميل عروض Atom من Google Sheets...")
    try:
        listings = load_atom_listings(
            spreadsheet_id=settings["atom_spreadsheet_id"],
            sheet_name=settings.get("atom_sheet_name", "Atom"),
            cache_ttl=0  # لا نستخدم الكاش للاختبار
        )
        print(f"✅ تم تحميل {len(listings)} عرضًا بنجاح.")
        
        if listings:
            print("\nأول 3 عروض:")
            for i, listing in enumerate(listings[:3], 1):
                print(f"{i}. {listing['domain']} | الفئة: {listing['category']} | السعر: ${listing['price']:,} | الرابط: {listing['page_url']}")
        else:
            print("⚠️  لم يتم العثور على أي عروض.")
    except Exception as e:
        print(f"❌ خطأ أثناء تحميل Atom: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_atom_loading()