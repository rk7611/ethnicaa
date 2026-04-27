import Image from "next/image";

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
      <h1 style={styles.h1}>About Ethnicaa: The Heart of Surat Textiles</h1>
      
      <div style={styles.content}>
        <p>Ethnicaa is born from the looms of Surat, the textile capital of the world. Our mission is to bridge the gap between Surat&apos;s high-quality manufacturers and the global community of retailers, boutique owners, and online resellers.</p>
        
        <h2>Our Manufacturing Heritage</h2>
        <p>With roots deep in the Surat Ring Road textile market, Ethnicaa understands the intricate details of fabric, craftsmanship, and design. We partner with over 500+ verified manufacturers in Surat to bring you the latest collections in Kurtis, Sarees, and Salwar Suits.</p>

        <h2>Direct Factory Access</h2>
        <p>By eliminating multiple layers of middlemen and commission agents, we ensure that you get the <strong>lowest possible wholesale prices</strong>. This direct-from-factory model allows our resellers to maintain healthy margins while offering competitive prices to their customers.</p>

        <h2>Quality & Trust</h2>
        <p>Every product ordered through Ethnicaa undergoes a 3-layer quality check at our Surat warehouse. From fabric strength to embroidery precision, we ensure that what you see is exactly what you get.</p>
      </div>

      <div style={styles.stats}>
        <div style={styles.statItem}>
          <h3>500+</h3>
          <p>Verified Manufacturers</p>
        </div>
        <div style={styles.statItem}>
          <h3>10k+</h3>
          <p>Resellers Globally</p>
        </div>
        <div style={styles.statItem}>
          <h3>50+</h3>
          <p>Countries Served</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: "0 auto", padding: "60px 20px" },
  h1: { fontSize: 36, fontWeight: 800, marginBottom: 30, textAlign: "center" },
  content: { lineHeight: 1.8, fontSize: 17, color: "#333" },
  stats: { display: "flex", justifyContent: "space-around", marginTop: 60, padding: 40, background: "#f9f9f9", borderRadius: 24 },
  statItem: { textAlign: "center" },
};
