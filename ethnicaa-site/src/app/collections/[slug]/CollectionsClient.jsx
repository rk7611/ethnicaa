"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { parseCollectionSlug, CITY_CONTENT } from "@/lib/seo-utils";

import Link from "next/link";
import Image from "next/image";
import EnquireButton from "@/components/EnquireButton";
import Breadcrumbs from "@/components/Breadcrumbs";

const PAGE_SIZE = 40;

export default function CollectionsClient({ slug, initialProducts, lang = "en" }) {
  const components = parseCollectionSlug(slug, lang);
  const { fabric, category, city } = components;

  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);

  const cityData = city ? CITY_CONTENT[city] : null;

  useEffect(() => {
    // ... existing loadProducts logic (if needed for client-side navigation)
  }, [slug, initialProducts]);

  // Schema for FAQ
  const faqSchema = cityData?.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": cityData.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  } : null;

  return (
    <div style={styles.container}>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Breadcrumbs 
        items={[
          { name: "Collections", url: "/" },
          { name: components.label, url: "" }
        ]} 
      />

      <h1 style={styles.pageTitle}>
        {lang !== "en" && VERNACULAR_MAP[lang]
          ? VERNACULAR_MAP[lang].title.replace("{category}", VERNACULAR_MAP[lang][category?.toLowerCase()] || category)
          : category && city 
          ? `Wholesale ${category} in ${city} — Direct from Surat Manufacturers` 
          : fabric && category 
          ? `Wholesale ${fabric} ${category} Collection`
          : components.label}
      </h1>

      {cityData && (
        <div style={styles.introBox}>
          <p style={styles.introText}>{cityData.intro}</p>
        </div>
      )}

      {/* Grid */}
      <div style={styles.grid}>
        {!loading && products.map((p) => (
          <div key={p.id} className="premium-card" style={styles.card}>
            <Link href={`/product/${p.slug}`}>
              <div style={styles.imgWrapper}>
                <Image
                  src={p.images?.[0] || "https://ethnicaa.com/logo.png"}
                  alt={`${p.catalog || p.name} wholesale ${category || ""} ${city ? "for " + city : ""} - Ethnicaa`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 220px"
                  style={styles.cardImg}
                  loading="lazy"
                />
              </div>
            </Link>
            <div style={styles.cardText}>{p.catalog || p.name}</div>
            <div style={styles.price}>₹ {p.price || p.avg_price}</div>
            <EnquireButton product={p} />
          </div>
        ))}

        {loading && <p>Loading specialized collection...</p>}
        {!loading && products.length === 0 && (
          <div style={styles.noResults}>
            <p>We are currently updating our {fabric} {category} collection.</p>
            <Link href="/" style={styles.homeLink}>View All New Arrivals</Link>
          </div>
        )}
      </div>

      {/* CTA SECTION */}
      <div style={styles.ctaBox}>
        <h2 style={styles.ctaTitle}>Start Your Wholesale Business Today</h2>
        <p style={styles.ctaText}>
          Join 10,000+ resellers across India sourcing direct from Surat factory. 
          Get daily updates and premium support.
        </p>
        <a 
          href={`https://wa.me/9586346332?text=Hi, I want to order wholesale ${category || "garments"} for delivery to ${city || "my city"}`}
          target="_blank"
          style={styles.whatsappBtn}
        >
          Order via WhatsApp
        </a>
      </div>

      {/* FAQ SECTION */}
      {cityData?.faqs && (
        <div style={styles.faqSection}>
          <h2 style={styles.faqSectionTitle}>Frequently Asked Questions</h2>
          <div style={styles.faqList}>
            {cityData.faqs.map((f, i) => (
              <div key={i} style={styles.faqItem}>
                <h3 style={styles.faqQ}>{f.q}</h3>
                <p style={styles.faqA}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content Block (Fallback/General) */}
      {!cityData && (
        <div style={styles.seoBox}>
          <h2>Wholesale {category || "Ethnic Wear"} Sourcing</h2>
          <p>
            At Ethnicaa, we specialize in providing {fabric || "premium fabric"} {category || "garments"} directly from 
            Surat&apos;s manufacturers. Our collection is specially curated to meet the demands 
            of local boutiques and online resellers.
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: 12 },
  pageTitle: { 
    fontSize: 32, 
    fontWeight: 800, 
    marginBottom: 20, 
    color: "#111",
    textAlign: "center",
    marginTop: 20
  },
  introBox: {
    maxWidth: 900,
    margin: "0 auto 40px auto",
    textAlign: "center",
    lineHeight: 1.8,
    fontSize: 17,
    color: "#444"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 20,
    marginBottom: 50,
  },
  card: { background: "#fff", padding: 12, borderRadius: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" },
  imgWrapper: { position: "relative", width: "100%", aspectRatio: "4/5", borderRadius: 12, overflow: "hidden", marginBottom: 10 },
  cardImg: { objectFit: "cover" },
  cardText: { fontWeight: 600, fontSize: 15, textAlign: "center", marginBottom: 5 },
  price: { fontWeight: 700, textAlign: "center", marginBottom: 10 },
  noResults: { gridColumn: "1 / -1", textAlign: "center", padding: "60px 0" },
  homeLink: { display: "inline-block", marginTop: 20, background: "#000", color: "#fff", padding: "12px 24px", borderRadius: 12, textDecoration: "none" },
  
  ctaBox: {
    margin: "60px auto",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    borderRadius: 24,
    textAlign: "center",
    maxWidth: 1000
  },
  ctaTitle: { fontSize: 24, fontWeight: 700, marginBottom: 12 },
  ctaText: { fontSize: 16, color: "#555", marginBottom: 25 },
  whatsappBtn: {
    display: "inline-block",
    background: "#25D366",
    color: "#fff",
    padding: "16px 32px",
    borderRadius: 50,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 18,
    boxShadow: "0 10px 20px rgba(37, 211, 102, 0.2)"
  },

  faqSection: { marginTop: 60, padding: "0 20px" },
  faqSectionTitle: { fontSize: 26, fontWeight: 700, marginBottom: 30, textAlign: "center" },
  faqList: { maxWidth: 800, margin: "0 auto" },
  faqItem: { marginBottom: 30, borderBottom: "1px solid #eee", paddingBottom: 20 },
  faqQ: { fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#111" },
  faqA: { fontSize: 16, color: "#555", lineHeight: 1.6 },

  seoBox: { marginTop: 60, padding: 30, background: "#f9f9f9", borderRadius: 20, lineHeight: 1.8 },
};
