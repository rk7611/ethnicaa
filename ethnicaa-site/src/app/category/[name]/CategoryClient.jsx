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
import EnquireButton from "@/components/EnquireButton";


const PAGE_SIZE = 50;

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

/* ============================================================
   ALT TEXT GENERATOR (FIXED)
============================================================ */
function generateAltText(p) {
  if (!p) return "Ethnicaa product image";

  const title = p.catalog || p.name || "Ethnic wear";
  const fabric =
    Array.isArray(p.fabrics) && p.fabrics.length > 0
      ? p.fabrics.join(", ")
      : "";
  
  // FIXED: Use category string instead of categories array
  const cat = p.category || "";

  return `${title}${
    fabric ? " in " + fabric : ""
  }${cat ? " | " + cat : ""} | Ethnicaa Wholesale`.trim();
}

/* ============================================================
   APPLY SEO
============================================================ */
function applyCategorySEO(category, count) {
  if (!category) return;

  const title =
    category.category_seo_title ||
    `${category.name} Wholesale — ${count}+ Latest Catalogs | Ethnicaa`;

  const desc =
    category.category_seo_description ||
    `Buy ${count}+ latest ${category.name} wholesale catalogs at best price. Daily new arrivals.`;

  document.title = title;

  const setMeta = (name, content) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = name;
      document.head.appendChild(tag);
    }
    tag.content = content;
  };

  setMeta("description", desc);
  setMeta(
    "keywords",
    category.category_seo_keywords ||
      `${category.name}, wholesale ${category.slug}, ${category.name} catalog`
  );

  const setOG = (property, content) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("property", property);
      document.head.appendChild(tag);
    }
    tag.content = content;
  };

  setOG("og:title", title);
  setOG("og:description", desc);
  setOG("og:type", "website");
  setOG("og:url", window.location.href);

  let canonical = document.querySelector(`link[rel="canonical"]`);
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = window.location.href;
}

/* ============================================================
   CATEGORY PAGE
============================================================ */
export default function CategoryClient({ name, searchParams }){
  const categorySlug = decodeURIComponent(name);
  const sort = searchParams?.sort || "latest";

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [allCategories, setAllCategories] = useState([]);

  /* LOAD CATEGORY DETAILS */
  useEffect(() => {
    async function loadCategory() {
      const ref = doc(db, "categories", categorySlug);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCategory({ slug: categorySlug, ...snap.data() });
      } else {
        setCategory({
          slug: categorySlug,
          name: categorySlug.replace(/-/g, " "),
        });
      }
    }

    loadCategory();
  }, [categorySlug]);

  /* LOAD ALL CATEGORIES (for internal linking) */
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

  
  /* LOAD PRODUCTS - CASE INSENSITIVE VERSION */
