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
import BannerSlider from "@/components/BannerSlider";
import EnquireButton from "@/components/EnquireButton";
import { blogs } from "@/lib/blog-data";
import TrustBadges from "@/components/TrustBadges";
import { isValidImageUrl } from "@/utils/imageUtils";

const PAGE_SIZE = 12;

/* ============================================================
    FETCH BANNERS
============================================================ */
async function getBanners() {
  const snap = await getDocs(
    query(collection(db, "banners"), orderBy("order", "asc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    imageURL: d.data().imageURL || "",
    link: d.data().link || "#",
    order: d.data().order || 0,
  }));
}

export default function HomePage({ initialBanners, initialCategories, initialProducts }) {
  const [loading, setLoading] = useState(!initialProducts);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const [products, setProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [banners, setBanners] = useState(initialBanners || []);

  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Initial load categories if not provided (fallback)
  useEffect(() => {
    if (initialCategories) return;
    async function loadCategories() {
      const catsSnap = await getDocs(collection(db, "categories"));
      const categoriesList = catsSnap.docs.map((d) => {
        const cat = d.data();
        return {
          slug: d.id,
          name: cat.name ?? d.id.replace(/-/g, " "),
          cover: isValidImageUrl(cat.cover) ? cat.cover : null,
          count: cat.count || 0,
        };
      });
      setCategories(categoriesList);
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

  // Initial load products or pagination
  useEffect(() => {
    if (initialProducts && products.length > 0) {
      return;
    }
    loadProducts(false);
  }, [initialProducts]);

  async function loadProducts(loadMore) {
    loadMore ? setLoadMoreLoading(true) : setLoading(true);
    let q = query(
      collection(db, "products"),
      where("status", "in", ["published", "active"]),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    );
    if (loadMore && lastDoc) {
      q = query(
        collection(db, "products"),
        where("status", "in", ["published", "active"]),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
    }
    const snap = await getDocs(q);
    if (snap.empty) {
      setHasMore(false);
      setLoading(false);
      setLoadMoreLoading(false);
      return;
    }
    const list = snap.docs.map((d) => {
      const data = d.data();
      const createdAt = data.createdAt?.seconds || data.updatedAt?.seconds || data.timestamp || 0;
      return { id: d.id, ...data, _order: createdAt };
    });
    list.sort((a, b) => b._order - a._order);
    setProducts((prev) => (loadMore ? [...prev, ...list] : list));
    setLastDoc(snap.docs[snap.docs.length - 1]);
    if (snap.docs.length < PAGE_SIZE) setHasMore(false);
    setLoading(false);
    setLoadMoreLoading(false);
  }

  const homepageSEOContent = `
    <h2>Wholesale Ethnic Wear at Best Prices — Ethnicaa</h2>
    <p>Ethnicaa Wholesale is India’s fastest-growing wholesale marketplace for Sarees, Kurtis, Pakistani Suits, Lehenga Choli, Gowns, and Salwar Suits.</p>
    <p>We provide direct factory access to the latest 2026 designs from Surat's top manufacturers, ensuring the best profit margins for your retail or resale business.</p>
  `;

  return (
    <div style={styles.container}>
      {/* Schemas handled in layout or page.jsx for SSR efficiency */}

      {banners.length > 0 && (
        <div style={{ marginBottom: 20, marginTop: 10 }}>
          <BannerSlider banners={banners} />
        </div>
      )}

      <TrustBadges />

      <h1 style={styles.pageH1}>Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits</h1>

      {categories.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.heading}>Shop by Category</h2>
          <div style={styles.categories}>
            {categories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="premium-card" style={styles.categoryCard}>
                {isValidImageUrl(c.cover) && (
                  <Image
                    src={c.cover}
                    alt={c.name + " Wholesale"}
                    width={300}
                    height={380}
                    quality={100}
                    style={styles.categoryImg}
                  />
                )}
                <div style={styles.categoryTitle}>{c.name}</div>
                <div style={styles.categoryCount}>{c.count} items</div>
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
                <div key={i} style={styles.skeletonCard}><div style={styles.skeletonImg}></div><div style={styles.skeletonText}></div></div>
                ))
            : products.map((p) => (
                <div key={p.id} className="premium-card" style={styles.card}>
                    <Link href={`/product/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={styles.imgContainer}>
                      {isValidImageUrl(p.images?.[0]) && (
                        <Image 
                          src={p.images[0]} 
                          alt={`${p.catalog || p.name} wholesale Surat manufacturer`} 
                          width={300} 
                          height={380} 
                          style={styles.cardImg} 
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

      {hasMore && !loading && (
        <button onClick={() => loadProducts(true)} style={styles.loadMoreBtn} disabled={loadMoreLoading}>
          {loadMoreLoading ? "Loading..." : "Load More Products"}
        </button>
      )}

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
  categories: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 },
  categoryCard: { background: "#fff", padding: 12, borderRadius: 16, textAlign: "center", textDecoration: "none", color: "#000", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  categoryImg: { width: "100%", height: "auto", borderRadius: 12, marginBottom: 8, aspectRatio: "4/5", objectFit: "cover" },
  categoryTitle: { fontWeight: 700, fontSize: 15 },
  categoryCount: { fontSize: 12, opacity: 0.6, marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 },
  card: { background: "#fff", borderRadius: 16, padding: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  cardImg: { width: "100%", height: "auto", borderRadius: 12, aspectRatio: "4/5", objectFit: "cover" },
  imgContainer: { position: "relative" },
  cardText: { marginTop: 10, textAlign: "center", fontWeight: 700, fontSize: 14 },
  price: { marginTop: 6, fontSize: 15, fontWeight: 800, textAlign: "center", color: "#D4AF37" },
  priceOffer: { fontSize: 15, fontWeight: 800, textAlign: "center", color: "#d32f2f" },
  originalPrice: { fontSize: 13, color: "#888", textDecoration: "line-through", fontWeight: 500 },
  badge: { position: "absolute", top: 8, left: 8, background: "#d32f2f", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: "bold", zIndex: 2 },
  loadMoreBtn: { margin: "30px auto", display: "block", padding: "12px 30px", borderRadius: 12, background: "#000", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" },
  seoBox: { marginTop: 40, padding: 25, background: "#f9f9f9", borderRadius: 16, lineHeight: 1.8 },
  skeletonCard: { background: "#eee", borderRadius: 16, padding: 12 },
  skeletonImg: { width: "100%", height: 200, background: "#ddd", borderRadius: 12 },
  skeletonText: { height: 14, marginTop: 12, background: "#ddd", borderRadius: 6 },
  testimonialSection: { marginTop: 50, marginBottom: 30 },
  testimonialHeading: { fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 30 },
  testimonialGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  testimonialCard: { background: "#fff", padding: 25, borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.04)" },
  testimonialText: { fontStyle: "italic", color: "#444", marginBottom: 15, fontSize: 15, lineHeight: 1.6 },
  testimonialAuthor: { color: "#000", fontSize: 15, fontWeight: 700 },
  stars: { color: "#FFD700", marginBottom: 10, fontSize: 14 },
  authorBox: { display: "flex", alignItems: "center", gap: 12, marginTop: 15 },
  avatar: { width: 40, height: 40, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#555" },
  authorLoc: { fontSize: 12, color: "#888", marginTop: 2 },
  blogGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  blogCard: { padding: 16, background: "#fff", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" },
  blogImageWrapper: { position: "relative", width: "100%", height: 180, marginBottom: 12 },
  blogTitle: { fontSize: 17, fontWeight: 700 },
};
