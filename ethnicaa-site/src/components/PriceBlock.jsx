"use client";

export default function PriceBlock({ product }) {
  if (!product) return null;

  const {
    price = "",
    avgPrice = "",
    fullPrice = "",
    fullPriceWithGST = "",
    pcs = 0,
    priceText = "",
  } = product;

  /* Pick final per-piece price */
  const perPiece =
    Number(price) > 0
      ? Number(price)
      : avgPrice
      ? String(avgPrice).replace(/[^0-9.]/g, "")
      : "";

  return (
    <div style={styles.box}>
      {/* PRICE SECTION */}
      <div>
        {/* MAIN PRICE */}
        {perPiece ? (
          <div style={styles.mainPrice}>₹ {perPiece} / pc</div>
        ) : (
          <div style={styles.mainPrice}>Price on Request</div>
        )}

        {/* OPTIONAL TEXT PRICE */}
        {priceText && <div style={styles.subNote}>{priceText}</div>}

        {/* FULL SET PRICE */}
        {fullPrice && (
          <p style={styles.line}>
            <b>Total:</b> ₹ {fullPrice}
          </p>
        )}

        {/* GST PRICE */}
        {fullPriceWithGST && (
          <p style={styles.line}>
            <b>With GST (5%):</b> ₹ {fullPriceWithGST}
          </p>
        )}

        {/* MINIMUM ORDER */}
        {pcs > 0 && (
          <p style={styles.line}>
            <b>Minimum Order:</b> {pcs} pcs
          </p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------- */
/*               STYLES                   */
/* -------------------------------------- */
const styles = {
  box: {
    background: "#fafafa",
    padding: "14px 16px",
    borderRadius: 10,
    marginBottom: 15,
    border: "1px solid #eee",
  },

  mainPrice: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 6,
  },

  line: {
    fontSize: 15,
    margin: "4px 0",
    color: "#444",
  },

  subNote: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 8,
    color: "#777",
  },
};
