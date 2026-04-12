import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <div style={styles.nav}>
      <div style={styles.title}>Ethnicaa Admin</div>
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
};
