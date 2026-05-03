import { blogs } from "@/lib/blog-data";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Wholesale Blog & Surat Market Guides",
  description: "Learn how to grow your reselling business. Expert guides on the Surat textile market, latest ethnic wear trends, and business tips for boutique owners.",
  keywords: "wholesale business blog, Surat textile market news, ethnic wear trends 2026, reselling business India, clothing wholesale tips",
  alternates: {
    canonical: "https://ethnicaa.com/blog",
  },
};

export default function BlogIndex() {
  return (
    <div style={styles.container}>
      <Breadcrumbs items={[{ name: "Blog", url: "" }]} />
      <header style={styles.header}>
        <h1 style={styles.title}>Ethnicaa Wholesale Blog</h1>
        <p style={styles.subtitle}>
          Your expert resource for the Surat Textile Market & Online Reselling Business
        </p>
      </header>

      <div style={styles.grid}>
        {blogs.map((post) => (
          <article key={post.slug} className="premium-card" style={styles.card}>
            <Link href={`/blog/${post.slug}`} style={styles.link}>
              <div style={styles.imageWrapper}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={styles.content}>
                <time style={styles.date}>{post.date}</time>
                <h2 style={styles.postTitle}>{post.title}</h2>
                <p style={styles.excerpt}>{post.excerpt}</p>
                <span style={styles.readMore}>Read Article →</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: "40px auto",
    padding: "0 20px",
  },
  header: {
    textAlign: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    maxWidth: 700,
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 30,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 220,
  },
  content: {
    padding: 24,
  },
  date: {
    fontSize: 13,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  postTitle: {
    fontSize: 22,
    fontWeight: "700",
    margin: "12px 0",
    lineHeight: 1.3,
    color: "#000",
  },
  excerpt: {
    fontSize: 15,
    color: "#555",
    lineHeight: 1.6,
    marginBottom: 20,
  },
  readMore: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
};
