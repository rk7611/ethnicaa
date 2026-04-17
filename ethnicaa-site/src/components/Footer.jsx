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
              <li><Link href="/wholesale-manufacturers-in-surat" style={styles.link}>Surat Manufacturers</Link></li>
              <li><Link href="/surat-wholesale-market-guide" style={styles.link}>Market Guide 2026</Link></li>
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
              <li><Link href="/blog" style={styles.link}>Wholesale Blog</Link></li>
              <li><a href="https://wa.me/9586346332" target="_blank" rel="noopener noreferrer" style={styles.link}>WhatsApp: +91 9586346332</a></li>
              <li><a href="mailto:support@ethnicaa.com" style={styles.link}>support@ethnicaa.com</a></li>
            </ul>
          </div>
        </div>

        {/* SEO INTERNAL LINK STRIP */}
        <div style={styles.seoStrip}>
          <div style={styles.seoColumn}>
            <h4 style={styles.seoTitle}>Top Collections</h4>
            <div style={styles.seoLinks}>
              <Link href="/category/sarees" style={styles.link}>Wholesale Sarees Surat</Link>
              <Link href="/category/kurtis" style={styles.link}>Kurti Manufacturer Surat</Link>
              <Link href="/category/pakistani-suits" style={styles.link}>Pakistani Suits Wholesale</Link>
              <Link href="/category/salwar-suits" style={styles.link}>Salwar Suits Bulk Price</Link>
            </div>
          </div>
          <div style={styles.seoColumn}>
            <h4 style={styles.seoTitle}>Trending Searches</h4>
            <div style={styles.seoLinks}>
              <Link href="/search?keyword=lawn+suits" style={styles.link}>Lawn Suits Wholesale India</Link>
              <Link href="/search?keyword=cotton+kurtis" style={styles.link}>Cotton Kurtis for Resellers</Link>
              <Link href="/search?keyword=bridal+lehenga" style={styles.link}>Bridal Lehenga Surat Market</Link>
              <Link href="/search?keyword=party+wear+suits" style={styles.link}>Designer Party Wear Suits</Link>
            </div>
          </div>
          <div style={styles.seoColumn}>
            <h4 style={styles.seoTitle}>Wholesale Materials</h4>
            <div style={styles.seoLinks}>
              <Link href="/collections/silk-sarees" style={styles.link}>Wholesale Silk Sarees</Link>
              <Link href="/collections/cotton-kurtis" style={styles.link}>Wholesale Cotton Kurtis</Link>
              <Link href="/collections/organza-sarees" style={styles.link}>Organza Sarees Bulk</Link>
              <Link href="/collections/georgette-suits" style={styles.link}>Georgette Suits Manufacturer</Link>
            </div>
          </div>
          <div style={styles.seoColumn}>
            <h4 style={styles.seoTitle}>Local Sourcing</h4>
            <div style={styles.seoLinks}>
              <Link href="/collections/sarees-in-mumbai" style={styles.link}>Wholesale Sarees in Mumbai</Link>
              <Link href="/collections/kurtis-in-delhi" style={styles.link}>Wholesale Kurtis in Delhi</Link>
              <Link href="/collections/suits-in-jaipur" style={styles.link}>Wholesale Suits in Jaipur</Link>
              <Link href="/collections/sarees-in-kolkata" style={styles.link}>Wholesale Sarees in Kolkata</Link>
            </div>
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
  seoStrip: {
    borderTop: "1px solid #333",
    paddingTop: 30,
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 30,
    paddingBottom: 20,
  },
  seoColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  seoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 4,
  },
  seoLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px 20px",
  },
};
