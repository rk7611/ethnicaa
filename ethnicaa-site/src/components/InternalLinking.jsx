import Link from "next/link";

export default function InternalLinking({ links = [] }) {
  if (!links || links.length === 0) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Trending in Surat Wholesale Market</h3>
      <div style={styles.links}>
        {links.map((link, idx) => (
          <Link key={idx} href={link.href} style={styles.link}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: 40,
    padding: "25px 0",
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 15,
    color: "#333",
  },
  links: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px 20px",
  },
  link: {
    color: "#666",
    fontSize: 14,
    textDecoration: "none",
    borderBottom: "1px solid transparent",
    transition: "0.2s",
  },
};
