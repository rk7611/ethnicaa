import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Boutique Ecommerce Support & Branded Website Setup | Ethnicaa",
  description: "Get professional ecommerce support for your fashion business. Ethnicaa provides branded website setup and live inventory for approved boutique owners and resellers.",
};

export default function EcommerceSupportPage() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={{ color: "#d32f2f", fontWeight: 700, textTransform: "uppercase", fontSize: 12, letterSpacing: 2 }}>Partner Onboarding Program</span>
        <h1 style={styles.h1}>Ecommerce Support & Boutique Growth Infrastructure</h1>
        <p style={styles.sub}>
          We don&apos;t just sell wholesale kurtis; we build the digital infrastructure that helps your brand dominate the market. Ethnicaa is not only selling products. We are helping you build a real online fashion business. Approved reseller partners may receive branded ecommerce support and online selling infrastructure.
        </p>
      </header>

      <section style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.icon}>🚀</div>
          <h2>Boutique Online Store Setup</h2>
          <p>Launch your branded fashion store with our professional ecommerce setup. Selected buyers can apply for branded online store assistance to help scale their boutique brand globally.</p>
        </div>
        <div style={styles.card}>
          <div style={styles.icon}>🔌</div>
          <h2>Seamless Product Integration</h2>
          <p>Sync your store directly with Ethnicaa. When we launch a new catalog, it can appear on your website instantly. Focus on sales, not technical configuration.</p>
        </div>
        <div style={styles.card}>
          <div style={styles.icon}>📱</div>
          <h2>Boutique Branding Support</h2>
          <p>Every product on your branded site comes with your identity. We help you avoid technical struggles so you can focus on building your fashion brand.</p>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <h2 style={styles.ctaHeading}>Who is this for?</h2>
        <div style={styles.targetGrid}>
          <div style={styles.targetCard}>
            <h3>Established Boutiques</h3>
            <p>Move from physical-only to a global online brand with our managed ecommerce support.</p>
          </div>
          <div style={styles.targetCard}>
            <h3>Scale-Ready Resellers</h3>
            <p>Transform from a social media seller into a professional ecommerce business owner.</p>
          </div>
        </div>
        <div style={{ marginTop: 50, textAlign: "center" }}>
          <Link href="/become-a-partner" style={styles.btn}>Apply for Ecommerce Support</Link>
        </div>
      </section>

      <section style={styles.faqSection}>
        <h2 style={{ textAlign: "center", marginBottom: 40 }}>Common Questions</h2>
        <div style={styles.faqList}>
          <div style={styles.faqItem}>
            <strong>Is this website really branded to my business?</strong>
            <p>Yes. Your website will feature your business name, your logo, and your contact details. To your customers, it is 100% your store.</p>
          </div>
          <div style={styles.faqItem}>
            <strong>Do I need technical skills?</strong>
            <p>No. Ethnicaa handles the hosting, security, and product syncing. You only need to focus on marketing and serving your customers.</p>
          </div>
          <div style={styles.faqItem}>
            <strong>How do I get started?</strong>
            <p>Submit your application through our Partner Program. Our team reviews every profile to ensure a high-quality ecosystem.</p>
          </div>
          <div style={styles.faqItem}>
            <strong>Does Ethnicaa provide ecommerce support to everyone?</strong>
            <p>Our ecommerce support is reserved for approved reseller partners and selected buyers. We review every application to ensure business quality and growth potential.</p>
          </div>
          <div style={styles.faqItem}>
            <strong>Do I need coding knowledge to sell online with Ethnicaa?</strong>
            <p>No. Ethnicaa handles the technical configuration, hosting, and product syncing. You focus 100% on marketing and serving your customers.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: "60px 20px" },
  header: { textAlign: "center", marginBottom: 80 },
  h1: { fontSize: 48, fontWeight: 800, marginBottom: 20 },
  sub: { fontSize: 22, color: "#666", maxWidth: 800, margin: "0 auto" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30, marginBottom: 80 },
  card: { padding: 40, background: "#fff", borderRadius: 24, border: "1px solid #eee", textAlign: "center" },
  icon: { fontSize: 50, marginBottom: 20 },
  ctaSection: { background: "#000", color: "#fff", padding: "80px 40px", borderRadius: 40, marginBottom: 80 },
  ctaHeading: { textAlign: "center", fontSize: 36, fontWeight: 800, marginBottom: 40 },
  targetGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 },
  targetCard: { borderLeft: "4px solid #d32f2f", paddingLeft: 20 },
  btn: { display: "inline-block", background: "#fff", color: "#000", padding: "20px 50px", borderRadius: 15, fontWeight: 800, textDecoration: "none", fontSize: 18 },
  faqSection: { maxWidth: 800, margin: "0 auto" },
  faqList: { display: "flex", flexDirection: "column", gap: 30 },
  faqItem: { background: "#f8f9fa", padding: 25, borderRadius: 20 },
};
