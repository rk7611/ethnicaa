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

function buildSuggestedDescription(product = {}) {
  const name = product.catalog || product.name || "this ethnic wear catalog";
  const category = product.categoryNames?.[0] || product.category || product.categories?.[0]?.replace(/-/g, " ") || "ethnic wear";
  const fabric = product.fabricNames?.[0] || product.fabric || product.fabrics?.[0]?.replace(/-/g, " ") || "premium fabric";
  const price = product.offer_price || product.price || product.avg_price;

  return [
    `${name} is a wholesale ${category} catalog selected for boutiques, resellers, and bulk ethnic wear buyers.`,
    `The catalog uses ${fabric} and is suitable for customers looking for stylish Indian ethnic wear with reliable Surat wholesale sourcing.`,
    price ? `Current wholesale pricing starts around INR ${price} per piece, subject to live stock and quantity confirmation.` : "",
    "Use this product for WhatsApp selling, boutique display, export buying, and fast-moving festive or daily wear inventory.",
    "Confirm final price, stock, packing, and dispatch details with Ethnicaa before placing a bulk order.",
  ].filter(Boolean).join(" ");
}

async function previewSEODescriptions() {
  console.log("Previewing buyer-focused descriptions for latest 100 products...");

  const productsRef = collection(db, "products");
  const snapshot = await getDocs(query(productsRef, orderBy("createdAt", "desc"), limit(100)));

  for (const productDoc of snapshot.docs.slice(0, 10)) {
    const p = productDoc.data();
    console.log("\\n---");
    console.log(`Product: ${p.catalog || p.name || productDoc.id}`);
    console.log(buildSuggestedDescription(p));
  }

  console.log(`\\nGenerated description previews for ${Math.min(snapshot.size, 10)} of ${snapshot.size} latest products.`);
  console.log("This script is read-only. Use the protected SEO agent in /admin/seo-agent to write approved updates.");
}

previewSEODescriptions().catch(console.error);
