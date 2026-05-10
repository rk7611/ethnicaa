import Link from "next/link";
import TrustBadges from "@/components/TrustBadges";

export const metadata = {
  title: "Ethnicaa for Retailers & Boutique Owners | B2B Wholesale Sourcing",
  description: "Scale your ethnic wear business with Ethnicaa. We provide bulk sourcing, make-to-order services, and verified quality control for retail shop owners and boutique chains.",
};

export default function RetailersPage() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.h1}>B2B Sourcing Partner for Established Retailers</h1>
        <p style={styles.sub}>Reliable, Scalable, and Manufacturer-Direct. Sourcing excellence for boutiques and retail chains globally.</p>
      </header>

      <section style={styles.section}>
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Bulk Order Management</h3>
            <p>Specialized handling for large-ticket inventory (₹5 Lakh+). We coordinate with multiple Surat looms to ensure your stock is consistent and delivered on time.</p>
          </div>
          <div style={styles.card}>
            <h3>Make-to-Order Services</h3>
            <p>Need a custom design for your brand? Our manufacturing network supports custom production runs with your specific fabric and design requirements.</p>
          </div>
          <div style={styles.card}>
            <h3>Global Export Expertise</h3>
            <p>Full support for international retail buyers. We handle export documentation, GST compliance, and secure sea/air freight logistics to 50+ countries.</p>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <h2>Why Top Retailers Choose Ethnicaa</h2>
        <ul style={styles.list}>
          <li><strong>Inventory Stability:</strong> Never run out of your best-selling designs.</li>
          <li><strong>Verified QC:</strong> 3-layer quality check ensures 0% defect rate at your store.</li>
          <li><strong>Price Advantage:</strong> Direct-from-loom rates give you a 20-30% higher margin.</li>
          <li><strong>Trend Leadership:</strong> Weekly catalog updates from the heart of Surat.</li>
        </ul>
        <div style={styles.ctaBox}>
          <p>Looking for a high-volume sourcing partner?</p>
          <a href="https://wa.me/9586346332?text=I am a retailer/wholesaler looking for bulk sourcing support." style={styles.btn}>Connect with B2B Manager</a>
        </div>
      </section>

      <TrustBadges />
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: "40px 20px" },
  header: { textAlign: "center", marginBottom: 60 },
  h1: { fontSize: 42, fontWeight: 800, color: "#111", marginBottom: 20 },
  sub: { fontSize: 20, color: "#666", maxWidth: 800, margin: "0 auto" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30, marginTop: 40 },
  card: { padding: 30, background: "#fff", borderRadius: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #eee" },
  ctaSection: { marginTop: 80, padding: 60, background: "#fdf8e6", borderRadius: 30 },
  list: { listStyle: "none", padding: 0, margin: "30px 0", lineHeight: 2, fontSize: 18 },
  ctaBox: { marginTop: 40, textAlign: "center" },
  btn: { display: "inline-block", background: "#000", color: "#fff", padding: "18px 40px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 18 }
};
