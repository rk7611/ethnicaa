/**
 * Validates if a string is a potentially valid image URL for Next/Image.
 * Next/Image requires absolute URLs (starting with http/https) or relative paths (starting with /).
 * It explicitly rejects strings that don't match these patterns, like "image url" placeholders.
 * It also filters out hostnames that are not configured in next.config.js to prevent runtime crashes.
 */
/**
 * Generates SEO-optimized Alt Text for product images
 */
export function generateProductAlt(product) {
  if (!product) return "Ethnicaa Wholesale Surat Manufacturer";
  
  const name = product.catalog || product.name || "Product";
  const category = (product.categories && product.categories[0]) || (product.categoryNames && product.categoryNames[0]) || "";
  const fabric = product.fabric || (product.fabricNames && product.fabricNames[0]) || "";
  
  return `Buy ${name} ${category} ${fabric} Wholesale Surat Manufacturer - Ethnicaa`.trim().replace(/\s+/g, ' ');
}

export function isValidImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  
  const trimmed = url.trim();
  if (!trimmed || trimmed === "image url") return false;
  
  // Handle relative paths (e.g. /favicon.ico)
  if (trimmed.startsWith("/")) return true;

  // Handle absolute URLs - check for configured hostnames
  if (trimmed.startsWith("http")) {
    try {
      const parsed = new URL(trimmed);
      const allowedHosts = [
        "storage.googleapis.com",
        "firebasestorage.googleapis.com",
        "ethnicaa-8402c.firebasestorage.app",
        "images.unsplash.com",
        "ethnicaa.com",
        "picsum.photos",
        "fastly.picsum.photos",
        "lh3.googleusercontent.com",
        "kapdavilla.com",
        "www.kapdavilla.com",
        "cdn.kapdavilla.com",
        "wsrv.nl"
      ];
      return allowedHosts.some(host => parsed.hostname === host || parsed.hostname.endsWith(host));
    } catch (e) {
      return false;
    }
  }
  
  return false;
}
