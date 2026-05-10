"use client";
import { useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function PartnerApplicationPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    
    try {
      await addDoc(collection(db, "partner_applications"), {
        businessName: formData.get("businessName"),
        whatsapp: formData.get("whatsapp"),
        status: formData.get("status"),
        message: formData.get("message"),
        stage: "Application Received",
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
    } catch (err) {
      alert("Error submitting application. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h1 style={{ fontSize: 40 }}>Application Received! 🚀</h1>
        <p style={{ fontSize: 18, color: "#666", marginTop: 20 }}>Our team is reviewing your business profile. You will receive a WhatsApp message once your ecommerce website is ready for design.</p>
        <Link href="/" style={{ display: "inline-block", marginTop: 40, color: "#d32f2f", fontWeight: 700 }}>Return to Home</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={styles.badge}>Exclusive Opportunity</span>
        <h1 style={styles.h1}>Launch Your Branded Fashion Business in 24 Hours</h1>
        <p style={styles.sub}>We don&apos;t just provide inventory. We provide the <strong>entire digital infrastructure</strong> for your fashion brand.</p>
      </header>

      <section style={styles.valueGrid}>
        <div style={styles.vCard}>
          <div style={styles.icon}>🌐</div>
          <h3>Branded Website</h3>
          <p>Get a professional, mobile-responsive storefront under your own business name (e.g., <strong>yourname.ethnicaa.com</strong>).</p>
        </div>
        <div style={styles.vCard}>
          <div style={styles.icon}>📦</div>
          <h3>Live Inventory</h3>
          <p>Your website comes pre-loaded with our latest catalogs. No manual product uploading required.</p>
        </div>
        <div style={styles.vCard}>
          <div style={styles.icon}>💬</div>
          <h3>Direct WhatsApp Sales</h3>
          <p>Every inquiry from your website goes directly to <strong>your WhatsApp number</strong>, not ours.</p>
        </div>
        <div style={styles.vCard}>
          <div style={styles.icon}>⚙️</div>
          <h3>Managed Tech</h3>
          <p>We handle the hosting, security, and updates. You focus 100% on marketing and customer service.</p>
        </div>
      </section>

      <section style={styles.formSection}>
        <div style={styles.formCard}>
          <h2>Apply for Partner Approval</h2>
          <p style={{ color: "#666", marginBottom: 30 }}>Our team reviews every application to ensure business quality and location exclusivity.</p>
          
          <form style={styles.form} onSubmit={handleSubmit}>
             <div style={styles.inputGroup}>
                <label>Proposed Business/Store Name *</label>
                <input name="businessName" type="text" placeholder="e.g. Zara Boutique" style={styles.input} required />
             </div>
             <div style={styles.inputGroup}>
                <label>Your WhatsApp Number (For Inquiries) *</label>
                <input name="whatsapp" type="tel" placeholder="+91" style={styles.input} required />
             </div>
             <div style={styles.inputGroup}>
                <label>Current Business Status</label>
                <select name="status" style={styles.input}>
                   <option>Existing Retailer</option>
                   <option>Home-Based Reseller</option>
                   <option>New Startup</option>
                   <option>Social Media Influencer</option>
                </select>
             </div>
             <div style={styles.inputGroup}>
                <label>Why do you want to partner with Ethnicaa? *</label>
                <textarea name="message" style={{...styles.input, height: 100}} placeholder="Tell us about your customer base and growth plans..." required></textarea>
             </div>
             <button type="submit" style={styles.btn} disabled={loading}>
                {loading ? "Submitting..." : "Submit Application for Review"}
             </button>
          </form>
          <p style={{ textAlign: "center", fontSize: 13, color: "#999", marginTop: 20 }}>
            By submitting, you agree to Ethnicaa&apos;s Partner Terms & Conditions.
          </p>
        </div>
      </section>

      <section style={styles.statusFlow}>
        <h2>How Your Website Goes Live</h2>
        <div style={styles.flowGrid}>
           <div style={styles.flowItem}><span>1</span><p>Submit App</p></div>
           <div style={styles.flowItem}><span>2</span><p>Admin Review</p></div>
           <div style={styles.flowItem}><span>3</span><p>Branding Design</p></div>
           <div style={styles.flowItem}><span>4</span><p>Demo Link</p></div>
           <div style={{ ...styles.flowItem, color: "#d32f2f", fontWeight: 700 }}><span>5</span><p>Site Live!</p></div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: "60px 20px" },
  header: { textAlign: "center", marginBottom: 60 },
  badge: { background: "#d32f2f", color: "#fff", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 },
  h1: { fontSize: 44, fontWeight: 800, marginTop: 20, marginBottom: 15 },
  sub: { fontSize: 20, color: "#555", maxWidth: 800, margin: "0 auto" },
  valueGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 30, marginBottom: 80 },
  vCard: { padding: 30, background: "#fff", borderRadius: 24, border: "1px solid #eee", textAlign: "center" },
  icon: { fontSize: 40, marginBottom: 15 },
  formSection: { background: "#f8f9fa", padding: "80px 20px", borderRadius: 40 },
  formCard: { maxWidth: 600, margin: "0 auto", background: "#fff", padding: 40, borderRadius: 30, boxShadow: "0 20px 50px rgba(0,0,0,0.05)" },
  inputGroup: { marginBottom: 20 },
  input: { width: "100%", padding: "14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 16, marginTop: 8 },
  btn: { width: "100%", background: "#000", color: "#fff", padding: "18px", borderRadius: 12, fontSize: 18, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 20 },
  statusFlow: { marginTop: 100, textAlign: "center" },
  flowGrid: { display: "flex", justifyContent: "center", gap: 40, marginTop: 40, flexWrap: "wrap" },
  flowItem: { textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" },
};
