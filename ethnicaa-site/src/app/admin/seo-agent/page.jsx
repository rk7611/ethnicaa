"use client";

import { useState, useEffect, useRef } from "react";
import { 
  collection, 
  query, 
  where, 
  limit, 
  getDocs, 
  updateDoc, 
  doc,
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const AGENT_VERSION = "2.0.0 (Production)";

// ─── Score a product for SEO issues ──────────────────────────────────────────
function auditProduct(product) {
  const issues = [];
  let score = 100;

  if (!product.description || product.description.length < 150) {
    issues.push({ type: "description", label: "Missing/thin description", severity: "high" });
    score -= 30;
  }
  if (!product.images || product.images.length === 0) {
    issues.push({ type: "images", label: "Missing images", severity: "high" });
    score -= 20;
  }
  if (!product.seo_title || product.seo_title.length < 30) {
    issues.push({ type: "metaTitle", label: "Non-optimized title", severity: "medium" });
    score -= 20;
  }
  if (!product.categories || product.categories.length === 0) {
    issues.push({ type: "categories", label: "Missing categories", severity: "medium" });
    score -= 20;
  }
  if (!product.seo_optimized) {
    issues.push({ type: "optimized", label: "Never AI optimized", severity: "low" });
    score -= 10;
  }

  return { issues, score: Math.max(0, score) };
}

// ─── Severity color helper ────────────────────────────────────────────────────
function severityColor(s) {
  if (s === "high") return "#E24B4A";
  if (s === "medium") return "#EF9F27";
  return "#639922";
}

function scoreColor(s) {
  if (s >= 80) return "#1D9E75";
  if (s >= 50) return "#BA7517";
  return "#E24B4A";
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EthnicaaSEOAgent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [runningAll, setRunningAll] = useState(false);
  const [log, setLog] = useState([]);
  const [stats, setStats] = useState({ processed: 0, fixed: 0, errors: 0 });
  const logRef = useRef(null);

  // 1. FETCH REAL PRODUCTS FROM FIRESTORE
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const q = query(
          collection(db, "products"), 
          orderBy("createdAt", "desc"),
          limit(100)
        );
        const snap = await getDocs(q);
        const rawProducts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        setProducts(rawProducts.map(p => ({
          ...p,
          audit: auditProduct(p),
          status: "pending",
          generated: null,
          applied: false,
        })));
      } catch (err) {
        addLog(`✗ Error fetching products: ${err.message}`, "error");
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const addLog = (msg, type = "info") => {
    const time = new Date().toLocaleTimeString("en-IN");
    setLog(prev => [...prev, { msg, type, time }]);
    setTimeout(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 50);
  };

  const needsWork = products.filter(p => p.audit.issues.length > 0);
  const avgScore = products.length > 0 
    ? Math.round(products.reduce((a, p) => a + p.audit.score, 0) / products.length) 
    : 0;

  // 2. PROCESS VIA SECURE API ROUTE
  const processProduct = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: "processing" } : p));
    addLog(`AI Scanning: ${product.name}...`, "info");

    try {
      const response = await fetch("/api/seo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || `Request failed with ${response.status}`);
      }
      if (result.error) throw new Error(result.error);

      setProducts(prev => prev.map(p => {
        if (p.id !== productId) return p;
        return {
          ...p,
          status: "done",
          generated: result,
        };
      }));
      setStats(prev => ({ ...prev, processed: prev.processed + 1 }));
      addLog(`✓ AI Optimization generated for: ${product.name}`, "success");
    } catch (err) {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: "error" } : p));
      setStats(prev => ({ ...prev, errors: prev.errors + 1 }));
      addLog(`✗ AI Error on ${product.name}: ${err.message}`, "error");
    }
  };

  // 3. APPLY TO REAL FIRESTORE
  const applyContent = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.generated) return;

    addLog(`Updating Firestore: ${product.name}...`, "info");
    
    try {
      const docRef = doc(db, "products", productId);
      const updates = {
        description: product.generated.productDescription,
        seo_title: product.generated.metaTitle,
        seo_description: product.generated.metaDescription,
        seo_alt: product.generated.altText,
        seo_optimized: true,
        last_seo_update: new Date(),
        seo_keywords: product.generated.keywordsTargeted.join(", ")
      };

      await updateDoc(docRef, updates);

      setProducts(prev => prev.map(p => {
        if (p.id !== productId) return p;
        return {
          ...p,
          applied: true,
          audit: { issues: [], score: 95 },
        };
      }));
      setStats(prev => ({ ...prev, fixed: prev.fixed + 1 }));
      addLog(`✓ Product updated in database: ${productId}`, "success");
    } catch (err) {
      addLog(`✗ Firestore Update Error: ${err.message}`, "error");
    }
  };

  const runAllAgent = async () => {
    setRunningAll(true);
    setActiveTab("log");
    addLog("=== Ethnicaa SEO Agent started (Production Mode) ===", "system");
    
    const target = products.filter(p => p.status === "pending" && p.audit.score < 80);
    addLog(`Found ${target.length} products with low SEO scores`, "info");

    for (const product of target) {
      await processProduct(product.id);
      await new Promise(r => setTimeout(r, 1000)); // Rate limit safety
    }

    addLog("=== Agent run complete ===", "system");
    setRunningAll(false);
  };

  const productsByCategory = products.reduce((acc, p) => {
    const cat = p.categoryNames?.[0] || p.category || "Unknown";
    acc[cat] = acc[cat] || [];
    acc[cat].push(p);
    return acc;
  }, {});

  // ── Styles (Same as Claude but with brand colors) ───────────────────────────
  const styles = {
    root: {
      fontFamily: "inherit",
      background: "#0A0A0F",
      minHeight: "100vh",
      color: "#E8E6DF",
      padding: "0",
    },
    header: {
      background: "#0D0D14",
      borderBottom: "1px solid #1E1E2E",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    logoMark: {
      width: "32px",
      height: "32px",
      background: "linear-gradient(135deg, #C9A96E, #8B6914)",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: "700",
      color: "#0A0A0F",
    },
    logoText: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#E8E6DF",
      letterSpacing: "0.08em",
    },
    logoSub: {
      fontSize: "10px",
      color: "#666",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    },
    statusPill: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "#111118",
      border: "1px solid #1E1E2E",
      borderRadius: "20px",
      padding: "5px 12px",
      fontSize: "11px",
      color: "#888",
    },
    statusDot: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: runningAll ? "#EF9F27" : "#1D9E75",
      boxShadow: runningAll ? "0 0 6px #EF9F27" : "0 0 6px #1D9E75",
    },
    nav: {
      display: "flex",
      gap: "2px",
      padding: "12px 24px 0",
      borderBottom: "1px solid #1E1E2E",
    },
    navBtn: (active) => ({
      background: active ? "#16161F" : "transparent",
      border: "none",
      borderBottom: active ? "2px solid #C9A96E" : "2px solid transparent",
      color: active ? "#C9A96E" : "#555",
      padding: "8px 16px",
      fontSize: "12px",
      fontFamily: "inherit",
      letterSpacing: "0.06em",
      cursor: "pointer",
      transition: "all 0.15s",
      textTransform: "uppercase",
    }),
    body: {
      padding: "24px",
      maxWidth: "1100px",
      margin: "0 auto",
    },
    statGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "10px",
      marginBottom: "24px",
    },
    statCard: {
      background: "#0D0D14",
      border: "1px solid #1E1E2E",
      borderRadius: "8px",
      padding: "14px 16px",
    },
    statLabel: {
      fontSize: "10px",
      color: "#555",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      margin: "0 0 6px",
    },
    statVal: (color) => ({
      fontSize: "24px",
      fontWeight: "600",
      color: color || "#E8E6DF",
      margin: "0",
      fontVariantNumeric: "tabular-nums",
    }),
    runBtn: {
      background: runningAll ? "#1E1E2E" : "linear-gradient(135deg, #C9A96E, #8B6914)",
      border: "none",
      borderRadius: "8px",
      color: runningAll ? "#555" : "#0A0A0F",
      padding: "10px 20px",
      fontSize: "12px",
      fontFamily: "inherit",
      fontWeight: "600",
      letterSpacing: "0.08em",
      cursor: runningAll ? "not-allowed" : "pointer",
      textTransform: "uppercase",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    productRow: (status) => ({
      background: "#0D0D14",
      border: `1px solid ${status === "done" ? "#1D9E75" : status === "error" ? "#E24B4A" : status === "processing" ? "#EF9F27" : "#1E1E2E"}`,
      borderRadius: "8px",
      padding: "14px 16px",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      cursor: "pointer",
      transition: "border-color 0.15s",
    }),
    scoreCircle: (score) => ({
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      border: `2px solid ${scoreColor(score)}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
      fontWeight: "600",
      color: scoreColor(score),
      flexShrink: "0",
    }),
    issuePill: (severity) => ({
      display: "inline-block",
      fontSize: "10px",
      padding: "2px 7px",
      borderRadius: "20px",
      border: `1px solid ${severityColor(severity)}33`,
      color: severityColor(severity),
      background: `${severityColor(severity)}11`,
      marginRight: "4px",
      marginBottom: "2px",
    }),
    actionBtn: (variant) => ({
      background: variant === "primary" ? "#C9A96E22" : "#111118",
      border: `1px solid ${variant === "primary" ? "#C9A96E" : "#2E2E3E"}`,
      borderRadius: "6px",
      color: variant === "primary" ? "#C9A96E" : "#888",
      padding: "6px 12px",
      fontSize: "11px",
      fontFamily: "inherit",
      cursor: "pointer",
      letterSpacing: "0.05em",
      transition: "all 0.15s",
      textTransform: "uppercase",
    }),
    modal: {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "1000",
      padding: "20px",
    },
    modalBox: {
      background: "#0D0D14",
      border: "1px solid #2E2E3E",
      borderRadius: "12px",
      padding: "24px",
      width: "100%",
      maxWidth: "680px",
      maxHeight: "85vh",
      overflowY: "auto",
    },
    fieldBox: {
      background: "#07070D",
      border: "1px solid #1E1E2E",
      borderRadius: "6px",
      padding: "12px 14px",
      fontSize: "12px",
      color: "#C8C5BE",
      lineHeight: "1.6",
      marginBottom: "12px",
      whiteSpace: "pre-wrap"
    },
    fieldLabel: {
      fontSize: "10px",
      color: "#555",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom: "6px",
    },
    logBox: {
      background: "#07070D",
      border: "1px solid #1E1E2E",
      borderRadius: "8px",
      padding: "16px",
      height: "400px",
      overflowY: "auto",
      fontFamily: "monospace",
      fontSize: "12px",
      lineHeight: "1.7",
    },
    logLine: (type) => ({
      color: type === "success" ? "#1D9E75" : type === "error" ? "#E24B4A" : type === "system" ? "#C9A96E" : "#666",
      marginBottom: "2px",
    }),
  };

  if (loading) return <div style={{ background: "#0A0A0F", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A96E" }}>SYSTEM_LOADING...</div>;

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>E</div>
          <div>
            <div style={styles.logoText}>ETHNICAA</div>
            <div style={styles.logoSub}>SEO Agent v{AGENT_VERSION}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={styles.statusPill}>
            <div style={styles.statusDot} />
            {runningAll ? "Processing Queue..." : "System Idle"}
          </div>
          <button style={styles.runBtn} onClick={runAllAgent} disabled={runningAll}>
            {runningAll ? "⟳ Queuing..." : "▶ Start Optimization"}
          </button>
        </div>
      </div>

      {/* Nav */}
      <div style={styles.nav}>
        {["dashboard", "products", "log"].map(tab => (
          <button key={tab} style={styles.navBtn(activeTab === tab)} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div style={styles.body}>

        {activeTab === "dashboard" && (
          <div>
            <div style={styles.statGrid}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Products in catalog</p>
                <p style={styles.statVal()}>{ products.length }</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Critical SEO issues</p>
                <p style={styles.statVal("#E24B4A")}>{ needsWork.filter(p => !p.applied).length }</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Database updates</p>
                <p style={styles.statVal("#1D9E75")}>{ stats.fixed }</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Avg health score</p>
                <p style={styles.statVal(scoreColor(avgScore))}>{ avgScore }%</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
              {Object.entries(productsByCategory).map(([cat, prods]) => (
                <div key={cat} style={{ background: "#0D0D14", border: "1px solid #1E1E2E", borderRadius: "8px", padding: "14px" }}>
                   <p style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", margin: "0 0 4px" }}>{cat}</p>
                   <p style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>{prods.length} <span style={{ fontSize: "11px", fontWeight: "400", color: "#666" }}>SKUs</span></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            {products.map(product => (
              <div
                key={product.id}
                style={styles.productRow(product.applied ? "done" : product.status)}
                onClick={() => setSelectedProduct(product)}
              >
                <div style={styles.scoreCircle(product.audit.score)}>
                  {product.audit.score}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 3px", color: "#E8E6DF" }}>{product.catalog || product.name}</p>
                  <div>
                    {product.applied ? (
                      <span style={styles.issuePill("low")}>✓ Database Synced</span>
                    ) : (
                      product.audit.issues.map((issue, i) => (
                        <span key={i} style={styles.issuePill(issue.severity)}>{issue.label}</span>
                      ))
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {!product.applied && product.status === "pending" && (
                    <button style={styles.actionBtn("default")} onClick={e => { e.stopPropagation(); processProduct(product.id); }}>Analyze</button>
                  )}
                  {product.status === "done" && !product.applied && (
                    <button style={styles.actionBtn("primary")} onClick={e => { e.stopPropagation(); applyContent(product.id); }}>Update DB</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "log" && (
          <div style={styles.logBox} ref={logRef}>
            {log.map((entry, i) => (
              <div key={i} style={styles.logLine(entry.type)}>
                <span style={{ color: "#333", marginRight: "8px" }}>[{entry.time}]</span>
                {entry.msg}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <div style={styles.modal} onClick={() => setSelectedProduct(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
             <h2 style={{ fontSize: "18px", margin: "0 0 20px" }}>{selectedProduct.catalog || selectedProduct.name}</h2>
             
             {selectedProduct.generated ? (
               <div>
                  <p style={styles.fieldLabel}>AI Generated Description</p>
                  <div style={styles.fieldBox}>{selectedProduct.generated.productDescription}</div>
                  
                  <p style={styles.fieldLabel}>Keywords Targeted</p>
                  <p style={{ fontSize: "12px", color: "#C9A96E", marginBottom: 20 }}>{selectedProduct.generated.keywordsTargeted.join(", ")}</p>

                  <button 
                    style={{ ...styles.runBtn, width: "100%", justifyContent: "center" }}
                    onClick={() => applyContent(selectedProduct.id)}
                  >
                    Save Changes to Firebase
                  </button>
               </div>
             ) : (
               <p style={{ color: "#666" }}>Waiting for analysis...</p>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
