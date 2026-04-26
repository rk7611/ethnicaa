import asyncio
from playwright.async_api import async_playwright
import os
import time

async def discover_urls():
    print("Starting Kapdavilla Discovery...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
        page = await context.new_page()
        
        url = "https://kapdavilla.com/all_products"
        print(f"Navigating to {url}...")
        await page.goto(url, wait_until="networkidle")
        
        # Handle infinite scroll
        last_height = await page.evaluate("document.body.scrollHeight")
        links = set()
        
        print("Scrolling to load all products...")
        scroll_count = 0
        while True:
            # Extract links currently on page
            new_links = await page.evaluate("""
                () => Array.from(document.querySelectorAll('a[href*="/portfolio/"]'))
                           .map(a => a.href)
                           .filter(href => href.includes('kapdavilla.com/portfolio/') && !href.includes('api.whatsapp.com'))
            """)
            links.update(new_links)
            print(f"Found {len(links)} products so far...")
            
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await page.wait_for_timeout(2000) # Wait for load
            
            new_height = await page.evaluate("document.body.scrollHeight")
            if new_height == last_height:
                # Try one more time just in case
                await page.wait_for_timeout(3000)
                new_height = await page.evaluate("document.body.scrollHeight")
                if new_height == last_height:
                    break
            last_height = new_height
            scroll_count += 1
            if scroll_count > 100: # Safety break
                break
        
        print(f"Discovery complete. Total unique products found: {len(links)}")
        
        with open("urls.txt", "w", encoding="utf-8") as f:
            for link in sorted(list(links)):
                f.write(f"{link}\n")
        
        print("URLs saved to urls.txt")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(discover_urls())
