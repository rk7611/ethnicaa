import { getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { blogs } from "@/lib/blog-data";

export default async function sitemap() {
  const baseUrl = "https://ethnicaa.com";

  // 1. STATIC PAGES
  const staticPages = [
    "",
    "/about-us",
    "/contact-us",
    "/offers",
    "/blog",
    "/privacy-policy",
    "/shipping-policy",
    "/refund-cancellation",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. CATEGORY PAGES
  const categories = [
    "sarees",
    "kurtis",
    "pakistani-suits",
    "salwar-suits",
    "lehenga",
    "gowns",
    "all-products",
    "offers"
  ].map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // 3. PRODUCT PAGES (Optimized for 3000+ docs)
  let productPages = [];
  try {
    // Fetching only necessary fields to prevent timeout
    const q = query(
        collection(db, "products"), 
        where("status", "==", "published"),
        orderBy("createdAt", "desc"),
        limit(5000) // Next.js sitemap limit is high, but we limit to a safe batch
    );
    const snap = await getDocs(q);
    productPages = snap.docs.map((doc) => {
      const data = doc.data();
      const lastMod = data.updatedAt?.seconds ? new Date(data.updatedAt.seconds * 1000) : new Date();
      return {
        url: `${baseUrl}/product/${data.slug || doc.id}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });
  } catch (error) {
    console.error("Sitemap product fetch error:", error);
  }

  // 4. BLOG POSTS
  const blogPages = blogs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 5. COLLECTIONS (SEO Landing Pages)
  const cities = ["mumbai", "delhi", "jaipur", "kolkata", "hyderabad"];
  const cats = ["sarees", "kurtis", "suits"];
  const collectionPages = [];
  
  cities.forEach(city => {
    cats.forEach(cat => {
      collectionPages.push({
        url: `${baseUrl}/collections/${cat}-in-${city}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  });

  return [
    ...staticPages,
    ...categories,
    ...productPages,
    ...blogPages,
    ...collectionPages,
  ];
}
