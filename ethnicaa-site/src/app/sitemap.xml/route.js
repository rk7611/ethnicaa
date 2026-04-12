export async function GET() {
  const BASE = "https://ethnicaa.com";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>${BASE}/sitemap-products.xml</loc>
    </sitemap>
    <sitemap>
      <loc>${BASE}/sitemap-categories.xml</loc>
    </sitemap>
    <sitemap>
      <loc>${BASE}/sitemap-static.xml</loc>
    </sitemap>
  </sitemapindex>`;

  /* 🔥 AUTO-PING GOOGLE (ASYNC – Does NOT delay sitemap) */
  try {
    fetch(
      `https://www.google.com/ping?sitemap=${BASE}/sitemap.xml`
    ).catch(() => {});
  } catch (_) {}

  return new Response(xml.trim(), {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
