export const metadata = {
  title: "Terms & Conditions | Ethnicaa Wholesale",
  description: "Terms and conditions required for using the Ethnicaa Wholesale ethnic wear marketplace.",
};

export default function TermsConditionsPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Terms & Conditions</h1>
      
      <div style={styles.content}>
        <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>
        <p>
          Welcome to Ethnicaa Wholesale (ethnicaa.com). By using our website and placing bulk orders with our team, you agree to be bound by the following wholesale Terms & Conditions.
        </p>
        
        <h2>1. Business to Business (B2B) Policy</h2>
        <p>
          Ethnicaa operates purely as a B2B wholesaler. By engaging with our platform, you confirm that you are purchasing goods for the purpose of reselling or commercial trade. Single piece retail inquiries are strictly prohibited and will be ignored.
        </p>

        <h2>2. Pricing & Availability</h2>
        <ul>
          <li>All prices listed on our catalogs are purely wholesale (manufacturing) rates.</li>
          <li>Prices are subject to change without prior notice depending on fabric costs and market conditions.</li>
          <li>We process orders on a first-come, first-serve basis. Because wholesale stock depletes quickly, stock confirm availability is only valid at the exact time our executive confirms your WhatsApp order.</li>
        </ul>

        <h2>3. Taxes and GST</h2>
        <p>
          For buyers within India, a standard GST (typically 5% for textiles and 12% for readymade garments) will be added to the final invoice value. International buyers are exempt from Indian GST but are responsible for their own country's import duties.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          All images, catalog PDFs, and marketing materials provided by Ethnicaa remain the property of their respective manufacturer brands. As a registered reseller, you are permitted to use these images for your own further resale marketing.
        </p>

        <h2>5. Dispute Resolution</h2>
        <p>
          Any disputes arising from transactions with Ethnicaa Wholesale shall be subject to the exclusive jurisdiction of the courts located in Surat, Gujarat, India.
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
