import json

with open("brand_inspection_result.json", encoding="utf-8") as f:
    data = json.load(f)

print("=== CATALOG VALUES (all brands/collections) ===")
for item in data["catalog_values"]:
    print(f"  {item['catalog']:<50} -> {item['count']} product(s)")

print()
print("=== BRAND FIELD VALUES ===")
for item in data["brand_field_values"]:
    print(f"  {item['brand']:<50} -> {item['count']} product(s)")

print()
print("Total catalog entries:", len(data["catalog_values"]))
