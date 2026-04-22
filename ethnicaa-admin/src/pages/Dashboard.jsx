import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import useCategories from "../hooks/useCategories";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getCountFromServer, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const { categories, loading: categoriesLoading } = useCategories();
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [topViewed, setTopViewed] = useState([]);
  const [topClicked, setTopClicked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const prodCol = collection(db, "products");

        // 1. Get Counts (Very efficient)
        const [totalSnap, pubSnap, draftSnap] = await Promise.all([
          getCountFromServer(prodCol),
          getCountFromServer(query(prodCol, where("status", "==", "published"))),
          getCountFromServer(query(prodCol, where("status", "==", "draft")))
        ]);

        setStats({
          total: totalSnap.data().count,
          published: pubSnap.data().count,
          draft: draftSnap.data().count
        });

        // 2. Get Top Performers (Using a slightly larger batch and in-memory sort to handle missing fields)
        // Firestore's orderBy fails if the field doesn't exist in the document.
        // We fetch the 100 most recent/relevant products and sort them.
        const recentQ = query(prodCol, orderBy("updatedAt", "desc"), limit(100));
        const recentSnap = await getDocs(recentQ);
        const recentProds = recentSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const sortedByViews = [...recentProds]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5);

        const sortedByClicks = [...recentProds]
          .sort((a, b) => (b.whatsapp_clicks || 0) - (a.whatsapp_clicks || 0))
          .slice(0, 5);

        setTopViewed(sortedByViews);
        setTopClicked(sortedByClicks);

      } catch (err) {
        console.error("Dashboard analytics error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading || categoriesLoading) {
    return (
      <AdminLayout>
        <p style={{ color: "#D4AF37" }}>Loading Analytics...</p>
      </AdminLayout>
    );
  }

  const { total: totalProducts, published: publishedCount, draft: draftCount } = stats;
  const totalCategories = categories.length;

  return (
    <AdminLayout>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Store Overview</h1>
        <p style={styles.subtitle}>Real-time performance metrics for Ethnicaa</p>
      </div>

      {/* STATS GRID */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard} className="premium-card">
          <div style={styles.statVal}>{totalProducts}</div>
          <div style={styles.statLabel}>Total Products</div>
        </div>
        <div style={styles.statCard} className="premium-card">
          <div style={{ ...styles.statVal, color: "#4CAF50" }}>{publishedCount}</div>
          <div style={styles.statLabel}>Published</div>
        </div>
        <div style={styles.statCard} className="premium-card">
          <div style={{ ...styles.statVal, color: "#888" }}>{draftCount}</div>
          <div style={styles.statLabel}>Drafts</div>
        </div>
        <div style={styles.statCard} className="premium-card">
          <div style={styles.statVal}>{totalCategories}</div>
          <div style={styles.statLabel}>Categories</div>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* TOP PERFORMERS */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🔥 Most Viewed Products</h3>
          <div style={styles.listCard} className="premium-card">
            {topViewed.map((p, i) => (
              <div key={p.id} style={styles.listItem}>
                <div style={styles.rank}>{i + 1}</div>
                <img src={p.coverImage || p.images?.[0]} style={styles.miniImg} alt="" />
                <div style={{ flex: 1 }}>
                  <div style={styles.itemName}>{p.name}</div>
                  <div style={styles.itemMeta}>{p.views || 0} visits</div>
                </div>
                <Link to={`/edit-product/${p.id}`} style={styles.editLink}>Edit</Link>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>💬 Most WhatsApp Clicks</h3>
          <div style={styles.listCard} className="premium-card">
            {topClicked.map((p, i) => (
              <div key={p.id} style={styles.listItem}>
                <div style={styles.rank}>{i + 1}</div>
                <img src={p.coverImage || p.images?.[0]} style={styles.miniImg} alt="" />
                <div style={{ flex: 1 }}>
                  <div style={styles.itemName}>{p.name}</div>
                  <div style={styles.itemMeta}>{p.whatsapp_clicks || 0} enquiries</div>
                </div>
                <Link to={`/edit-product/${p.id}`} style={styles.editLink}>Edit</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...styles.section, marginTop: 40 }}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionsGrid}>
          <Link to="/add-product" style={styles.actionBtn}>➕ Add New Product</Link>
          <Link to="/products" style={styles.actionBtn}>📦 Manage Inventory</Link>
          <Link to="/banners" style={styles.actionBtn}>🖼️ Update Banners</Link>
        </div>
      </div>
    </AdminLayout>
  );
}

const styles = {
  header: { marginBottom: 30 },
  pageTitle: { fontSize: 32, fontWeight: 800, color: "#D4AF37", margin: 0 },
  subtitle: { color: "#888", marginTop: 5 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 },
  statCard: { background: "#111", padding: 25, borderRadius: 20, border: "1px solid #222", textAlign: "center" },
  statVal: { fontSize: 36, fontWeight: 800, color: "#D4AF37" },
  statLabel: { color: "#888", fontSize: 14, marginTop: 5, fontWeight: 600, textTransform: "uppercase" },
  mainGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 30 },
  section: { flex: 1 },
  sectionTitle: { fontSize: 18, color: "#fff", marginBottom: 15, fontWeight: 700 },
  listCard: { background: "#111", borderRadius: 20, border: "1px solid #222", overflow: "hidden" },
  listItem: { display: "flex", alignItems: "center", gap: 15, padding: "12px 20px", borderBottom: "1px solid #222" },
  rank: { width: 24, fontSize: 18, fontWeight: 800, color: "#333" },
  miniImg: { width: 40, height: 50, objectFit: "cover", borderRadius: 6 },
  itemName: { color: "#fff", fontWeight: 600, fontSize: 14 },
  itemMeta: { color: "#666", fontSize: 12, marginTop: 2 },
  editLink: { color: "#D4AF37", fontSize: 12, textDecoration: "none", fontWeight: 700 },
  actionsGrid: { display: "flex", gap: 15, flexWrap: "wrap" },
  actionBtn: { background: "#222", color: "#fff", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 600, border: "1px solid #333", fontSize: 14 },
};
