import subprocess
import sys
import os
import shutil
import time
from pathlib import Path
from datetime import datetime, timezone
import pandas as pd
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

LOG_FILE = os.path.join(BASE_DIR, "product_pipeline_log_fallback.csv")
EXPORTS_DIR = os.path.join(BASE_DIR, "exports")
IMAGES_TMP = os.path.join(BASE_DIR, "images_tmp")
ASSETS_TMP = os.path.join(BASE_DIR, "assets_tmp")

# VENV PATHS (Research Crawler Venv)
VENV_PYTHON = r"d:\ethnicaa_research_crawler\venv\Scripts\python.exe"
VENV_SCRAPY = r"d:\ethnicaa_research_crawler\venv\Scripts\scrapy.exe"


# ---------------- COMMAND RUNNER ----------------

def run(step, command):
    print(f"\nSTEP: {step}")
    print(f"RUN: {command}\n")

    result = subprocess.run(command, shell=True, cwd=BASE_DIR)

    if result.returncode != 0:
        print(f"\nFAILED: {step}")
        return False

    print(f"DONE: {step}")
    return True


# ---------------- HELPERS ----------------

def slug_from_url(url: str) -> str:
    return url.rstrip("/").split("/")[-1]


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


def load_urls(arg):
    if arg.endswith(".txt"):
        with open(arg, "r", encoding="utf-8") as f:
            return [x.strip() for x in f if x.strip().startswith("http")]
    return [arg]


def utc_now():
    return datetime.now(timezone.utc).isoformat()


# ---------------- EXCEL TRACKER ----------------

def load_log():
    if os.path.exists(LOG_FILE):
        try:
            return pd.read_csv(LOG_FILE)
        except Exception:
            pass

    return pd.DataFrame(columns=[
        "product_title",
        "product_url",
        "slug",
        "spider",
        "image_download",
        "image_upload",
        "asset_download",
        "asset_upload",
        "normalize",
        "validate",
        "firestore",
        "final_status",
        "failure_stage",
        "timestamp"
    ])


def write_log(row: dict):
    try:
        df = load_log()
        df.loc[len(df)] = row
        df.to_csv(LOG_FILE, index=False)
    except Exception as e:
        print(f"Excel log skipped: {e}")


def is_duplicate(title, url):
    df = load_log()
    if df.empty:
        return False

    title = title.strip().lower()
    url = url.strip().lower()

    return not df[
        (df["product_title"].astype(str).str.lower() == title) &
        (df["product_url"].astype(str).str.lower() == url)
    ].empty


# ---------------- CLEANUP ----------------

def cleanup_product_files(url_slug, title_slug=None):
    print("Cleaning temp files...")

    # Remove product JSON exports
    for file in Path(EXPORTS_DIR).glob(f"{url_slug}*"):
        try:
            file.unlink()
        except Exception:
            pass

    # Remove specific product subdirectories
    if title_slug:
        shutil.rmtree(os.path.join(IMAGES_TMP, title_slug), ignore_errors=True)
        shutil.rmtree(os.path.join(ASSETS_TMP, title_slug), ignore_errors=True)

    print("Cleanup completed")


# ---------------- PIPELINE ----------------

