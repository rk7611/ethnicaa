import requests
from bs4 import BeautifulSoup
import json
import re
import os

def scrape_kapdavilla_product(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }

    print(f"Fetching URL: {url}")
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch page. Status code: {response.status_code}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    
    # 1. Extract Title
    title = soup.select_one("div.tt-breadcrumb div.newclass div")
    if not title:
        title = soup.select_one("h1.tt-title")
    if not title:
        title = soup.select_one(".portfolio-description-title")
    
    product_name = title.get_text(strip=True) if title else "Unknown Product"

    # 2. Extract Table Data (Rate, SKU, Fabric, etc.)
    product_data = {
        "title": product_name,
        "name": product_name, # Also set name for compatibility
        "url": url,
        "product_url": url, # Pipeline uses product_url
        "source": "kapdavilla",
        "source_website": "kapdavilla.com",
        "specs": {},
        "catalog_assets": {"zip": None, "pdf": None}
    }

    # The site uses tables for specs. We look for tt-table-02 or tt-table-03
    table = soup.select_one("table.tt-table-02") or soup.select_one("table.tt-table-03") or soup.select_one("table")
    
    description = ""
    raw_specs = []
    if table:
        rows = table.find_all("tr")
        for i, row in enumerate(rows):
            tds = row.find_all(["td", "th"])
            
            # For rawSpecs, we want the text representation of the table
            row_text = " : ".join([td.get_text(strip=True) for td in tds])
            if row_text:
                raw_specs.append(row_text)

            if len(tds) >= 2:
                key = tds[0].get_text(strip=True).replace(":", "").strip()
                val = tds[1].get_text(strip=True).strip()
                
                if "RATE" in key.upper():
                    product_data["price"] = val
                    # Extract numeric price
                    price_match = re.search(r"(\d+)", val)
                    if price_match:
                        product_data["price_numeric"] = int(price_match.group(1))
                elif "SKU" in key.upper():
                    product_data["sku"] = val
                
                product_data["specs"][key] = val
            
            # Extract "OTHER DETAIL" section for description
            th = row.find("th")
            if th and "OTHER DETAIL" in th.get_text(strip=True).upper():
                if i + 1 < len(rows):
                    desc_td = rows[i+1].find("td")
                    if desc_td:
                        description = desc_td.get_text(separator="\n", strip=True)
    
    product_data["description"] = description
    product_data["rawSpecs"] = "\n".join(raw_specs)

    # 3. Extract ZIP and PDF Links
    zip_btn = soup.select_one("a[id='btn-zip'][href*='download_zip']")
    if zip_btn:
        href = zip_btn.get("href")
        if not href.startswith("http"):
            href = "https://kapdavilla.com" + href
        product_data["catalog_assets"]["zip"] = href
        
    pdf_btn = soup.select_one("a[id='btn-zip'][href*='download_pdf']")
    if pdf_btn:
        href = pdf_btn.get("href")
        if not href.startswith("http"):
            href = "https://kapdavilla.com" + href
        product_data["catalog_assets"]["pdf"] = href

    # 4. Extract Images
    images = []
    # Main images and gallery images
    img_elements = soup.select("div.tt-product-single-img a")
    for a in img_elements:
        href = a.get("href")
        if href and (href.endswith(".jpg") or href.endswith(".jpeg") or href.endswith(".png")):
            if not href.startswith("http"):
                href = "https://kapdavilla.com" + href
            if href not in images:
                images.append(href)
    
    # Fallback to img tags if no <a> links found
    if not images:
        for img in soup.select("div.tt-product-single-img img"):
            src = img.get("src")
            if src:
                if not src.startswith("http"):
                    src = "https://kapdavilla.com" + src
                if src not in images:
                    images.append(src)

    product_data["images"] = images

    # 4. Extract Category
    breadcrumbs = soup.select("div.tt-breadcrumb ul li a")
    if breadcrumbs:
        product_data["category"] = [b.get_text(strip=True) for b in breadcrumbs]
    
    return product_data

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        target_url = sys.argv[1]
    else:
        # Default example URL
        target_url = "https://kapdavilla.com/portfolio/passion-tree-colors-vol-1-lucknowi-style-rayon-short-tops-catalog-suppliers"
        print(f"No URL provided. Using default: {target_url}")
    
    print("--- Kapdavilla Single Product Scraper ---")
    data = scrape_kapdavilla_product(target_url)
    
    if data:
        output_file = "scraped_product.json"
        # Wrap in a list to be compatible with existing pipeline scripts
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump([data], f, indent=4)
        
        print(f"\nSuccessfully scraped product: {data['title']}")
        print(f"Data saved to: {os.path.abspath(output_file)}")
        print("\nTo upload ZIP/PDF to Firebase, you can now run:")
        print(f"python asset_upload_firebase.py {output_file} scraped_product_uploaded.json")
    else:
        print("Scraping failed.")
