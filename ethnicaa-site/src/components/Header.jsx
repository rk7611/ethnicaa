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
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={styles.logo}>Ethnicaa Wholesale</div>
        </Link>

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
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
  },

  logo: {
    fontWeight: 700,
    fontSize: 20,
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

  /* MOBILE OVERRIDES */
  "@media (max-width: 600px)": {
    header: {
      flexDirection: "column",
      alignItems: "stretch",
      padding: 12,
      gap: 8,
    },
    searchForm: {
      width: "100%",
      marginLeft: 0,
    },
    logo: {
      fontSize: 18,
      textAlign: "center",
    },
  },
};