def run_pipeline(url):
    slug = slug_from_url(url)

    RAW = os.path.join(EXPORTS_DIR, f"{slug}_raw.json")
    FIREBASE_IMG = os.path.join(EXPORTS_DIR, f"{slug}_with_firebase_images.json")
    FINAL_ASSETS = os.path.join(EXPORTS_DIR, f"{slug}_final_assets.json")
    NORMALIZED = os.path.join(EXPORTS_DIR, f"{slug}_normalized.json")

    status = {
        "product_title": "",
        "product_url": url,
        "slug": slug,
        "title_slug": "",
        "spider": "",
        "image_download": "",
        "image_upload": "",
        "asset_download": "",
        "asset_upload": "",
        "normalize": "",
        "validate": "",
        "firestore": "",
        "final_status": "",
        "failure_stage": "",
        "timestamp": utc_now()
    }

    try:
        # 1️⃣ Spider
        if not run("PRODUCT SPIDER",
            f'{VENV_SCRAPY} crawl kapdavilla_spider -a product_urls="{url}" -o {RAW}'):
            status["spider"] = "failed"
            status["final_status"] = "failed"
            status["failure_stage"] = "spider"
            return status

        status["spider"] = "success"

        with open(RAW, "r", encoding="utf-8") as f:
            product = json.load(f)[0]

        title = product.get("title")
        if not title:
            print("SKIPPING: No title found for product")
            status["final_status"] = "failed"
            status["failure_stage"] = "spider_no_data"
            return status

        title = title.strip()
        status["product_title"] = title
        title_slug = slugify(title)
        status["title_slug"] = title_slug

        if is_duplicate(title, url):
            print("DUPLICATE PRODUCT -- SKIPPED")
            status["final_status"] = "duplicate"
            write_log(status)
            return status

        # 2️⃣ Normalize (Process SEO and local formatting first)
        if not run("NORMALIZER",
            f"{VENV_PYTHON} normalize_product.py {RAW} {NORMALIZED}"):
            status["normalize"] = "failed"
            status["final_status"] = "failed"
            status["failure_stage"] = "normalize"
            return status

        status["normalize"] = "success"

        # 3️⃣ Pre-Validate (Safety Gatekeeper)
        if not run("PRE-VALIDATOR",
            f"{VENV_PYTHON} validate_product.py {NORMALIZED} --pre-upload"):
            status["validate"] = "pre-validation_failed"
            status["final_status"] = "failed"
            status["failure_stage"] = "pre-validate"
            print("SKIPPING PRODUCT DUE TO PRE-VALIDATION FAILURE")
            return status # This will skip the rest and move to next product

        # 4️⃣ Image upload (Streaming WebP optimization)
        if not run("IMAGE UPLOAD",
            f"{VENV_PYTHON} image_upload_firebase.py {NORMALIZED} {FIREBASE_IMG}"):
            status["image_upload"] = "failed"
            status["final_status"] = "failed"
            status["failure_stage"] = "image_upload"
            return status

        status["image_download"] = "skipped (streamed)"
        status["image_upload"] = "success"

        # 5️⃣ Asset upload
        if not run("ASSET UPLOAD",
            f"{VENV_PYTHON} asset_upload_firebase.py {FIREBASE_IMG} {FINAL_ASSETS}"):
            status["asset_upload"] = "failed"
            status["final_status"] = "failed"
            status["failure_stage"] = "asset_upload"
            return status

        status["asset_upload"] = "success"

        # 6️⃣ Post-Validate (Final safety check for Firebase URLs)
        if not run("POST-VALIDATOR",
            f"{VENV_PYTHON} validate_product.py {FINAL_ASSETS}"):
            status["validate"] = "failed"
            status["final_status"] = "validation_failed"
            status["failure_stage"] = "post-validate"
            return status

        status["validate"] = "success"

        # 7️⃣ Firestore Import
        if not run("FIRESTORE IMPORT",
            f"{VENV_PYTHON} firestore_importer.py {FINAL_ASSETS}"):
            status["firestore"] = "failed"
            status["final_status"] = "firestore_failed"
            status["failure_stage"] = "firestore"
            return status

        status["firestore"] = "uploaded"
        status["final_status"] = "uploaded"
        status["failure_stage"] = ""

        print(f"\nPRODUCT COMPLETED: {slug}")

    finally:
        write_log(status)
        cleanup_product_files(slug, status.get("title_slug"))

    return status


# ---------------- MAIN ----------------

def main():
    if len(sys.argv) < 2:
        print("Usage: python pipeline.py <url | urls.txt>")
        sys.exit(1)

    urls = load_urls(sys.argv[1])
    batch_size = 10
    total_products = len(urls)

    print(f"\nTotal products: {total_products}")
    print(f"Batch size: {batch_size}")

    # Create reports directory
    reports_dir = os.path.join(BASE_DIR, "exports", "batch_reports")
    os.makedirs(reports_dir, exist_ok=True)

    # Chunk URLs into batches
    for i in range(0, total_products, batch_size):
        batch_urls = urls[i : i + batch_size]
        batch_num = (i // batch_size) + 1
        total_batches = (total_products + batch_size - 1) // batch_size

        print(f"\nSTARTING BATCH {batch_num}/{total_batches}")
        
        batch_results = []
        for idx_in_batch, url in enumerate(batch_urls, start=1):
            global_idx = i + idx_in_batch
            print(f"\nProcessing {global_idx}/{total_products} (Batch {batch_num}, Item {idx_in_batch})")
            res = run_pipeline(url)
            if res:
                batch_results.append(res)

        # Generate Batch Excel Report
        if batch_results:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_file = os.path.join(reports_dir, f"batch_{batch_num}_{timestamp}.xlsx")
            
            try:
                df_batch = pd.DataFrame(batch_results)
                df_batch.to_excel(report_file, index=False)
                print(f"Batch {batch_num} report generated: {report_file}")
            except Exception as e:
                print(f"Failed to generate batch report: {e}")

        # Delay between batches
        if i + batch_size < total_products:
            print(f"\n⏳ Waiting 60 seconds before next batch...")
            time.sleep(60)

    print("\nALL PIPELINE RUNS COMPLETED")


if __name__ == "__main__":
    main()
