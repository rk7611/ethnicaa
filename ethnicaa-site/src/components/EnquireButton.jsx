"use client";

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

  const openWhatsApp = () => {
    const url = `https://wa.me/9586346332?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <button onClick={openWhatsApp} style={styles.button}>
      WhatsApp
    </button>
  );
}

const styles = {
  button: {
    display: "block",
    width: "100%",
    padding: "12px 18px",
    borderRadius: 8,
    background: "#25D366",
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: 600,
    textDecoration: "none",
    border: "none",
    marginTop: 12,
    cursor: "pointer",
  },
};
