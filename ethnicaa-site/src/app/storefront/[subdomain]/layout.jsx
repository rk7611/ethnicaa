import { getStoreBySubdomain } from "@/lib/store-utils";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function StorefrontLayout({ children, params }) {
  const subdomain = params.subdomain;
  const store = await getStoreBySubdomain(subdomain);

  if (!store) {
    return notFound();
  }

  const primaryColor = store.primaryColor || "#d32f2f";

  return (
    <div style={{...styles.container, "--primary": primaryColor}}>
      <header style={styles.header}>
        <Link href="/" style={styles.logoLink}>
           <div style={styles.logo}>{store.businessName}</div>
        </Link>
        <div style={styles.contact}>
           <a href={`https://wa.me/${store.whatsappNumber}`} style={styles.waBtn}>Inquire on WhatsApp</a>
        </div>
      </header>
      
      <main style={styles.main}>
        {children}
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2026 {store.businessName}. All Rights Reserved.</p>
        <p style={{ fontSize: 12, color: "#888", marginTop: 10 }}>Powered by Ethnicaa Technology Ecosystem</p>
      </footer>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#fff", fontFamily: "Inter, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid #eee", background: "#fff", position: "sticky", top: 0, zIndex: 100 },
  logoLink: { textDecoration: "none" },
  logo: { fontSize: 24, fontWeight: 800, color: "var(--primary)" },
  waBtn: { background: "#25D366", color: "#fff", padding: "10px 20px", borderRadius: 30, textDecoration: "none", fontWeight: 700, fontSize: 14 },
  main: { minHeight: "70vh" },
  footer: { textAlign: "center", padding: "60px 20px", background: "#f9f9f9", marginTop: 60, borderTop: "1px solid #eee" }
};
