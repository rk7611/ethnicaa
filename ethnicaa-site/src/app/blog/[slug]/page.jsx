import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogs } from "@/lib/blog-data";

export async function generateMetadata({ params }) {
  const post = blogs.find((b) => b.slug === params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | Ethnicaa Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default function BlogPost({ params }) {
  const post = blogs.find((b) => b.slug === params.slug);
  if (!post) notFound();

  // JSON-LD Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.image,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Ethnicaa Wholesale",
      url: "https://ethnicaa.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Ethnicaa Wholesale",
      logo: {
        "@type": "ImageObject",
        url: "https://ethnicaa.com/logo.png",
      },
    },
    description: post.excerpt,
  };

  return (
    <div style={styles.container}>
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Link href="/blog" style={styles.backLink}>← Back to Blog</Link>

      <header style={styles.header}>
        <time style={styles.date}>{post.date}</time>
        <h1 style={styles.title}>{post.title}</h1>
      </header>

      <div style={styles.imageWrapper}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          style={{ objectFit: "cover", borderRadius: 16 }}
        />
      </div>

      <main style={styles.content}>
        <div 
          style={styles.htmlContent} 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </main>

      <footer style={styles.footer}>
        <div style={styles.ctaBox}>
          <h3>Want to grow your business?</h3>
          <p>Get direct factory prices on the latest Surat wholesale catalogs with Ethnicaa.</p>
          <Link href="/" style={styles.ctaButton}>Wiew Latest Collections</Link>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: "40px auto",
    padding: "0 20px",
  },
  backLink: {
    display: "block",
    marginBottom: 30,
    color: "#666",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    marginBottom: 30,
  },
  date: {
    fontSize: 14,
    color: "#999",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    marginTop: 10,
    lineHeight: 1.2,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9",
    marginBottom: 40,
  },
  content: {
    lineHeight: 1.8,
    fontSize: 18,
    color: "#333",
  },
  htmlContent: {
    /* Custom spacing for dangerouslySetInnerHTML */
  },
  footer: {
    marginTop: 60,
    paddingTop: 40,
    borderTop: "1px solid #eee",
  },
  ctaBox: {
    background: "#f9f9f9",
    padding: "40px",
    borderRadius: 20,
    textAlign: "center",
  },
  ctaButton: {
    display: "inline-block",
    background: "#000",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: "700",
    marginTop: 20,
  },
};
