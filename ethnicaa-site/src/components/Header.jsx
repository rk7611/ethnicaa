"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search?keyword=${encodeURIComponent(search.trim())}`);
  }

  return (
    <>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={styles.logo}>Ethnicaa Wholesale</div>
          </Link>
          <Link href="/offers" style={styles.offerLink}>
            🔥 Offers
          </Link>
        </div>

        <form onSubmit={handleSubmit} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </form>
      </header>

      {/* Spacer to prevent content hiding behind sticky header */}
      <div style={{ height: 70 }}></div>
    </>
  );
}

const styles = {
  header: {
    position: "fixed",
    top: 0,
    width: "100%",
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  logo: {
    fontWeight: 700,
    fontSize: 20,
    whiteSpace: "nowrap",
    color: "#000",
  },

  offerLink: {
    fontWeight: 800,
    fontSize: 15,
    color: "#c62828",
    textDecoration: "none",
    background: "rgba(198, 40, 40, 0.08)",
    padding: "6px 12px",
    borderRadius: 20,
    whiteSpace: "nowrap",
  },
  funnelLinks: {
    display: "flex",
    gap: 15,
    marginLeft: 15,
  },
  navLink: {
    fontSize: 13,
    fontWeight: 600,
    color: "#555",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },

  searchForm: {
    flex: 1,
    marginLeft: 12,
  },

  searchInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },

};
