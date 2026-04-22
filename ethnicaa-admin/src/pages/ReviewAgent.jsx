import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, limit } from "firebase/firestore";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import slugify from "../utils/slugify";
import competitorIntelligence from "../data/competitorIntelligence.json";

/* -----------------------------------------------------------
   HELPERS (Mirrored from AddEditProduct for Auto-Fix)
------------------------------------------------------------ */
function generateSearchKeywords(product) {
  const keywords = new Set();
  const pushWords = (text) => {
    if (!text) return;
    const words = text.toLowerCase().split(/[\s,.-]+/);
    for (let i = 0; i < words.length; i++) {
        let phrase = words[i];
        if (!phrase) continue;
        keywords.add(phrase);
        for (let j = i + 1; j < words.length; j++) {
          phrase += " " + words[j];
          keywords.add(phrase);
        }
    }
  };
  pushWords(product.name);
  pushWords(product.catalog);
  product.categoryNames?.forEach((p) => pushWords(p));
  product.fabricNames?.forEach((p) => pushWords(p));
  pushWords(product.rawSpecs);
  pushWords(product.description);
  return Array.from(keywords).slice(0, 150);
}

export default function ReviewAgent() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [knowledge, setKnowledge] = useState(null);
  const [training, setTraining] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    fetchDrafts();
    loadKnowledge();
  }, []);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const loadKnowledge = () => {
    const saved = localStorage.getItem("agent_knowledge");
    if (saved) setKnowledge(JSON.parse(saved));
  };

  const trainAgent = async () => {
    setTraining(true);
    addLog("🤖 Agent is learning from published products...");
    try {
      // Fetch samples of published products for training
      const q = query(collection(db, "products"), where("status", "==", "published"), limit(500));
      const snap = await getDocs(q);
      const samples = snap.docs.map(d => d.data());

      const brands = new Set();
      const catPatterns = {}; // category -> { word -> count }

      samples.forEach(p => {
        if (p.brand) brands.add(p.brand.toLowerCase().trim());
        
        const cat = p.categoryNames?.[0];
        if (cat) {
          if (!catPatterns[cat]) catPatterns[cat] = {};
          const text = `${p.name} ${p.description} ${p.rawSpecs}`.toLowerCase();
          const words = text.split(/[\s,.-]+/);
          words.forEach(w => {
            if (w.length > 3) {
              catPatterns[cat][w] = (catPatterns[cat][w] || 0) + 1;
            }
          });
        }
      });

      const finalKnowledge = {
        brands: Array.from(brands),
        categories: Object.keys(catPatterns).map(cat => ({
          name: cat,
          keywords: Object.entries(catPatterns[cat])
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(e => e[0])
        })),
        updatedAt: Date.now()
      };

      localStorage.setItem("agent_knowledge", JSON.stringify(finalKnowledge));
      setKnowledge(finalKnowledge);
      addLog(`✨ Agent training complete! Learned ${finalKnowledge.brands.length} brands and patterns for ${finalKnowledge.categories.length} categories.`);
    } catch (err) {
      addLog(`Training Error: ${err.message}`);
    } finally {
      setTraining(false);
    }
  };

  const smartExtract = (p) => {
    const text = `${p.name} ${p.description} ${p.rawSpecs}`.toLowerCase();
    let foundBrand = p.brand;
    let foundCategory = (p.categoryNames && p.categoryNames.length > 0) ? p.categoryNames[0] : null;

    // 1. Check Competitor Keywords (Industry Standard)
    if (!foundCategory) {
      for (const [cat, kws] of Object.entries(competitorIntelligence.classificationKeywords)) {
        if (kws.some(kw => text.includes(kw))) {
          foundCategory = cat.charAt(0).toUpperCase() + cat.slice(1);
          if (foundCategory === "Suit") foundCategory = "Salwar Suit"; // mapping
          break;
        }
      }
    }

    // 2. Check Learned Knowledge (Historical Local Data)
    if (knowledge) {
      if (!foundBrand) {
        foundBrand = knowledge.brands.find(b => text.includes(b));
      }

      if (!foundCategory) {
        let bestMatch = null;
        let maxScore = 0;
        knowledge.categories.forEach(cat => {
          let score = 0;
          cat.keywords.forEach(kw => {
            if (text.includes(kw)) score++;
          });
          if (score > maxScore) {
            maxScore = score;
            bestMatch = cat.name;
          }
        });
        foundCategory = bestMatch;
      }
    }

    return { brand: foundBrand, category: foundCategory };
  };

  const fetchDrafts = async () => {
    setLoading(true);
    addLog("Scanning database for draft products...");
    try {
      const q = query(collection(db, "products"), where("status", "==", "draft"));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setDrafts(list);
      addLog(`Found ${list.length} draft products.`);
    } catch (err) {
      addLog(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const validateProduct = (p) => {
    const issues = [];
    const smart = smartExtract(p);

    if (!p.name || p.name.length < 3) issues.push("Name too short or missing");
    if (!p.price || Number(p.price) <= 0) issues.push("Invalid price");
    
    const hasCategory = (p.categoryNames && p.categoryNames.length > 0) || smart.category;
    if (!hasCategory) issues.push("No category (and agent couldn't guess)");
    
    if (!p.images || p.images.length === 0) issues.push("No images uploaded");
    
    // Auto-fixable issues
    const fixable = [];
    if (!p.brand && smart.brand) fixable.push(`Brand missing (Agent can set to "${smart.brand}")`);
    if (!p.categoryNames || p.categoryNames.length === 0) {
      if (smart.category) fixable.push(`Category missing (Agent can set to "${smart.category}")`);
    }
    if (!p.seo_title || !p.seo_description || !p.search_keywords || p.search_keywords.length === 0) {
      fixable.push("SEO/Search Metadata missing (Auto-fixable)");
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      fixableIssues: fixable,
      smartData: smart
    };
  };

  const autoFixAndPublish = async (p) => {
    addLog(`Agent processing: ${p.name}...`);
    const { isValid, issues, smartData } = validateProduct(p);
    
    if (!isValid) {
      addLog(`Cannot publish ${p.name}: ${issues.join(", ")}`);
      return false;
    }

    try {
      const updates = {
        updatedAt: serverTimestamp(),
        status: "published"
      };

      if (!p.brand && smartData.brand) updates.brand = smartData.brand;
      if (!p.categoryNames || p.categoryNames.length === 0) {
        if (smartData.category) {
          updates.categoryNames = [smartData.category];
          updates.categories = [slugify(smartData.category)];
        }
      }

      // Auto-generate missing SEO/Keywords using Competitor Patterns
      const fabric = p.fabricNames?.[0] || "";
      const catName = smartData.category || "Ethnic Wear";
      
      // Competitor-style SEO Title
      updates.seo_title = p.seo_title || competitorIntelligence.seoPatterns.metaTitle
        .replace("{name}", p.name)
        .replace("{category}", catName);

      // Competitor-style SEO Description
      updates.seo_description = p.seo_description || competitorIntelligence.seoPatterns.metaDescription
        .replace("{name}", p.name)
        .replace("{category}", catName);

      updates.search_keywords = (p.search_keywords && p.search_keywords.length > 0) 
        ? p.search_keywords 
        : [...generateSearchKeywords(p), ...competitorIntelligence.marketKeywords].slice(0, 150);

      await updateDoc(doc(db, "products", p.id), updates);
      
      addLog(`Published: ${p.name} (Competitor-style SEO applied)`);
      return true;
    } catch (err) {
      addLog(`Failed to publish ${p.name}: ${err.message}`);
      return false;
    }
  };

  const runAgent = async () => {
    const ready = drafts.filter(p => validateProduct(p).isValid);
    if (ready.length === 0) {
      addLog("No products are ready for publishing. Use 'Train Agent' or fix manual issues.");
      return;
    }

    setPublishing(true);
    addLog(`Agent starting bulk publish of ${ready.length} products...`);
    let successCount = 0;
    
    for (const p of ready) {
      const ok = await autoFixAndPublish(p);
      if (ok) successCount++;
    }

    addLog(`Agent task complete. Published ${successCount} products.`);
    setPublishing(false);
    fetchDrafts();
  };

  return (
    <AdminLayout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Ethnicaa Review Agent 🤖</h1>
          <p style={styles.subtitle}>Autonomous validator & publishing engine</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={styles.refreshBtn} onClick={fetchDrafts} disabled={loading || publishing}>Refresh</button>
          <button style={styles.trainBtn} onClick={trainAgent} disabled={training || publishing}>
            {training ? "🤖 Learning..." : "Train Agent"}
          </button>
          <button style={styles.bulkEditBtn} onClick={() => nav("/bulk-edit")}>Bulk Edit Catalog</button>
          <button 
            style={styles.publishAllBtn} 
            onClick={runAgent}
            disabled={publishing || drafts.length === 0}
          >
            {publishing ? "Agent Working..." : "Run Review Agent"}
          </button>
        </div>
      </div>

      <div style={styles.mainGrid}>
        <div style={styles.leftCol}>
          {!knowledge && (
            <div style={styles.knowledgeAlert}>
              <p>💡 <strong>Tip:</strong> Click <b>"Train Agent"</b> so the agent can learn your brand names and categories from existing products. This will make it much smarter!</p>
            </div>
          )}
          
          {loading ? (
            <div style={styles.loadingBox}>
              <div className="spinner"></div>
              <p>Agent is scanning product catalog...</p>
            </div>
          ) : drafts.length === 0 ? (
            <div style={styles.emptyState}>
              <h2>Catalog is Clean ✨</h2>
              <p>All products are currently published. No pending drafts to review.</p>
            </div>
          ) : (
            <div style={styles.productGrid}>
              {drafts.map(p => {
                const { isValid, issues, fixableIssues, smartData } = validateProduct(p);
                return (
                  <div key={p.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <img src={p.images?.[0] || "https://via.placeholder.com/100"} alt={p.name} style={styles.thumb} />
                      <div style={styles.info}>
                        <h3 style={styles.prodName}>{p.name || "Unnamed Product"}</h3>
                        <p style={styles.prodMeta}>
                          {p.brand || <span style={{ color: "#D4AF37" }}>{smartData.brand || "Missing Brand"}</span>} | 
                          { (p.categoryNames && p.categoryNames[0]) || <span style={{ color: "#D4AF37" }}>{smartData.category || "No Category"}</span>}
                        </p>
                        <p style={styles.price}>₹{p.price}</p>
                      </div>
                      <div style={styles.statusBadge(isValid)}>
                        {isValid ? "READY" : "BLOCKED"}
                      </div>
                    </div>

                    <div style={styles.issueBox}>
                      {!isValid && (
                        <div style={styles.errorList}>
                          {issues.map((iss, i) => <div key={i} style={styles.issueItem}>❌ {iss}</div>)}
                        </div>
                      )}
                      {fixableIssues.length > 0 && (
                        <div style={styles.fixableList}>
                          {fixableIssues.map((iss, i) => <div key={i} style={styles.fixableItem}>🔧 {iss}</div>)}
                        </div>
                      )}
                      {isValid && fixableIssues.length === 0 && (
                        <div style={styles.successMsg}>✅ Product data is perfectly valid.</div>
                      )}
                    </div>

                    <div style={styles.cardActions}>
                      <button style={styles.btnSecondary} onClick={() => nav(`/edit-product/${p.id}`)}>Edit Manually</button>
                      <button 
                        style={isValid ? styles.btnPrimary : styles.btnDisabled} 
                        disabled={!isValid || publishing}
                        onClick={() => autoFixAndPublish(p).then(fetchDrafts)}
                      >
                        Publish Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={styles.rightCol}>
          <div style={styles.logCard}>
            <h3 style={styles.logTitle}>Agent Activity Log</h3>
            <div style={styles.logBody}>
              {logs.length === 0 && <p style={{ color: "#444", fontSize: 13 }}>Waiting for agent activity...</p>}
              {logs.map((log, i) => (
                <div key={i} style={styles.logItem}>{log}</div>
              ))}
            </div>
          </div>

          <div style={styles.statsCard}>
            <h3 style={styles.logTitle}>Agent Knowledge</h3>
            <div style={styles.statRow}>
              <span>Known Brands:</span>
              <span style={{ color: "#fff", fontWeight: 700 }}>{knowledge?.brands?.length || 0}</span>
            </div>
            <div style={styles.statRow}>
              <span>Category Patterns:</span>
              <span style={{ color: "#fff", fontWeight: 700 }}>{knowledge?.categories?.length || 0}</span>
            </div>
            {knowledge && (
              <p style={{ fontSize: 10, color: "#444", marginTop: 10 }}>Last updated: {new Date(knowledge.updatedAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  title: { fontSize: 32, fontWeight: 800, color: "#D4AF37", margin: 0 },
  subtitle: { color: "#888", margin: "5px 0 0 0" },
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 350px", gap: 30 },
  leftCol: { display: "flex", flexDirection: "column", gap: 20 },
  rightCol: { display: "flex", flexDirection: "column", gap: 20 },
  
  publishAllBtn: { background: "#D4AF37", color: "#000", padding: "12px 24px", borderRadius: "12px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)" },
  refreshBtn: { background: "#222", color: "#fff", padding: "12px 20px", borderRadius: "12px", border: "1px solid #333", cursor: "pointer" },
  trainBtn: { background: "#1a1a1a", color: "#fff", padding: "12px 20px", borderRadius: "12px", border: "1px solid #444", cursor: "pointer", fontWeight: 600 },
  bulkEditBtn: { background: "#1a1a1a", color: "#D4AF37", padding: "12px 20px", borderRadius: "12px", border: "1px solid #D4AF37", cursor: "pointer", fontWeight: 600 },
  
  knowledgeAlert: { background: "rgba(212, 175, 55, 0.1)", border: "1px solid #D4AF3733", padding: "15px 20px", borderRadius: "16px", color: "#D4AF37", fontSize: 14 },
  loadingBox: { textAlign: "center", padding: 100, color: "#888" },
  emptyState: { textAlign: "center", padding: "80px 40px", background: "#111", borderRadius: "24px", border: "1px solid #222", color: "#888" },
  
  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100%, 1fr))", gap: 15 },
  card: { background: "#111", padding: 20, borderRadius: "20px", border: "1px solid #222", display: "flex", flexDirection: "column", gap: 15 },
  cardHeader: { display: "flex", gap: 20, alignItems: "center" },
  thumb: { width: 70, height: 90, objectFit: "cover", borderRadius: "10px", background: "#222" },
  info: { flex: 1 },
  prodName: { margin: 0, fontSize: 18, color: "#fff" },
  prodMeta: { margin: "4px 0", fontSize: 13, color: "#666" },
  price: { margin: 0, fontSize: 16, fontWeight: 700, color: "#D4AF37" },
  
  statusBadge: (isValid) => ({
    padding: "6px 12px", borderRadius: "8px", fontSize: 11, fontWeight: 800,
    background: isValid ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 82, 82, 0.1)",
    color: isValid ? "#4CAF50" : "#FF5252",
    border: `1px solid ${isValid ? "#4CAF5033" : "#FF525233"}`
  }),
  
  issueBox: { background: "#080808", padding: "12px 15px", borderRadius: "12px" },
  errorList: { display: "flex", flexDirection: "column", gap: 4 },
  issueItem: { fontSize: 13, color: "#FF5252" },
  fixableList: { marginTop: 8, display: "flex", flexDirection: "column", gap: 4 },
  fixableItem: { fontSize: 13, color: "#D4AF37" },
  successMsg: { fontSize: 13, color: "#4CAF50" },
  
  cardActions: { display: "flex", gap: 10, marginTop: "auto" },
  btnPrimary: { flex: 1, background: "#D4AF37", color: "#000", border: "none", padding: "10px", borderRadius: "10px", fontWeight: 700, cursor: "pointer" },
  btnSecondary: { flex: 1, background: "#222", color: "#fff", border: "1px solid #333", padding: "10px", borderRadius: "10px", cursor: "pointer" },
  btnDisabled: { flex: 1, background: "#1a1a1a", color: "#444", border: "none", padding: "10px", borderRadius: "10px", fontWeight: 700, cursor: "not-allowed" },
  
  logCard: { background: "#0b0b0b", border: "1px solid #222", borderRadius: "20px", padding: 20, display: "flex", flexDirection: "column", height: 400 },
  logTitle: { margin: "0 0 15px 0", fontSize: 16, color: "#D4AF37", fontWeight: 800 },
  logBody: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 5 },
  logItem: { fontSize: 12, color: "#888", fontFamily: "monospace", borderBottom: "1px solid #1a1a1a", paddingBottom: 4 },
  
  statsCard: { background: "#0b0b0b", border: "1px solid #222", borderRadius: "20px", padding: 20 },
  statRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1a1a1a", fontSize: 14, color: "#888" }
};
