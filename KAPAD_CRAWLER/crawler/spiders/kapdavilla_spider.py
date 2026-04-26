import scrapy
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from datetime import datetime
import re

class KapdavillaSpider(scrapy.Spider):
    name = "kapdavilla_spider"
    allowed_domains = ["kapdavilla.com"]

    custom_settings = {
        "DEFAULT_REQUEST_HEADERS": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
        }
    }

    def __init__(self, product_urls=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if product_urls:
            self.start_urls = [u.strip() for u in product_urls.split(",")]
        else:
            self.start_urls = []

    def parse(self, response):
        soup = BeautifulSoup(response.text, "lxml")
        
        table_data = self.extract_product_table(soup)
        
        title = response.css("h1.tt-title::text").get()
        if not title:
            title = response.css(".portfolio-description-title::text").get()
        if not title:
            title = response.css(".portfolio-details h2::text").get()
        if not title:
            title = response.css("h1::text").get()
        
        # Extract images
        images = set()
        # Method 1: Links to high-res images
        for img_a in response.css(".portfolio-detail-image a::attr(href)").getall():
            if img_a.endswith(('.jpg', '.jpeg', '.png', '.webp')):
                if img_a.startswith("http"):
                    images.add(img_a)
                elif img_a.startswith("/"):
                    images.add("https://kapdavilla.com" + img_a)
        
        # Method 2: Main product images
        for img_src in response.css(".tt-product-single-img img::attr(src)").getall():
             if img_src.startswith("http"):
                 images.add(img_src)
             elif img_src.startswith("/"):
                 images.add("https://kapdavilla.com" + img_src)
        
        # Method 3: Gallery/Thumb images (if high res available via data-src)
        for img_src in response.css("img[src*='/product/']::attr(src)").getall():
             if img_src.startswith("http"):
                 images.add(img_src)
             elif img_src.startswith("/"):
                 images.add("https://kapdavilla.com" + img_src)

        # Category from breadcrumbs
        categories = response.css(".btn11.btn-default11::text").getall()
        category = categories[-1].strip() if categories else "Ethnic Wear"

        yield {
            "source_website": "kapdavilla.com",
            "source": "kapdavilla",
            "product_url": response.url,
            "title": title.strip() if title else None,
            
            "brand": table_data.get("brand"),
            "catalog": table_data.get("sku") or table_data.get("catalog"),
            "pcs": table_data.get("pcs") or table_data.get("no_of_pieces"),
            "avg_price": table_data.get("rate") or table_data.get("avg_price"),
            "full_price": table_data.get("full_price"), # Usually derived later
            "fabric": table_data.get("fabric") or table_data.get("top_fabric"),
            "top_fabric": table_data.get("top_fabric"),
            "bottom_fabric": table_data.get("bottom_fabric"),
            "dupatta_fabric": table_data.get("dupatta_fabric"),
            "work": table_data.get("work"),
            "size": table_data.get("size"),
            "availability": table_data.get("availability") or "In Stock",
            
            "rawSpecs": table_data.get("other_details") or "",
            "description": table_data.get("description") or "",
            
            "images": list(images),
            "category": category,
            "status": "draft",
            "scraped_at": datetime.utcnow().isoformat(),
        }

    def extract_product_table(self, soup):
        data = {}
        table = soup.select_one(".tt-table-03")
        if not table:
            # Try generic table if specific one not found
            table = soup.select_one("table")
            if not table:
                return data
            
        rows = table.find_all("tr")
        other_details = []
        
        for row in rows:
            tds = row.find_all("td")
            if not tds:
                continue
                
            if len(tds) == 1:
                text = tds[0].get_text(strip=True)
                if text:
                    other_details.append(text)
                continue
            
            if len(tds) >= 2:
                # Handle colspan="2" as a header/description block
                if tds[0].get("colspan") == "2":
                    text = tds[0].get_text(strip=True)
                    if text:
                        other_details.append(text)
                    continue

                key = tds[0].get_text(strip=True).upper()
                val = tds[1].get_text(strip=True)
                
                if "SKU" in key:
                    data["sku"] = val
                elif "RATE" in key:
                    # Extract number from "2995"
                    price_match = re.search(r"(\d+)", val)
                    data["rate"] = price_match.group(1) if price_match else val
                elif "TOP" in key:
                    data["top_fabric"] = val
                elif "BOTTOM" in key or "INNER" in key:
                    data["bottom_fabric"] = val
                elif "DUPATTA" in key:
                    data["dupatta_fabric"] = val
                elif "FABRIC" in key:
                    data["fabric"] = val
                elif "WORK" in key:
                    data["work"] = val
                elif "SIZE" in key:
                    data["size"] = val
                elif "PIECES" in key or "PCS" in key:
                    data["pcs"] = val
                elif "OTHER" in key or "DESCRIPTION" in key:
                    data["description"] = val
                else:
                    # Generic mapping for anything else
                    clean_key = key.lower().replace(" ", "_").replace(":", "")
                    data[clean_key] = val
                
        if other_details:
            data["other_details"] = "\\n".join(other_details)
            
        return data
