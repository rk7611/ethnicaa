import json
import os
import re
import sys

# -------- ARGUMENTS --------

if len(sys.argv) < 3:
    print("❌ Usage: python normalize_product.py <input_json> <output_json>")
    sys.exit(1)

INPUT_JSON = sys.argv[1]
OUTPUT_JSON = sys.argv[2]

# -------- TAG DICTIONARY (With Spelling Shield) --------

KEYWORDS = [
    "kurti", "long kurti", "designer kurti", "saree", "salwar suit",
    "readymade salwar suit", "readymade suit", "readymade", "semi stitch salwar suit", "semi stitched", "pakistani",
    "lehenga", "lahanga", "gown", "designer suit", "designer",
    "cotton", "printed", "embroidered", 
    "dupatta", "duppatta", "duppata", "duppta", "duptta", "dupatt", "dupptta", # All variations
    "silk", "georgette", "chiffon", "net", "party wear",
    "wedding", "casual", "bridal", "heavy", "digital print",
    "top", "bottom", "bottam", "botam", "botom", "pant", "pents", "pent", # All variations
    "co-ord", "cord set", "co-rd set", "cord", "size", "m", "l", "xl", "xxl", "3xl", "4xl", "5xl"
]

# Mapping of scraped variations to clean tags
SPELLING_FIX = {
    "bottam": "bottom", "botam": "bottom", "botom": "bottom",
    "pent": "pant", "pents": "pant",
    "duppatta": "dupatta", "duppata": "dupatta", "duppta": "dupatta", "duptta": "dupatta", "dupatt": "dupatta", "dupptta": "dupatta",
    "lahanga": "lehenga", "cord": "co-ord-set", "cord set": "co-ord-set", "co-rd set": "co-ord-set"
}

# -------- HELPERS --------

def slugify_web(text: str) -> str:
    """Matches Admin panel toSlug logic."""
    if not text: return ""
    s = text.lower().strip()
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"[^a-z0-9-]", "", s)
    return s

def to_pretty(text: str) -> str:
    """Matches Admin panel toPretty logic."""
    if not text: return ""
    s = text.replace("-", " ")
    return re.sub(r"\b\w", lambda m: m.group(0).upper(), s)

def extract_price_number(text: str) -> int:
    """Extract numeric price."""
    if not text: return 0
    match = re.search(r"(\d{2,6})", str(text).replace(",", ""))
    return int(match.group(1)) if match else 0

def extract_pcs_number(product: dict) -> int:
    """Extract PCS count from various fields."""
    raw_pcs = product.get("pcs")
    if raw_pcs:
        match = re.search(r"(\d+)", str(raw_pcs))
        if match: return int(match.group(1))
    specs = str(product.get("rawSpecs", "")).lower()
    match = re.search(r"pcs\s*[:\-]*\s*(\d+)", specs)
    if match: return int(match.group(1))
    match = re.search(r"(\d+)\s*pcs", specs)
    if match: return int(match.group(1))
    return 0

def to_num(val) -> int:
    """Safely convert to integer."""
    if val is None: return 0
    if isinstance(val, list): val = val[0] if val else 0
    s = str(val).replace(",", "").strip()
    match = re.search(r"(\d+(\.\d+)?)", s)
    if match: return int(float(match.group(1)))
    return 0

def extract_tech_info(text: str) -> dict:
    """Parses description for structured data."""
    if not text: return {}
    info = {}
    lines = text.replace("\\n", "\n").split("\n")
    patterns = {
        "pcs": [r"(\d+)\s*pcs", r"set\s*of\s*(\d+)", r"(\d+)\s*pieces"],
        "price": [r"price\s*[:\-]*\s*(\d+)", r"rate\s*[:\-]*\s*(\d+)"],
        "sizes": [r"sizes\s*[:\-]*\s*(.+)", r"size\s*[:\-]*\s*(.+)"],
        "fabric": [r"fabric\s*[:\-]*\s*(.+)"],
        "gst": [r"gst\s*[:\-]*\s*(\d+)"],
        "catalog": [r"cat(?:a|e)?lo?g\s*[:\-]*\s*(.+)"],
    }
    for line in lines:
        line_clean = line.strip().lower()
        for key, regex_list in patterns.items():
            for pattern in regex_list:
                match = re.search(pattern, line_clean)
                if match:
                    val = match.group(1).strip().upper()
                    if key not in info: info[key] = val
    return info

