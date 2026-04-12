export function GET() {
  const BASE = "https://ethnicaa.com";

  const pages = ["about", "contact", "privacy"];

  const urls = pages.map((p) => {
    return `
      <url>
        <loc>${BASE}/${p}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
    `;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("")}
  </urlset>`;

  return new Response(xml.trim(), {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
