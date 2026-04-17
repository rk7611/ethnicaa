"use client";

import React from "react";

const badges = [
  { icon: "🏢", label: "Direct Factory", sub: "Surat Manufacturer" },
  { icon: "✅", label: "Quality Check", sub: "Verified Catalogs" },
  { icon: "🚀", label: "Fast Shipping", sub: "Dispatch in 24-48h" },
  { icon: "🔒", label: "Secure B2B", sub: "Trusted Payments" },
];

export default function TrustBadges() {
  return (
    <div style={styles.container}>
      {badges.map((b, i) => (
        <div key={i} style={styles.badge} className="premium-card">
          <div style={styles.icon}>{b.icon}</div>
          <div>
            <div style={styles.label}>{b.label}</div>
            <div style={styles.subText}>{b.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: 12,
    margin: "20px 0",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    padding: "12px 14px",
    borderRadius: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    gap: 10,
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },
  subText: {
    fontSize: 10,
    color: "#888",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.2px",
  },
};
