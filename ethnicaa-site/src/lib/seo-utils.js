/**
 * SEO Utilities for Ethnicaa Wholesale
 * Handles dynamic metadata generation for Programmatic SEO.
 */

export const PRIORITY_CITIES = [
  "Surat", "Mumbai", "Delhi", "Ahmedabad", "Jaipur", 
  "Kolkata", "Bhubneshwar", "Chennai", "Vishakapatnam", "Hyderabad"
];

export const PRIORITY_FABRICS = [
  "Cotton", "Rayon", "Georgette", "Silk", "Tusser Silk", "Organza", "Papper Cotton"
];

const CATEGORIES = [
  "Sarees", "Kurtis", "Salwar Suits", "Pakistani Suits", "Lehenga", "Gowns"
];

/**
 * Parses a slug like 'silk-sarees-in-mumbai' into its components.
 */
export function parseCollectionSlug(slug) {
  const s = slug.toLowerCase();
  
  let fabric = PRIORITY_FABRICS.find(f => s.includes(f.toLowerCase())) || "";
  let city = PRIORITY_CITIES.find(c => s.includes(c.toLowerCase())) || "";
  let category = CATEGORIES.find(cat => s.includes(cat.toLowerCase())) || "";

  // Fallback for category if slug is just 'silk-sarees'
  if (!category) {
    if (s.includes("saree")) category = "Sarees";
    else if (s.includes("kurti")) category = "Kurtis";
    else if (s.includes("suit")) category = "Salwar Suits";
    else if (s.includes("lehenga")) category = "Lehenga";
    else if (s.includes("gown")) category = "Gowns";
  }

  return {
    fabric,
    city,
    category,
    label: slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  };
}

/**
 * Generates SEO Optimized Title
 */
export function generateCollectionTitle(components) {
  const { fabric, category, city } = components;
  
  if (fabric && category && city) {
    return `Wholesale ${fabric} ${category} in ${city} — Direct Factory Price`;
  }
  if (fabric && category) {
    return `Wholesale ${fabric} ${category} Catalog 2026 — Ethnicaa`;
  }
  if (category && city) {
    return `Wholesale ${category} in ${city} — Best Prices Surat Market`;
  }
  
  return `${components.label} Wholesale — Surat Manufacturer`;
}

/**
 * Generates SEO Optimized Description
 */
export function generateCollectionDescription(components) {
  const { fabric, category, city } = components;
  
  const base = `Buy latest wholesale ${fabric || ""} ${category || "ethnic wear"} ${city ? "in " + city : ""} at direct factory rates.`;
  const suffix = ` Worldwide shipping, daily new arrivals, and best margins for resellers. Shop Ethnicaa Wholesale today.`;
  
  return `${base}${suffix}`;
}
