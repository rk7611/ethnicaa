import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

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
  console.log("Starting product SEO audit...");

  const productsRef = collection(db, "products");
  const snapshot = await getDocs(query(productsRef, orderBy("createdAt", "desc"), limit(100)));

  const stats = {
    total: snapshot.size,
    thinDescription: 0,
    missingDescription: 0,
    missingFabric: 0,
    missingCategories: 0,
    nonOptimizedTitles: 0,
    missingImages: 0,
  };

  for (const productDoc of snapshot.docs) {
    const p = productDoc.data();
    const desc = p.description || "";

    if (!p.description) {
      stats.missingDescription++;
      stats.thinDescription++;
    } else if (desc.length < 150) {
      stats.thinDescription++;
    }

    if (!p.fabric && (!Array.isArray(p.fabricNames) || p.fabricNames.length === 0)) stats.missingFabric++;
    if (!p.categories || p.categories.length === 0) stats.missingCategories++;

    const title = (p.seo_title || p.catalog || p.name || "").toLowerCase();
    if (!title.includes("wholesale") && !title.includes("surat")) {
      stats.nonOptimizedTitles++;
    }

    if (!p.images || p.images.length === 0) stats.missingImages++;
  }

  console.log("\\nSEO Health Report (Latest 100 Products):");
  console.log(`Total products audited: ${stats.total}`);
  console.log(`Missing descriptions: ${stats.missingDescription}`);
  console.log(`Thin descriptions under 150 chars: ${stats.thinDescription}`);
  console.log(`Missing fabric data: ${stats.missingFabric}`);
  console.log(`Missing categories: ${stats.missingCategories}`);
  console.log(`Non-optimized titles: ${stats.nonOptimizedTitles}`);
  console.log(`Missing images: ${stats.missingImages}`);
}

runSEOAudit().catch(console.error);
