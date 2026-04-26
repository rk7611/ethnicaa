import os
import json
import sys
import uuid
import requests
import io
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
import firebase_admin
from firebase_admin import credentials, initialize_app, storage

# ---------------- ARGUMENTS ----------------

if len(sys.argv) < 3:
    print("Usage: python image_upload_firebase.py <input_json> <output_json>")
    sys.exit(1)

INPUT_JSON = sys.argv[1]
OUTPUT_JSON = sys.argv[2]

# ---------------- CONFIG ----------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_KEY = os.path.join(BASE_DIR, "firebase_key.json")
BUCKET_NAME = "ethnicaa-8402c.firebasestorage.app"
WEBP_QUALITY = 90
MAX_WORKERS = 8 # Simultaneous uploads

# ---------------- FIREBASE INIT ----------------

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_KEY)
    initialize_app(cred, {"storageBucket": BUCKET_NAME})
bucket = storage.bucket()

# ---------------- HELPERS ----------------

def slugify(text: str) -> str:
    # Replace non-breaking space and other weird chars
    clean_text = text.lower().replace("\xa0", " ").strip()
    return (
        clean_text
        .replace("&", "and")
        .replace(" ", "-")
        .replace("/", "")
        .replace("\\", "")
        .replace(",", "")
        .replace("--", "-")
        .replace("--", "-") # Double check for multiple hyphens
    )

def process_and_upload(url, slug):
    """
    1. Downloads image to memory buffer
    2. Converts to WebP using Pillow
    3. Uploads to Firebase Storage
    """
    try:
        # 1. Download
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # 2. Convert to WebP
        img = Image.open(io.BytesIO(response.content))
        
        # Convert to RGB if necessary (e.g. RGBA -> RGB for high quality WebP)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        webp_buffer = io.BytesIO()
        img.save(webp_buffer, format="WEBP", quality=WEBP_QUALITY)
        webp_buffer.seek(0)
        
        # 3. Upload
        filename = f"products/{slug}/{uuid.uuid4()}.webp"
        blob = bucket.blob(filename)
        
        blob.upload_from_string(
            webp_buffer.getvalue(),
            content_type="image/webp"
        )
        # Construct correct Firebase Download URL
        from urllib.parse import quote
        encoded_path = quote(filename, safe='')
        download_url = f"https://firebasestorage.googleapis.com/v0/b/{BUCKET_NAME}/o/{encoded_path}?alt=media"
        
        return download_url
    except Exception as e:
        print(f"Error processing {url}: {e}")
        return None

# ---------------- MAIN ----------------

def main():
    print("Loading JSON...")

    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        products = json.load(f)

    if not products:
        print("No products found")
        sys.exit(1)

    print(f"Products found: {len(products)}")

    for idx, product in enumerate(products, start=1):
        title = product.get("title") or product.get("name")
        # Use raw images from scraper if local_images is missing
        source_images = product.get("images") or product.get("local_images") or []

        if not title or not source_images:
            print(f"Skipping product {idx} (missing title or images)")
            continue

        slug = slugify(title)
        print(f"\nProcessing {len(source_images)} images for: {title}")

        # Use ThreadPoolExecutor for concurrency
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            # Map the processing function to all image URLs
            futures = [executor.submit(process_and_upload, img_url, slug) for img_url in source_images]
            
            uploaded_urls = []
            for future in futures:
                result = future.result()
                if result:
                    uploaded_urls.append(result)
                    print(f"Uploaded -> {result}")

        product["images"] = uploaded_urls
        # Clean up local image references if they exist
        product.pop("local_images", None)

    # ---------------- SAVE OUTPUT ----------------

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"\nDONE! Output saved to {OUTPUT_JSON}")

# ---------------- RUN ----------------

if __name__ == "__main__":
    main()
