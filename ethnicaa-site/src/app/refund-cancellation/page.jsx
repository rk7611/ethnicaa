export const metadata = {
  title: "Refund & Cancellation | Ethnicaa Wholesale",
  description: "B2B Refund and Cancellation policies for wholesale apparel orders at Ethnicaa.",
};

export default function RefundPolicyPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Refund & Cancellation Policy</h1>
      
      <div style={styles.content}>
        <p>
          Ethnicaa operates exclusively as a B2B (Business-to-Business) wholesale distributor. Because our margins are strictly wholesale, our return policies differ significantly from retail B2C shopping sites.
        </p>
        
        <h2>1. Returns & Replacements</h2>
        <p>
          We accept returns or offer replacements <strong>ONLY</strong> in the case of major manufacturing defects or if the wrong catalog/product was shipped to you. 
        </p>
        <ul>
          <li>We do <strong>not</strong> accept returns for reasons such as "did not like the color", "cloth quality not as expected", or "reselling issues".</li>
          <li>Slight color variations are possible due to professional photography lighting and device screen settings, and do not qualify as defects.</li>
        </ul>

        <h2>2. The Unpacking Video Rule (Mandatory)</h2>
        <p>
          To claim a defect or missing item, you <strong>must</strong> record a clear, continuous, uncut 360-degree Unpacking Video from the moment the sealed parcel is opened up to the point the defect is shown.
        </p>
        <ul>
          <li>Claims submitted without an uncut unpacking video will be strictly rejected.</li>
          <li>Defects must be reported to our WhatsApp support within 24 hours of parcel delivery.</li>
        </ul>

        <h2>3. Order Cancellation</h2>
        <ul>
          <li><strong>Before Dispatch:</strong> You may cancel your order for a full refund if the parcel has not yet left our godown.</li>
          <li><strong>After Dispatch:</strong> Once the AWB tracking number is generated and the parcel is handed to the courier, cancellations are not permitted.</li>
          <li><strong>Pre-booked Catalogs:</strong> Advance token money paid for upcoming catalogs is non-refundable if you later decide back out, as stock is reserved for you.</li>
        </ul>

        <h2>4. Refund Processing</h2>
        <p>
          Approved refunds will be initiated to your original bank account or UPI ID within 3-5 working days. Return shipping charges (in case of a valid defect return) will be borne by us.
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
