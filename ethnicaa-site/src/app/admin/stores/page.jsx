"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "reseller_stores"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setStores(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function createStore(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subdomain = formData.get("subdomain").toLowerCase().trim();
    
    await addDoc(collection(db, "reseller_stores"), {
      subdomain,
      businessName: formData.get("businessName"),
      whatsappNumber: formData.get("whatsapp"),
      primaryColor: formData.get("color") || "#d32f2f",
      status: "draft",
      createdAt: serverTimestamp(),
    });
    setShowModal(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h1>Active Reseller Websites</h1>
        <button onClick={() => setShowModal(true)} style={styles.addBtn}>+ Create New Store</button>
      </div>

      <div style={styles.grid}>
        {stores.map(store => (
          <div key={store.id} style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
               <h3 style={{ margin: 0 }}>{store.businessName}</h3>
               <span style={{...styles.badge, background: store.status === 'live' ? '#4caf50' : '#999'}}>{store.status}</span>
            </div>
            <p style={{ color: "#666", fontSize: 13 }}>URL: <strong>{store.subdomain}.ethnicaa.com</strong></p>
            <p style={{ color: "#666", fontSize: 13 }}>WhatsApp: {store.whatsappNumber}</p>
            
            <div style={styles.cardActions}>
               <button style={styles.editBtn}>Edit Branding</button>
               <button style={styles.visitBtn} onClick={() => window.open(`http://${store.subdomain}.ethnicaa.com:3000`, '_blank')}>Visit Site</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Configure New Website</h2>
            <form onSubmit={createStore} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <input name="businessName" placeholder="Business Name" style={styles.input} required />
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <input name="subdomain" placeholder="subdomain" style={styles.input} required />
                <span style={{ fontSize: 14 }}>.ethnicaa.com</span>
              </div>
              <input name="whatsapp" placeholder="WhatsApp Number (+91)" style={styles.input} required />
              <input name="color" type="color" defaultValue="#d32f2f" style={{ width: 50, height: 40, border: "none" }} />
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.saveBtn}>Generate & Deploy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  addBtn: { background: "#d32f2f", color: "#fff", padding: "12px 24px", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 25 },
  card: { background: "#fff", padding: 25, borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0" },
  badge: { padding: "4px 10px", borderRadius: 12, color: "#fff", fontSize: 11, fontWeight: 700, textTransform: "uppercase" },
  cardActions: { marginTop: 20, display: "flex", gap: 10 },
  editBtn: { flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd", background: "#f9f9f9", fontSize: 13, cursor: "pointer" },
  visitBtn: { flex: 1, padding: 10, borderRadius: 8, border: "none", background: "#111", color: "#fff", fontSize: 13, cursor: "pointer" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", padding: 40, borderRadius: 30, width: 450, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  input: { padding: 12, borderRadius: 10, border: "1px solid #ddd", fontSize: 15 },
  saveBtn: { flex: 1, background: "#000", color: "#fff", padding: 12, borderRadius: 10, border: "none", fontWeight: 700 },
  cancelBtn: { flex: 1, background: "#eee", color: "#666", padding: 12, borderRadius: 10, border: "none" }
};
