"use client";

export default function ShareButton({ product }) {
  const link = typeof window !== "undefined" ? window.location.href : "";
  const img = product.images?.[0] || "";
  const name = product.catalog || product.name;

  const message =
    `Check out this Ethnicaa product:%0A%0A` +
    `*${name}*%0A` +
    `${link}%0A%0A` +
    `Image: ${img}`;

  const url = `https://wa.me/?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      style={styles.btn}
    >
      🔗 Share
    </a>
  );
}

const styles = {
  btn: {
    marginTop: 10,
    display: "inline-block",
    background: "#111",
    padding: "10px 16px",
    borderRadius: 8,
    color: "#fff",
    fontSize: 15,
    fontWeight: 500,
    textDecoration: "none",
  },
};
