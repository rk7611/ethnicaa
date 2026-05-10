import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import ProductCard from "@/components/ProductCard";

async function getStoreProducts() {
  // For now, we show all published products from the main Ethnicaa inventory
  // In the future, we can filter by 'store.products' array
  const q = query(
    collection(db, "products"),
    where("status", "in", ["published", "active"]),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export default async function StorefrontHome({ params }) {
  const products = await getStoreProducts();

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
         <h1 style={styles.heroTitle}>New Arrivals for You</h1>
         <p style={styles.heroSub}>Explore our latest collection of premium ethnic wear sourced directly from Surat.</p>
      </section>

      <div style={styles.productGrid}>
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={{
              ...product,
              slug: product.slug || product.id
            }} 
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: "40px 20px" },
  hero: { textAlign: "center", padding: "80px 0", background: "#fdf8e6", borderRadius: 40, marginBottom: 60 },
  heroTitle: { fontSize: 36, fontWeight: 800, marginBottom: 15 },
  heroSub: { fontSize: 18, color: "#666", maxWidth: 600, margin: "0 auto" },
  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 30 }
};
