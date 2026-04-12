import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET() {
  const BASE = "https://ethnicaa.com";

  const snap = await getDocs(
    query(collection(db, "products"), where("status", "==", "published"))
  );

  const urls = snap.docs.map((d) => {
    const p = d.data();
    return `
      <url>
        <loc>${BASE}/product/${p.slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
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
