"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import ImageGallery from "@/components/ImageGallery";
import EnquireButton from "@/components/EnquireButton";
import PriceBlock from "@/components/PriceBlock";
import StructuredDescription from "@/components/StructuredDescription";
import Link from "next/link";
import Image from "next/image";



/* ============================================================
   ALT TEXT GENERATOR (NEW)
============================================================ */
function generateAltText(p) {
  if (!p) return "Ethnicaa product image";

  const name = p.catalog || p.name || "Ethnic wear";
  const fabric = Array.isArray(p.fabrics)
    ? p.fabrics.join(", ")
    : p.fabric || "";

  const category = p.category || "";

  return `${name}${fabric ? " in " + fabric : ""}${
    category ? " | " + category : ""
  } | Ethnicaa Wholesale`;
}


/* ============================================================
   FETCH SIMILAR PRODUCTS
============================================================ */
async function fetchSimilarProducts(product, slug) {
  const q = query(
    collection(db, "products"),
    where("status", "==", "published"),
    orderBy("createdAt", "desc"),
    limit(80)
  );

  const snap = await getDocs(q);
  const all = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.slug !== slug);

  const byCategory = all.filter((p) =>
  p.category === product.category
);

  return byCategory.slice(0, 6);
}

/* ============================================================
   PRODUCT PAGE
============================================================ */
export default function ProductClient({ slug }) {
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);

  /* LOAD PRODUCT */
  useEffect(() => {
    async function load() {
      setLoading(true);

      const snap = await getDoc(doc(db, "products", slug));
      if (!snap.exists()) {
        setProduct("not-found");
        setLoading(false);
        return;
      }

      const data = snap.data();

      const normalized = {
        ...data,

        price: data.price ?? "",
        avgPrice: data.avg_price ?? "",
        fullPrice: data.full_price ?? "",
        fullPriceWithGST: data.full_price_with_gst ?? "",

        pcs: data.pcs ?? 0,
        fabrics: Array.isArray(data.fabrics)
          ? data.fabrics
          : data.fabric
          ? [data.fabric]
          : [],
        sizes: Array.isArray(data.sizes)
          ? data.sizes
          : data.size
          ? [data.size]
          : [],

        dispatch: data.dispatchTime ?? "",
      };

      setProduct(normalized);


      const sim = await fetchSimilarProducts(normalized, slug);
      setSimilar(sim);

      setLoading(false);
    }

    load();
  }, [slug]);

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (product === "not-found") return <p style={{ padding: 40 }}>Not found.</p>;

  /* FAQ */
  const faqs = [
    {
      q: `What is the fabric of ${product.name}?`,
      a: product.fabrics.join(", ") || "Fabric details provided above.",
    },
    {
      q: `What is the dispatch time for ${product.name}?`,
      a: product.dispatch || "Dispatch within 24–48 hours.",
    },
    {
      q: `Is ${product.name} available at wholesale rates?`,
      a: "Yes, all products on Ethnicaa are wholesale only.",
    },
    {
      q: `How can I place a wholesale order for ${product.name}?`,
      a: "Click on the WhatsApp button and share your order.",
    },
  ];

  /* SCHEMA */
  const schemaList = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.images || [],
      description: product.seo_description || product.description || "",
      sku: product.slug,
      brand: { "@type": "Brand", name: "Ethnicaa" },
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: product.price || product.avgPrice || "",
        availability: "https://schema.org/InStock",
        url: `https://ethnicaa.com/product/${product.slug}`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  
 

  /* ============================================================
      UI
============================================================ */
  return (
    <div style={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaList),
        }}
      />

      {/* BREADCRUMB */}
      <div style={styles.breadcrumbs}>
        <Link href="/">Home</Link> /{" "}
        {product.category && (
  <Link href={`/category/${encodeURIComponent(product.category)}`}>
    {product.category}
  </Link>
)}{" "}
        / {product.catalog || product.name}
      </div>

      {/* MAIN GRID */}
      <div style={styles.main}>
        <div style={styles.left}>
  {/* Image Gallery with SEO ALT TEXT */}
  <ImageGallery
    images={product.images}
    altText={generateAltText(product)}
  />
        </div>

        <div style={styles.right}>
          <h1 style={styles.title}>{product.catalog || product.name}</h1>

          <PriceBlock product={product} />

          {/* SHARE BUTTONS */}
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <button
              onClick={() =>
                navigator.share({
                  title: product.name,
                  url: window.location.href,
                })
              }
              style={styles.shareBtn}
            >
              Share
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link Copied!");
              }}
              style={styles.shareBtn}
            >
              Copy Link
            </button>
          </div>

          {/* META */}
          <div style={styles.meta}>
            <p><b>Category:</b> {product.category}</p>

            {product.fabrics.length > 0 && (
              <p>
                <b>Fabric:</b> {product.fabrics.join(", ")}
              </p>
            )}

            {product.sizes.length > 0 && (
              <p>
                <b>Sizes:</b> {product.sizes.join(", ")}
              </p>
            )}

            {product.dispatch && (
              <p>
                <b>Dispatch:</b> {product.dispatch}
              </p>
            )}

            {product.pcs > 0 && (
              <p>
                <b>Min Order:</b> {product.pcs} pcs
              </p>
            )}
          </div>

          {/* DOWNLOADS */}
          <div style={styles.downloads}>
            {product.catalogAssets?.zip && (
              <a
                href={product.catalogAssets.zip}
                target="_blank"
                style={styles.downloadBtn}
              >
                DOWNLOAD ZIP
              </a>
            )}

            {product.catalogAssets?.pdf && (
              <a
                href={product.catalogAssets.pdf}
                target="_blank"
                style={styles.downloadBtn}
              >
                DOWNLOAD PDF
              </a>
            )}
          </div>

          <EnquireButton product={product} />
        </div>
      </div>

      {/* STRUCTURED DESCRIPTION */}
      <StructuredDescription product={product} />

      {/* FAQ SECTION */}
      <div style={{ marginTop: 40 }}>
        <h3 style={styles.sectionTitle}>Frequently Asked Questions</h3>

        {faqs.map((f, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <p style={{ fontWeight: 600 }}>{f.q}</p>
            <p>{f.a}</p>
          </div>
        ))}
      </div>

      {/* SIMILAR PRODUCTS */}
      {similar.length > 0 && (
        <div>
          <h3 style={styles.sectionTitle}>Similar Products</h3>

          <div style={styles.similarGrid}>
            {similar.map((p) => (
              <Link
                key={p.slug}
                href={`/product/${p.slug}`}
                className="premium-card"
                style={styles.similarCard}
              >
                <Image
                  src={p.images?.[0]}
                  alt={generateAltText(p)}   
                  width={200}
                  height={250}
                  quality={100}
                  style={styles.similarImg}
                />
                <div style={styles.similarText}>
                  {p.catalog || p.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* WHATSAPP FLOAT */}
      <a
        href={`https://wa.me/9586346332?text=Hi, I am interested in ${encodeURIComponent(
          product.catalog || product.name
        )}`}
        target="_blank"
        className="pulsing-whatsapp"
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

  breadcrumbs: { fontSize: 14, marginBottom: 18 },

  main: {
  display: "grid",
  gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1.2fr 1fr",
  gap: 16,
},
  
  '@media (max-width: 768px)': {
  main: {
    display: "block",
  },
},

  left: {
    background: "#fff",
    padding: 10,
    borderRadius: 10,
  },

  right: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 6,
  },

  shareBtn: {
    padding: "10px 16px",
    background: "#000",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
  },

  meta: {
    marginTop: 14,
    lineHeight: 1.7,
    fontSize: 15,
  },

  downloads: {
    display: "flex",
    gap: 10,
    marginTop: 14,
  },

  downloadBtn: {
    background: "#000",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 8,
  },

  sectionTitle: {
    fontSize: 22,
    margin: "35px 0 15px",
    fontWeight: 700,
  },

  similarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 16,
  },

  similarCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.02)",
    textDecoration: "none",
    color: "#000",
  },

  similarImg: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 12,
  },

  similarText: {
    marginTop: 8,
    textAlign: "center",
    fontWeight: 600,
  },

  whatsapp: {
    position: "fixed",
    bottom: 20,
    right: 20,
    background: "#25D366",
    width: 54,
    height: 54,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 26,
    color: "#fff",
  },
};
