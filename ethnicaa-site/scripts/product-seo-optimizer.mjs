import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit, updateDoc, doc } from "firebase/firestore";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Firebase Config
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

async function runSEOOptimizer() {
  console.log("🚀 Agent 3: Starting Product SEO Optimizer...");
  
  const productsRef = collection(db, "products");
  const snapshot = await getDocs(query(productsRef, limit(5))); // Proof of concept: 5 docs
  
  let updatedCount = 0;

  for (const productDoc of snapshot.docs) {
    const p = productDoc.data();
    const docRef = doc(db, "products", productDoc.id);
    let updates = {};

    // 1. Optimize Title
    const originalName = p.catalog || p.name || "";
    if (!originalName.toLowerCase().includes("wholesale") && !originalName.toLowerCase().includes("surat")) {
      const optimizedName = `${originalName} Wholesale Surat Factory Price`.trim();
      updates.seo_title = `${optimizedName} | Ethnicaa`;
      // We don't overwrite p.name to keep original data, but we can update seo_title
      console.log(`✅ Optimizing Title: ${originalName} -> ${optimizedName}`);
    }

    // 2. Auto-Tag Categories if missing
    if (!p.categories || p.categories.length === 0) {
      let guessedCat = [];
      const name = originalName.toLowerCase();
      if (name.includes("saree")) guessedCat.push("sarees");
      if (name.includes("kurti")) guessedCat.push("kurtis");
      if (name.includes("suit")) guessedCat.push("salwar-suits");
      
      if (guessedCat.length > 0) {
        updates.categories = guessedCat;
        console.log(`✅ Auto-Tagging Category: ${originalName} -> ${guessedCat}`);
      }
    }

    // 3. Mark as Optimized
    if (Object.keys(updates).length > 0) {
      updates.seo_optimized = true;
      updates.last_seo_update = new Date();
      
      await updateDoc(docRef, updates);
      updatedCount++;
    }
  }

  console.log(`\n🎉 Optimizer Finished! Updated ${updatedCount} products.`);
}

runSEOOptimizer().catch(console.error);