useEffect(() => {
  async function loadProducts() {
    setLoading(true);

    try {
      // Get products with matching category (case-insensitive)
      // We query all and filter in JS to handle case mismatches
      const q = query(
        collection(db, "products"),
        where("status", "==", "published"),
        limit(PAGE_SIZE * 5)
      );

      const snap = await getDocs(q);
      
      let list = snap.docs
        .map((d) => ({
          id: d.id,
          slug: d.data().slug,
          ...d.data(),
        }))
        // Filter by category with case-insensitive matching
        .filter((p) => {
  let prodCategory = "";

  if (typeof p.category === "string") {
    prodCategory = p.category.toLowerCase();
  }

  const searchSlug = categorySlug.toLowerCase();

  return prodCategory.includes(searchSlug);
});

      // Apply sorting
      if (sort === "low-high") {
        list.sort((a, b) => getNumericPrice(a) - getNumericPrice(b));
      } else if (sort === "high-low") {
        list.sort((a, b) => getNumericPrice(b) - getNumericPrice(a));
      } else if (sort === "oldest") {
        list.sort((a, b) => {
          const dateA = a.createdAt?.seconds || a.createdAt?._seconds || 0;
          const dateB = b.createdAt?.seconds || b.createdAt?._seconds || 0;
          return dateA - dateB;
        });
      } else {
        // Latest first
        list.sort((a, b) => {
          const dateA = a.createdAt?.seconds || a.createdAt?._seconds || 0;
          const dateB = b.createdAt?.seconds || b.createdAt?._seconds || 0;
          return dateB - dateA;
        });
      }

      setProducts(list.slice(0, PAGE_SIZE));
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    }

    setLoading(false);
  }

  loadProducts();
}, [sort, categorySlug]);

  /* APPLY SEO */
  useEffect(() => {
    if (category && products.length > 0) {
      applyCategorySEO(category, products.length);
    }
  }, [category, products]);

  /* ============================================================
      SCHEMAS
  ============================================================= */
  const schemaList = [];

  if (category) {
    schemaList.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://ethnicaa.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: category.name,
          item: typeof window !== "undefined" ? window.location.href : "",
        },
      ],
    });
  }

  if (Array.isArray(category?.category_faqs)) {
    schemaList.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: category.category_faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  if (products.length > 0) {
    schemaList.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://ethnicaa.com/product/${p.slug}`,
      })),
    });
  }

  schemaList.push({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ethnicaa Wholesale",
    url: "https://ethnicaa.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ethnicaa.com/search?keyword={search}",
      "query-input": "required name=search",
    },
  });

  /* ============================================================
      UI
  ============================================================= */
  return (
    <div style={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaList) }}
      />

      <h1 style={styles.pageTitle}>
        {category?.name || categorySlug.replace(/-/g, " ")}
      </h1>

      {/* SORT */}
      <select
        value={sort}
        style={styles.sort}
        onChange={(e) =>
          (window.location.href = `/category/${categorySlug}?sort=${e.target.value}`)
        }
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="low-high">Price — Low to High</option>
        <option value="high-low">Price — High to Low</option>
      </select>

      {/* PRODUCTS */}
      <div style={styles.grid}>
        {!loading &&
          products.map((p) => (
            <div key={p.id} style={styles.card}>
              <Link href={`/product/${p.slug}`}>
                {p.images?.[0] && (
                  <img
                    src={p.images[0]}
                    alt={generateAltText(p)}
                    style={styles.cardImg}
                  />
                )}
              </Link>

              <div style={styles.cardText}>
                {p.catalog || p.name}
              </div>

              <div style={styles.price}>
                ₹ {getNumericPrice(p)}
              </div>

              <EnquireButton product={p} />
            </div>
          ))}

        {loading && <p>Loading...</p>}
      </div>

      {/* SEO CONTENT */}
      {category?.category_seo_content && (
        <div style={styles.seoBox}>
          <div
            dangerouslySetInnerHTML={{
              __html: category.category_seo_content,
            }}
          />
        </div>
      )}

      {/* FAQ */}
      {Array.isArray(category?.category_faqs) &&
        category.category_faqs.length > 0 && (
          <div style={styles.faqBox}>
            <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
            <ul style={styles.faqList}>
              {category.category_faqs.map((f, i) => (
                <li key={i} style={styles.faqItem}>
                  <strong>{f.q}</strong>
                  <br />
                  <span style={{ opacity: 0.85 }}>{f.a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
		
		
		      {/* CATEGORY INTERNAL SEO LINKS */}
      {category && (
        <div style={styles.internalLinksBox}>
          <h2 style={styles.internalLinksTitle}>
            Explore More in {category.name}
          </h2>

          <ul style={styles.internalLinksList}>
            <li>
              <Link href={`/category/${categorySlug}`} style={styles.internalLink}>
                {category.name} Wholesale Collection
              </Link>
            </li>

            {allCategories
              .filter((c) => c.slug !== categorySlug)
              .filter((c) => {
                const a = c.name.toLowerCase();
                const b = category.name.toLowerCase();
                return (
                  (a.includes("suit") && b.includes("suit")) ||
                  (a.includes("saree") && b.includes("saree")) ||
                  (a.includes("kurti") && b.includes("kurti")) ||
                  (a.includes("gown") && b.includes("gown")) ||
                  (a.includes("lehenga") && b.includes("lehenga"))
                );
              })
              .slice(0, 5)
              .map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} style={styles.internalLink}>
                    {c.name} Wholesale
                  </Link>
                </li>
              ))}

            <li><Link href="/" style={styles.internalLink}>Latest Wholesale New Arrivals</Link></li>
            <li><Link href="/category/sarees" style={styles.internalLink}>Wholesale Sarees</Link></li>
            <li><Link href="/category/salwar-suits" style={styles.internalLink}>Wholesale Salwar Suits</Link></li>
            <li><Link href="/category/pakistani-suits" style={styles.internalLink}>Pakistani Suits Wholesale</Link></li>
            <li><Link href="/category/gowns" style={styles.internalLink}>Wholesale Gowns</Link></li>
            <li><Link href="/category/lehenga" style={styles.internalLink}>Lehenga Choli Wholesale</Link></li>
            <li><Link href="/category/kurti" style={styles.internalLink}>Wholesale Kurtis</Link></li>
          </ul>
        </div>
      )}
		

      {/* RELATED CATEGORIES */}
      {allCategories.length > 0 && (
        <div style={styles.relatedBox}>
          <h2 style={styles.relatedTitle}>Related Categories</h2>
          <ul style={styles.relatedList}>
            {allCategories
              .filter((c) => c.slug !== categorySlug)
              .map((c) => (
                <li key={c.slug} style={styles.relatedItem}>
                  <Link href={`/category/${c.slug}`} style={styles.relatedLink}>
                    {c.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* WHATSAPP */}
      <a
        href="https://wa.me/9586346332"
        target="_blank"
        style={styles.whatsapp}
      >
        💬
      </a>
    </div>
  );
}

/* ============================================================
      STYLES
============================================================ */
const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: 12 },

  pageTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 15,
    textTransform: "capitalize",
  },

  sort: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 16,
  },

  card: {
    background: "#fff",
    padding: 12,
    borderRadius: 14,
    boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
  },

  cardImg: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 10,
  },

  cardText: {
    marginTop: 8,
    fontWeight: 600,
    textAlign: "center",
    fontSize: 14,
    minHeight: 34,
  },

  price: {
    marginTop: 5,
    fontWeight: 700,
    textAlign: "center",
  },

  seoBox: {
    marginTop: 35,
    padding: 20,
    background: "#fafafa",
    borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    lineHeight: 1.7,
  },

  faqBox: {
    marginTop: 35,
    padding: 20,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
  },

  faqTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
  },

  faqList: {
    paddingLeft: 18,
    lineHeight: 1.65,
  },

  faqItem: {
    marginBottom: 10,
    fontSize: 15,
  },

  relatedBox: {
    marginTop: 40,
    padding: 20,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },

  relatedTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
  },

  relatedList: {
    paddingLeft: 18,
    lineHeight: 1.7,
  },

  relatedItem: {
    marginBottom: 8,
    fontSize: 15,
  },
  internalLinksBox: {
    marginTop: 40,
    padding: 20,
    background: "#fafafa",
    borderRadius: 10,
    border: "1px solid #eee",
  },

  internalLinksTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
  },

  internalLinksList: {
    paddingLeft: 18,
    lineHeight: 1.8,
  },

  internalLink: {
    textDecoration: "none",
    color: "#0066cc",
    fontWeight: 600,
  },

  relatedLink: {
    textDecoration: "none",
    color: "#000",
    fontWeight: 600,
  },

  whatsapp: {
    position: "fixed",
    bottom: 25,
    right: 25,
    background: "#25D366",
    width: 60,
    height: 60,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 32,
    textDecoration: "none",
    color: "#fff",
  },
};

