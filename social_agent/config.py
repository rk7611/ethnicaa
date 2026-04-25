import os

# --- SOCIAL MEDIA HOOKS ---
HOOKS = [
    "!!! SURAT MARKET ALERT: New Pakistani Suits catalog just arrived!",
    "Stop buying from middlemen! Get direct factory rates from Ethnicaa.",
    "Resellers only: 50+ new Kurti designs for your boutique. DM for bulk.",
    "Restock Alert: Our best-selling Silk Sarees are back in stock!",
    "B2B SPECIAL: Direct from Shree Om Market, Surat. Global Shipping!",
    "Looking for high-margin textiles? Check our latest drops!"
]

# --- DIRECTORY SETTINGS ---
TEMP_DIR = os.path.join(os.getcwd(), "temp_assets")
OUTPUT_DIR = os.path.join(os.getcwd(), "output_videos")

# Ensure directories exist
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- FIREBASE SETTINGS ---
# We will use the existing key from the research crawler
FIREBASE_KEY = r"D:\ethnicaa_research_crawler\firebase_key.json"

# --- META (INSTAGRAM/FACEBOOK) API ---
# USER TO PROVIDE:
IG_USERNAME = "ethnicaa_wholesale" 
IG_PASSWORD = "" # Use environment variables for safety
FB_ACCESS_TOKEN = ""
FB_PAGE_ID = ""
