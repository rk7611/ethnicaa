export const metadata = {
  title: "Frequently Asked Questions | Ethnicaa Wholesale",
  description: "Find answers to commonly asked questions about wholesale pricing, MOQs, and shipping on Ethnicaa.",
};

import FAQSchema from "@/components/FAQSchema";

export default function FAQPage() {
  const faqs = [
    {
      q: "Do you offer wholesale prices?",
      a: "Yes! Every single product on Ethnicaa is priced at direct manufacturer wholesale rates. We cater exclusively to boutique owners, shopkeepers, and resellers."
    },
    {
      q: "Can I buy a single piece for personal use?",
      a: "No, we strictly deal in full wholesale catalogs and sets. Single pieces or retail inquiries are not entertained."
    },
    {
      q: "What is your MOQ (Minimum Order Quantity)?",
      a: "The MOQ typically depends on the specific catalog. Most of our catalogs come in sets of 4, 6, or 8 colors/designs. You must purchase the entire set."
    },
    {
      q: "How often do you add new catalogs?",
      a: "We update our website daily with fresh arrivals directly from Surat manufacturers. Check the 'Latest Products' section on our homepage frequently."
    },
    {
      q: "Do you provide Cash on Delivery (COD)?",
      a: "Yes, partial COD is available for select pin codes in India. A small advance token amount must be paid to confirm the COD booking. International deliveries are strictly fully prepaid."
    },
    {
      q: "Do you ship internationally?",
      a: "Absolutely! We export daily to the USA, UK, Canada, Australia, Malaysia, UAE, and many other countries using premium couriers like DHL and FedEx."
    },
    {
      q: "Are the catalog images exactly what I will receive?",
      a: "Yes, we sell 100% original manufacturer catalogs. However, minor color differences may appear due to professional photography lighting."
    },
    {
      q: "Can I use your photos to sell on Instagram/WhatsApp?",
      a: "Yes, once you become a customer, you are fully authorized to use our high-quality catalog images for your own social media marketing and reselling."
    }
  ];

  return (
    <div style={styles.container}>
      <FAQSchema 
        faqs={faqs.map(f => ({ question: f.q, answer: f.a }))} 
        id="faq-page-schema" 
      />
      <h1 style={styles.title}>Frequently Asked Questions</h1>
      
      <div style={styles.content}>
        <p>If you have a question that isn&apos;t answered here, please don&apos;t hesitate to reach out to our WhatsApp support.</p>
        
        <div style={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} style={styles.faqItem}>
              <h3 style={styles.q}>Q: {faq.q}</h3>
              <p style={styles.a}><strong>A:</strong> {faq.a}</p>
            </div>
          ))}
        </div>
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
    color: "#333",
  },
  faqList: {
    marginTop: 30,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  faqItem: {
    background: "#F9FAFC",
    padding: 20,
    borderRadius: 10,
    border: "1px solid #eee",
  },
  q: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111",
  },
  a: {
    fontSize: 16,
    lineHeight: 1.6,
    color: "#444",
  }
};
