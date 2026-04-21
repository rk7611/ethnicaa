import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EnquireButton({ product }) {
  if (!product) return null;

  const name = product.catalog || product.name || "";
  const slug = product.slug || "";
  const category =
    Array.isArray(product.categories) && product.categories.length > 0
      ? product.categories[0]
      : "Catalog";

  const perPiece = product.price || product.avg_price || "";
  const pcs = product.pcs || "";
  const fullPrice = product.full_price || "";
  const gstPrice = product.full_price_with_gst || "";

  const productUrl = `https://ethnicaa.com/product/${slug}`;

  const message = `
Hello Ethnicaa,

I am interested in the following product:

• Product: ${name}
• Category: ${category}
• Product ID: ${slug}

• Price per piece: ₹${perPiece}
• PCS: ${pcs}
• Full Price: ₹${fullPrice}
• With GST (5%): ₹${gstPrice}

Link: ${productUrl}

Please share more details.
  `.trim();

  const openWhatsApp = async () => {
    // Increment WhatsApp Clips (NEW)
    try {
      if (slug) {
        await updateDoc(doc(db, "products", slug), {
          whatsapp_clicks: increment(1)
        });
      }
    } catch (err) {
      console.error("Failed to increment clicks:", err);
    }

    const url = `https://wa.me/9586346332?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <button onClick={openWhatsApp} style={styles.button} className="pulse-button">
      <span style={{ marginRight: 8 }}>💬</span>
      Enquire on WhatsApp
    </button>
  );
}

const styles = {
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    background: "#25D366", // High-contrast WhatsApp Green
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: 700,
    textDecoration: "none",
    border: "none",
    marginTop: 12,
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(37, 211, 102, 0.3)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
};
