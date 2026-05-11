import Link from "next/link";

export const metadata = {
  title: "Start Your Wholesale Clothing Business | Ethnicaa Guide",
  description: "Learn how to start your own ethnic wear reselling business from home with Ethnicaa. Low MOQ, direct factory prices, and business support for beginners.",
};

export default function StartBusinessPage() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.h1}>Launch Your Own Ethnic Wear Business</h1>
        <p style={styles.sub}>Zero heavy investment. Zero middlemen. Just high-quality Surat fashion delivered to your doorstep.</p>
      </header>

      <section style={styles.steps}>
        <div style={styles.step}>
          <div style={styles.stepNum}>1</div>
          <h3>Browse & Share</h3>
          <p>Explore thousands of latest catalogs on Ethnicaa and share images with your network via WhatsApp and Instagram.</p>
        </div>
        <div style={styles.step}>
          <div style={styles.stepNum}>2</div>
          <h3>Collect Orders</h3>
          <p>Take orders from your customers and confirm their sizes. You don&apos;t need to stock inventory upfront.</p>
        </div>
        <div style={styles.step}>
          <div style={styles.stepNum}>3</div>
          <h3>Order Wholesale</h3>
          <p>Place your order on Ethnicaa at factory-direct rates and keep the profit margin for yourself!</p>
        </div>
      </section>

      <section style={styles.whyBeginner}>
        <h2>Why Beginners Love Ethnicaa</h2>
        <div style={styles.benefitGrid}>
          <div style={styles.benefit}>
            <h4>Low MOQ (Small Sets)</h4>
            <p>You can start by buying just one full set (4-6 pieces). Perfect for testing the market.</p>
          </div>
          <div style={styles.benefit}>
            <h4>Business Guidance</h4>
            <p>Our blog and WhatsApp support help you understand trending fabrics and pricing strategies.</p>
          </div>
          <div style={styles.benefit}>
            <h4>Trusted Surat Sourcing</h4>
            <p>Skip the confusing market agents. Source directly from a verified B2B marketplace.</p>
          </div>
          <div style={{ ...styles.benefit, borderBottom: "none", background: "#f8f9fa", padding: 20, borderRadius: 15 }}>
            <h4 style={{ color: "#d32f2f" }}>Free Branded Website</h4>
            <p>We help beginners grow by starting a professional ecommerce website with <strong>your business name</strong> and <strong>your contact details</strong>.</p>
          </div>
          <div style={{ ...styles.benefit, borderBottom: "none", background: "#fff5f5", padding: 20, borderRadius: 15, border: "1px solid #ffdada" }}>
            <h4 style={{ color: "#d32f2f" }}>Boutique Ecommerce Infrastructure</h4>
            <p>Approved partners can access professional <strong>branded online store assistance</strong> and <strong>reseller growth support</strong> to scale faster.</p>
          </div>
        </div>
      </section>

      <div style={styles.ctaBox}>
        <h3>Ready to make your first ₹10,000 profit?</h3>
        <p>Join 10,000+ resellers who have started their journey with us.</p>
        <Link href="/category/all-products" style={styles.btn}>Browse All Products</Link>
        <Link href="/blog" style={{ display: "block", marginTop: 20, color: "#666" }}>Read Our Reselling Guides</Link>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1000, margin: "0 auto", padding: "60px 20px" },
  header: { textAlign: "center", marginBottom: 60 },
  h1: { fontSize: 38, fontWeight: 800, marginBottom: 20 },
  sub: { fontSize: 18, color: "#555" },
  steps: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 30, marginBottom: 60 },
  step: { padding: 30, background: "#f9f9f9", borderRadius: 20, textAlign: "center" },
  stepNum: { width: 40, height: 40, background: "#000", color: "#fff", borderRadius: "50%", margin: "0 auto 15px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  whyBeginner: { padding: 50, background: "#fff", borderRadius: 30, border: "1px solid #eee", marginBottom: 60 },
  benefitGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 25, marginTop: 30 },
  benefit: { borderBottom: "1px solid #eee", paddingBottom: 15 },
  ctaBox: { textAlign: "center", padding: 50, background: "#fdf8e6", borderRadius: 30 },
  btn: { display: "inline-block", background: "#000", color: "#fff", padding: "16px 32px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 16 }
};
