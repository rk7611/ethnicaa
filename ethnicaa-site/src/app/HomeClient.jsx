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

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);

  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  /* ============================================================
      LOAD BANNERS
  ============================================================= */
  useEffect(() => {
    getBanners().then(setBanners);
  }, []);
  /* ============================================================
      LOAD CATEGORIES + APPLY SEO
  ============================================================= */
  useEffect(() => {
    async function loadCategories() {
      const catsSnap = await getDocs(collection(db, "categories"));
      const categoriesList = catsSnap.docs.map((d) => ({
        slug: d.id,
        ...d.data(),
      }));

      const proSnap = await getDocs(
        query(
          collection(db, "products"),
          where("status", "in", ["published", "active"]),
          orderBy("createdAt", "desc")
        )
      );

      const allProducts = proSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const result = categoriesList.map((cat) => {
  const catSlug = cat.slug.toLowerCase();
  const catName = (cat.name || "").toLowerCase();
  
  const matched = allProducts.filter((p) => {
    // Safely convert to string
    const prodCat = String(p.category || "").toLowerCase();
    
    return prodCat === catSlug || 
           prodCat === catName ||
           prodCat.includes(catSlug);
  });

  

        return {
          slug: cat.slug,
          name: cat.name ?? cat.slug.replace(/-/g, " "),
          cover: matched[0]?.images?.[0] || null,
          count: matched.length,
        };
      });

      setCategories(result);
    }

    loadCategories();
  }, []);

  /* ============================================================
      LOAD PRODUCTS (LATEST)
  ============================================================= */
  useEffect(() => {
    loadProducts(false);
  }, []);

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
      const createdAt =
        data.createdAt?.seconds ||
        data.updatedAt?.seconds ||
        data.timestamp ||
        0;

      return {
        id: d.id,
        ...data,
        _order: createdAt,
      };
    });

    list.sort((a, b) => b._order - a._order);

    setProducts((prev) => (loadMore ? [...prev, ...list] : list));
    setLastDoc(snap.docs[snap.docs.length - 1]);

    if (snap.docs.length < PAGE_SIZE) setHasMore(false);

    setLoading(false);
    setLoadMoreLoading(false);
  }

  /* ============================================================
      JSON-LD SCHEMAS
  ============================================================= */

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ethnicaa Wholesale",
    url: "https://ethnicaa.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ethnicaa.com/search?keyword={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ethnicaa Wholesale",
    url: "https://ethnicaa.com",
    logo: "https://ethnicaa.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9586346332",
      contactType: "sales",
    },
    sameAs: [
      "https://www.facebook.com",
      "https://www.instagram.com",
    ],
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do you offer wholesale prices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all products on Ethnicaa are available at wholesale prices with bulk order benefits.",
        },
      },
      {
        "@type": "Question",
        name: "How often do you add new catalogs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We add new catalogs daily across sarees, Kurtis, salwar suits, lehengas, gowns, and Pakistani suits.",
        },
      },
      {
        "@type": "Question",
        name: "Can I buy a single piece?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We deal only in wholesale. Minimum quantity varies per catalog.",
        },
      },
      {
        "@type": "Question",
        name: "Do you ship internationally?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we ship globally with reliable logistics partners.",
        },
      },
      {
        "@type": "Question",
        name: "How to place order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Click on the Enquire button on any product and message us directly on WhatsApp to place your order.",
        },
      },
    ],
  };

  /* ============================================================
      ITEMLIST SCHEMA (LATEST 12 PRODUCTS)
  ============================================================= */
  const itemListSchema =
    products.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.slice(0, 12).map((p, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: p.name || p.catalog,
            url: `https://ethnicaa.com/product/${p.slug}`,
          })),
        }
      : null;
  /* ============================================================
      HOMEPAGE SEO CONTENT (VISIBLE)
  ============================================================= */
  const homepageSEOContent = `
    <h2>Wholesale Ethnic Wear at Best Prices — Ethnicaa</h2>
    <p>
      Ethnicaa Wholesale is India’s fastest-growing wholesale marketplace for Sarees,
      Kurtis, Pakistani Suits, Lehenga Choli, Gowns, and Salwar Suits.
      We provide 100% manufacturer-sourced catalogs designed for retailers,
      resellers, and boutique owners.
    </p>

    <h3>Why Buy Wholesale from Ethnicaa?</h3>
    <ul>
      <li>Daily new arrivals in all categories</li>
      <li>Best wholesale pricing guaranteed</li>
      <li>Original branded catalogs only</li>
      <li>Fast dispatch & trusted courier partners</li>
      <li>Support for global buyers</li>
    </ul>

    <h3>Our Major Collections</h3>
    <ul>
      <li><a href="/category/sarees">Wholesale Sarees Surat</a></li>
      <li><a href="/category/kurtis">Wholesale Kurtis Surat</a></li>
      <li><a href="/category/pakistani-suits">Pakistani Suits Wholesale</a></li>
      <li><a href="/category/salwar-suits">Salwar Suits Manufacturer</a></li>
      <li><a href="/category/gowns">Designer Gowns Wholesale</a></li>
      <li><a href="/category/lehenga">Lehenga Choli Wholesale Surat</a></li>
    </ul>

    <h3>Why Resellers Prefer Ethnicaa?</h3>
    <p>
      Every catalog we upload is hand-picked for trends, demand, 
      margins, and customer preference. Perfect for online sellers,
      shopkeepers, and boutique owners.
    </p>

    <h3>The Legacy of Surat’s Textile Market</h3>
    <p>
      Surat is the undisputed global hub for ethnic wear manufacturing. Known as the 'Silk City' and 'Textile Hub of India,' it produces over 40% of India’s synthetic fabric. By sourcing your inventory directly from Surat through Ethnicaa, you are tapping into a century-old legacy of craftsmanship and industrial efficiency. This allows us to provide you with prices that are 20-30% lower than traditional regional wholesalers.
    </p>

    <h3>B2B Sourcing Guide for International Buyers</h3>
    <p>
      If you are a boutique owner in the USA, UK, Canada, or UAE, sourcing from India can be challenging. Ethnicaa simplifies this by providing a reliable B2B gateway. We handle quality inspection, professional packaging, and customs documentation, ensuring your wholesale Pakistani suits and Sarees reach you without any logistical hurdles. Our global shipping partners ensure doorstep delivery within 7-10 business days.
    </p>

    <h3>Quality Control & Fulfillment in Wholesale</h3>
    <p>
      In the wholesale business, consistency is key. At Ethnicaa, we have a multi-step quality check process. Before any catalog is dispatched from our Surat warehouse, our team inspects the fabric, embroidery, and stitch quality to ensure it matches the brand’s original catalog images. This commitment to quality has made us the trusted partner for over 5000+ resellers worldwide.
    </p>

    <h3>Sustainable Partnerships & Long-term Growth</h3>
    <p>
      We don't just sell catalogs; we build businesses. Our team provides resellers with high-resolution images and marketing materials to help them sell effectively on social media platforms like Instagram and WhatsApp. Whether you are a small home-based startup or a large retail chain, our scalable wholesale models are designed to grow with you.
    </p>

    <h3>FAQs</h3>
  `;

  /* ============================================================
      UI
  ============================================================= */
  return (
    <div style={styles.container}>

      {/* ====================== SCHEMAS ====================== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://ethnicaa.com",
              },
            ],
          }),
        }}
      />

      {/* ====================== BANNERS ====================== */}
      {banners.length > 0 && (
        <div style={{ marginBottom: 20, marginTop: 10 }}>
          <BannerSlider banners={banners} />
        </div>
      )}

      {/* ====================== TRUST BADGES ====================== */}
      <div style={styles.trustStrip}>
        <div className="premium-card" style={styles.trustBadge}>
          <span style={styles.trustIcon}>🏢</span>
          <span style={styles.trustText}>Direct Surat Manufacturer</span>
        </div>
        <div className="premium-card" style={styles.trustBadge}>
          <span style={styles.trustIcon}>🔒</span>
          <span style={styles.trustText}>100% Secure Payment</span>
        </div>
        <div className="premium-card" style={styles.trustBadge}>
          <span style={styles.trustIcon}>📦</span>
          <span style={styles.trustText}>Fast Global Dispatch</span>
        </div>
        <div className="premium-card" style={styles.trustBadge}>
          <span style={styles.trustIcon}>✅</span>
          <span style={styles.trustText}>Quality Assured</span>
        </div>
      </div>

      {/* ====================== H1 HOMEPAGE ====================== */}
      <h1 style={styles.pageH1}>Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits</h1>

      {/* ====================== CATEGORIES ====================== */}
      {categories.length > 0 && (
        <>
          <h2 style={styles.heading}>Categories</h2>

          <div style={styles.categories}>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="premium-card"
                style={styles.categoryCard}
              >
                {c.cover && (
                  <Image
                    src={c.cover}
                    alt={c.name}
                    width={300}
                    height={380}
                    quality={100}
                    sizes="(max-width:600px) 48vw, (max-width:1024px) 32vw, 200px"
                    style={styles.categoryImg}
                  />
                )}

                <div style={styles.categoryTitle}>{c.name}</div>
                <div style={styles.categoryCount}>{c.count} items</div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* ====================== PRODUCTS ====================== */}
      <h2 style={styles.heading}>Latest Products</h2>

      <div style={styles.grid}>
        {loading
          ? Array(12)
              .fill(0)
              .map((_, i) => (
                <div key={i} style={styles.skeletonCard}>
                  <div style={styles.skeletonImg}></div>
                  <div style={styles.skeletonText}></div>
                </div>
              ))
          : products.map((p) => (
              <div key={p.id} className="premium-card" style={styles.card}>
                <Link
                  href={`/product/${p.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {p.images?.[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.catalog || p.name}
                      width={300}
                      height={380}
                      sizes="(max-width:600px) 48vw, (max-width:1024px) 32vw, 200px"
                      style={styles.cardImg}
                    />
                  )}

                  <div style={styles.cardText}>{p.catalog || p.name}</div>
                  <div style={styles.price}>
                    ₹ {p.price || p.avg_price || "N/A"} / pc
                  </div>
                </Link>

                <EnquireButton product={p} />
              </div>
            ))}
      </div>

      {/* LOAD MORE BUTTON */}
      {hasMore && !loading && (
        <button
          onClick={() => loadProducts(true)}
          style={styles.loadMoreBtn}
          disabled={loadMoreLoading}
        >
          {loadMoreLoading ? "Loading..." : "Load More"}
        </button>
      )}

      {/* ====================== BLOG SECTION ====================== */}
      <h2 style={styles.heading}>From Our Blog</h2>
      <div style={styles.blogGrid}>
        {blogs.slice(0, 3).map((post) => (
          <div key={post.slug} className="premium-card" style={styles.blogCard}>
            <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={styles.blogImageWrapper}>
                <Image src={post.image} alt={post.title} fill style={{ objectFit: "cover", borderRadius: 12 }} />
              </div>
              <h3 style={styles.blogTitle}>{post.title}</h3>
              <p style={styles.blogExcerpt}>{post.excerpt.substring(0, 100)}...</p>
            </Link>
          </div>
        ))}
      </div>

      {/* ====================== SEO CONTENT BLOCK ====================== */}
      <div style={styles.seoBox}>
        <div style={styles.htmlContent} dangerouslySetInnerHTML={{ __html: homepageSEOContent }} />

        {/* Visible FAQs */}
        <div style={{ marginTop: 20 }}>
          <h3>Frequently Asked Questions</h3>

          <p><b>Do you offer wholesale prices?</b><br />Yes, all products are sold at wholesale rates.</p>
          <p><b>How often do you add new catalogs?</b><br />We upload fresh catalogs daily.</p>
          <p><b>Do you ship internationally?</b><br />Yes, worldwide shipping is available.</p>
          <p><b>How to place an order?</b><br />Click the Enquire button and message us on WhatsApp.</p>
        </div>
      </div>

      {/* ====================== TESTIMONIALS ====================== */}
      <div style={styles.testimonialSection}>
        <h3 style={styles.testimonialHeading}>What Our Resellers Say</h3>
        <div style={styles.testimonialGrid}>
          <div className="premium-card" style={styles.testimonialCard}>
            <p style={styles.testimonialText}>"Always brings the latest wholesale catalogs! My customers love the quality."</p>
            <strong style={styles.testimonialAuthor}>- Riya, Mumbai</strong>
          </div>
          <div className="premium-card" style={styles.testimonialCard}>
            <p style={styles.testimonialText}>"Best reseller margin and very fast dispatch perfectly packed."</p>
            <strong style={styles.testimonialAuthor}>- Ayesha, Delhi</strong>
          </div>
          <div className="premium-card" style={styles.testimonialCard}>
            <p style={styles.testimonialText}>"I only order my Kurtis and Lehenga from Ethnicaa. Top notch fabric!"</p>
            <strong style={styles.testimonialAuthor}>- Pooja, Surat</strong>
          </div>
        </div>
      </div>

      {/* ====================== WHATSAPP FLOAT BUTTON ====================== */}
      <a
        href="https://wa.me/9586346332"
        target="_blank"
        rel="noopener noreferrer"
        className="pulsing-whatsapp"
        aria-label="Chat on WhatsApp"
      >
        💬
      </a>

    </div>
  );
}

/* ============================================================
    STYLES (NO CHANGES NEEDED)
============================================================ */
const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: 12 },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  logo: { fontSize: 22, fontWeight: 700 },

  whatsappTop: {
    color: "#25D366",
    fontWeight: 600,
    textDecoration: "none",
  },

  heading: { fontSize: 20, fontWeight: 600, marginBottom: 10 },

  categories: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 14,
    marginBottom: 20,
  },

  categoryCard: {
    background: "#fff",
    padding: 10,
    borderRadius: 12,
    textAlign: "center",
    textDecoration: "none",
    color: "#000",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  categoryImg: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
    marginBottom: 6,
    aspectRatio: "4/5",
    objectFit: "cover",
  },

  categoryTitle: { fontWeight: 600, fontSize: 14 },
  categoryCount: { fontSize: 12, opacity: 0.7 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 14,
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.02)",
  },

  cardImg: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
    aspectRatio: "4/5",
    objectFit: "cover",
  },

  cardText: { marginTop: 8, textAlign: "center", fontWeight: 600 },

  price: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: 700,
    textAlign: "center",
  },

  loadMoreBtn: {
    margin: "20px auto",
    display: "block",
    padding: "10px 20px",
    borderRadius: 10,
    background: "#000",
    color: "#fff",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },

  seoBox: {
    marginTop: 35,
    padding: 20,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
    lineHeight: 1.7,
  },

  pageH1: {
    fontSize: 24,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    color: "#111",
  },
  skeletonCard: {
    background: "#eee",
    borderRadius: 12,
    padding: 10,
  },

  skeletonImg: {
    width: "100%",
    height: 200,
    background: "#ccc",
    borderRadius: 8,
  },

  skeletonText: {
    height: 14,
    marginTop: 10,
    background: "#ddd",
    borderRadius: 6,
  },

  trustStrip: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    padding: "20px 0",
    marginBottom: 24,
  },
  trustBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fff",
    padding: "12px 20px",
    borderRadius: 50,
    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
  },
  trustIcon: {
    fontSize: 20,
  },
  trustText: {
    fontWeight: 600,
    fontSize: 14,
  },

  testimonialSection: {
    marginTop: 40,
    marginBottom: 20,
  },
  testimonialHeading: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 24,
  },
  testimonialGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  testimonialCard: {
    background: "#fff",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
  },
  testimonialText: {
    fontStyle: "italic",
    color: "#444",
    lineHeight: 1.6,
    marginBottom: 16,
  },
  testimonialAuthor: {
    color: "#000",
  },
  blogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
    marginBottom: 40,
  },
  blogCard: {
    padding: 16,
    background: "#fff",
    borderRadius: 16,
  },
  blogImageWrapper: {
    position: "relative",
    width: "100%",
    height: 180,
    marginBottom: 12,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  blogExcerpt: {
    fontSize: 14,
    color: "#666",
    lineHeight: 1.5,
  },
  htmlContent: {
    "& a": {
      color: "#0066cc",
      fontWeight: "600",
      textDecoration: "none",
    }
  }
};

