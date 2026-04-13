import Link from "next/link";

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  // JSON-LD BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? `https://ethnicaa.com${item.url}` : undefined,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" style={styles.nav}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <ol style={styles.list}>
        <li style={styles.item}>
          <Link href="/" style={styles.link}>Home</Link>
          <span style={styles.separator}>/</span>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} style={styles.item}>
              {isLast ? (
                <span style={styles.current} aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.url} style={styles.link}>
                    {item.name}
                  </Link>
                  <span style={styles.separator}>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const styles = {
  nav: {
    marginBottom: 20,
    fontSize: 14,
  },
  list: {
    display: "flex",
    listStyle: "none",
    padding: 0,
    margin: 0,
    flexWrap: "wrap",
    gap: 8,
  },
  item: {
    display: "flex",
    alignItems: "center",
  },
  link: {
    color: "#666",
    textDecoration: "none",
    fontWeight: "500",
  },
  separator: {
    marginLeft: 8,
    color: "#ccc",
    userSelect: "none",
  },
  current: {
    color: "#111",
    fontWeight: "600",
  },
};
