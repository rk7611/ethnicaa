"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
const BannerSlider = dynamic(() => import("@/components/BannerSlider"), { ssr: true });
const EnquireButton = dynamic(() => import("@/components/EnquireButton"), { ssr: false });
const Pagination = dynamic(() => import("@/components/Pagination"), { ssr: false });
const TrustBadges = dynamic(() => import("@/components/TrustBadges"), { ssr: false });
const FAQSchema = dynamic(() => import("@/components/FAQSchema"), { ssr: false });

import { blogs } from "@/lib/blog-data";
import { consolidateCategories } from "@/lib/category-utils";
import { isValidImageUrl, generateProductAlt } from "@/utils/imageUtils";
import InternalLinking from "@/components/InternalLinking";

/* ============================================================
    FETCH BANNERS
============================================================ */
async function getBanners() {
  const snap = await getDocs(
    query(collection(db, "banners"), orderBy("order", "asc"))
  );
  return snap.docs.map((d) => {
    const data = d.data();
    let link = data.link || "#";
    
    // Normalize localhost links to relative paths
    if (link.includes("localhost:3000")) {
      link = link.split("localhost:3000")[1] || "#";
    }

    return {
      id: d.id,
      imageURL: data.imageURL || "",
      link: link,
      order: data.order || 0,
    };
  });
}



