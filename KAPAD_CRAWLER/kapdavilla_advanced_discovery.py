import asyncio
from playwright.async_api import async_playwright
import requests
from bs4 import BeautifulSoup
import json
import re
import os
import time
from datetime import datetime

# Headers for the requests-based date extraction
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
                
    except Exception as e:
        print(f"Error fetching date for {product_url}: {e}")
    return None

async def discover_with_infinite_scroll(max_products=100):
    """Uses Playwright to scroll and discover products with titles and thumbnails."""
    print(f"Starting Infinite Scroll Discovery (Target: {max_products} products)...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent=REQUEST_HEADERS["User-Agent"])
        page = await context.new_page()
        
        url = "https://kapdavilla.com/all_products"
        print(f"Navigating to {url}...")
        await page.goto(url, wait_until="networkidle")
        
        discovered_data = {} # URL -> {title, thumbnail}
        last_height = 0
        scroll_attempts = 0
        
        while len(discovered_data) < max_products:
            # Extract cards currently in the DOM
            new_items = await page.evaluate("""
                () => {
                    const results = [];
                    // Look for product cards - usually a div containing a portfolio link
                    const cards = document.querySelectorAll('div.tt-product, div.portfolio-item, .col-md-3');
                    cards.forEach(card => {
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
                    
                    // Fallback: If no card structure found, just get all portfolio links
                    if (results.length === 0) {
                        document.querySelectorAll('a[href*="/portfolio/"]').forEach(link => {
                            if (link.href.includes('whatsapp')) return;
                            results.push({
                                url: link.href,
                                title: link.innerText.trim(),
                                thumbnail: ""
                            });
                        });
                    }
                    return results;
                }
            """)
            
            # Update our collection
            for item in new_items:
                if item["url"] not in discovered_data:
                    discovered_data[item["url"]] = item
            
            print(f"Discovered {len(discovered_data)} items...", end="\r")
            
            if len(discovered_data) >= max_products:
                break
                
            # Scroll down
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await page.wait_for_timeout(2500) # Wait for AJAX load
            
            new_height = await page.evaluate("document.body.scrollHeight")
            if new_height == last_height:
                scroll_attempts += 1
                if scroll_attempts > 3: # Truly reached the end
                    print("\nReached the end of the page.")
                    break
            else:
                scroll_attempts = 0
                last_height = new_height

        await browser.close()
        print(f"\nScroll discovery complete. Found {len(discovered_data)} products.")
        
        # Now fetch dates for the discovered products
        final_results = []
        count = 1
        for url, info in discovered_data.items():
            if count > max_products: break
            
            print(f"[{count}/{len(discovered_data)}] Fetching date for: {info['title'][:40]}...")
            date = extract_product_date(url)
            
            final_results.append({
                **info,
                "published_date": date,
                "discovery_method": "infinite_scroll",
                "discovered_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            count += 1
            
        return final_results

if __name__ == "__main__":
    import sys
    
    # Target number of products to discover
    limit = 50 
    if len(sys.argv) > 1:
        limit = int(sys.argv[1])
        
    loop = asyncio.get_event_loop()
    results = loop.run_until_complete(discover_with_infinite_scroll(limit))
    
    output_file = "discovered_products_detailed.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)
        
    print(f"\nDONE! {len(results)} products saved to {output_file}")
