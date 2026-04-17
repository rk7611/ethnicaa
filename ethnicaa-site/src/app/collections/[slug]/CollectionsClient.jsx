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
import { parseCollectionSlug } from "@/lib/seo-utils";

import Link from "next/link";
import Image from "next/image";
import EnquireButton from "@/components/EnquireButton";
import Breadcrumbs from "@/components/Breadcrumbs";

const PAGE_SIZE = 40;

export default function CollectionsClient({ slug }) {
  const components = parseCollectionSlug(slug);
  const { fabric, category, city } = components;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);

      try {
        // Step 1: Query by Category (primary filter)
        let q = query(
          collection(db, "products"),
          where("status", "==", "published"),
          orderBy("createdAt", "desc"),
          limit(300) // Fetch a decent chunk to filter by fabric in JS
        );

        const snap = await getDocs(q);
        let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Step 2: Filter by Category in JS (handles case-insensitive and partial matches)
        if (category) {
          const catLower = category.toLowerCase();
          list = list.filter(p => {
             const prodCat = (p.category || "").toLowerCase();
             return prodCat.includes(catLower) || catLower.includes(prodCat);
          });
        }

        // Step 3: Filter by Fabric in JS
        if (fabric) {
          const fabLower = fabric.toLowerCase();
          list = list.filter(p => {
            const prodFabrics = (p.fabrics || []).map(f => f.toLowerCase());
            const prodFabricStr = (p.fabric || "").toLowerCase();
            return prodFabrics.includes(fabLower) || prodFabricStr.includes(fabLower);
          });
        }

        setProducts(list.slice(0, PAGE_SIZE));
      } catch (error) {
        console.error("Error loading collection products:", error);
      }

      setLoading(false);
    }

    loadProducts();
  }, [slug]);

  return (
    <div style={styles.container}>
      <Breadcrumbs 
        items={[
          { name: "Collections", url: "/" },
          { name: components.label, url: "" }
        ]} 
      />

      <h1 style={styles.pageTitle}>
        {fabric && category && city 
          ? `Wholesale ${fabric} ${category} in ${city}` 
          : fabric && category 
          ? `Wholesale ${fabric} ${category} Collection`
          : components.label}
      </h1>

      <p style={styles.subtext}>
        Explore our bulk catalog of {fabric || ""} {category || "ethnic wear"} at direct factory prices from Surat. 
        {city ? ` Specialized shipping and service available for buyers in ${city}.` : ""}
      </p>

      {/* Grid */}
      <div style={styles.grid}>
        {!loading && products.map((p) => (
          <div key={p.id} className="premium-card" style={styles.card}>
            <Link href={`/product/${p.slug}`}>
              <div style={styles.imgWrapper}>
                <Image
                  src={p.images?.[0] || "https://ethnicaa.com/logo.png"}
                  alt={p.catalog || p.name}
                  fill
                  style={styles.cardImg}
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

      {/* SEO Content Block */}
      <div style={styles.seoBox}>
        <h2>Wholesale {category || "Ethnic Wear"} Sourcing for {city || "Retailers"}</h2>
        <p>
          At Ethnicaa, we specialize in providing {fabric || "premium fabric"} {category || "garments"} directly from 
          Surat's manufacturers. Our collection in {city || "the region"} is specially curated to meet the demands 
          of local boutiques and online resellers.
        </p>
        <p>
          Each catalog features the latest 2026 designs, high-quality embroidery, and durable fabrics. 
          By cutting out the middlemen, we ensure you get the best wholesale margins for your business.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: 12 },
  pageTitle: { fontSize: 28, fontWeight: 700, marginBottom: 10, color: "#111" },
  subtext: { fontSize: 16, color: "#666", marginBottom: 30, lineHeight: 1.6, maxWidth: 800 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 20,
  },
  card: { background: "#fff", padding: 12, borderRadius: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" },
  imgWrapper: { position: "relative", width: "100%", aspectRatio: "4/5", borderRadius: 12, overflow: "hidden", marginBottom: 10 },
  cardImg: { objectFit: "cover" },
  cardText: { fontWeight: 600, fontSize: 15, textAlign: "center", marginBottom: 5 },
  price: { fontWeight: 700, textAlign: "center", marginBottom: 10 },
  noResults: { gridColumn: "1 / -1", textAlign: "center", padding: "60px 0" },
  homeLink: { display: "inline-block", marginTop: 20, background: "#000", color: "#fff", padding: "12px 24px", borderRadius: 12, textDecoration: "none" },
  seoBox: { marginTop: 60, padding: 30, background: "#f9f9f9", borderRadius: 20, lineHeight: 1.8 },
};
