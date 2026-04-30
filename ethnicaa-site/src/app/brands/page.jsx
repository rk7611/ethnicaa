import { brandsData } from "@/lib/brands-data";
import Link from "next/link";

export const metadata = {
  title: "Shop by Brand | Wholesale Ethnic Wear Brands | Ethnicaa",
  description: "Browse all major wholesale ethnic wear brands including Bela, Bansi, Laxmipati, and more. Direct factory prices for retailers and boutiques.",
};

export default function BrandsDirectoryPage() {
  const brands = Object.values(brandsData);

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Our Wholesale Brands</h1>
      <p style={styles.subtitle}>Direct Factory Supply from India's Top Ethnic Wear Manufacturers</p>
      
      <div style={styles.grid}>
        {brands.map((brand) => (
          <Link key={brand.slug} href={`/brands/${brand.slug}`} style={styles.card}>
            <div style={styles.brandName}>{brand.name}</div>
            <div style={styles.viewLink}>View Collection →</div>
          </Link>
        ))}
      </div>

      <div style={styles.infoSection}>
        <h2>Don't see your favorite brand?</h2>
        <p>We work with over 500+ manufacturers in Surat and Jaipur. If you are looking for a specific brand that is not listed here, contact us on WhatsApp.</p>
        <a href="https://wa.me/9586346332" style={styles.waBtn}>Inquire on WhatsApp</a>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: "60px 20px" },
  h1: { fontSize: "36px", fontWeight: "800", textAlign: "center", marginBottom: "10px" },
  subtitle: { textAlign: "center", color: "#666", marginBottom: "50px", fontSize: "18px" },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
    gap: "30px" 
  },
  card: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center",
    padding: "40px 20px", 
    borderRadius: "20px", 
    background: "#fff", 
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    textDecoration: "none",
    color: "#000",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    border: "1px solid #eee",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
    }
  },
  brandName: { fontSize: "24px", fontWeight: "700", marginBottom: "15px" },
  viewLink: { color: "#B8860B", fontWeight: "600", fontSize: "14px" },
  infoSection: { 
    marginTop: "80px", 
    textAlign: "center", 
    background: "#f9f9f9", 
    padding: "50px", 
    borderRadius: "30px" 
  },
  waBtn: { 
    display: "inline-block", 
    marginTop: "20px", 
    background: "#25D366", 
    color: "#fff", 
    padding: "12px 35px", 
    borderRadius: "50px", 
    textDecoration: "none", 
    fontWeight: "700" 
  }
};
