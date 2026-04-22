import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { blogs } from "@/lib/blog-data";

export const revalidate = 3600; // Update sitemap every hour

export default async function sitemap() {
  const BASE_URL = "https://ethnicaa.com";

  // 1. Static Pages
  const staticPages = [
    "",
    "/about-us",
    "/contact-us",
    "/faq",
    "/how-to-order",
    "/privacy-policy",
    "/refund-cancellation",
    "/shipping-policy",
    "/terms-conditions",
    "/blog",
    "/wholesale-manufacturers-in-surat",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1 : 0.5,
  }));

  // 2. Categories from Firestore
  let categories = [];
  try {
    const catSnap = await getDocs(collection(db, "categories"));
    categories = catSnap.docs.map((doc) => ({
      url: `${BASE_URL}/category/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
  }

  // 3. Products from Firestore (Limit to published ones)
  let products = [];
  try {
    const prodSnap = await getDocs(
      query(collection(db, "products"), where("status", "==", "published"))
    );
    products = prodSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        url: `${BASE_URL}/product/${data.slug || doc.id}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      };
    });
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // 4. Blog Posts from blog-data.js
  const blogPosts = blogs.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...categories, ...products, ...blogPosts];
}
