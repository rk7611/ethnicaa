import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, writeBatch, orderBy, limit, startAfter } from "firebase/firestore";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";

/* -----------------------------------------------------------
   HELPERS
------------------------------------------------------------ */
function toSlug(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const PAGE_SIZE = 50;

export default function BulkEdit() {
  const [products, setProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({}); // { id: { field: value } }
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all"); // all, draft, published
  const lastDoc = useRef(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async (isMore = false) => {
    if (isMore) setLoadingMore(true);
    else {
      setLoading(true);
      setProducts([]);
      lastDoc.current = null;
    }

    try {
      let q = collection(db, "products");
      if (filter !== "all") {
        q = query(q, where("status", "==", filter));
      }
      
      q = query(q, orderBy("createdAt", "desc"));
      
      if (isMore && lastDoc.current) {
        q = query(q, startAfter(lastDoc.current));
      }
      
      q = query(q, limit(PAGE_SIZE));
      
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      if (isMore) {
        setProducts(prev => [...prev, ...list]);
      } else {
        setProducts(list);
        setEditedProducts({}); // Reset local changes only on initial fetch
      }
      
      lastDoc.current = snap.docs[snap.docs.length - 1];
      setHasMore(snap.docs.length === PAGE_SIZE);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setEditedProducts(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const saveChanges = async () => {
    const idsToUpdate = Object.keys(editedProducts);
    if (idsToUpdate.length === 0) {
      alert("No changes to save.");
      return;
    }

    setSaving(true);
    try {
      const batch = writeBatch(db);
      for (const id of idsToUpdate) {
        const ref = doc(db, "products", id);
        const updates = { ...editedProducts[id], updatedAt: serverTimestamp() };
        
        // Convert numbers if needed
        if (updates.price !== undefined) updates.price = Number(updates.price);
        if (updates.pcs !== undefined) updates.pcs = Number(updates.pcs);
        
        // Handle Categories
        if (updates.categoryNames !== undefined) {
          const names = updates.categoryNames.split(",").map(n => n.trim()).filter(Boolean);
          updates.categoryNames = names;
          updates.categories = names.map(n => toSlug(n));
        }
        
        batch.update(ref, updates);
      }
      await batch.commit();
      alert(`Successfully updated ${idsToUpdate.length} products!`);
      fetchProducts();
    } catch (err) {
      alert("Error saving changes: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getFieldValue = (p, field) => {
    if (editedProducts[p.id] && editedProducts[p.id][field] !== undefined) {
      return editedProducts[p.id][field];
    }
    const val = p[field];
    if (field === "categoryNames" && Array.isArray(val)) {
      return val.join(", ");
    }
    return val || "";
  };

  return (
    <AdminLayout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Bulk Product Editor</h1>
          <p style={styles.subtitle}>Edit multiple products in a spreadsheet-like view</p>
        </div>
        <div style={styles.actionRow}>
          <select 
            style={styles.select} 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Products</option>
            <option value="draft">Drafts Only</option>
            <option value="published">Published Only</option>
          </select>
          <button 
            style={styles.saveBtn} 
            onClick={saveChanges}
            disabled={saving || Object.keys(editedProducts).length === 0}
          >
            {saving ? "Saving..." : `Save ${Object.keys(editedProducts).length} Changes`}
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading catalog...</p>
      ) : products.length === 0 ? (
        <div style={styles.emptyState}>No products found for this filter.</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Preview</th>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Brand</th>
                <th style={styles.th}>Catalog</th>
                <th style={styles.th}>Price (₹)</th>
                <th style={styles.th}>PCS</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={styles.tr}>
                  <td style={styles.td}>
                    <button style={styles.previewBtn} onClick={() => setPreviewProduct(p)}>👁️</button>
                  </td>
                  <td style={styles.td}>
                    <img src={p.images?.[0] || "https://via.placeholder.com/50"} alt={p.name} style={styles.thumb} />
                  </td>
                  <td style={styles.td}>
                    <input 
                      style={styles.tableInput} 
                      value={getFieldValue(p, "name")} 
                      onChange={(e) => handleInputChange(p.id, "name", e.target.value)}
                    />
                  </td>
                  <td style={styles.td}>
                    <input 
                      style={styles.tableInput} 
                      value={getFieldValue(p, "categoryNames")} 
                      onChange={(e) => handleInputChange(p.id, "categoryNames", e.target.value)}
                      placeholder="e.g. Saree, Silk"
                    />
                  </td>
                  <td style={styles.td}>
                    <input 
                      style={styles.tableInput} 
                      value={getFieldValue(p, "brand")} 
                      onChange={(e) => handleInputChange(p.id, "brand", e.target.value)}
                    />
                  </td>
                  <td style={styles.td}>
                    <input 
                      style={styles.tableInput} 
                      value={getFieldValue(p, "catalog")} 
                      onChange={(e) => handleInputChange(p.id, "catalog", e.target.value)}
                    />
                  </td>
                  <td style={styles.td}>
                    <input 
                      style={{...styles.tableInput, width: 80}} 
                      type="number"
                      value={getFieldValue(p, "price")} 
                      onChange={(e) => handleInputChange(p.id, "price", e.target.value)}
                    />
                  </td>
                  <td style={styles.td}>
                    <input 
                      style={{...styles.tableInput, width: 60}} 
                      type="number"
                      value={getFieldValue(p, "pcs")} 
                      onChange={(e) => handleInputChange(p.id, "pcs", e.target.value)}
                    />
                  </td>
                  <td style={styles.td}>
                    <select 
                      style={styles.tableSelect} 
                      value={getFieldValue(p, "status")} 
                      onChange={(e) => handleInputChange(p.id, "status", e.target.value)}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasMore && (
        <div style={styles.loadMoreContainer}>
          <button 
            style={styles.loadMoreBtn} 
            onClick={() => fetchProducts(true)} 
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More Products"}
          </button>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewProduct && (
        <div style={styles.modalOverlay} onClick={() => setPreviewProduct(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{previewProduct.name}</h2>
              <button style={styles.closeBtn} onClick={() => setPreviewProduct(null)}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.previewGallery}>
                {previewProduct.images?.map((img, i) => (
                  <img key={i} src={img} style={styles.previewImg} alt={`Product ${i}`} />
                ))}
              </div>
              
              <div style={styles.previewDetails}>
                <div style={styles.previewSection}>
                  <h4 style={styles.previewHeading}>Core Information</h4>
                  <p style={styles.previewItem}><span style={styles.previewLabel}>Brand:</span> {previewProduct.brand || "N/A"}</p>
                  <p style={styles.previewItem}><span style={styles.previewLabel}>Catalog:</span> {previewProduct.catalog || "N/A"}</p>
                  <p style={styles.previewItem}><span style={styles.previewLabel}>Status:</span> {previewProduct.status}</p>
                  <p style={styles.previewItem}><span style={styles.previewLabel}>Categories:</span> {previewProduct.categoryNames?.join(", ") || "None"}</p>
                  <p style={styles.previewItem}><span style={styles.previewLabel}>Fabrics:</span> {previewProduct.fabricNames?.join(", ") || "None"}</p>
                </div>

                <div style={styles.previewSection}>
                  <h4 style={styles.previewHeading}>Pricing & Logistics</h4>
                  <p style={styles.previewItem}><span style={styles.previewLabel}>Price per PC:</span> ₹{previewProduct.price}</p>
                  <p style={styles.previewItem}><span style={styles.previewLabel}>Total PCS:</span> {previewProduct.pcs || "N/A"}</p>
                  <p style={styles.previewItem}><span style={styles.previewLabel}>Total Price (with GST):</span> {previewProduct.full_price_with_gst || "N/A"}</p>
                </div>

                <div style={styles.previewSection}>
                  <h4 style={styles.previewHeading}>Description</h4>
                  <p style={styles.previewText}>{previewProduct.description || "No description provided."}</p>
                </div>

                <div style={styles.previewSection}>
                  <h4 style={styles.previewHeading}>Raw Specs</h4>
                  <p style={styles.previewText}>{previewProduct.rawSpecs || "No specs provided."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  title: { fontSize: 32, fontWeight: 800, color: "#D4AF37", margin: 0 },
  subtitle: { color: "#888", margin: "5px 0 0 0" },
  actionRow: { display: "flex", gap: 15, alignItems: "center" },
  select: { background: "#111", color: "#fff", border: "1px solid #333", padding: "10px 15px", borderRadius: "10px", outline: "none" },
  saveBtn: { background: "#D4AF37", color: "#000", padding: "12px 24px", borderRadius: "12px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)" },
  
  tableWrapper: { background: "#111", borderRadius: "20px", border: "1px solid #222", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "15px 20px", background: "#0b0b0b", color: "#666", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 },
  td: { padding: "12px 20px", borderBottom: "1px solid #1a1a1a" },
  tr: { transition: "background 0.2s" },
  thumb: { width: 40, height: 55, objectFit: "cover", borderRadius: 6, background: "#222" },
  tableInput: { background: "transparent", border: "1px solid #333", color: "#fff", padding: "8px 12px", borderRadius: "6px", width: "100%", outline: "none" },
  tableSelect: { background: "#1a1a1a", border: "1px solid #333", color: "#fff", padding: "8px", borderRadius: "6px", width: "100%", outline: "none" },
  
  toggleOn: { background: "rgba(212, 175, 55, 0.1)", color: "#D4AF37", border: "1px solid #D4AF37", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontSize: 11 },
  toggleOff: { background: "rgba(255, 255, 255, 0.05)", color: "#666", border: "1px solid #333", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: 11 },
  
  emptyState: { textAlign: "center", padding: 60, color: "#888", background: "#111", borderRadius: 20, border: "1px dashed #333" },

  loadMoreContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    marginBottom: "50px",
  },
  loadMoreBtn: {
    background: "#1a1a1a",
    color: "#D4AF37",
    border: "1px solid #D4AF37",
    padding: "12px 30px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    transition: "all 0.2s",
  },
  previewBtn: {
    background: "#1a1a1a",
    border: "1px solid #333",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.9)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
  },
  modalContent: {
    background: "#0b0b0b",
    width: "100%",
    maxWidth: "1000px",
    maxHeight: "90vh",
    borderRadius: "24px",
    border: "1px solid #222",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "20px 30px",
    borderBottom: "1px solid #222",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    margin: 0,
    fontSize: 22,
    color: "#D4AF37",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: 24,
    cursor: "pointer",
  },
  modalBody: {
    padding: "30px",
    overflowY: "auto",
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: 30,
  },
  previewGallery: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: 15,
    alignContent: "start",
  },
  previewImg: {
    width: "100%",
    aspectRatio: "3/4",
    objectFit: "cover",
    borderRadius: "12px",
    background: "#111",
  },
  previewDetails: {
    display: "flex",
    flexDirection: "column",
    gap: 25,
  },
  previewSection: {
    background: "#111",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #222",
    color: "#fff",
  },
  previewHeading: {
    margin: "0 0 15px 0",
    color: "#D4AF37",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "1px solid #222",
    paddingBottom: "10px",
  },
  previewItem: {
    fontSize: 14,
    marginBottom: "8px",
    color: "#eee",
  },
  previewLabel: {
    color: "#888",
    marginRight: "8px",
  },
  previewText: {
    fontSize: 14,
    color: "#aaa",
    lineHeight: "1.6",
    margin: 0,
    whiteSpace: "pre-wrap",
  },
};
