export const metadata = {
  title: "How to Order | Ethnicaa Wholesale",
  description: "Learn the simple 3-step process to place your wholesale order with Ethnicaa.",
};

export default function HowToOrderPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>How to Place a Wholesale Order</h1>
      
      <div style={styles.content}>
        <p>
          At Ethnicaa, we have optimized our B2B ordering process to be as fast and personal as possible. Because wholesale inventory moves extremely fast, we process all orders directly through our executive WhatsApp team to ensure live stock availability.
        </p>
        
        <div style={styles.stepBox}>
          <div style={styles.stepNum}>1</div>
          <div>
            <h3>Select Your Catalogs</h3>
            <p>Browse our Latest Arrivals or navigate through categories like Sarees, Kurtis, and Salwar Suits on our website. Find the items that suit your boutique.</p>
          </div>
        </div>

        <div style={styles.stepBox}>
          <div style={styles.stepNum}>2</div>
          <div>
            <h3>Click "Enquire"</h3>
            <p>Once you find a catalog you want to purchase, click the <strong>Enquire on WhatsApp</strong> button located on the product page. This will automatically open a chat with our wholesale team with the specific product details pre-filled.</p>
          </div>
        </div>

        <div style={styles.stepBox}>
          <div style={styles.stepNum}>3</div>
          <div>
            <h3>Confirm & Pay</h3>
            <p>Our team will instantly verify current stock status, calculate the precise shipping cost based on your location/country, and issue your final invoice. We accept secure bank transfers, NEFT, and major UPI apps.</p>
          </div>
        </div>

        <h2>Frequently Asked Questions About Ordering</h2>
        <ul>
          <li><strong>Can I buy single pieces?</strong> No, we are strictly a B2B wholesale business. We sell complete catalog sets.</li>
          <li><strong>Is COD (Cash on Delivery) available?</strong> Yes, partial COD is available for specific pin codes inside India (subject to an advance booking token). International orders require full prepaid payment.</li>
        </ul>
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
  stepBox: {
    display: "flex",
    gap: 20,
    background: "#F9FAFC",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    border: "1px solid #eee",
    alignItems: "flex-start",
  },
  stepNum: {
    background: "#111",
    color: "#fff",
    minWidth: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    fontSize: 20,
    fontWeight: "bold",
  }
};
