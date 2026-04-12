"use client";

export default function StructuredDescription({ product = {} }) {
  if (!product) return null;

  const {
    description = "",
    fabrics = [],
    sizes = [],
    dispatch = "",
    weight = "",
    work = "",
    type = "",
    color = "",
    pattern = "",
    occasion = "",
  } = product;

  const cleanDesc = (description || "").trim();

  return (
    <div style={styles.box}>
      <h3 style={styles.title}>Product Details</h3>

      <div style={styles.list}>
        {/* FABRICS */}
        {Array.isArray(fabrics) && fabrics.length > 0 && (
          <p style={styles.row}>
            <b>Fabric:</b> {fabrics.join(", ")}
          </p>
        )}

        {/* SIZES */}
        {Array.isArray(sizes) && sizes.length > 0 && (
          <p style={styles.row}>
            <b>Sizes:</b> {sizes.join(", ")}
          </p>
        )}

        {/* DISPATCH TIME */}
        {dispatch && (
          <p style={styles.row}>
            <b>Dispatch:</b> {dispatch}
          </p>
        )}

        {/* WEIGHT */}
        {weight && (
          <p style={styles.row}>
            <b>Weight:</b> {weight}
          </p>
        )}

        {/* TYPE / CATEGORY */}
        {type && (
          <p style={styles.row}>
            <b>Type:</b> {type}
          </p>
        )}

        {/* COLOR */}
        {color && (
          <p style={styles.row}>
            <b>Color:</b> {color}
          </p>
        )}

        {/* WORK */}
        {work && (
          <p style={styles.row}>
            <b>Work:</b> {work}
          </p>
        )}

        {/* PATTERN */}
        {pattern && (
          <p style={styles.row}>
            <b>Pattern:</b> {pattern}
          </p>
        )}

        {/* OCCASION */}
        {occasion && (
          <p style={styles.row}>
            <b>Occasion:</b> {occasion}
          </p>
        )}
      </div>

      {/* LONG DESCRIPTION BLOCK */}
      {cleanDesc && (
        <>
          <h3 style={styles.subTitle}>Description</h3>
          <div style={styles.desc}>
            {cleanDesc.split("\n").map((line, i) => (
              <p key={i} style={styles.descLine}>
                {line}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------------------- */
/*            STYLES             */
/* ----------------------------- */

const styles = {
  box: {
    marginTop: 35,
    padding: "18px 16px",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
  },

  subTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginTop: 20,
    marginBottom: 10,
  },

  list: {
    lineHeight: "1.7",
    fontSize: 15,
    color: "#333",
  },

  row: {
    marginBottom: 6,
  },

  desc: {
    marginTop: 10,
    lineHeight: "1.7",
    fontSize: 15,
    color: "#444",
  },

  descLine: {
    marginBottom: 8,
  },
};
