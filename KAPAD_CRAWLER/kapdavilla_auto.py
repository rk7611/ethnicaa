import os
import subprocess
import pandas as pd
import sys
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
URLS_FILE = os.path.join(BASE_DIR, "urls.txt")
LOG_FILE = os.path.join(BASE_DIR, "product_pipeline_log_fallback.csv")
VENV_PYTHON = r"d:\ethnicaa_research_crawler\venv\Scripts\python.exe"

def run_discovery():
    print("--- [1/3] Running Discovery ---")
    subprocess.run([VENV_PYTHON, "kapdavilla_discovery.py"], cwd=BASE_DIR)

def get_new_urls():
    print("--- [2/3] Filtering New URLs ---")
    if not os.path.exists(URLS_FILE):
        print("No urls.txt found. Run discovery first.")
        return []
        
    with open(URLS_FILE, "r", encoding="utf-8") as f:
        all_urls = [line.strip() for line in f if line.strip()]
        
    if not os.path.exists(LOG_FILE):
        return all_urls
        
    try:
        df = pd.read_csv(LOG_FILE)
        processed_urls = set(df["product_url"].dropna().tolist())
    except Exception as e:
        print(f"Error reading log: {e}")
        processed_urls = set()
        
    new_urls = [url for url in all_urls if url not in processed_urls]
    print(f"Found {len(new_urls)} new products to process.")
    return new_urls

def run_pipeline(new_urls, limit=50):
    if not new_urls:
        print("No new products to process.")
        return
        
    print(f"--- [3/3] Running Pipeline for {min(len(new_urls), limit)} items ---")
    
    # Save new urls to a temporary file for the pipeline
    temp_urls_file = os.path.join(BASE_DIR, "temp_batch_urls.txt")
    with open(temp_urls_file, "w", encoding="utf-8") as f:
        for url in new_urls[:limit]:
            f.write(f"{url}\n")
            
    # Run the existing pipeline.py
    subprocess.run([VENV_PYTHON, "pipeline.py", temp_urls_file], cwd=BASE_DIR)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=10, help="Limit number of products to process in one go")
    parser.add_argument("--skip-discovery", action="store_true", help="Skip discovery and use existing urls.txt")
    args = parser.parse_args()
    
    if not args.skip_discovery:
        run_discovery()
        
    new_urls = get_new_urls()
    run_pipeline(new_urls, limit=args.limit)
    
    print("\n--- DONE ---")
