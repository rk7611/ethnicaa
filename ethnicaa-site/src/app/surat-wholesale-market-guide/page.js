import Link from "next/link";
import TrustBadges from "@/components/TrustBadges";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Ultimate Guide to Surat Wholesale Market: Top Fabrics & Markets 2026",
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

      <section style={styles.content}>
        <h2 style={styles.sectionTitle}>Top Wholesale Markets in Surat</h2>
        <p style={styles.text}>
          Surat is home to over 50,000 textile traders and thousands of manufacturers. If you are a reseller or boutique owner, these are the legendary markets you must know:
        </p>
        
        <div style={styles.marketGrid}>
          <div style={styles.marketCard} className="premium-card">
            <h3>1. Ring Road Market</h3>
            <p>The core hub for traditional sarees and dress materials. It includes towers like Pashupati Market and Surat Textile Market (STM). Best for middle-range bulk orders.</p>
          </div>
          <div style={styles.marketCard} className="premium-card">
            <h3>2. Millennium Market</h3>
            <p>A more modern market complex famous for high-quality Kurtis, designer Suits, and premium catalogs. Highly recommended for boutique owners.</p>
          </div>
          <div style={styles.marketCard} className="premium-card">
            <h3>3. Bombay Market</h3>
            <p>Known for bridal wear and heavy embroidered lehengas. If you are looking for premium wedding collections, this is the place.</p>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>Premium Fabrics to Source in 2026</h2>
        <p style={styles.text}>
          Surat manufacturers are masters of both synthetic and natural fibers. Here is what is trending for the current season:
        </p>
        
        <ul style={styles.list}>
          <li>
            <strong>Organza Silk:</strong> Currently the #1 trending fabric for lightweight designer sarees and party wear. 
            <Link href="/collections/organza-sarees" style={styles.inlineLink}>View Wholesale Organza Collection</Link>
          </li>
          <li>
            <strong>Pure Georgette:</strong> Known for its &quot;fall&quot; and durability. Ideal for heavy embroidery and Swarovski work.
            <Link href="/collections/georgette-suits" style={styles.inlineLink}>Explore Georgette Suits</Link>
          </li>
          <li>
            <strong>Tusser Silk &amp; Banarasi:</strong> Timeless classics that always have a high demand in the South Indian and NRI markets.
            <Link href="/collections/silk-sarees" style={styles.inlineLink}>Browse Silk Catalog</Link>
          </li>
          <li>
            <strong>Cotton &amp; Rayon:</strong> The go-to fabrics for daily wear Kurtis. High breathability and perfect for the Indian climate.
            <Link href="/collections/cotton-kurtis" style={styles.inlineLink}>Shop Cotton Kurtis</Link>
          </li>
        </ul>

        <div style={styles.infoBox}>
          <h3>Pro Tip for Resellers</h3>
          <p>
            When sourcing from Surat, pay attention to the &quot;Cut&quot; size and &quot;Fabric GSM.&quot; Many local wholesalers may provide shorter cuts to lower the price. At Ethnicaa, we guarantee standard factory cuts and verified fabric quality.
          </p>
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
};
