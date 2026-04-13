export const metadata = {
  title: "Shipping Policy | Ethnicaa Wholesale",
  description: "Read Ethnicaa Wholesale's shipping policies for domestic Indian orders and International B2B exports.",
};

export default function ShippingPolicyPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shipping & Delivery Policy</h1>
      
      <div style={styles.content}>
        <p>
          At Ethnicaa Wholesale, we ensure that your bulk orders are packaged securely and dispatched through India's most reliable logistics partners. 
        </p>
        
        <h2>1. Dispatch Time</h2>
        <ul>
          <li><strong>In-Stock Items:</strong> Dispatched within 24–48 working hours after payment confirmation.</li>
          <li><strong>Pre-Booking/Upcoming Catalogs:</strong> Dispatched as soon as the stock arrives at our Surat godown. You will be notified of the exact ETA upon ordering.</li>
        </ul>

        <h2>2. Domestic Shipping (India)</h2>
        <p>
          We use premier surface and air courier networks (e.g., Delhivery, Trackon, DTDC, Xpressbees, or specified Local Transports based on your weight).
        </p>
        <ul>
          <li><strong>Transit Time:</strong> Typically 3 to 7 working days depending on your pin code.</li>
          <li><strong>Shipping Charges:</strong> Calculated based on the exact dimensional weight of your parcel and final destination. Actual receipt from the courier is provided.</li>
        </ul>

        <h2>3. International Shipping (Exports)</h2>
        <p>
          We export to resellers in the USA, UK, UAE, Malaysia, Canada, Australia, and worldwide. 
        </p>
        <ul>
          <li><strong>Transit Time:</strong> Usually 5 to 12 working days via DHL, FedEx, Aramex, or UPS.</li>
          <li><strong>Customs & Duties:</strong> Any import duties, destination taxes, or customs clearance fees imposed by the destination country are solely the responsibility of the buyer.</li>
        </ul>

        <h2>4. Order Tracking</h2>
        <p>
          Once your parcel is handed over to the courier, our dispatch team will immediately share the Tracking AWB Number and courier website link with you on WhatsApp so you can monitor its journey live.
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
