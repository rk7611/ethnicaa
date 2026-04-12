import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  const BASE = "https://ethnicaa.com";

  const snap = await getDocs(collection(db, "categories"));

  const urls = snap.docs.map((d) => {
    return `
      <url>
        <loc>${BASE}/category/${d.id}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
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
