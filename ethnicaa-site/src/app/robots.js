export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/search", "/admin", "/dashboard"],
    },
    sitemap: "https://ethnicaa.com/sitemap.xml",
  };
}
