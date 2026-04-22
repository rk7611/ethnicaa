import { Link, useLocation } from "react-router-dom";
import useMobile from "../hooks/useMobile";

export default function Sidebar({ onClose }) {
  const loc = useLocation();
  const isMobile = useMobile(1024);

  const isActive = (path) => loc.pathname === path;

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <h2 style={styles.brand}>ETHNICAA</h2>
        {isMobile && (
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        )}
      </div>

      <nav style={styles.menu}>
        <Link to="/" style={isActive("/") ? styles.activeLink : styles.link} onClick={onClose}>
          Dashboard
        </Link>
        <Link to="/products" style={isActive("/products") ? styles.activeLink : styles.link} onClick={onClose}>
          All Products
        </Link>
        <Link to="/add-product" style={isActive("/add-product") ? styles.activeLink : styles.link} onClick={onClose}>
          Add New Product
        </Link>
        <Link to="/review-agent" style={isActive("/review-agent") ? styles.activeLink : styles.link} onClick={onClose}>
          Review Agent
        </Link>
        <Link to="/bulk-edit" style={isActive("/bulk-edit") ? styles.activeLink : styles.link} onClick={onClose}>
          Bulk Edit
        </Link>
        <Link to="/Banners" style={isActive("/Banners") ? styles.activeLink : styles.link} onClick={onClose}>
          Banners & Promotions
        </Link>
        <Link to="/profile" style={isActive("/profile") ? styles.activeLink : styles.link} onClick={onClose}>
          Store Profile
        </Link>
      </nav>

      <div style={styles.footer}>
        <p style={styles.version}>v1.2.0 Production</p>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    height: "100%",
    background: "#0b0b0b",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  brand: {
    color: "#D4AF37",
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: "3px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#444",
    fontSize: 24,
    cursor: "pointer",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },
  link: {
    color: "#888",
    textDecoration: "none",
    fontSize: "15px",
    padding: "12px 15px",
    borderRadius: "10px",
    transition: "all 0.2s",
  },
  activeLink: {
    color: "#fff",
    background: "#1a1a1a",
    textDecoration: "none",
    fontSize: "15px",
    padding: "12px 15px",
    borderRadius: "10px",
    fontWeight: 700,
    borderLeft: "4px solid #D4AF37",
  },
  footer: {
    marginTop: "auto",
    paddingTop: "20px",
    borderTop: "1px solid #222",
  },
  version: {
    color: "#444",
    fontSize: 12,
    margin: 0,
  }
};
