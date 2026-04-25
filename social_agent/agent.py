import firebase_admin
from firebase_admin import credentials, firestore, storage
from config import FIREBASE_KEY
from video_engine import create_reel
from email_engine import send_video_email
import os

# --- FIREBASE INIT ---
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_KEY)
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'ethnicaa-8402c.firebasestorage.app'
    })

db = firestore.client()
bucket = storage.bucket()

def upload_video(file_path, product_id):
    print(f"Uploading video for {product_id} to Firebase Storage...")
    blob = bucket.blob(f"videos/{product_id}.mp4")
    blob.upload_from_filename(file_path)
    blob.make_public()
    return blob.public_url

def run_social_cycle(limit=5, dry_run=True):
    print(f"--- [SYNC] Starting Social Cycle ({'DRY RUN' if dry_run else 'LIVE'}) ---")
    
    # 1. Fetch unposted products
    docs = db.collection("products").where("status", "==", "published").limit(50).get()
    
    sent_count = 0
    for doc in docs:
        if sent_count >= limit:
            break
            
        p = doc.to_dict()
        p['id'] = doc.id
        
        if p.get("posted_to_social"):
            continue
            
        if not p.get("images") or len(p.get("images", [])) < 3:
            continue
            
        print(f"\n[INFO] Processing Product: {p['name']}")
        
        # 2. Create Video
        video_path = create_reel(p, f"reel_{p['id']}.mp4")
        
        if video_path and os.path.exists(video_path):
            # 3. Upload and Update Database
            if not dry_run:
                video_url = upload_video(video_path, p['id'])
                doc.reference.update({
                    "videoUrl": video_url,
                    "posted_to_social": True
                })
                print(f"SUCCESS: Video uploaded and linked to product.")
            
            # 4. Email Video to User
            if dry_run:
                print(f"[DRY RUN] Would email video to rahulsharmasujan@gmail.com")
            else:
                send_video_email(video_path, p['name'])
            
            sent_count += 1
            # Small pause to be gentle on servers
            import time
            time.sleep(2)
        else:
            print(f"WARNING: Could not generate video for {p['id']}")

    print(f"\n--- Cycle Finished. Emailed {sent_count} reels. ---")

if __name__ == "__main__":
    import sys
    is_live = "--live" in sys.argv
    run_social_cycle(limit=1, dry_run=not is_live)
