import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Firebase Config from Env
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runSEOAudit() {
  console.log("🚀 Agent 3: Starting Product SEO Audit...");
  
  const productsRef = collection(db, "products");
  const snapshot = await getDocs(query(productsRef, limit(500)));
  
  let stats = {
    total: snapshot.size,
    thinDescription: 0,
    missingDescription: 0,
    missingFabric: 0,
    missingCategories: 0,
    nonOptimizedTitles: 0,
    missingImages: 0
  };

  let index = 0;
  for (const doc of snapshot.docs) {
    const p = doc.data();
    
    // Check Description
    const desc = p.description || "";
    const isThin = desc.length < 150;
    if (index < 5) console.log(`DEBUG Index ${index}: length=${desc.length}, isThin=${isThin}`);

    if (!p.description) {
      stats.missingDescription++;
      stats.thinDescription++;
    } else if (isThin) {
      stats.thinDescription++;
    }

    if (index < 5) console.log(`DEBUG: Index ${index}, missingDesc: ${stats.missingDescription}, thinDesc: ${stats.thinDescription}`);

    // Check Fabric
    if (!p.fabric) stats.missingFabric++;

    // Check Categories
    if (!p.categories || p.categories.length === 0) stats.missingCategories++;

    // Check Title
    const title = (p.catalog || p.name || "").toLowerCase();
    if (!title.includes("wholesale") && !title.includes("surat")) {
      stats.nonOptimizedTitles++;
    }

    // Check Images
    if (!p.images || p.images.length === 0) stats.missingImages++;
    index++;
  }

  console.log("\n📊 SEO Health Report (First 500 Products):");
  console.log(`Total Products Audited: ${stats.total}`);
  console.log(`❌ Missing Description: ${stats.missingDescription}`);
  console.log(`❌ Thin Descriptions (<150 chars): ${stats.thinDescription} (${Math.round(stats.thinDescription/stats.total*100)}%)`);
  console.log(`❌ Missing Fabric Data: ${stats.missingFabric}`);
  console.log(`❌ Missing Categories: ${stats.missingCategories}`);
  console.log(`❌ Non-Optimized Titles: ${stats.nonOptimizedTitles}`);
  console.log(`❌ Missing Images: ${stats.missingImages}`);
}

runSEOAudit().catch(console.error);
