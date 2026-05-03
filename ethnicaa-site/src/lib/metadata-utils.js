export const SITE_URL = "https://ethnicaa.com";

const MAX_TITLE_LENGTH = 58;

export function absoluteUrl(path = "") {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function cleanTitle(title, maxLength = MAX_TITLE_LENGTH) {
  if (!title) return "Ethnicaa Wholesale";
  const normalized = String(title).replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const clipped = normalized.slice(0, maxLength + 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 38 ? lastSpace : maxLength).trim()}...`;
}

export function collectionLanguageAlternates(slug) {
  return {
    "en-IN": absoluteUrl(`/collections/${slug}`),
    hi: absoluteUrl(`/hi/collections/${slug}`),
    te: absoluteUrl(`/te/collections/${slug}`),
    ta: absoluteUrl(`/ta/collections/${slug}`),
    kn: absoluteUrl(`/kn/collections/${slug}`),
    ml: absoluteUrl(`/ml/collections/${slug}`),
    pa: absoluteUrl(`/pa/collections/${slug}`),
    gu: absoluteUrl(`/gu/collections/${slug}`),
    "x-default": absoluteUrl(`/collections/${slug}`),
  };
}

export function blogLanguageAlternates(slug, lang) {
  const languages = {
    "en-IN": absoluteUrl(`/blog/${slug}`),
    "x-default": absoluteUrl(`/blog/${slug}`),
  };

  if (lang && lang !== "en") {
    languages[lang] = absoluteUrl(`/${lang}/blog/${slug}`);
  }

  return languages;
}
