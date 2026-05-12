"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search?keyword=${encodeURIComponent(search.trim())}`);
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Hamburger Menu Icon */}
          <button 
            onClick={toggleMenu} 
            style={styles.menuBtn}
            aria-label="Toggle Menu"
          >
            ☰
          </button>

          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={styles.logo}>Ethnicaa</div>
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, justifyContent: "flex-end" }}>
          <form onSubmit={handleSubmit} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </form>

          <Link href="/offers" style={styles.offerLink} className="mobile-hide">
            🔥 Offers
          </Link>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer */}
      {isMenuOpen && (
        <div style={styles.overlay} onClick={toggleMenu}>
          <div 
            style={styles.sidebar} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.sidebarHeader}>
              <div style={styles.logo}>Navigation</div>
              <button onClick={toggleMenu} style={styles.closeBtn}>×</button>
            </div>
            
            <nav style={styles.navStack}>
              <Link href="/" style={styles.sidebarLink} onClick={toggleMenu}>🏠 Home</Link>
              <Link href="/offers" style={styles.sidebarLink} onClick={toggleMenu}>🔥 Hot Offers</Link>
              <Link href="/faq" style={styles.sidebarLink} onClick={toggleMenu}>❓ FAQ & Support</Link>
              <Link href="/become-a-partner" style={styles.sidebarLink} onClick={toggleMenu}>🤝 Become a Partner</Link>
              
              <div style={styles.sidebarDivider}>Sourcing Categories</div>
              <Link href="/category/sarees" style={styles.sidebarLink} onClick={toggleMenu}>Sarees Wholesale</Link>
              <Link href="/category/kurtis" style={styles.sidebarLink} onClick={toggleMenu}>Kurtis Wholesale</Link>
              <Link href="/category/pakistani-suits" style={styles.sidebarLink} onClick={toggleMenu}>Pakistani Suits</Link>
              <Link href="/category/lehenga-choli" style={styles.sidebarLink} onClick={toggleMenu}>Lehenga Choli</Link>
            </nav>

            <div style={styles.sidebarFooter}>
              <p style={{ fontSize: 12, color: "#777" }}>Surat&apos;s #1 Wholesale B2B Marketplace</p>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content hiding behind sticky header */}
      <div style={{ height: 65 }}></div>
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
    fontWeight: 800,
    fontSize: 22,
    whiteSpace: "nowrap",
    color: "#000",
    letterSpacing: "-0.5px",
  },

  menuBtn: {
    background: "none",
    border: "none",
    fontSize: 24,
    cursor: "pointer",
    padding: "4px 8px",
    color: "#000",
    display: "flex",
    alignItems: "center",
  },

  offerLink: {
    fontWeight: 800,
    fontSize: 14,
    color: "#c62828",
    textDecoration: "none",
    background: "rgba(198, 40, 40, 0.08)",
    padding: "8px 14px",
    borderRadius: 25,
    whiteSpace: "nowrap",
  },

  searchForm: {
    maxWidth: 300,
    width: "100%",
  },

  searchInput: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 20,
    border: "1px solid #eee",
    fontSize: 14,
    background: "#f5f5f5",
    outline: "none",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    zIndex: 1001,
    backdropFilter: "blur(4px)",
  },

  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "80%",
    maxWidth: 300,
    height: "100%",
    background: "#fff",
    boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    animation: "slideIn 0.3s ease-out",
  },

  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: "1px solid #eee",
  },

  closeBtn: {
    background: "none",
    border: "none",
    fontSize: 32,
    cursor: "pointer",
    color: "#777",
  },

  navStack: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    flex: 1,
  },

  sidebarLink: {
    fontSize: 16,
    fontWeight: 600,
    color: "#333",
    textDecoration: "none",
    padding: "12px 0",
    borderBottom: "1px solid #f9f9f9",
  },

  sidebarDivider: {
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#999",
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: "1px",
  },

  sidebarFooter: {
    marginTop: "auto",
    paddingTop: 20,
    borderTop: "1px solid #eee",
    textAlign: "center",
  }
};
