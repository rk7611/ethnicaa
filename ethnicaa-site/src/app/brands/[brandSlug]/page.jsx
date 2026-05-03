import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { brandsData } from "@/lib/brands-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import EnquireButton from "@/components/EnquireButton";
import FAQSchema from "@/components/FAQSchema";
import { cleanTitle } from "@/lib/metadata-utils";

export async function generateMetadata({ params }) {
  const brand = brandsData[params.brandSlug];
  if (!brand) return {};

  return {
    title: cleanTitle(brand.title || `${brand.name} Wholesale | Latest 2026 Collections`),
    description: brand.description,
    alternates: {
      canonical: `https://ethnicaa.com/brands/${params.brandSlug}`,
    },
  };
}

export default async function BrandLandingPage({ params }) {
  const brand = brandsData[params.brandSlug];
  if (!brand) return notFound();

  // Try to fetch products by brand name
  // Note: Firestore queries are case-sensitive. 
  // We'll try both lowercase and uppercase if needed, but for now we'll match the 'brand' field.
  let products = [];
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef, 
      where("brand", "==", brand.name.toUpperCase()), // Try uppercase first as seen in inspection
      limit(12)
    );
    const querySnapshot = await getDocs(q);
    products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // If still empty, try exact name from config
    if (products.length === 0) {
      const q2 = query(productsRef, where("brand", "==", brand.name), limit(12));
      const querySnapshot2 = await getDocs(q2);
      products = querySnapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    
    // If still empty, try lowercase
    if (products.length === 0) {
        const q3 = query(productsRef, where("brand", "==", brand.name.toLowerCase()), limit(12));
        const querySnapshot3 = await getDocs(q3);
        products = querySnapshot3.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
  } catch (error) {
    console.error("Firestore error:", error);
  }

  return (
    <div style={styles.container}>
      {/* Brand Header */}
      <div style={styles.brandHeader}>
        <h1 style={styles.h1}>{brand.name} Wholesale</h1>
        <p style={styles.tagline}>{brand.tagline}</p>
      </div>

      {/* Product Section */}
      <div style={styles.productSection}>
        <h2 style={styles.sectionHeading}>Latest {brand.name} Products</h2>
        
        {products.length > 0 ? (
          <div style={styles.grid}>
            {products.map((p) => (
              <div key={p.id} style={styles.card}>
                <Link href={`/product/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={styles.imgWrapper}>
                    <Image 
                      src={p.images?.[0] || "/logo.png"} 
                      alt={p.name} 
                      fill 
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: "cover", borderRadius: 12 }}
                    />
                  </div>
                  <div style={styles.cardContent}>
                    <div style={styles.cardTitle}>{p.catalog || p.name}</div>
                    <div style={styles.price}>₹ {p.price} / pc</div>
                  </div>
                </Link>
                <EnquireButton product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noProductsBox}>
            <p>We are currently updating the online catalog for <strong>{brand.name}</strong>.</p>
            <p style={{marginBottom: '20px'}}>New arrivals for {brand.name} are coming in daily. Inquire on WhatsApp to see the latest live catalogs and price lists.</p>
            <a href={`https://wa.me/9586346332?text=I%20am%20interested%20in%20latest%20${brand.name}%20wholesale%20collection`} style={styles.waBtnLarge}>
               Inquire about {brand.name} on WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* SEO Content Section */}
      <div style={styles.contentSection}>
        <div dangerouslySetInnerHTML={{ __html: brand.seoContent }} />
      </div>

      {/* FAQ Section */}
      {brand.faqs && (
        <div style={styles.faqSection}>
          <h2 style={styles.sectionHeading}>Frequently Asked Questions</h2>
          {brand.faqs.map((faq, i) => (
            <div key={i} style={styles.faqItem}>
              <h3 style={styles.faqQuestion}>{faq.question}</h3>
              <p style={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
          <FAQSchema faqs={brand.faqs} />
        </div>
      )}

      {/* Footer CTA */}
      <div style={styles.footerCTA}>
        <h2>Scale Your Business with {brand.name}</h2>
        <p>Get direct factory rates and express shipping for all bulk orders.</p>
        <a href="https://wa.me/9586346332" style={styles.waBtnFooter}>Contact Wholesale Manager</a>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1100, margin: "0 auto", padding: "40px 20px" },
  brandHeader: { textAlign: "center", marginBottom: "60px", padding: "40px", background: "#fcfcfc", borderRadius: "30px", border: "1px solid #f0f0f0" },
  h1: { fontSize: "42px", fontWeight: "900", marginBottom: "10px", color: "#000" },
  tagline: { fontSize: "18px", color: "#B8860B", fontWeight: "600", letterSpacing: "1px" },
  productSection: { marginBottom: "80px" },
  sectionHeading: { fontSize: "28px", fontWeight: "800", marginBottom: "30px", borderLeft: "5px solid #B8860B", paddingLeft: "20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "25px" },
  card: { background: "#fff", borderRadius: "20px", padding: "15px", boxShadow: "0 5px 20px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0" },
  imgWrapper: { position: "relative", width: "100%", aspectRatio: "3/4", marginBottom: "15px" },
  cardContent: { textAlign: "center", marginBottom: "15px" },
  cardTitle: { fontWeight: "700", fontSize: "16px", marginBottom: "5px", color: "#333" },
  price: { color: "#B8860B", fontWeight: "800", fontSize: "17px" },
  noProductsBox: { textAlign: "center", padding: "60px 20px", background: "#fff9f0", borderRadius: "30px", border: "1px dashed #ffcc80" },
  waBtnLarge: { display: "inline-block", background: "#25D366", color: "#fff", padding: "15px 40px", borderRadius: "50px", textDecoration: "none", fontWeight: "700", fontSize: "18px" },
  contentSection: { lineHeight: "1.9", fontSize: "17px", color: "#444", marginBottom: "80px", background: "#fff", padding: "40px", borderRadius: "30px", boxShadow: "0 5px 30px rgba(0,0,0,0.02)" },
  faqSection: { marginBottom: "80px" },
  faqItem: { marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid #f0f0f0" },
  faqQuestion: { fontSize: "20px", fontWeight: "700", marginBottom: "12px", color: "#222" },
  faqAnswer: { color: "#555", fontSize: "16px" },
  footerCTA: { textAlign: "center", background: "#000", color: "#fff", padding: "60px", borderRadius: "40px" },
  waBtnFooter: { display: "inline-block", marginTop: "25px", background: "#25D366", color: "#fff", padding: "14px 40px", borderRadius: "50px", textDecoration: "none", fontWeight: "700" },
};