export default function HomePage({ initialBanners, initialCategories, initialProducts, initialBrands, currentPage, totalPages }) {
  const [loading, setLoading] = useState(!initialProducts);

  const [products, setProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [banners, setBanners] = useState(initialBanners || []);
  const [brands, setBrands] = useState(initialBrands || []);

  // Sync state when server sends new data (pagination fix)
  useEffect(() => {
    if (initialProducts) setProducts(initialProducts);
    if (initialCategories) setCategories(initialCategories);
    if (initialBanners) setBanners(initialBanners);
    if (initialBrands) setBrands(initialBrands);
    setLoading(false);
  }, [initialProducts, initialCategories, initialBanners, initialBrands]);

  // Scroll to top on page change
  useEffect(() => {
    // Only scroll if we are deep into the page (above the products)
    if (window.scrollY > 500) {
        window.scrollTo({ top: 400, behavior: "smooth" });
    }
  }, [currentPage]);

  // Initial load categories if not provided (fallback)
  useEffect(() => {
    if (initialCategories) return;
    async function loadCategories() {
      const catsSnap = await getDocs(collection(db, "categories"));
      const rawCategories = catsSnap.docs.map((d) => {
        const cat = d.data();
        return {
          slug: d.id,
          name: cat.name ?? d.id.replace(/-/g, " "),
          cover: isValidImageUrl(cat.cover) ? cat.cover : null,
          count: cat.count || 0,
        };
      });
      setCategories(consolidateCategories(rawCategories));
    }
    loadCategories();
  }, [initialCategories]);

  // Initial load banners if not provided (fallback)
  useEffect(() => {
    if (initialBanners) return;
    getBanners().then(list => {
      setBanners(list.filter(b => isValidImageUrl(b.imageURL)));
    });
  }, [initialBanners]);

  const homepageSEOContent = `
    <h2>Surat Wholesale Market: Your Gateway to Direct Factory Prices — Ethnicaa</h2>
    <p>Ethnicaa Wholesale is India’s fastest-growing B2B marketplace, designed specifically for resellers and boutique owners looking to source the latest ethnic wear directly from the heart of the Surat textile market. We bridge the gap between global retailers and Surat's most prominent manufacturers, providing 100% verified catalogs of Kurtis, Sarees, Pakistani Suits, Lehenga Choli, Gowns, and Designer Salwar Suits.</p>
    
    <h3>Why Choose Ethnicaa for Your Wholesale Sourcing?</h3>
    <p>When you source from Ethnicaa, you are not just buying clothes; you are investing in a partnership that prioritizes your business growth. We understand the challenges of the reselling business, which is why we offer direct factory prices without any middleman commission. This ensures that you get the maximum possible profit margin on every piece you sell.</p>
    
    <ul>
      <li><strong>Direct from Manufacturers:</strong> We work with top-tier Surat manufacturers to bring you fresh stock every single day.</li>
      <li><strong>Verified Quality:</strong> Every catalog listed on our platform undergoes a quality check to ensure the fabric, embroidery, and stitching meet international standards.</li>
      <li><strong>Global Shipping Hub:</strong> We have a robust logistics network shipping daily to the USA, UK, Canada, Australia, Malaysia, and over 50 other countries.</li>
      <li><strong>Wholesale Support:</strong> Our dedicated wholesale managers are available on WhatsApp to help you with bulk enquiries, shipping estimates, and customs documentation.</li>
    </ul>

    <h3>Latest Collections in Kurtis, Sarees & Pakistani Suits</h3>
    <p>Our catalog is updated daily with the trending designs of 2026. Whether you are looking for cotton kurtis for daily wear, heavy bridal lehengas for the wedding season, or authentic Pakistani lawn suits for festive occasions, Ethnicaa has it all. We feature premium brands and designers known for their craftsmanship and innovation in ethnic fashion.</p>
    
    <p>For resellers in Mumbai, Delhi, Jaipur, and Kolkata, we provide a centralized platform to access the Surat market without the need for travel. You can browse, enquire, and order from the comfort of your home, saving time and operational costs.</p>
  `;

  const homeFaqs = [
    {
      question: "How do I buy wholesale from Ethnicaa?",
      answer: "Buying wholesale is easy! Browse our catalogs for Kurtis, Sarees, and Suits. Once you find a product you like, click the 'Enquire on WhatsApp' button to get live stock availability and the best bulk pricing direct from our Surat warehouse."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, Ethnicaa ships to over 50+ countries including USA, UK, Canada, Australia, and UAE. We use express shipping partners to ensure your wholesale orders reach you safely and quickly."
    },
    {
      question: "What is the minimum order quantity (MOQ)?",
      answer: "Most of our catalogs are available as full sets (one of each size/color in a design). For many items, we also support custom bulk orders. Contact our wholesale managers on WhatsApp for specific product MOQs."
    },
    {
      question: "Are these direct factory prices from Surat?",
      answer: "Absolutely. Ethnicaa is based in the heart of the Surat textile market. We work directly with manufacturers to bring you factory-direct rates, eliminating middlemen and helping you maximize your margins."
    }
  ];

  return (
    <div style={styles.container}>
      {/* Schemas handled in layout or page.jsx for SSR efficiency */}

      {/* 
        ============================================================
        BANNER SLIDER (Temporarily Disabled)
        To restore, simply uncomment the BannerSlider component below.
        ============================================================
      {banners.length > 0 && (
        <div style={{ marginBottom: 20, marginTop: 10 }}>
          <BannerSlider banners={banners} />
        </div>
      )}
      */}

      <TrustBadges />

      <h1 style={styles.pageH1}>Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits</h1>

      {categories.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.heading}>Shop by Category</h2>
          <div style={styles.categories}>
            {categories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="premium-card" style={styles.categoryCard}>
                <div style={styles.categoryTitle}>{c.name}</div>
                <div style={styles.categoryCount}>{c.count} items</div>
              </Link>
            ))}
          </div>
        </div>
      )}
 
      {brands.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.heading}>Shop by Brand</h2>
          <div style={styles.brandsGrid}>
            {brands.map((b) => (
              <Link key={b.slug} href={`/brands/${b.slug}`} className="premium-card" style={styles.brandCard}>
                <div style={styles.brandImgWrapper}>
                  <Image src={b.image} alt={b.name} fill sizes="100px" style={{ objectFit: "contain" }} />
                </div>
                <div style={styles.brandName}>{b.name}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h2 style={styles.heading}>Latest Arrivals</h2>
        <div style={styles.grid}>
            {loading && products.length === 0
            ? Array(12).fill(0).map((_, i) => (
                <div key={i} style={styles.skeletonCard}>
                  <div style={styles.skeletonImg}></div>
                  <div style={styles.skeletonText}></div>
                  <div style={{...styles.skeletonText, width: '60%', marginTop: 8}}></div>
                </div>
                ))
            : products.map((p) => (
                <div key={p.id} className="premium-card" style={styles.card}>
                    <Link href={`/product/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={styles.imgContainer}>
                      {isValidImageUrl(p.images?.[0]) && (
                        <Image 
                          src={p.images[0]} 
                          alt={generateProductAlt(p)} 
                          width={300} 
                          height={380} 
                          sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, 250px"
                          style={styles.cardImg} 
                          loading="lazy"
                        />
                      )}
                      {p.offer && p.discount_percent > 0 && (
                        <div style={styles.badge}>Save {p.discount_percent}%</div>
                      )}
                    </div>
                    <div style={styles.cardText}>{p.catalog || p.name}</div>
                    {p.offer && p.offer_price ? (
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                        <div style={styles.originalPrice}>₹ {p.price}</div>
                        <div style={styles.priceOffer}>₹ {p.offer_price}</div>
                      </div>
                    ) : (
                      <div style={styles.price}>₹ {p.price || 0} / pc</div>
                    )}
                    </Link>
                    <EnquireButton product={p} />
                </div>
                ))}
        </div>
      </div>

      <Pagination 
        totalPages={totalPages} 
        currentPage={currentPage} 
        basePath="/"
        searchParams={{}}
      />

      <div style={styles.section}>
        <h2 style={styles.heading}>From Our Blog</h2>
        <div style={styles.blogGrid}>
            {blogs.slice(0, 3).map((post) => (
            <div key={post.slug} className="premium-card" style={styles.blogCard}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={styles.blogImageWrapper}>
                  {isValidImageUrl(post.image) && (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover", borderRadius: 12 }}
                    />
                  )}
                </div>
                <h3 style={styles.blogTitle}>{post.title}</h3>
                </Link>
            </div>
            ))}
        </div>
      </div>

      <InternalLinking 
        links={[
          { href: "/collections/kurti-wholesale-surat", label: "Kurti Wholesale Surat" },
          { href: "/collections/saree-manufacturer-surat", label: "Saree Manufacturer Surat" },
          { href: "/collections/kurti-wholesaler-mumbai", label: "Mumbai Wholesale Market" },
          { href: "/collections/kurti-market-delhi", label: "Delhi Kurti Market" },
          { href: "/collections/jaipuri-kurtis-wholesale", label: "Jaipuri Kurtis" },
          { href: "/collections/wholesale-pakistani-suits", label: "Pakistani Suits" },
          { href: "/collections/best-kurti-wholesaler-surat", label: "Best Wholesalers" },
          { href: "/collections/wholesale-sarees-usa", label: "Export Sarees USA" },
        ]} 
      />

      <div style={styles.section}>
        <h2 style={styles.heading}>Frequently Asked Questions</h2>
        <div style={styles.faqGrid}>
          {homeFaqs.map((faq, i) => (
            <div key={i} style={styles.faqItem}>
              <h3 style={styles.faqQuestion}>{faq.question}</h3>
              <p style={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
        <FAQSchema faqs={homeFaqs} />
      </div>

      <div style={styles.seoBox}>
        <div dangerouslySetInnerHTML={{ __html: homepageSEOContent }} />
      </div>

      <div style={styles.testimonialSection}>
        <h2 style={styles.testimonialHeading}>What Our Resellers Say</h2>
        <div style={styles.testimonialGrid}>
          <div className="premium-card" style={styles.testimonialCard}>
            <div style={styles.stars}>★★★★★</div>
            <p style={styles.testimonialText}>&quot;Always brings the latest wholesale catalogs! My customers love the quality and fast shipping.&quot;</p>
            <div style={styles.authorBox}>
              <div style={styles.avatar}>R</div>
              <div>
                <strong style={styles.testimonialAuthor}>Riya Sharma</strong>
                <div style={styles.authorLoc}>Mumbai, Reseller</div>
              </div>
            </div>
          </div>
          <div className="premium-card" style={styles.testimonialCard}>
            <div style={styles.stars}>★★★★★</div>
            <p style={styles.testimonialText}>&quot;Best reseller margin and very fast dispatch perfectly packed. Ethnicaa is my primary source.&quot;</p>
            <div style={styles.authorBox}>
              <div style={styles.avatar}>A</div>
              <div>
                <strong style={styles.testimonialAuthor}>Ayesha Khan</strong>
                <div style={styles.authorLoc}>Delhi, Boutique Owner</div>
              </div>
            </div>
          </div>
          <div className="premium-card" style={styles.testimonialCard}>
            <div style={styles.stars}>★★★★★</div>
            <p style={styles.testimonialText}>&quot;I only order my Kurtis and Lehenga from Ethnicaa. Top notch fabric and genuine rates.&quot;</p>
            <div style={styles.authorBox}>
              <div style={styles.avatar}>P</div>
              <div>
                <strong style={styles.testimonialAuthor}>Pooja Patel</strong>
                <div style={styles.authorLoc}>Surat, Online Seller</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="https://wa.me/9586346332?text=Hi, I want to enquire about wholesale sarees" target="_blank" rel="noopener noreferrer" className="pulsing-whatsapp" aria-label="Chat on WhatsApp">💬</a>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: 12 },
  section: { marginBottom: 40 },
  heading: { fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#111" },
  pageH1: { fontSize: 26, fontWeight: 800, textAlign: "center", marginBottom: 30, marginTop: 10, color: "#000" },
  categories: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 },
  brandsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 12 },
  brandCard: { background: "#fff", padding: 12, borderRadius: 12, textAlign: "center", textDecoration: "none" },
  brandImgWrapper: { position: "relative", width: "100%", aspectRatio: "1/1", marginBottom: 8 },
  brandName: { fontSize: 13, fontWeight: 700, color: "#333" },
  brandName: { fontSize: 13, fontWeight: 700, color: "#333" },
  faqGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 },
  faqItem: { background: "#fff", padding: 20, borderRadius: 16, border: "1px solid #eee" },
  faqQuestion: { fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#000" },
  faqAnswer: { fontSize: 14, color: "#555", lineHeight: 1.6 },
  categoryCard: { 
    background: "#fff", 
    padding: "20px 10px", 
    borderRadius: 12, 
    textAlign: "center", 
    textDecoration: "none", 
    color: "#000", 
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 80
  },
  categoryTitle: { fontWeight: 700, fontSize: 16, color: "#333" },
  categoryCount: { fontSize: 13, color: "#777", marginTop: 4 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 },
  card: { background: "#fff", borderRadius: 16, padding: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  cardImg: { width: "100%", height: "auto", borderRadius: 12, aspectRatio: "4/5", objectFit: "cover" },
  imgContainer: { position: "relative" },
  cardText: { marginTop: 10, textAlign: "center", fontWeight: 700, fontSize: 14 },
  price: { marginTop: 6, fontSize: 15, fontWeight: 800, textAlign: "center", color: "#B8860B" },
  priceOffer: { fontSize: 15, fontWeight: 800, textAlign: "center", color: "#d32f2f" },
  originalPrice: { fontSize: 13, color: "#777", textDecoration: "line-through", fontWeight: 500 },
  badge: { position: "absolute", top: 8, left: 8, background: "#d32f2f", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: "bold", zIndex: 2 },
  loadMoreBtn: { margin: "30px auto", display: "block", padding: "12px 30px", borderRadius: 12, background: "#000", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" },
  seoBox: { marginTop: 40, padding: 25, background: "#f9f9f9", borderRadius: 16, lineHeight: 1.8 },
  skeletonCard: { background: "#eee", borderRadius: 16, padding: 12 },
  skeletonImg: { width: "100%", height: 200, background: "#ccc", borderRadius: 12 },
  skeletonText: { height: 14, marginTop: 12, background: "#ccc", borderRadius: 6 },
  testimonialSection: { marginTop: 50, marginBottom: 30 },
  testimonialHeading: { fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 30 },
  testimonialGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  testimonialCard: { background: "#fff", padding: 25, borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.04)" },
  testimonialText: { fontStyle: "italic", color: "#333", marginBottom: 15, fontSize: 15, lineHeight: 1.6 },
  testimonialAuthor: { color: "#000", fontSize: 15, fontWeight: 700 },
  stars: { color: "#FFD700", marginBottom: 10, fontSize: 14 },
  authorBox: { display: "flex", alignItems: "center", gap: 12, marginTop: 15 },
  avatar: { width: 40, height: 40, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#555" },
  authorLoc: { fontSize: 12, color: "#777", marginTop: 2 },
  blogGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  blogCard: { padding: 16, background: "#fff", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" },
  blogImageWrapper: { position: "relative", width: "100%", height: 180, marginBottom: 12 },
  blogTitle: { fontSize: 17, fontWeight: 700 },
};
