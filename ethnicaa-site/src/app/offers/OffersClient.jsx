"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductCard from "@/components/ProductCard";

export default function OffersClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const q = query(
          collection(db, "products"),
          where("status", "in", ["published", "active"]),
          where("offer", "==", true)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Sort in memory by createdAt descending
        list.sort((a, b) => {
          const t1 = a.createdAt?.seconds || a.timestamp || 0;
          const t2 = b.createdAt?.seconds || b.timestamp || 0;
          return t2 - t1;
        });
        setProducts(list);
      } catch (err) {
        console.error("Failed to fetch offers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.headerBox}>
        <h1 style={styles.title}>Exclusive Offers & Clearance Sale</h1>
        <p style={styles.subtitle}>
          Discover premium quality <strong>lot shot kurti</strong>, <strong>lot sot suit</strong>, <strong>lot shot salwar suit</strong>, and <strong>designer gowns in half rate</strong>. Grab these limited-time wholesale deals before stock runs out!
        </p>
      </div>

      {loading ? (
        <div style={styles.grid}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} style={styles.skeletonCard} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div style={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div style={styles.empty}>
          <h2>No Active Offers Right Now</h2>
          <p>Check back later for exciting discounts!</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "20px 12px",
    minHeight: "60vh",
  },
  headerBox: {
    textAlign: "center",
    background: "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)",
    color: "#fff",
    padding: "40px 20px",
    borderRadius: 16,
    marginBottom: 30,
    boxShadow: "0 10px 30px rgba(211, 47, 47, 0.2)",
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    margin: "0 0 10px 0",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    maxWidth: 800,
    margin: "0 auto",
    lineHeight: 1.6,
    opacity: 0.9,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 20,
  },
  skeletonCard: {
    background: "#eee",
    borderRadius: 12,
    height: 280,
  },
  empty: {
    textAlign: "center",
    padding: "50px 20px",
    background: "#f9f9f9",
    borderRadius: 16,
    color: "#666"
  },
};
