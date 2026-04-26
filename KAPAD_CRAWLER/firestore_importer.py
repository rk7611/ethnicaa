import os
import json
import sys
import re
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1 import SERVER_TIMESTAMP
from datetime import datetime, timezone

# ---------------- ARGUMENTS ----------------

if len(sys.argv) < 2:
    print("Usage: python firestore_importer.py <normalized_json>")
    sys.exit(1)

INPUT_JSON = sys.argv[1]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_KEY = os.path.join(BASE_DIR, "firebase_key.json")

COLLECTION_NAME = "products"

# ---------------- FIREBASE INIT ----------------

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_KEY)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ---------------- HELPERS ----------------

def iso_to_datetime(value):
    """Convert ISO → Python datetime (UTC)."""
    if not value:
        return datetime.now(timezone.utc)

    if isinstance(value, datetime):
        return value

    try:
        dt = datetime.fromisoformat(value)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        return datetime.now(timezone.utc)


def safe_get(product, key, default=""):
    value = product.get(key, default)
    return default if value is None else value


def generate_search_keywords(product: dict):
    """Matches Admin panel search keyword generation."""
    keywords = set()

    def push_words(text):
        if not text:
            return
        # Split by non-alphanumeric/spaces
        words = re.split(r"[\s,.-]+", str(text).lower())
        for i in range(len(words)):
            phrase = words[i]
            if not phrase:
                continue
            keywords.add(phrase)
            # Create phrases up to words[j]
            for j in range(i + 1, len(words)):
                phrase += " " + words[j]
                keywords.add(phrase)

    push_words(product.get("name"))
    push_words(product.get("catalog"))
    for cat in product.get("categoryNames", []):
        push_words(cat)
    for fab in product.get("fabricNames", []):
        push_words(fab)
    push_words(product.get("rawSpecs"))
    push_words(product.get("description"))

    return list(keywords)[:150]


def merge_preserve(existing: dict, incoming: dict):
    """Do not overwrite published products."""
    if existing.get("status") == "published":
        return None

    merged = existing.copy()

    for k, v in incoming.items():
        if v not in [None, "", []]:
            merged[k] = v

    merged["updatedAt"] = SERVER_TIMESTAMP
    return merged


# ---------------- MAIN ----------------

def main():
    print("Loading normalized JSON...")

    if not os.path.exists(INPUT_JSON):
        print(f"❌ File not found: {INPUT_JSON}")
        sys.exit(1)

    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        products = json.load(f)

    print(f"Products found: {len(products)}\n")

    for idx, product in enumerate(products, start=1):

        if not isinstance(product, dict):
            print(f"Skipping product {idx}: invalid dict")
            continue

        slug = product.get("slug")
        if not slug:
            print(f"Skipping product {idx}: missing slug")
            continue

        doc_ref = db.collection(COLLECTION_NAME).document(slug)
        doc = doc_ref.get()

        created_at = iso_to_datetime(product.get("createdAt"))
        imported_at = iso_to_datetime(
            product.get("sourceMeta", {}).get("imported_at")
        )

        # Build Search Fields
        search_title = f"{product.get('name', '')} {product.get('catalog', '')}".lower()
        search_category = " ".join(product.get("categoryNames", [])).lower()
        search_fabric = " ".join(product.get("fabricNames", [])).lower()
        search_text = f"{search_title} {search_category} {search_fabric} {product.get('description', '')}".lower()
        search_keywords = generate_search_keywords(product)

        incoming = {
            "name": safe_get(product, "name"),
            "slug": slug,
            "price": safe_get(product, "price", 0),
            "priceText": safe_get(product, "priceText"),
            
            "categories": product.get("categories", []),
            "categoryNames": product.get("categoryNames", []),
            "tags": product.get("tags", []),
            "category": safe_get(product, "category"), # Legacy

            "fabrics": product.get("fabrics", []),
            "fabricNames": product.get("fabricNames", []),
            "fabric": safe_get(product, "fabric"), # Legacy

            "catalog": safe_get(product, "catalog"),
            "pcs": safe_get(product, "pcs", 0),
            "sizes": safe_get(product, "sizes"),
            "totalDesign": safe_get(product, "totalDesign"),
            "availability": safe_get(product, "availability"),
            "dispatchTime": safe_get(product, "dispatchTime"),
            "description": safe_get(product, "description"),

            "seo_title": product.get("seo_title", ""),
            "seo_description": product.get("seo_description", ""),
            "seo_keywords": product.get("seo_keywords", ""),
            "seo_slug": product.get("seo_slug", ""),
            "seo_alt": product.get("seo_alt", ""),

            "search_title": search_title,
            "search_category": search_category,
            "search_fabric": search_fabric,
            "search_text": search_text,
            "search_keywords": search_keywords,

            "images": product.get("images", []),
            "catalogAssets": product.get("catalogAssets", {"zip": None, "pdf": None}),
            "status": "draft",

            "rawSpecs": safe_get(product, "rawSpecs"),
            "full_price_with_gst": safe_get(product, "full_price_with_gst", 0),
            "gst": safe_get(product, "gst", 5),

            "createdAt": created_at,
            "updatedAt": SERVER_TIMESTAMP,
            "source": {
                "website": product.get("source"),
                "original_url": product.get("product_url"),
                "imported_at": imported_at,
            },
            "admin": {"reviewed": False}
        }

        # ---- existing doc ----
        if doc.exists:
            existing = doc.to_dict()
            merged = merge_preserve(existing, incoming)

            if merged is None:
                print(f"Skipped (published): {slug}")
                continue

            doc_ref.set(merged)
            print(f"Updated draft: {slug}")

        else:
            doc_ref.set(incoming)
            print(f"Imported new draft: {slug}")

    print("\nFIRESTORE IMPORT COMPLETED SAFELY")


if __name__ == "__main__":
    main()