def extract_tags(title, description):
    raw_text = (str(title) + " " + str(description)).lower()
    
    # Boilerplate removal
    clean_patterns = [
        r"requirment for.*", r"requirement for.*", r"available for.*",
        r"search keywords.*", r"dispatched only after.*"
    ]
    for pattern in clean_patterns:
        raw_text = re.sub(pattern, " ", raw_text, flags=re.DOTALL)

    text = re.sub(r'[^a-z0-9\s]', ' ', raw_text)
    tags = set()

    # Priority Phrases
    phrases = [
        "readymade salwar suit", "readymade suit", "semi stitch salwar suit",
        "3 pcs concept", "3 pcs catlog", "3 pieces concept", "3 pieces catalog"
    ]
    for phrase in phrases:
        if phrase in raw_text:
            tags.add(phrase)

    # Keyword Matching
    for kw in KEYWORDS:
        if f" {kw} " in f" {text} " or (len(kw) > 4 and kw in text):
            # Apply Spelling Shield
            clean_tag = SPELLING_FIX.get(kw, kw)
            tags.add(clean_tag)
            
    return sorted(list(tags))

def derive_category(tags):
    # --- PRIORITY 0: SPECIAL CONCEPTS (3 PCS) ---
    special_3pcs = ["3 pcs concept", "3 pcs catlog", "3 pieces concept", "3 pieces catalog"]
    if any(t in tags for t in special_3pcs):
        return "Readymade Salwar Suits"

    # --- PRIORITY 1: EXACT KEYWORDS ---
    if "co-ord" in tags or "co-ord-set" in tags:
        return "CO ORD SET"
    if "readymade salwar suit" in tags or "readymade suit" in tags:
        return "Readymade Salwar Suits"
    if "semi stitch salwar suit" in tags or "semi stitched" in tags:
        return "Salwar Suits"
    if "salwar suit" in tags:
        return "Salwar Suits"
    if "saree" in tags:
        return "Sarees"
    if "kurti" in tags:
        return "Kurti"
    if "gown" in tags:
        return "Gown"
    if "lehenga" in tags:
        return "Lahanga"

    # --- PRIORITY 2: STRUCTURAL RULES (Fallback) ---
    has_top = any(t in tags for t in ["top", "kurti", "designer kurti"])
    has_bottom = any(t in tags for t in ["bottom", "pant"])
    has_dupatta = any(t in tags for t in ["dupatta"])
    has_size = any(t in tags for t in ["size", "m", "l", "xl", "xxl", "3xl", "4xl", "5xl"])
    
    if has_top and has_bottom and has_dupatta and has_size:
        return "Readymade Salwar Suits"
    if has_top and has_bottom and has_dupatta:
        return "Salwar Suits"
    if has_top and has_bottom and has_size:
        return "CO ORD SET"

    return "Ethnic Wear"


# -------- NORMALIZER --------

