import Image from "next/image";
import Link from "next/link";
import TrustBadges from "@/components/TrustBadges";
import EnquireButton from "@/components/EnquireButton";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Direct Wholesale Manufacturers in Surat | Ethnicaa B2B",
  description: "Source directly from Surat's leading textile manufacturers. Ethnicaa connects you with Ring Road and Millennium Market's top suppliers at authentic factory prices.",
  alternates: {
    canonical: "https://ethnicaa.com/wholesale-manufacturers-in-surat",
  },
};

export default function SuratManufacturersPage() {
  return (
    <div style={styles.container}>
      <Breadcrumbs items={[{ name: "Surat Manufacturers", url: "" }]} />

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Direct From Surat&apos;s Leading Manufacturers</h1>
        <p style={styles.heroSub}>
          Ethnicaa is your primary bridge to the world-renowned Surat Textile Market. Skip the middlemen and source ethnic wear at authentic factory prices.
        </p>
        <Link href="/category/all" style={styles.primaryBtn}>Explore All Collections</Link>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.textBlock}>
          <h2 style={styles.sectionTitle}>Why Source From Surat with Ethnicaa?</h2>
          <p style={styles.text}>
            Surat is the heart of India&apos;s textile industry. However, finding reliable manufacturers and managing quality can be challenging. 
            Ethnicaa acts as your **boots-on-the-ground partner**, aggregating products from over 100+ verified factories in Ring Road, Millennium Market, and Pashupati Market.
          </p>
          <ul style={styles.featList}>
            <li>✅ **Verified Manufacturers**: Every supplier is vetted for quality and reliability.</li>
            <li>✅ **Daily New Arrivals**: Get catalog updates as soon as they hit the factory floors.</li>
            <li>✅ **Zero Middleman Markup**: We provide products at the manufacturer&apos;s listed price.</li>
            <li>✅ **Global Shipping**: We ship Surat&apos;s best-selling designs to over 50+ countries.</li>
          </ul>
        </div>
      </section>

      <TrustBadges />

      <section style={styles.ctaBox}>
        <h2 style={styles.ctaTitle}>Ready to Scale Your Reselling Business?</h2>
        <p style={styles.ctaText}>
          Join 5,000+ happy buyers who source their inventory directly through our Surat-based network.
        </p>
        <div style={styles.ctaActions}>
             <EnquireButton product={{ name: "Surat Manufacturer Inquiry", slug: "surat-manufacturers" }} />
        </div>
      </section>

      <section style={styles.seoFooter}>
        <h3 style={styles.smallTitle}>About Surat Wholesale Market</h3>
        <p style={styles.smallText}>
          The Surat wholesale market is famous for its vibrant sarees, premium salwar suits, and designer kurtis. 
          By sourcing from manufacturers in Surat via Ethnicaa, you gain a competitive edge with the latest fashion trends and 50-70% higher margins compared to local wholesalers.
        </p>
      </section>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: "20px 12px" },
  hero: {
    padding: "60px 20px",
    background: "linear-gradient(135deg, #111 0%, #333 100%)",
    borderRadius: 24,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
  },
  heroTitle: { fontSize: 36, fontWeight: 800, marginBottom: 15 },
  heroSub: { fontSize: 18, opacity: 0.9, maxWidth: 800, margin: "0 auto 30px", lineHeight: 1.6 },
  primaryBtn: { display: "inline-block", background: "#fff", color: "#000", padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 700 },
  contentSection: { display: "grid", gap: 30, marginBottom: 50 },
  sectionTitle: { fontSize: 28, fontWeight: 700, marginBottom: 20 },
  text: { fontSize: 16, color: "#444", lineHeight: 1.7, marginBottom: 20 },
  featList: { listStyle: "none", padding: 0, display: "grid", gap: 12 },
  ctaBox: { background: "#f5f5f5", padding: "40px 20px", borderRadius: 24, textAlign: "center", marginBottom: 50 },
  ctaTitle: { fontSize: 26, fontWeight: 800, marginBottom: 10 },
  ctaText: { fontSize: 16, color: "#666", marginBottom: 25 },
  ctaActions: { maxWidth: 300, margin: "0 auto" },
  seoFooter: { borderTop: "1px solid #eee", paddingTop: 30, color: "#777" },
  smallTitle: { fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#555" },
  smallText: { fontSize: 14, lineHeight: 1.6 },
};
