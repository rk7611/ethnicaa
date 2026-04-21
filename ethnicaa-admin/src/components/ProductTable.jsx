import React, { useState } from "react";
import { Link } from "react-router-dom";
import useMobile from "../hooks/useMobile";

export default function ProductTable({
  products,
  loading,
  onToggleStatus,
  onToggleOffer,
  onDelete,
  onDuplicate,
  onBulkDelete,
  onBulkPublish,
  onBulkDraft,
  onBulkOfferOn,
  onBulkOfferOff
}) {
  const isMobile = useMobile(1024);
  const [selected, setSelected] = useState([]);

  // Toggle individual checkbox
  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Select all
  const toggleSelectAll = () => {
    if (selected.length === products.length) {
      setSelected([]);
    } else {
      setSelected(products.map((p) => p.id));
    }
  };

  // Confirm delete
  const confirmDelete = (product) => {
    if (window.confirm("Delete this product permanently?")) {
      onDelete(product.id, product.slug);
    }
  };

  const renderMobileCard = (p) => (
    <div key={p.id} style={styles.card}>
      <div style={styles.cardHeader}>
        <input
          type="checkbox"
          checked={selected.includes(p.id)}
          onChange={() => toggleSelect(p.id)}
        />
        <span style={p.status === "published" ? styles.statusBadgePub : styles.statusBadgeDraft}>
          {p.status}
        </span>
      </div>
      
      <div style={styles.cardBody}>
        <img src={p.coverImage || p.images?.[0]} style={styles.cardImg} />
        <div style={styles.cardInfo}>
          <h4 style={styles.cardName}>{p.name}</h4>
          <div style={styles.assetBadges}>
            {(p.catalogAssets?.pdf || p.catalog_assets?.pdf || p.pdf) && <span style={styles.assetBadgePdf}>PDF</span>}
            {(p.catalogAssets?.zip || p.catalog_assets?.zip || p.zip) && <span style={styles.assetBadgeZip}>ZIP</span>}
          </div>
          <p style={styles.cardPrice}>₹{p.price}</p>
          <div style={styles.cardToggles}>
             <button
                style={p.offer ? styles.toggleOn : styles.toggleOff}
                onClick={() => onToggleOffer(p.id, p.offer)}
              >
                Offer: {p.offer ? "ON" : "OFF"}
              </button>
          </div>
        </div>
      </div>

      <div style={styles.cardActions}>
         <Link to={`/edit-product/${p.id}`} style={styles.editBtn}>Edit</Link>
         <button onClick={() => onDuplicate(p)} style={styles.dupBtn}>Copy</button>
         <button onClick={() => confirmDelete(p)} style={styles.delBtn}>✕</button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <div style={styles.bulkBar}>
          <span style={styles.bulkText}>{selected.length} selected</span>
          <button style={styles.bulkBtn} onClick={() => onBulkPublish(selected)}>Publish</button>
          <button style={styles.bulkBtn} onClick={() => onBulkDraft(selected)}>Draft</button>
          <button style={styles.bulkDelete} onClick={() => {
            if (window.confirm("Delete selected products permanently?")) {
              onBulkDelete(products.filter(p => selected.includes(p.id)));
            }
          }}>Delete</button>
        </div>
      )}

      {loading && <div style={styles.loading}>Updating products...</div>}

      {isMobile ? (
        <div style={styles.mobileList}>
          {products.length > 0 && (
            <div style={styles.mobileSelectAll}>
              <input 
                type="checkbox" 
                checked={selected.length === products.length && products.length > 0} 
                onChange={toggleSelectAll} 
                id="select-all-mobile"
              />
              <label htmlFor="select-all-mobile" style={styles.selectAllLabel}>Select All Products</label>
            </div>
          )}
          {products.map(renderMobileCard)}
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th><input type="checkbox" checked={selected.length === products.length && products.length > 0} onChange={toggleSelectAll} /></th>
              <th>Cover</th>
              <th>Name</th>
              <th>Price</th>
              <th>Offer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                <td><img src={p.coverImage || p.images?.[0]} style={styles.image} /></td>
                <td>
                  <div style={styles.productName}>{p.name}</div>
                  <div style={styles.slug}>{p.slug}</div>
                  <div style={styles.assetBadges}>
                    {(p.catalogAssets?.pdf || p.catalog_assets?.pdf || p.pdf) && <span style={styles.assetBadgePdf}>PDF</span>}
                    {(p.catalogAssets?.zip || p.catalog_assets?.zip || p.zip) && <span style={styles.assetBadgeZip}>ZIP</span>}
                  </div>
                </td>
                <td>₹{p.price}</td>
                <td>
                  <button style={p.offer ? styles.toggleOn : styles.toggleOff} onClick={() => onToggleOffer(p.id, p.offer)}>
                    {p.offer ? "ON" : "OFF"}
                  </button>
                </td>
                <td>
                  <button style={p.status === "published" ? styles.published : styles.draft} onClick={() => onToggleStatus(p.id, p.status)}>
                    {p.status}
                  </button>
                </td>
                <td>
                  <div style={styles.actionRow}>
                    <Link to={`/edit-product/${p.id}`} style={styles.editBtn}>Edit</Link>
                    <button onClick={() => onDuplicate(p)} style={styles.dupBtn}>Copy</button>
                    <button onClick={() => confirmDelete(p)} style={styles.delBtn}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: { width: "100%" },
  mobileList: { display: "flex", flexDirection: "column", gap: 15 },
  card: { background: "#111", borderRadius: 15, padding: 15, border: "1px solid #222" },
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  cardBody: { display: "flex", gap: 15, marginBottom: 12 },
  cardImg: { width: 60, height: 80, objectFit: "cover", borderRadius: 8 },
  cardInfo: { flex: 1 },
  cardName: { margin: "0 0 5px 0", fontSize: 16, color: "#fff" },
  cardPrice: { margin: 0, color: "#D4AF37", fontWeight: 700 },
  cardActions: { display: "flex", gap: 10, borderTop: "1px solid #222", paddingTop: 12 },
  statusBadgePub: { background: "rgba(0,128,0,0.2)", color: "green", padding: "2px 8px", borderRadius: 5, fontSize: 10, textTransform: "uppercase", fontWeight: 700 },
  statusBadgeDraft: { background: "rgba(255,255,255,0.1)", color: "#888", padding: "2px 8px", borderRadius: 5, fontSize: 10, textTransform: "uppercase", fontWeight: 700 },
  table: { width: "100%", borderCollapse: "collapse", color: "#fff", background: "#111", borderRadius: 15, overflow: "hidden" },
  image: { width: "50px", height: "65px", objectFit: "cover", borderRadius: "5px" },
  loading: { textAlign: "center", padding: "20px", color: "#D4AF37", fontWeight: 600 },
  productName: { fontWeight: 600, color: "#fff" },
  slug: { fontSize: "10px", opacity: 0.5 },
  published: { background: "#006400", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", border: "none", color: "#fff", fontSize: "11px" },
  draft: { background: "#333", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", border: "none", color: "#fff", fontSize: "11px" },
  toggleOn: { background: "#D4AF37", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", border: "none", color: "#000", fontSize: "11px", fontWeight: "bold" },
  toggleOff: { background: "#222", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", border: "1px solid #333", color: "#fff", fontSize: "11px" },
  actionRow: { display: "flex", gap: "6px" },
  editBtn: { background: "#D4AF37", padding: "6px 10px", borderRadius: "6px", textDecoration: "none", color: "#000", fontSize: "11px", fontWeight: "bold" },
  dupBtn: { background: "#333", padding: "6px 10px", borderRadius: "6px", color: "#fff", border: "1px solid #444", cursor: "pointer", fontSize: "11px" },
  delBtn: { background: "none", color: "#ff4444", border: "none", cursor: "pointer", fontSize: "16px", padding: "0 10px" },
  bulkBar: { background: "#1a1a1a", padding: "12px 15px", marginBottom: "15px", borderRadius: "12px", border: "1px solid #D4AF37", display: "flex", gap: "10px", alignItems: "center" },
  bulkText: { color: "#D4AF37", fontWeight: "bold", fontSize: 14 },
  bulkBtn: { background: "#333", color: "#fff", padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: 12 },
  bulkDelete: { background: "#ff4444", padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: "bold", marginLeft: "auto" },
  mobileSelectAll: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#1a1a1a",
    padding: "12px 15px",
    borderRadius: "12px",
    border: "1px solid #333",
    marginBottom: "5px",
  },
  selectAllLabel: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  assetBadges: { display: "flex", gap: "6px", marginTop: "4px" },
  assetBadgePdf: { background: "rgba(212, 175, 55, 0.1)", color: "#D4AF37", border: "1px solid #D4AF37", fontSize: "9px", padding: "1px 5px", borderRadius: "4px", fontWeight: "bold" },
  assetBadgeZip: { background: "rgba(76, 175, 80, 0.1)", color: "#4CAF50", border: "1px solid #4CAF50", fontSize: "9px", padding: "1px 5px", borderRadius: "4px", fontWeight: "bold" },
};
