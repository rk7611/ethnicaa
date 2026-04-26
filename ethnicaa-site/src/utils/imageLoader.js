export default function imageLoader({ src, width, quality }) {
  // If it's a local asset (starts with /), don't optimize through weserv
  if (src.startsWith("/")) {
    return src;
  }

  // Use wsrv.nl (Weserv) as a free image optimizer
  // It resizes, converts to webp, and caches images for free.
  const url = new URL("https://wsrv.nl/");
  url.searchParams.set("url", src);
  url.searchParams.set("w", width);
  url.searchParams.set("q", quality || 75);
  url.searchParams.set("output", "webp");
  url.searchParams.set("il", ""); // Interlace/Progressive loading

  return url.href;
}
