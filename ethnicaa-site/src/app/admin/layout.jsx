import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>Ethnicaa Admin</div>
        <nav style={styles.nav}>
          <Link href="/admin/partners" style={styles.navLink}>Partner Apps</Link>
          <Link href="/admin/stores" style={styles.navLink}>Reseller Sites</Link>
          <Link href="/admin/seo-agent" style={styles.navLink}>SEO Agent</Link>
          <div style={{ marginTop: "auto", padding: 20, fontSize: 12, color: "#666" }}>
            v2.0 Reseller Platform
          </div>
        </nav>
      </aside>
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#f4f7f6" },
  sidebar: { width: 260, background: "#fff", borderRight: "1px solid #e0e0e0", display: "flex", flexDirection: "column" },
  logo: { padding: "30px 20px", fontSize: 20, fontWeight: 800, color: "#d32f2f", borderBottom: "1px solid #f0f0f0" },
  nav: { display: "flex", flexDirection: "column", padding: 10, flex: 1 },
  navLink: { padding: "15px 20px", textDecoration: "none", color: "#444", fontWeight: 600, borderRadius: 10, marginBottom: 5, transition: "0.2s" },
  main: { flex: 1, padding: 40, overflowY: "auto" },
};
