import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase
cred = credentials.Certificate(r"d:\ethnicaa_research_crawler\firebase_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def cleanup():
    print("--- Starting Video Cleanup ---")
    
    # 1. Fetch products that have a videoUrl or posted_to_social flag
    docs = db.collection("products").where("posted_to_social", "==", True).get()
    
    count = 0
    for doc in docs:
        print(f"Cleaning: {doc.id}")
        doc.reference.update({
            "videoUrl": firestore.DELETE_FIELD,
            "posted_to_social": firestore.DELETE_FIELD
        })
        count += 1
    
    print(f"--- Finished Cleanup. Removed video data from {count} products. ---")

if __name__ == "__main__":
    cleanup()
