"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import Link from "next/link";
import EnquireButton from "@/components/EnquireButton";

/* ===================================================================
    SEO UPDATE FUNCTION
=================================================================== */
function updateSearchSEO(keyword, resultCount) {
  const cleanKeyword = keyword?.trim() || "";

  const title = cleanKeyword
    ? `Search: "${cleanKeyword}" — ${resultCount} Results | Ethnicaa Wholesale`
    : `Search Products | Ethnicaa Wholesale`;

  const desc = cleanKeyword
    ? `Found ${resultCount} matching products for "${cleanKeyword}". Explore ethnic wear wholesale suits, sarees, kurtis, gowns and more.`
    : `Search Ethnicaa Wholesale product catalog for suits, sarees, kurtis, gowns & more.`

  document.title = title;

  const set = (name, value) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = name;
      document.head.appendChild(tag);
    }
    tag.content = value;
  };

  /* 🛑 Search pages must be NOINDEX */
  set("robots", "noindex, follow");
  set("description", desc);
  set("keywords", `${cleanKeyword}, wholesale ethnic wear search`);

  const setOg = (p, c) => {
    let tag = document.querySelector(`meta[property="${p}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("property", p);
      document.head.appendChild(tag);
    }
    tag.content = c;
  };

  const url = typeof window !== "undefined" ? window.location.href : "";

  setOg("og:title", title);
  setOg("og:description", desc);
  setOg("og:url", url);
  setOg("og:image", "https://ethnicaa.com/logo.png");
  setOg("og:type", "website");

  /* Canonical (Search pages should NOT have parameters) */
  let canonical = document.querySelector(`link[rel="canonical"]`);
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = "https://ethnicaa.com/search";
}

/* ===================================================================
    NORMALIZATION HELPERS
=================================================================== */
const norm = (t) => (t || "").toLowerCase().trim();

const synonyms = {
  saree: ["saree", "sarees", "sari", "saris"],
  kurti: ["kurti", "kurtis", "kurtees", "kurtha"],
  lehanga: ["lehanga", "lehenga", "lengha", "lehngha"],
};

function normalizeKeyword(keyword) {
  keyword = norm(keyword);
  for (const root in synonyms) {
    if (synonyms[root].includes(keyword)) return root;
  }
  return keyword;
}

function fuzzyMatch(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;

  if (Math.abs(a.length - b.length) > 1) return false;

  let mis = 0, i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] !== b[j]) {
      mis++;
      if (mis > 1) return false;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else { i++; j++; }
    } else {
      i++; j++;
    }
  }
  return true;
}

/* ===================================================================
    MAIN SEARCH PAGE
=================================================================== */
export default function SearchPage({ searchParams }) {
  const keywordRaw = searchParams?.keyword || "";
  const keyword = normalizeKeyword(keywordRaw);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===================================================================
      LOAD PRODUCTS
  ==================================================================== */
  useEffect(() => {
    async function load() {
      setLoading(true);

      const snap = await getDocs(
        query(
          collection(db, "products"),
          where("status", "==", "published"),
          orderBy("createdAt", "desc")
        )
      );

      const results = [];

      snap.docs.forEach((docSnap) => {
        const p = { id: docSnap.id, ...docSnap.data() };

        const name = norm(p.name);
        const catalog = norm(p.catalog);
        const catList = (p.categories || []).map(norm);

        let score = 0;

        if (name.includes(keyword) || catalog.includes(keyword)) score += 120;
        if (name.startsWith(keyword) || catalog.startsWith(keyword)) score += 100;

        for (const root in synonyms) {
          if (root === keyword) {
            if (
              synonyms[root].some((s) => name.includes(s) || catalog.includes(s))
            ) {
              score += 80;
            }
          }
        }

        if (catList.includes(keyword)) score += 60;

        const words = name.split(" ");
        if (words.some((w) => fuzzyMatch(w, keyword))) score += 40;

        if (score > 0) results.push({ ...p, _score: score });
      });

      results.sort((a, b) => b._score - a._score);

      setProducts(results);
      setLoading(false);

      /* APPLY SEO */
      updateSearchSEO(keywordRaw, results.length);
    }

    load();
  }, [keywordRaw]);

  /* ===================================================================
      SEARCH PAGE SCHEMAS
  ==================================================================== */

  const schemaList = [];

  // Simple breadcrumb (Google supports for search pages)
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
        name: "Search",
        item: "https://ethnicaa.com/search",
      },
    ],
  });

  // Website schema with search action
  schemaList.push({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ethnicaa Wholesale",
    url: "https://ethnicaa.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ethnicaa.com/search?keyword={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  });

  // Organization schema
  schemaList.push({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ethnicaa Wholesale",
    url: "https://ethnicaa.com",
    logo: "https://ethnicaa.com/logo.png",
  });

  /* ===================================================================
      UI
  ==================================================================== */

  return (
    <div style={styles.container}>

      {/* ALL SCHEMAS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaList) }}
      />

      <h1 style={styles.heading}>
        Search: <span style={{ color: "#555" }}>{keywordRaw}</span>
      </h1>

      {!loading && products.length === 0 && (
        <p style={styles.noProducts}>No results found.</p>
      )}

      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p.id} style={styles.card}>
            <Link href={`/product/${p.slug}`}>
              {p.images?.[0] && (
                <img
                  src={p.images[0]}
                  alt={p.name}
                  style={styles.cardImg}
                />
              )}
            </Link>

            <div style={styles.cardText}>{p.catalog || p.name}</div>
            <div style={styles.price}>₹ {p.price || p.avg_price || "N/A"} / pc</div>

            <EnquireButton product={p} />
          </div>
        ))}
      </div>

      <a
        href="https://wa.me/9586346332"
        target="_blank"
        style={styles.whatsappFloat}
      >
        💬
      </a>
    </div>
  );
}

/* ===================================================================
    STYLES
=================================================================== */
const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: 12 },
  heading: { fontSize: 26, fontWeight: 700, marginBottom: 15 },
  noProducts: { textAlign: "center", margin: "20px 0", opacity: 0.7 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 14,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  cardImg: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 10,
  },
  cardText: { marginTop: 8, fontWeight: 600, textAlign: "center" },
  price: { marginTop: 5, textAlign: "center", fontWeight: 700 },
  whatsappFloat: {
    position: "fixed",
    bottom: 25,
    right: 25,
    background: "#25D366",
    width: 60,
    height: 60,
    borderRadius: "50%",
    fontSize: 32,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
};
