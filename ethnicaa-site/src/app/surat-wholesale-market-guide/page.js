import Link from "next/link";
import TrustBadges from "@/components/TrustBadges";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Surat Wholesale Market Guide 2026",
  description: "Explore the complete guide to Surat textile wholesale market. Learn about the best markets (Ring Road, Millennium) and top fabrics like Silk, Organza, and Georgette.",
  alternates: {
    canonical: "https://ethnicaa.com/surat-wholesale-market-guide",
  },
};

export default function SuratWholesaleGuide() {
  return (
    <div style={styles.container}>
      <Breadcrumbs items={[{ name: "Surat Market Guide", url: "" }]} />

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>The Ultimate Guide to sourcing from Surat Wholesale Market (2026)</h1>
        <p style={styles.heroSub}>
          Everything you need to know about the top fabrics, biggest markets, and direct sourcing secrets from India&apos;s textile capital.
        </p>
      </section>

      <section style={styles.toc}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>In this Guide:</h3>
        <ul style={styles.tocList}>
          <li><a href="#markets" style={styles.tocLink}>1. Top Sourcing Markets (Ring Road, Millennium)</a></li>
          <li><a href="#fabrics" style={styles.tocLink}>2. Trending Fabrics for 2026</a></li>
          <li><a href="#logistics" style={styles.tocLink}>3. Shipping & Logistics from Surat</a></li>
          <li><a href="#timings" style={styles.tocLink}>4. Market Timings & Best Visit Times</a></li>
          <li><a href="#faq" style={styles.tocLink}>5. Surat Wholesale FAQs</a></li>
        </ul>
      </section>

      <section style={styles.content} id="markets">
        <h2 style={styles.sectionTitle}>Top Wholesale Markets in Surat</h2>
        <p style={styles.text}>
          Surat is home to over 50,000 textile traders and thousands of manufacturers. If you are a reseller or boutique owner, these are the legendary markets you must know:
        </p>
        
        <div style={styles.marketGrid}>
          <div style={styles.marketCard} className="premium-card">
            <h3>1. Ring Road Market (The Saree Hub)</h3>
            <p>The core hub for traditional sarees and dress materials. It includes towers like <strong>Pashupati Market</strong>, <strong>Shree Om Market</strong>, and <strong>Radha Krishna Textile Market (RKTM)</strong>. Best for middle-range bulk orders and direct weaver catalogs.</p>
          </div>
          <div style={styles.marketCard} className="premium-card">
            <h3>2. Millennium Market (Kurti Capital)</h3>
            <p>A modern complex famous for high-quality Kurtis, designer Suits, and premium branded catalogs. This is where most premium boutique owners source their exclusive collections.</p>
          </div>
          <div style={styles.marketCard} className="premium-card">
            <h3>3. Bombay Market (Wedding Wear)</h3>
            <p>Known for bridal wear and heavy embroidered lehengas. If you are looking for premium wedding collections with heavy Zardosi and Sequence work, this is the place.</p>
          </div>
        </div>

        <h2 style={styles.sectionTitle} id="fabrics">Premium Fabrics to Source in 2026</h2>
        <p style={styles.text}>
          Surat manufacturers are masters of both synthetic and natural fibers. Here is what is trending for the current season:
        </p>
        
        <ul style={styles.list}>
          <li>
            <strong>Organza Silk:</strong> Currently the #1 trending fabric for lightweight designer sarees and party wear. 
            <Link href="/collections/organza-sarees" style={styles.inlineLink}>View Wholesale Organza Collection</Link>
          </li>
          <li>
            <strong>Pure Georgette & Liva Rayon:</strong> High-breathability fabrics ideal for summer Kurtis and semi-formal suits.
            <Link href="/collections/cotton-kurtis" style={styles.inlineLink}>Shop Liva Rayon Kurtis</Link>
          </li>
          <li>
            <strong>Banarasi & Jacquard:</strong> Essential for traditional wedding wear and heavy silk sarees.
            <Link href="/collections/silk-sarees" style={styles.inlineLink}>Browse Silk Catalog</Link>
          </li>
        </ul>

        <div style={styles.infoBox} id="logistics">
          <h3>Logistics & Quality Check</h3>
          <p>
            One of the biggest challenges for resellers is <strong>logistics</strong>. When sourcing through Ethnicaa, we handle the 3-layer quality check and consolidate your orders from multiple Surat manufacturers into a single express shipment via DHL, FedEx, or Aramex.
          </p>
        </div>

        <h2 style={styles.sectionTitle} id="timings">Market Timings & Visit Tips</h2>
        <p style={styles.text}>
            Most Surat wholesale markets are open from <strong>10:00 AM to 8:30 PM</strong>. However, Sundays are usually holidays for the majority of the Ring Road markets. If you plan a visit, we recommend coming between Tuesday and Friday to avoid the weekend rush and secure the best attention from wholesalers.
        </p>

        <div id="faq" style={{ marginTop: 60, padding: 30, background: "#f9f9f9", borderRadius: 20 }}>
            <h2 style={styles.sectionTitle}>Frequently Asked Questions (Surat Market)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                    <h4 style={{ fontWeight: 700 }}>Can I buy single pieces from Surat markets?</h4>
                    <p style={{ color: "#555" }}>Most markets operate on a &quot;Set-to-Set&quot; basis (4-12 pieces per design). However, at Ethnicaa, we support small boutique owners by offering smaller MOQs than typical market agents.</p>
                </div>
                <div>
                    <h4 style={{ fontWeight: 700 }}>How do I identify a genuine manufacturer?</h4>
                    <p style={{ color: "#555" }}>Genuine manufacturers always have GST-registered invoices and specific warehouse locations. Avoid unverified social media agents who don&apos;t have a physical presence in Surat.</p>
                </div>
                <div>
                    <h4 style={{ fontWeight: 700 }}>Is cash on delivery (COD) available for bulk orders?</h4>
                    <p style={{ color: "#555" }}>For most wholesale exports and large bulk orders, payment is via NEFT or UPI. Some verified catalogs on Ethnicaa may support partial COD for domestic Indian orders.</p>
                </div>
            </div>
        </div>
      </section>

      <TrustBadges />

      <section style={styles.internalLinkSection}>
        <h2>Start Your Sourcing Journey</h2>
        <div style={styles.linkGrid}>
           <Link href="/category/sarees" style={styles.bigLink}>Wholesale Sarees</Link>
           <Link href="/category/kurtis" style={styles.bigLink}>Wholesale Kurtis</Link>
           <Link href="/category/pakistani-suits" style={styles.bigLink}>Pakistani Suits</Link>
           <Link href="/wholesale-manufacturers-in-surat" style={styles.bigLink}>View Our Factory Network</Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1000, margin: "0 auto", padding: "20px 16px" },
  hero: { textAlign: "center", padding: "60px 0", borderBottom: "1px solid #eee", marginBottom: 40 },
  heroTitle: { fontSize: 34, fontWeight: 800, color: "#111", lineHeight: 1.2, marginBottom: 20 },
  heroSub: { fontSize: 18, color: "#666", maxWidth: 700, margin: "0 auto", lineHeight: 1.6 },
  sectionTitle: { fontSize: 26, fontWeight: 700, marginTop: 40, marginBottom: 20 },
  text: { fontSize: 16, color: "#444", lineHeight: 1.8, marginBottom: 20 },
  marketGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 40 },
  marketCard: { padding: 20, background: "#fff", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  list: { paddingLeft: 20, lineHeight: 2 },
  inlineLink: { marginLeft: 10, color: "#d32f2f", fontWeight: 600, textDecoration: "none" },
  infoBox: { background: "#fff9c4", padding: 25, borderRadius: 16, marginTop: 40, borderLeft: "5px solid #fbc02d" },
  internalLinkSection: { marginTop: 60, padding: 40, background: "#111", color: "#fff", borderRadius: 24, textAlign: "center" },
  linkGrid: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 15, marginTop: 25 },
  bigLink: { background: "rgba(255,255,255,0.1)", padding: "12px 24px", borderRadius: 30, color: "#fff", textDecoration: "none", fontWeight: 600, border: "1px solid rgba(255,255,255,0.2)" },
  toc: { background: "#f8f9fa", padding: 25, borderRadius: 20, marginBottom: 40, border: "1px solid #eee" },
  tocList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  tocLink: { color: "#d32f2f", textDecoration: "none", fontWeight: 500, fontSize: 15 },
};
