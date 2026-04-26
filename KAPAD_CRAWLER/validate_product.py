import json
import os
import re
import sys
from urllib.parse import urlparse

# -------- ARGUMENTS --------

if len(sys.argv) < 2:
    print("Usage: python validate_product.py <input_json> [--pre-upload]")
    sys.exit(1)

INPUT_JSON = sys.argv[1]
PRE_UPLOAD = "--pre-upload" in sys.argv

# -------- HELPERS --------

def is_firebase_url(url: str) -> bool:
    if not isinstance(url, str):
        return False
    return (
        url.startswith("https://storage.googleapis.com/") or 
        url.startswith("https://firebasestorage.googleapis.com/")
    )


def is_non_empty_string(value):
    return isinstance(value, str) and value.strip() != ""


def is_number(value):
    return isinstance(value, (int, float))


# -------- VALIDATION --------

def validate_product(product: dict, index: int):
    errors = []

    # ---- REQUIRED WEBSITE FIELDS ----
    required_fields = [
        "name",
        "slug",
        "price",
        "priceText",
        "category",
        "fabric",
        "catalog",
        "pcs",
        "sizes",
        "totalDesign",
        "availability",
        "dispatchTime",
        "description",
        "images",
        "status",
    ]

    for field in required_fields:
        if field not in product:
            errors.append(f"Missing field: {field}")

    # ---- BASIC TYPE CHECKS ----
    if not is_non_empty_string(product.get("name", "")):
        errors.append("Invalid name")

    if not is_non_empty_string(product.get("slug", "")):
        errors.append("Invalid slug")

    if not is_number(product.get("price")):
        errors.append("price must be a number")

    if not is_non_empty_string(product.get("priceText", "")):
        errors.append("priceText must be a string")

    # ---- IMAGES CHECK ----
    images = product.get("images", [])
    if not isinstance(images, list) or not images:
        errors.append("images must be a non-empty array")
    else:
        for img in images:
            if not PRE_UPLOAD and not is_firebase_url(img):
                errors.append(f"non-Firebase image URL found: {img}")
            elif PRE_UPLOAD and not is_non_empty_string(img):
                errors.append(f"Invalid image URL: {img}")

    # ---- CATALOG ASSETS CHECK ----
    assets = product.get("catalogAssets", {})
    if not isinstance(assets, dict):
        errors.append("catalogAssets must be an object")
    else:
        for key in ["zip", "pdf"]:
            val = assets.get(key)
            if val is not None:
                if not PRE_UPLOAD and not is_firebase_url(val):
                    errors.append(f"{key} asset is not a Firebase URL")
                elif PRE_UPLOAD and not is_non_empty_string(val):
                    errors.append(f"Invalid {key} asset URL: {val}")

    # ---- STATUS RULE ----
    if product.get("status") not in ["draft", "published"]:
        errors.append("status must be 'draft' or 'published'")

    # ---- RAW DATA PRESERVATION CHECK ----
    preserved_fields = [
        "avg_price",
        "full_price",
        "full_price_with_gst",
        "size",
        "rawSpecs",
    ]

    for field in preserved_fields:
        if field in product and product[field] in [None, ""]:
            errors.append(f"{field} exists but is empty (data loss risk)")

    return errors


# -------- MAIN --------

def main():
    print("Validating normalized products...\n")

    if not os.path.exists(INPUT_JSON):
        print(f"File not found: {INPUT_JSON}")
        sys.exit(1)

    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        products = json.load(f)

    total_errors = 0

    for idx, product in enumerate(products, start=1):
        errors = validate_product(product, idx)

        if errors:
            total_errors += 1
            print(f"VALIDATION FAILED: Product {idx}")
            for err in errors:
                print(f"   - {err}")
            print()
        else:
            print(f"Product {idx} passed validation")

    print("\n------------------------------")
    if total_errors:
        print(f"Validation completed with {total_errors} error(s)")
        print("DO NOT IMPORT TO FIRESTORE")
        sys.exit(1)
    else:
        print("ALL PRODUCTS VALID")
        print("Safe to import into Firestore")


if __name__ == "__main__":
    main()
