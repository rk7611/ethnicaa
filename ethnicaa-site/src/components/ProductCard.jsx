import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.slug}`} style={styles.card}>
      <img
        src={product.cover || product.images?.[0]}
        alt={product.name}
        style={styles.image}
      />

      <div style={styles.info}>
        <div style={styles.name}>{product.catalog || product.name}</div>
        <div style={styles.price}>₹ {product.price}</div>
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
  image: {
    width: "100%",
    height: 220,
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
  },
};
