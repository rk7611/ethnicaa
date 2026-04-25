import os
from instagrapi import Client
from config import IG_USERNAME, IG_PASSWORD
import requests

class SocialAgent:
    def __init__(self, dry_run=True):
        self.dry_run = dry_run
        self.ig_client = None

    def login_instagram(self):
        if self.dry_run:
            print("[DRY RUN] Instagram login skipped.")
            return True
            
        try:
            self.ig_client = Client()
            # We can use a session file to avoid constant logins (Meta safety)
            session_file = "ig_session.json"
            if os.path.exists(session_file):
                self.ig_client.load_settings(session_file)
                self.ig_client.login(IG_USERNAME, IG_PASSWORD)
            else:
                self.ig_client.login(IG_USERNAME, IG_PASSWORD)
                self.ig_client.dump_settings(session_file)
            print("Instagram Login Successful!")
            return True
        except Exception as e:
            print(f"FAILED: Instagram Login Failed: {e}")
            return False

    def post_reel(self, video_path, product_data):
        caption = f"{product_data['name']}\n\n"
        caption += f"PRICE: Direct Wholesale Price: Rs. {product_data['price']}\n"
        caption += "SHIPPING: Worldwide Shipping | STOCK: Bulk Only\n\n"
        caption += "DM for catalog and ordering!\n\n"
        caption += "#SuratWholesale #Ethnicaa #ResellersWelcome #EthnicWear #Manufacturer #B2B"

        if self.dry_run:
            print(f"[DRY RUN] Would post Reel to Instagram with caption:\n{caption}")
            return True

        try:
            # Uploading to Instagram
            media = self.ig_client.clip_upload(
                video_path,
                caption=caption
            )
            print(f"SUCCESS: Reel posted successfully! Media ID: {media.pk}")
            return True
        except Exception as e:
            print(f"FAILED: Failed to post Reel: {e}")
            return False

if __name__ == "__main__":
    # Test
    agent = SocialAgent(dry_run=True)
    agent.post_reel("output_videos/test_reel.mp4", {"name": "Silk Saree", "price": 1200})
