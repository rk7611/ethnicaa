import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import useMobile from "../hooks/useMobile";

export default function AdminLayout({ children }) {
  const isMobile = useMobile(1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Styles (Replacing @media)
  const sidebarContainerStyle = {
    ...styles.sidebarContainer,
    left: isMobile ? (isMobileMenuOpen ? 0 : "-100%") : 0,
    position: isMobile ? "fixed" : "relative",
    boxShadow: isMobile ? "10px 0 30px rgba(0,0,0,0.5)" : "none",
  };

  return (
    <div style={styles.wrapper}>
      {/* OVERLAY FOR MOBILE */}
      {isMobile && isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={styles.overlay}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <div style={sidebarContainerStyle}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      <div style={styles.main}>
        {/* MOBILE HEADER */}
        {isMobile && (
          <div style={styles.mobileHeader}>
            <button 
              style={styles.menuBtn}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              ☰
            </button>
            <span style={styles.mobileTitle}>ETHNICAA ADMIN</span>
          </div>
        )}

        <div style={styles.content}>
          <Navbar />
          <div style={styles.innerContent}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    background: "#000",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },
  sidebarContainer: {
    width: "260px",
    top: 0,
    bottom: 0,
    zIndex: 1000,
    transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "#0b0b0b",
    borderRight: "1px solid #1a1a1a",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(5px)",
    zIndex: 999,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  mobileHeader: {
    display: "flex",
    alignItems: "center",
    padding: "15px 20px",
    background: "#0b0b0b",
    borderBottom: "1px solid #1a1a1a",
  },
  menuBtn: {
    background: "none",
    border: "none",
    color: "#D4AF37",
    fontSize: 24,
    cursor: "pointer",
    marginRight: 15,
  },
  mobileTitle: {
    color: "#D4AF37",
    fontWeight: 900,
    letterSpacing: 2,
    fontSize: 14,
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  innerContent: {
    padding: "20px",
    maxWidth: "1400px",
    width: "100%",
    margin: "0 auto",
  }
};
