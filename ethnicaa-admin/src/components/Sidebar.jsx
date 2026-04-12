import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.brand}>ETHNICAA</h2>

      <nav style={styles.menu}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/add-product" style={styles.link}>Add Product</Link>
        <Link to="/profile" style={styles.link}>Profile Manager</Link>
		<Link to="/Banners">Banners</Link>
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    background: "#0b0b0b",
    borderRight: "1px solid #222",
    minHeight: "100vh",
    padding: "20px",
  },
  brand: {
    color: "#D4AF37",
    marginBottom: "30px",
    letterSpacing: "2px",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "15px",
    opacity: 0.85,
  },
};
