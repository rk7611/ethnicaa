import os
import sys
import firebase_admin
from firebase_admin import credentials, firestore

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_KEY = os.path.join(BASE_DIR, "firebase_key.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_KEY)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def main():
    print("Fetching products from Firestore...")
    try:
        docs = db.collection("products").limit(100).stream()
    except Exception as e:
        print(f"Error fetching from Firebase: {e}")
        sys.exit(1)
    
    products = []
    for doc in docs:
        products.append(doc.to_dict())
        
    print(f"Fetched {len(products)} products.")
    
    if not products:
        print("No products found in Firestore.")
        return

    # 1. Schema inference
    sample = products[0]
    print("\n--- SAMPLE EXISTING SCHEMA KEYS ---")
    for k in sorted(sample.keys()):
        print(f"- {k}: {type(sample[k]).__name__}")
        
    # 2. Validation
    print("\n--- VALIDATION RESULTS ---")
    required_fields = [
        "name", "slug", "price", "priceText", "category", "fabric", "catalog", 
        "pcs", "sizes", "totalDesign", "availability", "dispatchTime", 
        "description", "images", "status"
    ]
    
    total_errors = 0
    invalid_products = 0
    
    for idx, p in enumerate(products, 1):
        errors = []
        for field in required_fields:
            if field not in p:
                errors.append(f"Missing field: {field}")
        
        if errors:
            total_errors += len(errors)
            invalid_products += 1
            if invalid_products <= 3: # Print first 3 errors to avoid spam
                print(f"Product slug: {p.get('slug', 'UNKNOWN')} errors: {errors}")
                
    print(f"\nTotal invalid products (out of {len(products)} checked): {invalid_products}")
    print(f"Total errors found: {total_errors}")

if __name__ == '__main__':
    main()
