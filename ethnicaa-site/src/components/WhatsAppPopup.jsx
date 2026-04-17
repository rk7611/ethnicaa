"use client";

import { useState, useEffect } from "react";

export default function WhatsAppPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 1. Check if user already dismissed the popup
    const isDismissed = localStorage.getItem("ethnicaa_wa_popup_dismissed");
    if (isDismissed) return;

    // 2. Trigger after 15 seconds
    const timer = setTimeout(() => {
      setShow(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("ethnicaa_wa_popup_dismissed", "true");
  };

  const subscribe = () => {
    const message = encodeURIComponent("Hi Ethnicaa, I want to subscribe to daily wholesale catalogues and new arrival updates. Please add me.");
    window.open(`https://wa.me/9586346332?text=${message}`, "_blank");
    dismiss();
  };

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div className="premium-card" style={styles.modal}>
        <button onClick={dismiss} style={styles.closeBtn}>✕</button>
        
        <div style={styles.icon}>🔔</div>
        
        <h2 style={styles.title}>Never Miss a New Catalog!</h2>
        <p style={styles.text}>
          Get the latest **Surat Wholesale** arrivals, daily price lists, and exclusive offers directly on your WhatsApp.
        </p>
        
        <button onClick={subscribe} style={styles.btn}>
          Subscribe on WhatsApp
        </button>
        
        <p style={styles.footer}>Join 5,000+ resellers already receiving updates.</p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
    padding: 20,
  },
  modal: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: 24,
    maxWidth: 400,
    width: "100%",
    position: "relative",
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  },
  closeBtn: {
    position: "absolute",
    top: 15,
    right: 15,
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#999",
  },
  icon: {
    fontSize: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    color: "#111",
  },
  text: {
    fontSize: 16,
    color: "#555",
    lineHeight: 1.6,
    marginBottom: 25,
  },
  btn: {
    background: "#25D366",
    color: "#fff",
    border: "none",
    padding: "16px 24px",
    borderRadius: 12,
    fontSize: 18,
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 4px 15px rgba(37, 211, 102, 0.4)",
    transition: "transform 0.2s",
  },
  footer: {
    marginTop: 15,
    fontSize: 12,
    color: "#999",
  }
};
