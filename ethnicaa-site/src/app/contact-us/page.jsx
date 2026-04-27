export const metadata = {
  title: "Contact Ethnicaa | Wholesale Enquiries & Support",
  description: "Get in touch with Ethnicaa for wholesale textile enquiries, manufacturing partnerships, and bulk shipping support. Located in the heart of Surat.",
  alternates: {
    canonical: "https://ethnicaa.com/contact-us",
  },
};

export default function ContactUs() {
  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Contact Ethnicaa Wholesale</h1>
      
      <div style={styles.grid}>
        <div style={styles.info}>
          <h2>Wholesale & Bulk Enquiries</h2>
          <p>For catalog enquiries and bulk ordering, please contact our sales team via WhatsApp for the fastest response.</p>
          <a href="https://wa.me/9586346332" style={styles.whatsappBtn}>Chat on WhatsApp: +91 9586346332</a>
          
          <div style={styles.detailBox}>
            <h3>Office & Warehouse Address:</h3>
            <p>1028-29, Shree Om Market,<br />
               Near RKTM, Ring Road,<br />
               Surat-395002, Gujarat, India</p>
          </div>

          <div style={styles.detailBox}>
            <h3>Email Support:</h3>
            <p>Sales: sales@ethnicaa.com<br />
               Support: support@ethnicaa.com</p>
          </div>
        </div>

        <div style={styles.map}>
          {/* Static representation of a map or contact form can go here */}
          <div style={styles.placeholderMap}>
            <p>📍 Located in the Heart of Surat Textile Market</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1000, margin: "0 auto", padding: "60px 20px" },
  h1: { fontSize: 36, fontWeight: 800, marginBottom: 40, textAlign: "center" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 },
  info: { display: "flex", flexDirection: "column", gap: 30 },
  whatsappBtn: { background: "#25D366", color: "#fff", padding: "15px 30px", borderRadius: 12, textDecoration: "none", fontWeight: 700, textAlign: "center" },
  detailBox: { borderLeft: "4px solid #eee", paddingLeft: 20 },
  placeholderMap: { width: "100%", height: 400, background: "#f0f0f0", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", color: "#666", fontWeight: 700 },
};
