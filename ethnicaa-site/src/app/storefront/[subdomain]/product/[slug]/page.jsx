import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getStoreBySubdomain } from "@/lib/store-utils";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import StructuredDescription from "@/components/StructuredDescription";

async function getProduct(slug) {
  const snap = await getDoc(doc(db, "products", slug));
  if (snap.exists()) return { id: snap.id, ...snap.data() };
  return null;
}

export default async function StorefrontProductPage({ params }) {
  const { subdomain, slug } = params;
  const [product, store] = await Promise.all([
    getProduct(slug),
    getStoreBySubdomain(subdomain)
  ]);

  if (!product || !store) return notFound();

  const waLink = `https://wa.me/${store.whatsappNumber}?text=Hi ${store.businessName}, I am interested in ${product.name} (ID: ${product.id}). Is it available?`;

  return (
    <div style={styles.container}>
      <div style={styles.layout}>
        <div style={styles.left}>
          <ImageGallery images={product.images || []} />
        </div>
        <div style={styles.right}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.category}>{product.categories?.[0]}</p>
          
          <div style={styles.priceBox}>
             <span style={styles.price}>₹{product.price || "Contact for Price"}</span>
          </div>

          <a href={waLink} style={styles.waBtn}>Enquire on WhatsApp</a>

          <div style={styles.desc}>
             <StructuredDescription product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: "40px 20px" },
  layout: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 60 },
  title: { fontSize: 32, fontWeight: 800, marginBottom: 10 },
  category: { color: "#666", fontSize: 14, textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 },
  priceBox: { marginBottom: 30 },
  price: { fontSize: 28, fontWeight: 700, color: "#d32f2f" },
  waBtn: { display: "block", background: "#25D366", color: "#fff", padding: "20px", borderRadius: 15, textAlign: "center", textDecoration: "none", fontWeight: 800, fontSize: 18, marginBottom: 40 },
  desc: { marginTop: 40, borderTop: "1px solid #eee", paddingTop: 40 }
};
