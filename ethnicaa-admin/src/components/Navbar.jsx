import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { logout } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <div style={styles.nav}>
      <div style={styles.title}>Ethnicaa Admin</div>
      
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input 
          style={styles.searchInput}
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" style={styles.searchBtn}>🔍</button>
      </form>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  nav: {
    height: "60px",
    background: "#111",
    borderBottom: "1px solid #222",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  title: {
    color: "#D4AF37",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  logout: {
    background: "#D4AF37",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  searchForm: { display: "flex", flex: 1, maxWidth: "400px", margin: "0 20px", background: "#1a1a1a", borderRadius: "8px", border: "1px solid #333", overflow: "hidden" },
  searchInput: { flex: 1, background: "none", border: "none", padding: "8px 12px", color: "#fff", outline: "none", fontSize: "14px" },
  searchBtn: { background: "none", border: "none", cursor: "pointer", padding: "0 10px", color: "#888" },
};
