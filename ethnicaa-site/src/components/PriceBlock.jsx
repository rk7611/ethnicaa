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
    offer = false,
    offer_price = "",
    discount_percent = 0,
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
            {offer && offer_price ? (
              <>
                <div style={styles.originalPrice}>₹ {price}</div>
                <div style={styles.offerPrice}>₹ {offer_price} / pc <span style={{fontSize: "14px", fontWeight: "600", color: "#666", marginLeft: "8px"}}>(Bulk Wholesale)</span></div>
                {discount_percent > 0 && (
                  <div style={styles.discountBadge}>Save {discount_percent}%</div>
                )}
              </>
            ) : (
              <div style={styles.mainPrice}>₹ {perPiece} / pc <span style={{fontSize: "14px", fontWeight: "600", color: "#666", marginLeft: "8px"}}>(Bulk Wholesale)</span></div>
            )}
          </div>
        ) : (
          <div style={styles.mainPrice}>Price on Request</div>
        )}

        {/* OPTIONAL TEXT PRICE */}
        {priceText && <div style={styles.subNote}>{priceText}</div>}

        {/* FULL SET PRICE */}
        {(fullPrice || (Number(perPiece) > 0 && pcs > 1)) && (
          <p style={styles.line}>
            <b>Full Set Price:</b> ₹ {fullPrice || (Number(perPiece) * pcs)}
          </p>
        )}

        {/* GST PRICE */}
        {(fullPriceWithGST || (Number(perPiece) > 0 && pcs > 1)) && (
          <p style={styles.line}>
            <b>Total with GST (5%):</b> ₹ {fullPriceWithGST || Math.round(Number(fullPrice || (Number(perPiece) * pcs)) * 1.05)}
          </p>
        )}

        {/* MINIMUM ORDER */}
        {pcs > 0 && (
          <p style={styles.line}>
            <b>Minimum Order:</b> {pcs} pcs
          </p>
        )}

        {/* TRUST & SHIPPING */}
        <div style={styles.trustInfo}>
          <div style={styles.trustItem}>
            <span>✅</span> Verified Surat Manufacturer
          </div>
          <div style={styles.trustItem}>
            <span>🚀</span> Ships in 24-48 Hours
          </div>
          <div style={styles.trustItem}>
            <span>🛡️</span> 100% Quality Assurance
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------- */
/*               STYLES                   */
/* -------------------------------------- */
const styles = {
  box: {
    background: "#fff",
    padding: "18px 20px",
    borderRadius: 16,
    marginBottom: 20,
    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
    border: "1px solid #eee",
  },

  mainPrice: {
    fontSize: 28,
    fontWeight: 800,
    color: "#d32f2f",
  },
  originalPrice: {
    fontSize: 20,
    fontWeight: 600,
    color: "#888",
    textDecoration: "line-through",
  },
  offerPrice: {
    fontSize: 28,
    fontWeight: 800,
    color: "#d32f2f",
  },
  discountBadge: {
    background: "#d32f2f", // Red badge like Meena Bazaar
    color: "#fff",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: "bold",
  },

  line: {
    fontSize: 16,
    margin: "6px 0",
    color: "#333",
  },

  subNote: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
    color: "#666",
    fontStyle: "italic",
  },

  trustInfo: {
    marginTop: 18,
    paddingTop: 15,
    borderTop: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  trustItem: {
    fontSize: 13,
    fontWeight: 600,
    color: "#2e7d32",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
};
