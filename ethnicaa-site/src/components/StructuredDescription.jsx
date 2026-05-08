"use client";

import { buildProductDescription } from "@/lib/commerce-seo-content";

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
  const buyerDescription = cleanDesc || buildProductDescription(product);

  return (
    <div style={styles.box}>
      {/* ⭐ AI HIGHLIGHTS SECTION (LLMO/GEO) */}
      <h3 style={styles.title}>Catalog Highlights</h3>
      <ul style={styles.list}>
          <li><b>Product:</b> {product.catalog || product.name}</li>
          <li><b>Pricing:</b> Direct Factory Wholesale Rates</li>
          <li><b>Quality:</b> 3-Layer Quality Checked</li>
          <li><b>Shipping:</b> Global Express Dispatch from Surat</li>
      </ul>

      {/* ⭐ STRUCTURED DATA TABLE (AEO) */}
      <h3 style={styles.subTitle}>Technical Specifications</h3>
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

      <h3 style={styles.subTitle}>Full Description</h3>
      <div style={styles.desc}>
        {buyerDescription.split("\n").map((line, i) => (
          <p key={i} style={styles.descLine}>
            {line}
          </p>
        ))}
      </div>

      {/* ⭐ SEMANTIC SEO CONTENT BLOCK */}
      <div style={styles.seoBox}>
          <h3 style={styles.subTitle}>Wholesale & Bulk Ordering Info</h3>
          <p style={styles.descLine}>
            Looking to buy <b>{product.name} wholesale</b>? Ethnicaa is Surat&apos;s leading <b>B2B textile supplier</b> providing direct factory access to the latest catalogs. 
            We specialize in bulk exports and supply to resellers, boutiques, and retailers globally including USA, UK, Canada, and UAE.
          </p>
          <ul style={styles.list}>
              <li><b>Best Factory Prices:</b> Buy direct from Surat manufacturers at unbeatable wholesale rates.</li>
              <li><b>Reseller Friendly:</b> Low MOQ (Minimum Order Quantity) and high profit margins for online resellers.</li>
              <li><b>Verified Quality:</b> Every catalog is checked for fabric quality and embroidery precision.</li>
              <li><b>Fast Dispatch:</b> We ship bulk orders via trusted logistics partners like DHL, FedEx, and DTDC.</li>
          </ul>
          <p style={styles.descLine}>
              Explore our other collections: 
              <a href="/category/sarees" style={styles.seoLink}> Wholesale Sarees</a>, 
              <a href="/category/kurtis" style={styles.seoLink}> Wholesale Kurtis</a>, and 
              <a href="/category/pakistani-suits" style={styles.seoLink}> Pakistani Suits</a>.
          </p>
      </div>
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
  seoBox: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: "1px solid #eee",
  },
  seoLink: {
    color: "#D4AF37",
    fontWeight: "700",
    textDecoration: "none",
    margin: "0 5px",
  },
};
