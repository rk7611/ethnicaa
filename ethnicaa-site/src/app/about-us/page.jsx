export const metadata = {
  title: "About Us | Ethnicaa Wholesale",
  description: "Learn about Ethnicaa Wholesale, India's leading B2B wholesale marketplace for ethnic wear directly from Surat manufacturers.",
};

export default function AboutUsPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About Ethnicaa Wholesale</h1>
      
      <div style={styles.content}>
        <p>
          Welcome to <strong>Ethnicaa Wholesale</strong>, India’s fastest-growing B2B marketplace for premium ethnic wear. We bridge the gap between Surat's leading manufacturers and retail businesses across the globe.
        </p>
        
        <h2>Our Mission</h2>
        <p>
          Our mission is to empower boutique owners, resellers, and online sellers by providing direct access to 100% original designer catalogs at absolute rock-bottom manufacturer prices. We believe that when our resellers grow, we grow.
        </p>

        <h2>Why Choose Ethnicaa?</h2>
        <ul>
          <li><strong>Direct Manufacturer Pricing:</strong> Avoid middleman margins. We source and supply directly from the factory.</li>
          <li><strong>Daily New Arrivals:</strong> Stay ahead of the fashion curve with fresh catalogs uploaded every single day.</li>
          <li><strong>Quality Guarantee:</strong> Every shipment undergoes strict quality control before dispatch.</li>
          <li><strong>Global Logistics:</strong> We partner with trusted courier services to deliver worldwide efficiently.</li>
        </ul>

        <h2>Our Categories</h2>
        <p>
          We specialize in complete wholesale catalogs across a vast range of categories including Sarees, Kurtis, Salwar Suits, Pakistani Suits, Gowns, Lehengas, and Cord Sets.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "40px 20px",
    background: "#fff",
    borderRadius: 12,
    marginTop: 40,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    borderBottom: "2px solid #eee",
    paddingBottom: 15,
  },
  content: {
    fontSize: 16,
    lineHeight: 1.8,
    color: "#333",
  },
};
