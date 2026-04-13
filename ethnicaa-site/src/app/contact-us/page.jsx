export const metadata = {
  title: "Contact Us | Ethnicaa Wholesale",
  description: "Get in touch with the Ethnicaa Wholesale support team for bulk inquiries, order tracking, and business partnerships.",
};

export default function ContactUsPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Contact Us</h1>
      
      <div style={styles.content}>
        <p>
          Our dedicated wholesale support team is ready to assist you with order inquiries, shipping details, or customized bulk requirements.
        </p>
        
        <div style={styles.card}>
          <h3>💬 WhatsApp Support (Fastest Response)</h3>
          <p>
            For instant ordering and support, message us on WhatsApp:<br/>
            <strong><a href="https://wa.me/9586346332" style={styles.link} target="_blank">+91 9586346332</a></strong>
          </p>
        </div>

        <div style={styles.card}>
          <h3>✉️ Email Support</h3>
          <p>
            For official inquiries, export documentation, or general support:<br/>
            <strong><a href="mailto:support@ethnicaa.com" style={styles.link}>support@ethnicaa.com</a></strong>
          </p>
        </div>

        <div style={styles.card}>
          <h3>🏢 Office & Dispatch Hub</h3>
          <p>
            <strong>Ethnicaa Wholesale</strong><br/>
            Surat, Gujarat, India<br/>
            <em>(Note: We are a strict B2B operating hub. Physical visits are by appointment only.)</em>
          </p>
        </div>

        <h2>Business Hours</h2>
        <p>
          Monday - Saturday: <strong>10:00 AM - 7:00 PM (IST)</strong><br/>
          Sunday: Closed
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
  card: {
    background: "#F9FAFC",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    border: "1px solid #eee",
  },
  link: {
    color: "#0066cc",
    textDecoration: "none",
  }
};
