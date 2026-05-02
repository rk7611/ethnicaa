import { getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { blogs } from "@/lib/blog-data";
import { keywordPages } from "@/lib/keyword-content";
import { brandsData } from "@/lib/brands-data";

export const revalidate = 21600;

export default async function sitemap() {
  const baseUrl = "https://ethnicaa.com";

  // 1. STATIC PAGES
  const staticPages = [
    "",
    "/about-us",
    "/contact-us",
    "/offers",
    "/blog",
    "/brands",
    "/privacy-policy",
    "/shipping-policy",
    "/refund-cancellation",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  // ... (categories and products sections remain the same)
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

  // 3. PRODUCT PAGES
  let productPages = [];
  try {
    const q = query(
        collection(db, "products"), 
        where("status", "==", "published"),
        orderBy("createdAt", "desc"),
        limit(1000)
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
  const collectionPages = Object.keys(keywordPages).map((slug) => ({
    url: `${baseUrl}/collections/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 6. BRAND PAGES
  const brandPages = Object.keys(brandsData).map((slug) => ({
    url: `${baseUrl}/brands/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...categories,
    ...productPages,
    ...blogPages,
    ...collectionPages,
    ...brandPages,
  ];
}
