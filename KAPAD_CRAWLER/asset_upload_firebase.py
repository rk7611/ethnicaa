import os
import json
import sys
import uuid
import requests
import io
import firebase_admin
from firebase_admin import credentials, initialize_app, storage
from concurrent.futures import ThreadPoolExecutor

# ---------------- ARGUMENTS ----------------

if len(sys.argv) < 3:
    print("Usage: python asset_upload_firebase.py <input_json> <output_json>")
    sys.exit(1)

INPUT_JSON = sys.argv[1]
OUTPUT_JSON = sys.argv[2]

# ---------------- CONFIG ----------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_KEY = os.path.join(BASE_DIR, "firebase_key.json")
BUCKET_NAME = "ethnicaa-8402c.firebasestorage.app"

# ---------------- FIREBASE INIT ----------------

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_KEY)
    initialize_app(cred, {"storageBucket": BUCKET_NAME})
bucket = storage.bucket()

# ---------------- HELPERS ----------------

def slugify(text: str) -> str:
    return (
        text.lower()
        .strip()
        .replace("&", "and")
        .replace(" ", "-")
        .replace("/", "")
        .replace("\\", "")
        .replace(",", "")
        .replace("--", "-")
    )

def download_and_upload(url, slug, asset_type):
    """
    Streams file from URL to Firebase.
    """
    if not url:
        return None
        
    try:
        print(f"Streaming {asset_type}: {url}")
        response = requests.get(url, timeout=60, stream=True)
        response.raise_for_status()
        
        # Determine extension from URL or content-type
        ext = ".pdf" if asset_type == "pdf" else ".zip"
        if "?" in url:
            # Handle php download scripts by forcing the right ext
            pass 
        else:
            _, url_ext = os.path.splitext(url.split("?")[0])
            if url_ext: ext = url_ext

        filename = f"products/{slug}/catalog_{asset_type}{ext}"
        blob = bucket.blob(filename)
        
        # Stream directly from requests to blob
        # We use BytesIO for safety with upload_from_file
        buffer = io.BytesIO(response.content)
        blob.upload_from_file(buffer, content_type=response.headers.get('Content-Type'))
        # Construct correct Firebase Download URL
        from urllib.parse import quote
        encoded_path = quote(filename, safe='')
        download_url = f"https://firebasestorage.googleapis.com/v0/b/{BUCKET_NAME}/o/{encoded_path}?alt=media"
        
        return download_url
    except Exception as e:
        print(f"Error uploading {asset_type} ({url}): {e}")
        return None

# ---------------- MAIN ----------------

def main():
    print("Loading product JSON...")

    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        products = json.load(f)

    if not products:
        print("No products found")
        sys.exit(1)

    # Note: Pipeline usually processes 1 product at a time in the loop,
    # but we support list for robustness.
    for product in products:
        title = product.get("name") or product.get("title") or "product"
        slug = slugify(title)
        
        # Read raw assets from spider output
        raw_assets = product.get("catalog_assets", {})
        if not raw_assets:
            # Fallback for older normalized files
            raw_assets = product.get("catalogAssets", {})

        print(f"\nProcessing assets for: {title}")
        
        results = {}
        with ThreadPoolExecutor(max_workers=2) as executor:
            future_zip = executor.submit(download_and_upload, raw_assets.get("zip"), slug, "zip")
            future_pdf = executor.submit(download_and_upload, raw_assets.get("pdf"), slug, "pdf")
            
            results["zip"] = future_zip.result()
            results["pdf"] = future_pdf.result()

        product["catalogAssets"] = results
        # Clean up legacy fields
        product.pop("catalog_assets", None)
        product.pop("local_catalog_assets", None)

    # ---------------- SAVE OUTPUT ----------------

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"DONE! Assets uploaded and JSON updated: {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