def normalize_product(product: dict) -> dict:
    """
    IMPORTANT RULES:
    - DO NOT delete any existing field
    - ONLY add website-compatible fields
    - DO NOT write Firestore timestamps here
    """

    normalized = dict(product)  # 🔒 FULL COPY (CRITICAL)

    title = product.get("title") or product.get("name") or ""
    avg_price = product.get("avg_price") or ""

    # ---- SMART EXTRACTION FROM DESCRIPTION ----
    raw_specs_text = product.get("rawSpecs", "")
    tech_info = extract_tech_info(raw_specs_text)
    
    # price (number)
    if not normalized.get("price") or normalized["price"] == 0:
        extracted_price = tech_info.get("price")
        if extracted_price:
            # We use extract_price_number logic to ensure it's a clean int even if it has /-
            normalized["price"] = extract_price_number(extracted_price)
        else:
            normalized["price"] = extract_price_number(avg_price)

    # pcs
    if not normalized.get("pcs") or normalized["pcs"] == 0:
        extracted_pcs = tech_info.get("pcs")
        if extracted_pcs:
            normalized["pcs"] = int(extracted_pcs)
        else:
            normalized["pcs"] = extract_pcs_number(normalized)

    # Calculate Full Price with GST
    price_val = to_num(normalized.get("price", 0))
    pcs_val = to_num(normalized.get("pcs", 0))
    
    # Default GST 5% unless found in description (e.g. 12% GST)
    gst_match = tech_info.get("gst", "5")
    gst_pct = to_num(gst_match)
    if gst_pct == 0: gst_pct = 5 # Safety fallback
    
    full_price = price_val * pcs_val
    full_with_gst = round(full_price * (1 + gst_pct / 100), 2)
    
    normalized["price"] = price_val
    normalized["pcs"] = pcs_val
    normalized["full_price"] = full_price
    normalized["full_price_with_gst"] = full_with_gst
    normalized["gst"] = gst_pct

    # priceText (string)
    if not normalized.get("priceText"):
        normalized["priceText"] = avg_price or f"INR {price_val}"

    # sizes (Intelligent Inference)
    raw_size_field = tech_info.get("sizes") or product.get("size", "")
    main_cat_slug = normalized.get("categories", [""])[0]
    
    inferred_size = ""
    # 1. Search description for keywords if raw field is weak
    desc_lower = raw_specs_text.lower()
    if "free size" in desc_lower or "free-size" in desc_lower:
        inferred_size = "Free Size"
    elif "semi stitched" in desc_lower or "semi-stitched" in desc_lower:
        inferred_size = "Semi-Stitched"
    elif "full stitch" in desc_lower or "fully stitched" in desc_lower:
        inferred_size = "Ready Made"
    elif "unstitched" in desc_lower or "un-stitched" in desc_lower:
        inferred_size = "Unstitched"

    # 2. Category-based defaults
    if main_cat_slug == "sarees":
        # Sarees are always standard/free unless marked otherwise
        inferred_size = inferred_size or "Standard"
    
    # 3. Final merge
    final_size = raw_size_field or inferred_size
    
    # Clean up "Free" -> "Free Size"
    if str(final_size).strip().lower() == "free":
        final_size = "Free Size"
        
    normalized["sizes"] = final_size

    # description & rawSpecs cleanup
    if not normalized.get("description"):
        normalized["description"] = raw_specs_text
        
    # Rebuild rawSpecs for Admin Panel
    spec_summary = []
    if tech_info.get("fabric"): spec_summary.append(f"Fabric: {tech_info['fabric']}")
    if tech_info.get("sizes"): spec_summary.append(f"Sizes: {tech_info['sizes']}")
    if tech_info.get("catalog"): spec_summary.append(f"Catalog: {tech_info['catalog']}")
    
    normalized["rawSpecs"] = "\\n".join(spec_summary) if spec_summary else raw_specs_text

    # catalogAssets initialization (CRITICAL for Validator)
    raw_assets = product.get("catalog_assets", {})
    normalized["catalogAssets"] = {
        "zip": raw_assets.get("zip"),
        "pdf": raw_assets.get("pdf"),
    }

    # ---- Website Required Fields (Remapped) ----
    
    normalized["name"] = normalized.get("name") or title
    normalized["slug"] = normalized.get("slug") or slugify_web(normalized["name"])

    # sizes fallback
    if not normalized.get("sizes"):
        normalized["sizes"] = ""

    # totalDesign
    normalized.setdefault("totalDesign", "")

    # dispatchTime
    normalized["dispatchTime"] = normalized.get("dispatchTime") or product.get(
        "initial_delivery", ""
    )
    
    # catalog
    if tech_info.get("catalog"):
        normalized["catalog"] = tech_info["catalog"]

    # ---- BOILERPLATE REMOVAL (Clean description before tagging) ----
    desc = str(normalized.get("description", ""))
    clean_patterns = [
        r"Stitching available on customer",
        r"Requirment For Sarees\s*,\s*Salwar Kameez\s*,?",
        r"Lehengha\s*\.\s*\(i\.e\s*M\s*,\s*L\s*,\s*XL\s*,\s*XXL\s*\)\s*.*Goods Will be dispatched only",
        r"after.*Payment is recived in our bank account\.",
        r"Goods Will be dispatched only after.*Payment is recived in our bank account\.",
        r"Lehengha\.\(i\.e M,L,XL,XXL\)"
    ]
    for pattern in clean_patterns:
        desc = re.sub(pattern, "", desc, flags=re.IGNORECASE | re.DOTALL)
    
    # Fix literal \n from scraping
    desc = desc.replace("\\n", "\n").replace("\\\\n", "\n")
    
    normalized["description"] = re.sub(r'\n\s*\n', '\n\n', desc).strip()

    # ---- TAG-BASED CLASSIFICATION & SYNC ----
    tags_list = extract_tags(normalized["name"], normalized["description"])
    derived_cat = derive_category(tags_list)
    website_slug = slugify_web(derived_cat)
    
    # Final tag sync for website matching
    final_tags = set(tags_list)
    if derived_cat == "CO ORD SET":
        final_tags.add("co-ord-set")
    elif derived_cat == "Readymade Salwar Suits":
        final_tags.add("readymade-suits")
        final_tags.add("salwar-suits")
    elif derived_cat == "Salwar Suits":
        final_tags.add("salwar-suits")
    elif derived_cat == "Pakistani Suits":
        final_tags.add("pakistani-suits")
    elif derived_cat == "Sarees":
        final_tags.add("saree")
    elif derived_cat == "Kurti":
        final_tags.add("kurti")
        
    normalized["tags"] = sorted(list(final_tags))
    normalized["categoryNames"] = [derived_cat]
    normalized["categories"] = [website_slug]
    normalized["category"] = derived_cat 

    # ---- PCS NORMALIZATION ----
    normalized["pcs"] = extract_pcs_number(normalized)

    # ---- FABRIC CONSOLIDATION (Kapdavilla Special) ----
    source = normalized.get("source", "").lower()
    if source == "kapdavilla":
        fab_parts = []
        if product.get("top_fabric"): fab_parts.append(f"Top: {product['top_fabric']}")
        if product.get("bottom_fabric"): fab_parts.append(f"Bottom: {product['bottom_fabric']}")
        if product.get("dupatta_fabric"): fab_parts.append(f"Dupatta: {product['dupatta_fabric']}")
        
        if fab_parts and not normalized.get("fabric"):
            normalized["fabric"] = " | ".join(fab_parts)
            
    raw_fab = normalized.get("fabric", "")
    if raw_fab:
        pretty_fab = to_pretty(raw_fab)
        slug_fab = slugify_web(raw_fab)
        normalized["fabricNames"] = [pretty_fab]
        normalized["fabrics"] = [slug_fab]
        normalized["fabric"] = pretty_fab
    else:
        normalized["fabricNames"] = []
        normalized["fabrics"] = []
        normalized["fabric"] = ""

    # ---- SEO SUITE ----
    main_cat = normalized["categoryNames"][0] if normalized["categoryNames"] else ""
    main_fab = normalized["fabricNames"][0] if normalized["fabricNames"] else ""
    
    normalized["seo_title"] = f"{normalized['name']} | Ethnicaa"
    normalized["seo_description"] = f"Buy {normalized['name']} at wholesale. Fabric: {main_fab}. Category: {main_cat}. Latest Surat collection."
    normalized["seo_keywords"] = f"{normalized['name']}, {main_fab}, {main_cat}, Ethnicaa Wholesale"
    normalized["seo_slug"] = normalized["slug"]
    normalized["seo_alt"] = f"{main_fab} {main_cat} {normalized['name']} Ethnicaa".strip()

    # status (crawler rule)
    normalized["status"] = "draft"

    # ❗ DO NOT SET createdAt / updatedAt HERE
    # Firestore importer is responsible for timestamps

    # ---- SOURCE METADATA (SAFE, JSON ONLY) ----
    normalized.setdefault("source", product.get("source", "crawler"))
    normalized.setdefault(
        "sourceMeta",
        {
            "website": product.get("source_website"),
            "original_url": product.get("product_url"),
            # imported_at will be converted in firestore_importer
        },
    )

    return normalized


# -------- MAIN --------

def main():
    print("Normalizing products...")

    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        products = json.load(f)

    normalized_products = []

    for idx, product in enumerate(products, start=1):
        if not product or not isinstance(product, dict):
            print(f"Skipping invalid product at index {idx}")
            continue

        normalized = normalize_product(product)
        normalized_products.append(normalized)

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(normalized_products, f, ensure_ascii=False, indent=2)

    print(f"Normalization complete -> {OUTPUT_JSON}")
    print("Raw scraped data preserved. No fields deleted.")


if __name__ == "__main__":
    main()
