export const metadata = {
  title: "Privacy Policy | Ethnicaa Wholesale",
  description: "Ethnicaa Wholesale protects your B2B data. Read our privacy policy concerning data collection and usage.",
};

export default function PrivacyPolicyPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Privacy Policy</h1>
      
      <div style={styles.content}>
        <p><em>Last Updated: April 13, 2026</em></p>
        <p>
          Ethnicaa Wholesale (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how your personal and business information is collected, used, and disclosed when you visit our website (ethnicaa.com).
        </p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information that you voluntarily provide when making wholesale inquiries or communicating with us via WhatsApp, which may include:</p>
        <ul>
          <li>Business Name / Contact Name</li>
          <li>WhatsApp / Phone Number</li>
          <li>Email Address</li>
          <li>Shipping and Billing Addresses</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>Your data is used strictly to facilitate B2B transactions:</p>
        <ul>
          <li>To process bulk orders and arrange shipping logistics.</li>
          <li>To send you invoices, dispatch receipts, and tracking links.</li>
          <li>To occasionally broadcast new catalog updates if you have opted in.</li>
        </ul>

        <h2>3. Data Sharing and Third Parties</h2>
        <p>
          We do <strong>not</strong> sell, rent, or trade your business data to external marketers. We only share necessary data (Name, Address, Phone) with our courier and logistics partners (e.g., DHL, Delhivery, FedEx) solely for the purpose of delivering your parcels.
        </p>

        <h2>4. Analytics</h2>
        <p>
          We use Google Analytics to understand general website traffic and improve our catalog offerings. This data is aggregated and does not personally identify you.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You have the right to request the deletion of your personal data from our contact books at any time. Simply message our WhatsApp support requesting data removal.
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
