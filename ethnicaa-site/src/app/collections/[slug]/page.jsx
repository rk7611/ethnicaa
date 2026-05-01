import { db } from "@/lib/firebase";
import { collection, query, getDocs, limit } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { keywordPages } from "@/lib/keyword-content";
import FAQSchema from "@/components/FAQSchema";
import InternalLinking from "@/components/InternalLinking";
import EnquireButton from "@/components/EnquireButton";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const page = keywordPages[params.slug];
  if (!page) return {};

  return {
    title: page.title,
    description: page.meta,
    alternates: {
      canonical: `https://ethnicaa.com/collections/${params.slug}`,
    },
  };
}

export default async function KeywordLandingPage({ params }) {
  const page = keywordPages[params.slug];
  if (!page) return notFound();

  // Fetch relevant products based on the slug/keyword
  let products = [];
  try {
    // Attempt to filter by keyword or category inferred from slug
    const isSaree = params.slug.includes("saree");
    const isKurti = params.slug.includes("kurti");
    const isSuit = params.slug.includes("suit") || params.slug.includes("material");
    
    let q;
    if (isSaree) q = query(collection(db, "products"), where("category", "==", "sarees"), limit(12));
    else if (isKurti) q = query(collection(db, "products"), where("category", "==", "kurtis"), limit(12));
    else if (isSuit) q = query(collection(db, "products"), where("category", "==", "pakistani-suits"), limit(12));
    else q = query(collection(db, "products"), limit(12));

    const productsSnap = await getDocs(q);
    products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Fallback if no category matches
    if (products.length === 0) {
      const fallbackSnap = await getDocs(query(collection(db, "products"), limit(12)));
      products = fallbackSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.error("Product fetch error:", err);
  }

  const internalLinks = Object.keys(keywordPages)
    .filter(slug => slug !== params.slug)
    .map(slug => ({
      href: `/collections/${slug}`,
      label: keywordPages[slug].targetKeyword.toUpperCase(),
    }));

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>{page.h1}</h1>
      
      <div style={styles.introBox}>
        <p style={styles.intro}>{page.intro}</p>
      </div>

      <div style={styles.productSection}>
        <h2 style={styles.sectionHeading}>Latest {page.targetKeyword} Collection</h2>
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
      </div>

      <div style={styles.contentSection} dangerouslySetInnerHTML={{ __html: page.content }} />

      <div style={styles.faqSection}>
        <h2 style={styles.sectionHeading}>Frequently Asked Questions</h2>
        {page.faqs.map((faq, i) => (
          <div key={i} style={styles.faqItem}>
            <h3 style={styles.faqQuestion}>{faq.question}</h3>
            <p style={styles.faqAnswer}>{faq.answer}</p>
          </div>
        ))}
      </div>

      <FAQSchema faqs={page.faqs} />
      <InternalLinking links={internalLinks} />

      <div style={styles.footerCTA}>
        <h2>Start Your Wholesale Business Today</h2>
        <p>Contact Ethnicaa for bulk enquiries and direct factory shipping.</p>
        <a href="https://wa.me/9586346332" style={styles.ctaBtn}>Chat on WhatsApp</a>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1000, margin: "0 auto", padding: "40px 20px" },
  h1: { fontSize: 32, fontWeight: 800, marginBottom: 25, textAlign: "center", color: "#000" },
  introBox: { background: "#f9f9f9", padding: 25, borderRadius: 16, marginBottom: 40, lineHeight: 1.8 },
  intro: { fontSize: 17, color: "#444" },
  productSection: { marginBottom: 60 },
  sectionHeading: { fontSize: 24, fontWeight: 700, marginBottom: 25, borderLeft: "4px solid #000", paddingLeft: 15 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 20 },
  card: { background: "#fff", borderRadius: 16, padding: 12, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" },
  imgWrapper: { position: "relative", width: "100%", aspectRatio: "3/4", marginBottom: 12 },
  cardContent: { textAlign: "center" },
  cardTitle: { fontWeight: 700, fontSize: 15, marginBottom: 5 },
  price: { color: "#B8860B", fontWeight: 800 },
  contentSection: { lineHeight: 1.9, fontSize: 16, color: "#333", marginBottom: 60 },
  faqSection: { marginBottom: 60 },
  faqItem: { marginBottom: 25, paddingBottom: 20, borderBottom: "1px solid #eee" },
  faqQuestion: { fontSize: 18, fontWeight: 700, marginBottom: 10 },
  faqAnswer: { color: "#555" },
  footerCTA: { textAlign: "center", background: "#000", color: "#fff", padding: 50, borderRadius: 24 },
  ctaBtn: { display: "inline-block", marginTop: 20, background: "#25D366", color: "#fff", padding: "12px 30px", borderRadius: 50, textDecoration: "none", fontWeight: 700 },
};
