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
  updateDoc,
  increment,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import ImageGallery from "@/components/ImageGallery";
import EnquireButton from "@/components/EnquireButton";
import PriceBlock from "@/components/PriceBlock";
import StructuredDescription from "@/components/StructuredDescription";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";
import TrustBadges from "@/components/TrustBadges";
import { isValidImageUrl } from "@/utils/imageUtils";



/* ============================================================
   ALT TEXT GENERATOR (NEW)
============================================================ */
function generateAltText(p) {
  if (!p) return "Ethnicaa product image";

  const name = p.catalog || p.name || "Ethnic wear";
  const fabric = Array.isArray(p.fabricNames)
    ? p.fabricNames.join(", ")
    : p.fabric || "";

  const category = Array.isArray(p.categoryNames)
    ? p.categoryNames[0]
    : p.category || "";

  return `${name}${fabric ? " in " + fabric : ""}${
    category ? " | " + category : ""
  } | Ethnicaa Wholesale`;
}


/* ============================================================
   FETCH SIMILAR PRODUCTS
============================================================ */
async function fetchSimilarProducts(product, slug) {
  // Use first category for similarity
  const mainCat = Array.isArray(product.categories) ? product.categories[0] : "";
  if (!mainCat) return [];

  const q = query(
    collection(db, "products"),
    where("status", "==", "published"),
    where("categories", "array-contains", mainCat),
    limit(7)
  );

  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.slug !== slug)
    .slice(0, 6);
}

/* ============================================================
   PRODUCT PAGE
============================================================ */
export default function ProductClient({ slug, initialProduct, initialSimilar }) {
  const [product, setProduct] = useState(initialProduct || null);
  const [similar, setSimilar] = useState(initialSimilar || []);
  const [loading, setLoading] = useState(!initialProduct);
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);

  /* LOAD PRODUCT (only if not provided) */
  useEffect(() => {
    if (initialProduct && product && product.id === slug) return;

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
        id: slug,

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

      // INCREMENT VIEWS
      try {
        await updateDoc(doc(db, "products", slug), {
          views: increment(1)
        });
      } catch (err) {
        console.error("Failed to increment views:", err);
      }
    }

    load();
  }, [slug, initialProduct]);

  useEffect(() => {
    if (product && product !== "not-found") {
       import("@/lib/analytics").then((m) => m.trackProductView(product));
    }
  }, [product]);

  function generateAltText(p) {
    if (!p) return "Ethnicaa product image";
    const catalog = p.catalog || p.name || "Ethnic wear";
    const type = p.categoryNames?.[0] || "";
    const fabric = p.fabricNames?.[0] || "";
    return `${catalog} ${type} wholesale ${fabric} - Ethnicaa`.trim().replace(/\s+/g, ' ');
  }

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

  return (
    <div style={styles.container}>

      {/* BREADCRUMB */}
      <Breadcrumbs
        items={[
          {
            name: product.categoryNames?.[0] || product.category || "Catalog",
            url: `/category/${product.categories?.[0] || encodeURIComponent(product.category || "")}`,
          },
          { name: product.catalog || product.name, url: "" },
        ]}
      />

      {/* MAIN GRID */}
      <div style={{ ...styles.main, gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr" }}>
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
            <p><b>Category:</b> {product.categoryNames?.join(", ") || product.category}</p>

            {product.fabricNames?.length > 0 && (
              <p>
                <b>Fabric:</b> {product.fabricNames.join(", ")}
              </p>
            )}

            {product.fabricNames?.length === 0 && product.fabrics?.length > 0 && (
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

          {/* B2B DOWNLOADS SECTION */}
          <div style={styles.downloadSection}>
            <p style={styles.downloadTitle}>📥 RESELLER TOOLS</p>
            <div style={styles.downloads}>
              {product.catalogAssets?.zip && (
                <a
                  href={product.catalogAssets.zip}
                  target="_blank"
                  style={styles.downloadBtn}
                >
                  Download Images (ZIP)
                </a>
              )}

              {product.catalogAssets?.pdf && (
                <a
                  href={product.catalogAssets.pdf}
                  target="_blank"
                  style={styles.downloadBtnSecondary}
                >
                  Download PDF Catalog
                </a>
              )}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <p style={{ fontSize: 12, color: "#666", marginBottom: 8, fontWeight: 600 }}>READY TO ORDER? INQUIRE VIA WHATSAPP</p>
            <EnquireButton product={product} />
          </div>
        </div>
      </div>

      {/* STRUCTURED DESCRIPTION */}
      <StructuredDescription product={product} />

      <TrustBadges />

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
        <div style={{ marginTop: 60 }}>
          <h3 style={styles.sectionTitle}>You May Also Like</h3>
          <div style={styles.similarGrid}>
            {similar.map((p) => (
              <div key={p.id} className="premium-card" style={styles.similarCard}>
                <Link href={`/product/${p.slug || p.id}`} style={{ textDecoration: "none" }}>
                  <div style={styles.similarImg}>
                    {isValidImageUrl(p.images?.[0]) && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 150px"
                        style={{ objectFit: "cover", borderRadius: 12 }}
                      />
                    )}
                  </div>
                  <div style={styles.similarInfo}>
                    <div style={styles.similarCat}>
                      {p.fabric} {p.category}
                    </div>
                    <div style={styles.similarName}>{p.catalog || p.name}</div>
                    <div style={styles.similarPrice}>Wholesale Price</div>
                  </div>
                </Link>
              </div>
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
        aria-label="Chat on WhatsApp"
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
    gap: 16,
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
    marginTop: 8,
  },

  downloadSection: {
    marginTop: 24,
    padding: "16px 20px",
    background: "#fdf8e6",
    borderRadius: 14,
    border: "1px solid #D4AF3744",
  },

  downloadTitle: {
    fontSize: 11,
    fontWeight: 800,
    color: "#D4AF37",
    margin: "0 0 10px 0",
    letterSpacing: 1,
  },

  downloadBtn: {
    flex: 1,
    background: "#D4AF37",
    color: "#000",
    padding: "12px 10px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    textAlign: "center",
    textDecoration: "none",
  },

  downloadBtnSecondary: {
    flex: 1,
    background: "#000",
    color: "#fff",
    padding: "12px 10px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    textAlign: "center",
    textDecoration: "none",
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
    position: "relative", // CRITICAL FIX
    borderRadius: 12,
    overflow: "hidden"
  },

  similarInfo: {
    padding: "8px 4px",
  },

  similarCat: {
    fontSize: 11,
    textTransform: "uppercase",
    color: "#666",
    letterSpacing: 0.5,
  },

  similarName: {
    fontSize: 14,
    fontWeight: 600,
    marginTop: 4,
    color: "#000",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  similarPrice: {
    fontSize: 13,
    fontWeight: 700,
    marginTop: 6,
    color: "#D4AF37",
  },

};
