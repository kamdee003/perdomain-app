# backend/config_loader.py
import json
import os
from typing import Dict, Any

def get_settings() -> Dict[str, Any]:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    CONFIG_PATH = os.path.join(BASE_DIR, "config", "app_settings.json")
    
    if not os.path.exists(CONFIG_PATH):
        raise FileNotFoundError(f"ملف الإعدادات غير موجود: {CONFIG_PATH}")
    
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)
