import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Ethnicaa | India's Leading B2B Textile Marketplace",
  description: "Ethnicaa is a premier B2B textile marketplace based in Surat, Gujarat. We connect global retailers directly with verified Surat manufacturers.",
  alternates: {
    canonical: "https://ethnicaa.com/about-us",
  },
};

export default function AboutUs() {
  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Ethnicaa: Your Scalable Wholesale Textile Partner</h1>
      
      <div style={styles.content}>
        <p>Born in the heart of Surat—India&apos;s textile capital—Ethnicaa is built on a single promise: <strong>To make high-quality Surat fashion accessible to every scale of business.</strong> Whether you are an established retail chain sourcing in bulk or a home-based reseller starting your first boutique, we provide the manufacturing backbone you need to succeed.</p>
        
        <div style={styles.funnelBox}>
          <div style={styles.funnelItem}>
            <h3>For Retailers & Wholesalers</h3>
            <p>We provide professional B2B services including bulk sourcing, export logistics, and make-to-order manufacturing for shop owners globally.</p>
            <Link href="/retailers" style={styles.link}>Explore B2B Services &rarr;</Link>
          </div>
          <div style={styles.funnelItem}>
            <h3>For Resellers & Startups</h3>
            <p>Launch your business with zero investment and low MOQs. We provide the support and direct factory pricing to help you scale.</p>
            <Link href="/start-business" style={styles.link}>Start Your Business &rarr;</Link>
          </div>
        </div>

        <h2>Manufacturing Excellence from Surat</h2>
        <p>With roots deep in the Surat Ring Road textile market, we partner with 500+ verified manufacturers. By eliminating middlemen and commission agents, we ensure you get the <strong>true factory cost</strong>, giving you a massive margin advantage.</p>

        <h2>Global Export & Reliability</h2>
        <p>From our 3-layer quality check at the Surat warehouse to secure international shipping via DHL and FedEx, we handle the technical logistics so you can focus on your customers. We currently serve businesses in 50+ countries including USA, UK, Canada, and UAE.</p>
      </div>

      <div style={styles.stats}>
        <div style={styles.statItem}>
          <h3>500+</h3>
          <p>Verified Looms</p>
        </div>
        <div style={styles.statItem}>
          <h3>₹5Cr+</h3>
          <p>Inventory Value</p>
        </div>
        <div style={styles.statItem}>
          <h3>50+</h3>
          <p>Global Hubs</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: "0 auto", padding: "60px 20px" },
  h1: { fontSize: 36, fontWeight: 800, marginBottom: 30, textAlign: "center" },
  content: { lineHeight: 1.8, fontSize: 17, color: "#333" },
  funnelBox: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30, margin: "40px 0", padding: "40px 0", borderTop: "1px solid #eee", borderBottom: "1px solid #eee" },
  funnelItem: { padding: 30, background: "#fff", borderRadius: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0" },
  link: { display: "inline-block", marginTop: 15, color: "#d32f2f", fontWeight: 700, textDecoration: "none" },
  stats: { display: "flex", justifyContent: "space-around", marginTop: 60, padding: 40, background: "#f9f9f9", borderRadius: 24 },
  statItem: { textAlign: "center" },
};
