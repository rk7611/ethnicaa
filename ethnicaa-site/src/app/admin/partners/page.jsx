"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";

export default function AdminPartners() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "partner_applications"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setApps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function updateStage(id, newStage) {
    await updateDoc(doc(db, "partner_applications", id), { stage: newStage });
  }

  return (
    <div>
      <h1 style={{ marginBottom: 30 }}>Reseller Partner Applications</h1>
      
      {loading ? <p>Loading applications...</p> : (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tr}>
                <th style={styles.th}>Business Name</th>
                <th style={styles.th}>WhatsApp</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Stage</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <tr key={app.id} style={styles.tr}>
                  <td style={styles.td}><strong>{app.businessName}</strong></td>
                  <td style={styles.td}>{app.whatsapp}</td>
                  <td style={styles.td}>{app.status}</td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, background: getStageColor(app.stage)}}>
                      {app.stage || "Pending"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <select 
                      value={app.stage} 
                      onChange={(e) => updateStage(app.id, e.target.value)}
                      style={styles.select}
                    >
                      <option value="Application Received">Application Received</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Website In Design">Website In Design</option>
                      <option value="Demo Shared">Demo Shared</option>
                      <option value="Live">Live</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getStageColor(stage) {
  switch(stage) {
    case "Approved": return "#4caf50";
    case "Under Review": return "#ff9800";
    case "Live": return "#d32f2f";
    case "Demo Shared": return "#2196f3";
    default: return "#999";
  }
}

const styles = {
  tableCard: { background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "15px", borderBottom: "2px solid #f0f0f0", color: "#666", fontSize: 13, textTransform: "uppercase" },
  td: { padding: "15px", borderBottom: "1px solid #f0f0f0", fontSize: 14 },
  tr: { transition: "0.2s" },
  badge: { padding: "4px 10px", borderRadius: 12, color: "#fff", fontSize: 11, fontWeight: 700 },
  select: { padding: "6px", borderRadius: 8, border: "1px solid #ddd", fontSize: 12 }
};
