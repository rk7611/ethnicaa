"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
        <div style={styles.logo}>Ethnicaa Wholesale</div>

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
    background: "#fff",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    borderBottom: "1px solid #eee",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
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
