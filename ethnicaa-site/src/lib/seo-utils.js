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

export const LANGUAGES = {
  en: { name: "English", native: "English" },
  hi: { name: "Hindi", native: "हिन्दी" },
  te: { name: "Telugu", native: "తెలుగు" },
  ta: { name: "Tamil", native: "தமிழ்" },
  kn: { name: "Kannada", native: "ಕನ್ನಡ" },
  ml: { name: "Malayalam", native: "മലയാളம்" },
  pa: { name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  gu: { name: "Gujarati", native: "ગુજરાતી" }
};

export const VERNACULAR_MAP = {
  hi: {
    wholesale: "थोक",
    sarees: "साड़ियाँ",
    kurtis: "कुर्तियाँ",
    surat: "सूरत",
    manufacturer: "निर्माता",
    factory: "फैक्ट्री",
    reseller: "पुनर्विक्रेता",
    title: "सूरत से सीधे थोक {category} — फैक्टरी रेट",
    desc: "सूरत से सीधे थोक दरों पर {category} खरीदें। रीसेलर्स और बुटीक मालिकों के लिए बेहतरीन संग्रह। पूरे भारत में डिलीवरी।"
  },
  te: {
    wholesale: "హోల్‌సేల్",
    sarees: "చీరలు",
    kurtis: "కుర్తీలు",
    surat: "సూరత్",
    title: "సూరత్ ఫ్యాక్టరీ నుండి నేరుగా హోల్‌సేల్ {category}",
    desc: "సూరత్ తయారీదారుల నుండి నేరుగా హోల్‌సేల్ ధరలకు {category} కొనండి. రీసెల్లర్లకు ఉత్తమ మార్జిన్."
  },
  ta: {
    wholesale: "மொத்த விற்பனை",
    sarees: "சேலைகள்",
    kurtis: "குர்த்திகள்",
    surat: "சூரத்",
    title: "சூரத் தொழிற்சாலையிலிருந்து நேரடியாக மொத்த விற்பனை {category}",
    desc: "சூரத் உற்பத்தியாளர்களிடமிருந்து நேரடியாக மொத்த விலையில் {category} வாங்கவும்."
  },
  kn: {
    wholesale: "ಸಗಟು",
    sarees: "ಸೀರೆಗಳು",
    kurtis: "ಕುರ್ತಿಗಳು",
    surat: "ಸೂರತ್",
    title: "ಸೂರತ್ ಫ್ಯಾಕ್ಟರಿಯಿಂದ ನೇರವಾಗಿ ಸಗಟು {category}",
    desc: "ಸೂರತ್ ತಯಾರಕರಿಂದ ನೇರವಾಗಿ ಸಗಟು ದರದಲ್ಲಿ {category} ಖರೀದಿಸಿ."
  }
};

/**
 * Parses a slug like 'silk-sarees-in-mumbai' into its components.
 */
export function parseCollectionSlug(slug, lang = "en") {
  const s = slug.toLowerCase();
  
  // Vernacular Keyword Mapping (thok = wholesale, etc)
  const isVernacular = s.includes("thok") || s.includes("thok-") || s.includes("wholesale-");

  let fabric = PRIORITY_FABRICS.find(f => s.includes(f.toLowerCase())) || "";
  let city = PRIORITY_CITIES.find(c => s.includes(c.toLowerCase())) || "";
  let category = CATEGORIES.find(cat => s.includes(cat.toLowerCase())) || "";

  // Handle common vernacular terms
  if (!category && s.includes("saree")) category = "Sarees";
  if (!category && s.includes("kurti")) category = "Kurtis";

  return {
    fabric,
    city,
    category,
    label: slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    isVernacular
  };
}

export const CITY_CONTENT = {
  "Mumbai": {
    intro: "Mumbai is the fashion capital of India, and the demand for high-quality ethnic wear in markets like Dadar, Crawford Market, and Santacruz is perennial. Ethnicaa brings Surat's manufacturing excellence directly to Mumbai's doorstep. We specialize in supplying boutiques and resellers across Mumbai with premium sarees and kurtis at direct factory rates. Our logistics network ensures dispatch within 24 hours, reaching Mumbai hubs in just 1-2 days. Whether you are a home-based reseller in Thane or a large retailer in South Bombay, Ethnicaa is your trusted B2B partner for the latest 2026 collections.",
    faqs: [
      { q: "How long does wholesale saree delivery take to Mumbai?", a: "Delivery typically takes 1-2 working days from our Surat warehouse to most parts of Mumbai and Navi Mumbai." },
      { q: "What is the minimum order for wholesale sarees?", a: "We focus on catalog-based wholesale. Most catalogs come in sets of 4 to 8 pieces." },
      { q: "Do you deliver to boutiques in Mumbai?", a: "Yes, we supply hundreds of boutique owners in Mumbai, offering door-step delivery via reliable courier services." }
    ]
  },
  "Delhi": {
    intro: "For retailers in Chandni Chowk, Karol Bagh, and Lajpat Nagar, sourcing direct from Surat manufacturers is the key to maintaining high profit margins. Ethnicaa serves the Delhi NCR region with a massive catalog of wholesale kurtis and Pakistani suits. By cutting out middleman commissions, we offer Delhi buyers a 20-30% price advantage compared to local wholesalers. Our daily new arrivals ensure that your shop always has the freshest trends from the textile capital of India.",
    faqs: [
      { q: "What are the shipping charges from Surat to Delhi?", a: "Shipping is calculated based on weight. We use bulk transport services to keep costs as low as ₹5-10 per kg for Delhi NCR." },
      { q: "Can I get daily updates for new kurti catalogs?", a: "Yes, we provide daily updates via our WhatsApp broadcast for all our Delhi-based resellers." },
      { q: "Is COD available for wholesale orders in Delhi?", a: "Yes, we offer Cash on Delivery options for verified business accounts across Delhi." }
    ]
  },
  "Jaipur": {
    intro: "Jaipur is famous for its own textile heritage, but Surat's designer suits and fancy sarees offer a perfect complement to local Rajasthani prints. Ethnicaa provides Jaipur-based boutique owners with access to heavy embroidery work and premium fabrics like organza and chinon that are currently trending. We offer seamless delivery to Jaipur, Jodhpur, and Udaipur, helping local businesses stay ahead of the fashion curve with Surat's latest factory outputs.",
    faqs: [
      { q: "How do you handle delivery to Jaipur?", a: "We use express road transport and couriers, ensuring your parcels reach Jaipur within 2-3 days of dispatch." },
      { q: "Are these authentic Surat factory prices?", a: "Yes, Ethnicaa works directly with manufacturers on Ring Road and Millennium Market to ensure the lowest B2B rates." },
      { q: "Can I order single pieces for samples?", a: "We are a B2B marketplace and primarily sell in full catalogs/sets to maintain wholesale pricing." }
    ]
  },
  "Kolkata": {
    intro: "Ethnicaa is a leading supplier for wholesalers in Burrabazar and Gariahat, providing the latest Surat sarees at unbeatable factory rates. We understand the specific taste of the West Bengal market, focusing on premium silk, georgette, and cotton collections. Our dedicated logistics partners ensure that your bulk orders reach Kolkata and surrounding districts efficiently, allowing you to restock your inventory with the latest 2026 trends in record time.",
    faqs: [
      { q: "How long does delivery take to Kolkata?", a: "Orders usually reach Kolkata within 4-5 working days via reliable transport services." },
      { q: "Do you supply to resellers in West Bengal?", a: "Yes, we have a large network of home-based resellers and small shop owners across West Bengal." },
      { q: "What fabrics are most popular for the Kolkata market?", a: "Silk and cotton-based sarees remain our top sellers for the Kolkata wholesale region." }
    ]
  },
  "Bangalore": {
    intro: "Bangalore's cosmopolitan crowd demands the latest in ethnic fashion, from designer sarees to ready-to-wear kurtis. Ethnicaa bridges the gap between Surat's manufacturing hubs and Bangalore's retail markets like Chickpet and Commercial Street. We offer premium quality ethnic wear that meets the high standards of Bangalore's boutique owners. With fast shipping and a focus on trending fabrics like Tusser and Organza, we help you keep your collection fresh and profitable.",
    faqs: [
      { q: "Do you deliver to Chickpet area in Bangalore?", a: "Yes, we deliver to all major commercial hubs in Bangalore, including Chickpet and MG Road." },
      { q: "What is the delivery time for Bangalore?", a: "Express shipping takes approximately 3-4 days to reach Bangalore from Surat." },
      { q: "Can I get GST invoices for my business?", a: "Yes, all orders are provided with valid GST invoices for input tax credit." }
    ]
  },
  "Hyderabad": {
    intro: "For boutique owners in Hyderabad and Secunderabad, Ethnicaa offers the most competitive rates on wholesale Pakistani suits and designer kurtis. We are the preferred sourcing partner for many retailers in Laad Bazar and Madina Market who want direct factory access to Surat's production. Our collections are curated for the premium tastes of the Hyderabad market, ensuring high turnover and satisfied customers for your business.",
    faqs: [
      { q: "How fast is the shipping to Hyderabad?", a: "Being well-connected to Surat, Hyderabad orders are typically delivered within 2-3 working days." },
      { q: "What are the trending categories in Hyderabad?", a: "Pakistani Suits and Embroidered Georgette sets are currently the highest demand items in Hyderabad." },
      { q: "Do you offer wholesale prices for new boutiques?", a: "Yes, we support new business owners with factory rates even on small initial catalog orders." }
    ]
  }
};

/**
 * Generates SEO Optimized Title
 */
export function generateCollectionTitle(components, lang = "en") {
  const { fabric, category, city } = components;
  
  if (lang !== "en" && VERNACULAR_MAP[lang]) {
    const map = VERNACULAR_MAP[lang];
    const catTrans = map[category.toLowerCase()] || category;
    return map.title.replace("{category}", catTrans) + " | Ethnicaa";
  }

  if (category && city) {
    return `Wholesale ${category} in ${city} | Direct from Surat Factory | Ethnicaa`;
  }
  if (fabric && category && city) {
    return `Wholesale ${fabric} ${category} in ${city} — Surat Manufacturer Direct`;
  }
  if (fabric && category) {
    return `Wholesale ${fabric} ${category} Catalog 2026 — Factory Rates Ethnicaa`;
  }
  
  return `${components.label} Wholesale — Surat Manufacturer Direct`;
}

/**
 * Generates SEO Optimized Description
 */
export function generateCollectionDescription(components, lang = "en") {
  const { fabric, category, city } = components;
  
  if (lang !== "en" && VERNACULAR_MAP[lang]) {
    const map = VERNACULAR_MAP[lang];
    const catTrans = map[category.toLowerCase()] || category;
    return map.desc.replace("{category}", catTrans);
  }

  if (category && city) {
    return `Buy wholesale ${category} in ${city} at direct factory prices from Surat. Best collection for resellers and boutique owners. Fast delivery to ${city}, COD available. Join Ethnicaa today.`;
  }
  
  const base = `Buy latest wholesale ${fabric || ""} ${category || "ethnic wear"} ${city ? "for your business in " + city : ""} at direct factory rates.`;
  const suffix = ` Daily new arrivals, worldwide shipping, and 100% original catalogs.`;
  
  const finalDesc = `${base}${suffix}`.trim();
  return finalDesc.length > 170 ? finalDesc.substring(0, 167) + "..." : finalDesc;
}
