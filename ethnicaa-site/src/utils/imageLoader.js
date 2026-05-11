export default function imageLoader({ src, width, quality }) {
  // 1. If it's a local asset (starts with /), don't optimize through weserv
  if (src.startsWith("/")) {
    return `${src}?w=${width}`;
  }

  // 2. PROXY BYPASS FOR LCP: If src contains 'noproc=1', return the raw URL.
  // This saves the DNS/Connection hop for the most critical above-the-fold images.
  if (src.includes("noproc=1")) {
    return src.replace(/[?&]noproc=1/, "");
  }

  // 3. Use wsrv.nl (Weserv) as a free image optimizer for all other images.
  const url = new URL("https://wsrv.nl/");
  url.searchParams.set("url", src);
  url.searchParams.set("w", width);
  url.searchParams.set("q", quality || 75);
  url.searchParams.set("output", "webp");
  url.searchParams.set("il", ""); // Interlace/Progressive loading

  return url.href;
}
