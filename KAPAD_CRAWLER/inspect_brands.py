import os
import sys
import json
from collections import Counter
import firebase_admin
from firebase_admin import credentials, firestore

# Force UTF-8 output on Windows
sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_KEY = os.path.join(BASE_DIR, "firebase_key.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_KEY)
    firebase_admin.initialize_app(cred)

db = firestore.client()

SEP = "=" * 60
LINE = "-" * 60

def safe(val):
    """Return string, replacing unencodable chars."""
    return str(val).encode("ascii", errors="replace").decode("ascii")

def main():
    print(SEP)
    print("  ETHNICAA -- FIRESTORE BRAND INSPECTOR")
    print(SEP)

    print("\n[*] Fetching up to 500 products from Firestore...")
    try:
        docs = list(db.collection("products").limit(500).stream())
    except Exception as e:
        print(f"[ERROR] {e}")
        sys.exit(1)

    if not docs:
        print("No products found.")
        return

    products = [{"id": d.id, **d.to_dict()} for d in docs]
    print(f"[OK] Fetched {len(products)} products.\n")

    # -- 1. ALL field names
    all_keys = Counter()
    for p in products:
        for k in p.keys():
            all_keys[k] += 1

    print(LINE)
    print(f"[FIELDS] ALL FIELDS (across {len(products)} products):")
    print(LINE)
    for k, count in sorted(all_keys.items(), key=lambda x: -x[1]):
        print(f"  {k:<30} present in {count}/{len(products)} products")

    # -- 2. 'catalog' field — this is likely the brand/collection name
    print("\n" + LINE)
    print("[CATALOG] All unique 'catalog' values + product count:")
    print(LINE)
    catalog_counter = Counter()
    for p in products:
        val = str(p.get("catalog", "")).strip()
        if val:
            catalog_counter[val] += 1

    for val, count in catalog_counter.most_common(200):
        print(f"  {safe(val):<50} -> {count} product(s)")

    # -- 3. 'brand' field (only 22 products have it)
    print("\n" + LINE)
    print("[BRAND FIELD] 'brand' field values (sparse):")
    print(LINE)
    brand_counter = Counter()
    for p in products:
        val = str(p.get("brand", "")).strip()
        if val:
            brand_counter[val] += 1
    for val, count in brand_counter.most_common(50):
        print(f"  {safe(val):<50} -> {count} product(s)")

    # -- 4. Sample product
    print("\n" + LINE)
    print("[SAMPLE] First product full structure:")
    print(LINE)
    sample = dict(products[0])
    if "images" in sample and isinstance(sample["images"], list):
        sample["images"] = sample["images"][:2]
    print(json.dumps(sample, indent=2, default=str, ensure_ascii=True))

    # -- 5. Save to JSON
    summary = {
        "total_products": len(products),
        "all_fields": dict(all_keys),
        "catalog_values": [{"catalog": safe(v), "count": c} for v, c in catalog_counter.most_common(200)],
        "brand_field_values": [{"brand": safe(v), "count": c} for v, c in brand_counter.most_common(50)],
    }
    out_path = os.path.join(BASE_DIR, "brand_inspection_result.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(f"\n[SAVED] {out_path}")
    print(SEP)

if __name__ == "__main__":
    main()
