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
const BannerSlider = dynamic(() => import("@/components/BannerSlider"), { ssr: false });
const Pagination = dynamic(() => import("@/components/Pagination"), { ssr: true });

import { blogs } from "@/lib/blog-data";
import { consolidateCategories } from "@/lib/category-utils";
import { isValidImageUrl, generateProductAlt } from "@/utils/imageUtils";
import { keywordPages } from "@/lib/keyword-content";

// Lazy load below-the-fold components to improve LCP/FCP
const InternalLinking = dynamic(() => import("@/components/InternalLinking"), { ssr: false });
const TrustBadges = dynamic(() => import("@/components/TrustBadges"), { ssr: true });
const EnquireButton = dynamic(() => import("@/components/EnquireButton"), { ssr: false });

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



export default function HomePage({ initialBanners, initialCategories, initialProducts, initialBrands, homeFaqs = [], currentPage, totalPages, children }) {
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

      <h1 style={styles.pageH1} className="lcp-heading">
        {currentPage > 1
          ? `Page ${currentPage} — Wholesale Ethnic Wear & Boutique Sourcing Partner`
          : "Ethnicaa Wholesale: Surat Manufacturer & Ecommerce Partner for Boutique Owners"}
      </h1>

      {currentPage === 1 && (
        <div style={{ minHeight: 140 }}>
          <TrustBadges />
        </div>
      )}

      {currentPage === 1 && categories.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.heading}>Shop by Category</h2>
          <div style={styles.categories}>
            {categories.map((c) => (
              <Link key={c.slug} href={c.href || `/category/${c.slug}`} className="premium-card" style={styles.categoryCard}>
                <div style={styles.categoryTitle}>{c.name}</div>
                <div style={styles.categoryCount}>{c.count} items</div>
              </Link>
            ))}
          </div>
        </div>
      )}
 


      {currentPage === 1 && (
        <section style={styles.partnerCTA}>
          <div style={styles.partnerOverlay}>
            <h2 style={styles.partnerHeading}>Start Your Own Fashion Business</h2>
            <p style={styles.partnerSub}>Get a professionally branded, mobile-ready website powered by Ethnicaa inventory. We handle the technology; you handle the brand.</p>
            <Link href="/become-a-partner" style={styles.partnerBtn}>Become a Partner</Link>
          </div>
        </section>
      )}

      {/* Wholesale Hub removed as requested */}

      <div style={styles.section}>
        <h2 style={styles.heading}>Latest Arrivals</h2>
        <div style={styles.grid}>
            {loading && products.length === 0
            ? Array(30).fill(0).map((_, i) => (
                <div key={i} style={styles.skeletonCard}>
                  <div style={styles.skeletonImg}></div>
                  <div style={styles.skeletonText}></div>
                  <div style={{...styles.skeletonText, width: '60%', marginTop: 8}}></div>
                </div>
                ))
            : products.map((p, index) => (
                <div key={p.id} className="premium-card" style={styles.card}>
                    <Link href={`/product/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={styles.imgContainer}>
                      {(index < 10 || isValidImageUrl(p.images?.[0])) && (
                        <Image 
                          src={p.images[0] || "/logo.png"} 
                          alt={generateProductAlt(p)} 
                          width={300} 
                          height={380} 
                          sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, 250px"
                          style={styles.cardImg} 
                          priority={index < 10}
                          fetchPriority={index < 10 ? "high" : "auto"}
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

      {currentPage === 1 && brands.length > 0 && (
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

      <div style={{ minHeight: 350 }}>
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
      </div>

      <div style={styles.section}>
        <h2 style={styles.heading}>Frequently Asked Questions</h2>
        <div style={styles.faqGrid}>
          <div style={styles.faqItem}>
             <h3 style={styles.faqQuestion}>Does Ethnicaa provide website support?</h3>
             <p style={styles.faqAnswer}>Yes, approved buyers and reseller partners may receive branded ecommerce website support from Ethnicaa to scale their business online.</p>
          </div>
          <div style={styles.faqItem}>
             <h3 style={styles.faqQuestion}>Can I start an online boutique with Ethnicaa?</h3>
             <p style={styles.faqAnswer}>Ethnicaa helps approved partners launch and grow their online clothing business through wholesale supply and professional ecommerce infrastructure.</p>
          </div>
          <div style={styles.faqItem}>
             <h3 style={styles.faqQuestion}>Is Ethnicaa a direct manufacturer?</h3>
             <p style={styles.faqAnswer}>Yes, we are a Surat-based manufacturer providing wholesale fashion infrastructure to boutiques and retailers across India and 50+ countries.</p>
          </div>
          {homeFaqs.map((faq, i) => (
            <div key={i} style={styles.faqItem}>
              <h3 style={styles.faqQuestion}>{faq.question}</h3>
              <p style={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {children}

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
  cardImg: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" },
  imgContainer: { position: "relative", width: "100%", aspectRatio: "300 / 380", background: "#f9f9f9", borderRadius: 12, overflow: "hidden" },
  cardText: { marginTop: 10, textAlign: "center", fontWeight: 700, fontSize: 14 },
  price: { marginTop: 6, fontSize: 15, fontWeight: 800, textAlign: "center", color: "#B8860B" },
  priceOffer: { fontSize: 15, fontWeight: 800, textAlign: "center", color: "#d32f2f" },
  originalPrice: { fontSize: 13, color: "#777", textDecoration: "line-through", fontWeight: 500 },
  badge: { position: "absolute", top: 8, left: 8, background: "#d32f2f", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: "bold", zIndex: 2 },
  loadMoreBtn: { margin: "30px auto", display: "block", padding: "12px 30px", borderRadius: 12, background: "#000", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" },
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
  partnerCTA: { 
    background: "linear-gradient(135deg, #000 0%, #333 100%)", 
    borderRadius: 30, 
    padding: "60px 20px", 
    marginBottom: 50, 
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
  },
  partnerOverlay: { maxWidth: 700, margin: "0 auto" },
  partnerHeading: { color: "#fff", fontSize: 28, fontWeight: 800, marginBottom: 15 },
  partnerSub: { color: "#ccc", fontSize: 16, lineHeight: 1.6, marginBottom: 30 },
  partnerBtn: { 
    display: "inline-block", 
    background: "#fff", 
    color: "#000", 
    padding: "15px 40px", 
    borderRadius: 15, 
    textDecoration: "none", 
    fontWeight: 800, 
    fontSize: 16,
    transition: "0.2s"
  }
};
