import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.slug}`} style={styles.card}>
      <div style={styles.imageWrapper}>
        <Image
          src={product.cover || product.images?.[0]}
          alt={`${product.catalog || product.name} ${product.categoryNames?.[0] || ""} wholesale ${product.fabricNames?.[0] || ""} - Ethnicaa`.trim()}
          fill
          sizes="(max-width: 600px) 48vw, 220px"
          style={styles.image}
          loading="lazy"
        />
        {product.offer && product.discount_percent > 0 && (
          <div style={styles.badge}>Save {product.discount_percent}%</div>
        )}
      </div>

      <div style={styles.info}>
        <div style={styles.name}>{product.catalog || product.name}</div>
        {product.offer && product.offer_price ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <div style={styles.originalPrice}>₹ {product.price}</div>
            <div style={styles.price}>₹ {product.offer_price}</div>
          </div>
        ) : (
          <div style={styles.price}>₹ {product.price || product.avg_price}</div>
        )}
      </div>
    </Link>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    textDecoration: "none",
    color: "#000",
    border: "1px solid #eee",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 220,
    overflow: "hidden",
  },
  image: {
    objectFit: "cover",
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
    lineHeight: "1.3em",
  },
  price: {
    fontSize: 15,
    fontWeight: 700,
    color: "#d32f2f",
  },
  originalPrice: {
    fontSize: 13,
    color: "#888",
    textDecoration: "line-through",
    fontWeight: 500,
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    background: "#d32f2f",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: "bold",
    zIndex: 2,
  },
};
