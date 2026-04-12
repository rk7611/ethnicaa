export function GET() {
  const BASE = "https://ethnicaa.com";

  const robots = `
User-agent: *
Allow: /
Disallow: /search

# Block admin & internal pages (future-safe)
Disallow: /admin
Disallow: /dashboard

# Sitemap rules
Sitemap: ${BASE}/sitemap.xml
Sitemap: ${BASE}/sitemap-products.xml
Sitemap: ${BASE}/sitemap-categories.xml
Sitemap: ${BASE}/sitemap-static.xml
`;

  return new Response(robots.trim(), {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
