/**
 * Normalizes category names to avoid duplicates like "Saree" and "Sarees".
 */
export const CATEGORY_MAP = {
  "saree": "Sarees",
  "sarees": "Sarees",
  "kurti": "Kurtis",
  "kurtis": "Kurtis",
  "gown": "Gowns",
  "gowns": "Gowns",
  "pakistani suit": "Pakistani Suits",
  "pakistani suits": "Pakistani Suits",
  "salwar suit": "Salwar Suits",
  "salwar suits": "Salwar Suits",
  "readymade salwar suit": "Salwar Suits",
  "suit": "Salwar Suits",
  "suits": "Salwar Suits",
  "cord set": "Cord Sets",
  "cord sets": "Cord Sets",
  "co ord set": "Cord Sets",
  "co-ord set": "Cord Sets",
  "lehenga": "Lehenga Choli",
  "lehenga choli": "Lehenga Choli",
  "lehengas": "Lehenga Choli",
};

export function normalizeCategoryName(name) {
  if (!name) return "Others";
  const clean = name.toLowerCase().trim();
  return CATEGORY_MAP[clean] || name;
}

export function consolidateCategories(categories) {
  const consolidated = {};

  // 1. Add "All Products" as the first virtual category
  consolidated["All Products"] = {
    slug: "all-products",
    name: "All Products",
    cover: "https://ethnicaa.com/logo.png", // Or a generic store image
    count: categories.reduce((a, b) => a + (b.count || 0), 0)
  };

  categories.forEach(cat => {
    const name = cat.name || "";
    // Filter out "Test", "Dummy", or categories with 0 items (except virtual ones)
    if (name.toLowerCase().includes("test") || name.toLowerCase().includes("dummy")) return;
    if (cat.count === 0) return;

    const normalizedName = normalizeCategoryName(name);
    
    if (!consolidated[normalizedName]) {
      consolidated[normalizedName] = {
        ...cat,
        name: normalizedName,
        count: cat.count || 0
      };
    } else {
      consolidated[normalizedName].count += (cat.count || 0);
      if (!consolidated[normalizedName].cover && cat.cover) {
        consolidated[normalizedName].cover = cat.cover;
      }
    }
  });

  // Convert to array and ensure "All Products" is first, then rest by count
  const items = Object.values(consolidated);
  const allProducts = items.find(i => i.name === "All Products");
  const others = items.filter(i => i.name !== "All Products").sort((a, b) => b.count - a.count);

  return [allProducts, ...others];
}
