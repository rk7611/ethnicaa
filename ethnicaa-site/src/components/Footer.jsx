import Link from "next/link";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Column 1 */}
          <div>
            <h3 style={styles.title}>Ethnicaa Wholesale</h3>
            <p style={styles.text}>
              India's fastest growing B2B ethnic wear marketplace. Direct from Surat manufacturers giving you the best margins for your resale business.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 style={styles.title}>Company</h3>
            <ul style={styles.list}>
              <li><Link href="/about-us" style={styles.link}>About Us</Link></li>
              <li><Link href="/contact-us" style={styles.link}>Contact Us</Link></li>
              <li><Link href="/faq" style={styles.link}>FAQs</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 style={styles.title}>Legal & Policies</h3>
            <ul style={styles.list}>
              <li><Link href="/privacy-policy" style={styles.link}>Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" style={styles.link}>Terms & Conditions</Link></li>
              <li><Link href="/refund-cancellation" style={styles.link}>Refund & Cancellation</Link></li>
              <li><Link href="/shipping-policy" style={styles.link}>Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 style={styles.title}>Support</h3>
            <ul style={styles.list}>
              <li><Link href="/how-to-order" style={styles.link}>How to Order</Link></li>
              <li><a href="https://wa.me/9586346332" target="_blank" rel="noopener noreferrer" style={styles.link}>WhatsApp: +91 9586346332</a></li>
              <li><a href="mailto:support@ethnicaa.com" style={styles.link}>support@ethnicaa.com</a></li>
            </ul>
          </div>
        </div>
        
        <div style={styles.bottomBar}>
          <p>&copy; 2026 Ethnicaa Wholesale. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#111",
    color: "#fff",
    paddingTop: 60,
    marginTop: 60,
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  text: {
    fontSize: 14,
    color: "#aaa",
    lineHeight: 1.6,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  link: {
    color: "#aaa",
    textDecoration: "none",
    fontSize: 14,
    transition: "color 0.2s",
  },
  bottomBar: {
    borderTop: "1px solid #333",
    padding: "20px 0",
    textAlign: "center",
    fontSize: 14,
    color: "#777",
  },
};
