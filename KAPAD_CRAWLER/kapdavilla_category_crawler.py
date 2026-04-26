import asyncio
from playwright.async_api import async_playwright
import requests
from bs4 import BeautifulSoup
import json
import re
import os
from datetime import datetime

# Category list discovered from the navigation menu
CATEGORIES = [
    {"name": "Readymade", "url": "https://kapdavilla.com/products/readymade"},
    {"name": "Salwar Kameez", "url": "https://kapdavilla.com/products/salwar-kameez"},
    {"name": "Saree", "url": "https://kapdavilla.com/products/saree"},
    {"name": "Lehenga", "url": "https://kapdavilla.com/products/lehenga"},
    {"name": "Indo Western", "url": "https://kapdavilla.com/products/indo-western"},
    {"name": "Bottom", "url": "https://kapdavilla.com/products/bottom"},
    {"name": "Accessories", "url": "https://kapdavilla.com/products/accessories"},
    {"name": "Mens Wear", "url": "https://kapdavilla.com/products/mens-wear"},
    {"name": "Ready to Ship", "url": "https://kapdavilla.com/ready-to-ship"},
    {"name": "Single", "url": "https://kapdavilla.com/single"},
    {"name": "Single Designs", "url": "https://kapdavilla.com/single_designs"},
]

REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
}

def extract_product_date(product_url):
    """Quickly fetches the product page using requests and extracts the date."""
    try:
        response = requests.get(product_url, headers=REQUEST_HEADERS, timeout=10)
        if response.status_code != 200:
            return None
        
        soup = BeautifulSoup(response.text, "html.parser")
        table = soup.select_one("table.tt-table-02") or soup.select_one("table.tt-table-03") or soup.select_one("table")
        
        if table:
            for row in table.find_all("tr"):
                tds = row.find_all(["td", "th"])
                if len(tds) >= 2:
                    key = tds[0].get_text(strip=True).upper()
                    if "DATE" in key:
                        return tds[1].get_text(strip=True)
        
        # Fallback to image filename date
        img = soup.select_one("div.tt-product-single-img img")
        if img and img.get("src"):
            match = re.search(r"(\d{4}-\d{2}-\d{2})", img.get("src"))
            if match:
                return match.group(1)
                
    except Exception:
        pass
    return None

async def crawl_category(browser_context, category_info, limit_per_category=50):
    """Crawls a single category using infinite scroll."""
    print(f"\n--- Crawling Category: {category_info['name']} ---")
    page = await browser_context.new_page()
    
    try:
        await page.goto(category_info['url'], wait_until="networkidle", timeout=60000)
    except Exception as e:
        print(f"Error loading {category_info['name']}: {e}")
        await page.close()
        return []

    discovered = {}
    last_height = 0
    scroll_attempts = 0
    
    # Wait for the product grid to load (at least some products)
    try:
        await page.wait_for_selector("div.tt-product", timeout=10000)
    except:
        print(f"  > Warning: No products appeared quickly for {category_info['name']}")

    while len(discovered) < limit_per_category:
        # Extract items specifically from the product grid, avoiding the sidebar
        items = await page.evaluate("""
            () => {
                const results = [];
                // Target products only, avoiding the sidebar/left column
                const cards = document.querySelectorAll('div.tt-product');
                cards.forEach(card => {
                    // Safety check: ensure it's not in the sidebar
                    if (card.closest('.tt-left-column')) return;

                    const link = card.querySelector('a[href*="/portfolio/"]');
                    if (!link || link.href.includes('whatsapp')) return;
                    
                    const titleEl = card.querySelector('.tt-title, h2, h3, .portfolio-title');
                    const imgEl = card.querySelector('img');
                    
                    results.push({
                        url: link.href,
                        title: titleEl ? titleEl.innerText.trim() : "",
                        thumbnail: imgEl ? imgEl.src : ""
                    });
                });
                return results;
            }
        """)
        
        for item in items:
            if item['url'] not in discovered:
                discovered[item['url']] = item
        
        print(f"Found {len(discovered)} products in {category_info['name']}...", end="\r")
        
        if len(discovered) >= limit_per_category:
            break
            
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(3000) # Wait a bit longer for AJAX
        
        new_height = await page.evaluate("document.body.scrollHeight")
        if new_height == last_height:
            scroll_attempts += 1
            if scroll_attempts > 4: # Truly reached the end
                break
        else:
            scroll_attempts = 0
            last_height = new_height

    await page.close()
    return list(discovered.values())

async def main_crawler(limit_per_category=30):
    all_products_map = {} # URL -> product_info
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent=REQUEST_HEADERS["User-Agent"])
        
        for cat in CATEGORIES:
            products = await crawl_category(context, cat, limit_per_category)
            
            for p_info in products:
                url = p_info['url']
                if url not in all_products_map:
                    all_products_map[url] = {
                        **p_info,
                        "found_in_categories": [cat['name']]
                    }
                else:
                    if cat['name'] not in all_products_map[url]["found_in_categories"]:
                        all_products_map[url]["found_in_categories"].append(cat['name'])
        
        await browser.close()

    print(f"\n\nTotal unique products discovered: {len(all_products_map)}")
    
    # Enrichment: Fetch dates
    final_results = []
    count = 1
    total = len(all_products_map)
    
    for url, info in all_products_map.items():
        print(f"[{count}/{total}] Fetching date for: {info['title'][:40]}...")
        date = extract_product_date(url)
        
        final_results.append({
            **info,
            "published_date": date,
            "discovered_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        count += 1
        
    return final_results

if __name__ == "__main__":
    import sys
    
    # Default limit to 20 per category for a test run
    limit = 20
    if len(sys.argv) > 1:
        limit = int(sys.argv[1])
        
    results = asyncio.run(main_crawler(limit))
    
    output_file = "category_discovered_products.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)
        
    print(f"\nSUCCESS! Scraped {len(results)} products across categories.")
    print(f"Results saved to: {os.path.abspath(output_file)}")
