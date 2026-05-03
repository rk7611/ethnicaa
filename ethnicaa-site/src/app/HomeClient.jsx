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
import BannerSlider from "@/components/BannerSlider";
import EnquireButton from "@/components/EnquireButton";
import Pagination from "@/components/Pagination";
import TrustBadges from "@/components/TrustBadges";
import FAQSchema from "@/components/FAQSchema";

import { blogs } from "@/lib/blog-data";
import { consolidateCategories } from "@/lib/category-utils";
import { isValidImageUrl, generateProductAlt } from "@/utils/imageUtils";
import { keywordPages } from "@/lib/keyword-content";
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
    <section>
      <h2>Ethnicaa: India’s #1 Surat Wholesale Marketplace for Resellers</h2>
      <p>Welcome to <strong>Ethnicaa Wholesale</strong>, the premier B2B platform connecting global fashion retailers and independent resellers directly with the manufacturing heart of India: <strong>Surat, Gujarat</strong>. In 2026, the ethnic wear market is more competitive than ever. To win, you don't just need products; you need a supply chain that provides factory-direct pricing, verified quality, and lightning-fast global logistics. Ethnicaa is that engine for your business.</p>
      
      <h3>The Surat Advantage: Why Source Directly from the Source?</h3>
      <p>Surat is the undisputed textile capital of India, producing over 40% of the country's man-made fiber. By sourcing directly from our Surat-based marketplace, you eliminate up to 4 layers of middlemen (wholesalers, regional distributors, agents, and sub-agents). This allows you to access the <strong>true factory cost</strong>, giving you a 30-50% price advantage over your local competitors.</p>
      
      <h3>Profit Blueprint: How Our Resellers Earn ₹50,000+ Monthly</h3>
      <p>We don't just sell catalogs; we enable entrepreneurship. Most of our resellers on platforms like Instagram, WhatsApp, and Facebook operate with a "High-Margin, Low-Inventory" model. Here is the Ethnicaa profit breakdown:</p>
      <ul>
        <li><strong>Daily Wear Kurtis:</strong> Sourcing at ₹250-₹450 -> Selling at ₹750-₹950 (100%+ Margin).</li>
        <li><strong>Pakistani Suits & Lawn Collections:</strong> Sourcing at ₹800-₹1200 -> Selling at ₹1800-₹2500 (80%+ Margin).</li>
        <li><strong>Premium Silk Sarees:</strong> Sourcing at ₹1500-₹3000 -> Selling at ₹4500+ (Premium Boutique Margins).</li>
      </ul>
      <p>By leveraging our professional photography and verified catalogs, you can start your reselling business from home with zero stock investment.</p>

      <h3>Global Shipping & Export Expertise (USA, UK, Canada, UAE)</h3>
      <p>Ethnicaa is a registered export-ready platform. We understand that our international clients in the <strong>USA, UK, Canada, Australia, and Malaysia</strong> require more than just low prices—they require reliability. We provide:</p>
      <ul>
        <li><strong>Express Doorstep Delivery:</strong> Via DHL, FedEx, and Aramex (5-7 business days global transit).</li>
        <li><strong>Customs Assistance:</strong> We handle the documentation and export compliance for bulk shipments.</li>
        <li><strong>Stitching Services:</strong> Professional customized tailoring for suits and blouses to make your products "Ready-to-Wear" for your end customers.</li>
      </ul>

      <h3>Our Minimum Order Quantity (MOQ) Policy</h3>
      <p>To maintain factory-direct rates, we primarily operate on a <strong>Set-to-Set basis</strong>. This means you buy one complete catalog (usually 4-12 designs or sizes). For established boutiques and bulk wholesalers, we offer custom <strong>Bulk Discounts</strong> on orders exceeding ₹50,000. Contact our WhatsApp managers for a personalized quote.</p>

      <h3>Surat Wholesale Market Guide 2026</h3>
      <p>Navigating the Surat textile market can be overwhelming. Ethnicaa simplifies this by curating only the top-performing brands from markets like <strong>RKTM (Radha Krishna Textile Market), Shree Om Market, and Millennium Market</strong>. We do the ground research so you don't have to, ensuring you only receive trending, high-demand inventory.</p>
    </section>

    <section style="margin-top: 40px; padding: 20px; background: #fff8f8; border-radius: 12px; border: 1px solid #ffdada;">
      <h2 style="color: #c62828;">🚨 Verified Supplier Notice</h2>
      <p>Ethnicaa is a GST-registered entity. All transactions are secure, and we provide official invoices for all bulk and export orders. Beware of unverified agents on social media; always source through a verified marketplace to ensure your capital is safe and your quality is guaranteed.</p>
    </section>

    <section style="margin-top: 40px;">
      <h3>Wholesale Product Categories</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <h4>Wholesale Kurtis in Surat</h4>
          <p>From daily wear cotton kurtis to heavy party wear Rayon and Silk tunics, our Kurti collection is the largest in Surat. We feature brands like Kiana, Kajal Style, and more.</p>
        </div>
        <div>
          <h4>Saree Manufacturers in Surat</h4>
          <p>Explore the world of Lichi Silk, Organza, Banarasi, and Georgette sarees. We source directly from the looms to provide the best bulk rates.</p>
        </div>
        <div>
          <h4>Pakistani Suits Wholesale India</h4>
          <p>The craze for Pakistani lawn and velvet suits is at an all-time high. We provide authentic replicas and designer-inspired collections from brands like Shree Fabs and Vinay Fashion.</p>
        </div>
        <div>
          <h4>Lehenga Choli Bulk Supplier</h4>
          <p>Stunning bridal and bridesmaid lehengas with heavy embroidery and sequence work, perfect for wedding season boutiques.</p>
        </div>
      </div>
    </section>
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

      <h1 style={styles.pageH1}>Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits</h1>

      {currentPage === 1 && <TrustBadges />}

      {currentPage === 1 && categories.length > 0 && (
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
