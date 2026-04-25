"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import Link from "next/link";
import Image from "next/image";
import EnquireButton from "@/components/EnquireButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import { isValidImageUrl, generateProductAlt } from "@/utils/imageUtils";

/* ============================================================
   PRICE HELPER
============================================================ */
function getNumericPrice(p) {
  if (typeof p.price === "number") return p.price;

  if (typeof p.avg_price === "string") {
    const n = Number(p.avg_price.replace(/[^0-9.]/g, ""));
    return isNaN(n) ? 0 : n;
  }

  if (typeof p.avg_price === "number") return p.avg_price;

  return 0;
}

export default function CategoryClient({ name, searchParams, initialCategory, initialProducts, currentPage, totalPages }){
  const categorySlug = decodeURIComponent(name);
  const sort = searchParams?.sort || "latest";

  const [category, setCategory] = useState(initialCategory || null);
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  // Sync products state when server sends new data (pagination fix)
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, categorySlug]);

  /* LOAD CATEGORY DETAILS (if not provided) */
  useEffect(() => {
    if (initialCategory && initialCategory.slug === categorySlug) return;
    async function loadCategory() {
      const ref = doc(db, "categories", categorySlug);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCategory({ slug: categorySlug, ...snap.data() });
      } else {
        setCategory({ slug: categorySlug, name: categorySlug.replace(/-/g, " ") });
      }
    }
    loadCategory();
  }, [categorySlug, initialCategory]);

  /* LOAD ALL CATEGORIES */
  useEffect(() => {
    async function loadAllCategories() {
      const snap = await getDocs(collection(db, "categories"));
      const list = snap.docs.map((d) => ({
        slug: d.id,
        name: d.data().name || d.id.replace(/-/g, " "),
      }));
      setAllCategories(list);
    }
    loadAllCategories();
  }, []);

  return (
    <div style={styles.container}>
      <Breadcrumbs 
        items={[{ name: category?.name || categorySlug.replace(/-/g, " "), url: "" }]} 
      />

      <h1 style={styles.pageTitle}>
        {category?.name || categorySlug.replace(/-/g, " ")} Wholesale Catalog 2026 — Factory Price Surat
      </h1>

      <select
        value={sort}
        style={styles.sort}
        onChange={(e) => (window.location.href = `/category/${categorySlug}?sort=${e.target.value}`)}
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="low-high">Price — Low to High</option>
        <option value="high-low">Price — High to Low</option>
      </select>

      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p.id} className="premium-card" style={styles.card}>
            <Link href={`/product/${p.slug}`}>
              {isValidImageUrl(p.images?.[0]) && (
                <Image
                  src={p.images[0]}
                  alt={generateProductAlt(p)}
                  width={300}
                  height={380}
                  quality={100}
                  style={styles.cardImg}
                  loading="lazy"
                />
              )}
            </Link>
            <div style={styles.cardText}>{p.catalog || p.name}</div>
            <div style={styles.price}>₹ {getNumericPrice(p)}</div>
            <EnquireButton product={p} />
          </div>
        ))}
      </div>

      <Pagination 
        totalPages={totalPages} 
        currentPage={currentPage} 
        basePath={`/category/${categorySlug}`}
        searchParams={searchParams}
      />

      {category?.category_seo_content && (
        <div style={styles.seoBox}>
          <div dangerouslySetInnerHTML={{ __html: category.category_seo_content }} />
        </div>
      )}

      {Array.isArray(category?.category_faqs) && category.category_faqs.length > 0 && (
        <div style={styles.faqBox}>
          <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
          <ul style={styles.faqList}>
            {category.category_faqs.map((f, i) => (
              <li key={i} style={styles.faqItem}>
                <strong>{f.q}</strong><br />
                <span style={{ opacity: 0.85 }}>{f.a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {allCategories.length > 0 && (
        <div style={styles.relatedBox}>
          <h2 style={styles.relatedTitle}>Related Categories</h2>
          <ul style={styles.relatedList}>
            {allCategories
              .filter(c => c.slug !== categorySlug)
              .map(c => (
                <li key={c.slug} style={styles.relatedItem}>
                  <Link href={`/category/${c.slug}`} style={styles.relatedLink}>{c.name}</Link>
                </li>
              ))}
          </ul>
        </div>
      )}

      <a href="https://wa.me/9586346332" target="_blank" rel="noopener noreferrer" className="pulsing-whatsapp" aria-label="Chat on WhatsApp">💬</a>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: 12 },
  pageTitle: { fontSize: 26, fontWeight: 700, marginBottom: 15, textTransform: "capitalize" },
  sort: { padding: 10, borderRadius: 8, border: "1px solid #ccc", marginBottom: 20 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 },
  card: { background: "#fff", padding: 12, borderRadius: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.02)" },
  cardImg: { width: "100%", height: 200, objectFit: "cover", borderRadius: 10 },
  cardText: { marginTop: 8, fontWeight: 600, textAlign: "center", fontSize: 14, minHeight: 34 },
  price: { marginTop: 5, fontWeight: 700, textAlign: "center" },
  seoBox: { marginTop: 35, padding: 20, background: "#fafafa", borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.1)", lineHeight: 1.7 },
  faqBox: { marginTop: 35, padding: 20, background: "#fff", borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.12)" },
  faqTitle: { fontSize: 22, fontWeight: 700, marginBottom: 12 },
  faqList: { paddingLeft: 18, lineHeight: 1.65 },
  faqItem: { marginBottom: 10, fontSize: 15 },
  relatedBox: { marginTop: 40, padding: 20, background: "#fff", borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
  relatedTitle: { fontSize: 22, fontWeight: 700, marginBottom: 12 },
  relatedList: { paddingLeft: 18, lineHeight: 1.7 },
  relatedItem: { marginBottom: 8, fontSize: 15 },
  relatedLink: { textDecoration: "none", color: "#000", fontWeight: 600 },
  loadMoreBtn: { padding: "12px 30px", borderRadius: 12, background: "#000", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" },
};
