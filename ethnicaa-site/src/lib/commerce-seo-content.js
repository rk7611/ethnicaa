export const CATEGORY_SEO_CONTENT = {
  sarees: {
    title: "Wholesale Sarees from Surat for Retailers and Resellers",
    intro:
      "Source wholesale sarees directly from Surat manufacturers with Ethnicaa. This collection is built for boutiques, online resellers, export buyers, and retail stores that need fast-moving saree catalogs with clear pricing, verified product images, and reliable dispatch.",
    sections: [
      {
        heading: "What buyers can expect",
        body:
          "Our saree range covers daily wear, festive, party wear, silk-look, georgette, organza, printed, and designer concepts. Each catalog is selected for resale demand, fabric finish, margin potential, and repeat buying value.",
      },
      {
        heading: "Why source sarees from Ethnicaa",
        body:
          "Ethnicaa helps you buy closer to the Surat supply chain, avoid unnecessary middlemen, and receive product details that make WhatsApp, Instagram, boutique, and marketplace selling easier.",
      },
    ],
    faqs: [
      {
        question: "Can I buy wholesale sarees from Surat without visiting the market?",
        answer:
          "Yes. Ethnicaa shares verified saree catalogs, prices, images, and order details online so resellers and boutiques can source from Surat without visiting in person.",
      },
      {
        question: "Which sarees sell best for resellers?",
        answer:
          "Printed sarees, georgette sarees, organza sarees, festive sarees, and silk-look designer sarees usually perform well because they balance attractive pricing with strong visual appeal.",
      },
      {
        question: "Do you provide saree images for online selling?",
        answer:
          "Yes. Product pages include catalog images and reseller-friendly details that can help you promote sarees on WhatsApp, Instagram, and your boutique channels.",
      },
    ],
  },
  kurtis: {
    title: "Wholesale Kurtis for Boutiques, Resellers, and Bulk Buyers",
    intro:
      "Ethnicaa offers wholesale kurtis from Surat for resellers who need fresh designs, practical price points, and fast-moving catalogs. The collection is suitable for daily wear, office wear, casual ethnic wear, boutique displays, and online reselling.",
    sections: [
      {
        heading: "Built for high-repeat demand",
        body:
          "Kurti buyers often reorder based on comfort, size availability, print quality, and fabric feel. We focus on catalogs that are easier to explain, price, and sell to everyday customers.",
      },
      {
        heading: "Reseller advantage",
        body:
          "Our kurti catalogs are selected for strong margins, clean product presentation, and broad appeal across Indian and export markets including USA, UK, Canada, and UAE buyers.",
      },
    ],
    faqs: [
      {
        question: "What types of wholesale kurtis are available?",
        answer:
          "You can find casual kurtis, rayon kurtis, cotton-look kurtis, printed kurtis, party wear styles, and boutique-friendly ethnic wear catalogs.",
      },
      {
        question: "Are kurtis suitable for small resellers?",
        answer:
          "Yes. Kurtis are one of the easiest categories for new resellers because they have frequent demand, affordable price points, and broad customer appeal.",
      },
      {
        question: "Can I get bulk pricing for kurti catalogs?",
        answer:
          "Yes. Bulk pricing depends on catalog, quantity, fabric, and availability. Use the WhatsApp enquiry button on any product to request current wholesale rates.",
      },
    ],
  },
  "pakistani-suits": {
    title: "Wholesale Pakistani Suits and Luxury Suit Catalogs",
    intro:
      "Source wholesale Pakistani suits, lawn-style suits, organza concepts, embroidered sets, and premium ethnic suit catalogs through Ethnicaa. This category is curated for boutique owners and resellers who want higher perceived value and better selling margins.",
    sections: [
      {
        heading: "Premium catalog positioning",
        body:
          "Pakistani suit buyers often look for rich prints, embroidery detail, dupatta styling, fabric quality, and elegant presentation. Ethnicaa focuses on product information that helps you sell the complete look confidently.",
      },
      {
        heading: "Ideal for boutiques and exports",
        body:
          "These catalogs work well for boutiques, festive collections, wedding season buying, and international customers looking for Indian wholesale supply with Pakistani-style design influence.",
      },
    ],
    faqs: [
      {
        question: "Are Pakistani suits good for reseller margins?",
        answer:
          "Yes. Pakistani-style suits often carry better perceived value than basic daily wear, which can help resellers and boutiques maintain stronger margins.",
      },
      {
        question: "Do Pakistani suits come as full catalogs?",
        answer:
          "Many suit collections are sold catalog-wise or set-wise depending on the manufacturer. The current buying format is confirmed on WhatsApp before order finalization.",
      },
      {
        question: "Can you ship Pakistani suits outside India?",
        answer:
          "Yes. Ethnicaa supports bulk and export enquiries for countries such as USA, UK, Canada, UAE, Australia, and Malaysia.",
      },
    ],
  },
  "salwar-suits": {
    title: "Wholesale Salwar Suits for Daily Wear, Festive Wear, and Resale",
    intro:
      "Ethnicaa's wholesale salwar suits collection is designed for retailers, boutique owners, and online sellers who need dependable ethnic wear catalogs from Surat. The range includes readymade, semi-stitched, dress material, embroidered, printed, and festive suit concepts.",
    sections: [
      {
        heading: "Practical ethnic wear category",
        body:
          "Salwar suits remain a strong repeat category because customers buy them for daily wear, gifting, office wear, festive occasions, and family functions. Clear fabric, size, and dispatch details help resellers close orders faster.",
      },
      {
        heading: "Wholesale buying support",
        body:
          "Ethnicaa helps you compare catalogs, understand bulk prices, and place enquiries quickly through WhatsApp so your buying process stays simple and documented.",
      },
    ],
    faqs: [
      {
        question: "What salwar suit options are available wholesale?",
        answer:
          "You can source readymade suits, semi-stitched suits, dress material sets, embroidered suits, printed suits, and festive ethnic collections.",
      },
      {
        question: "Are salwar suits available for boutique owners?",
        answer:
          "Yes. Salwar suits are suitable for boutiques because they cover daily wear, festive wear, and premium occasion-wear customers.",
      },
      {
        question: "How do I confirm stock and dispatch time?",
        answer:
          "Open the product page and send a WhatsApp enquiry. The team confirms live stock, final price, packing, and dispatch timeline before order confirmation.",
      },
    ],
  },
};

export function getCategorySeoContent(slug, category) {
  const key = slug || "";
  const fallbackName = category?.name || key.replace(/-/g, " ") || "Ethnic Wear";

  return CATEGORY_SEO_CONTENT[key] || {
    title: `${fallbackName} Wholesale Collection from Surat`,
    intro: `Explore ${fallbackName} wholesale catalogs from Ethnicaa for resellers, boutique owners, online sellers, and bulk buyers. Each product page includes buying details, product images, and a direct WhatsApp enquiry path.`,
    sections: [
      {
        heading: "Direct wholesale sourcing",
        body:
          "Ethnicaa connects buyers with Surat-based ethnic wear supply so they can discover fresh catalogs, request live prices, and place bulk enquiries without wasting time across scattered supplier channels.",
      },
    ],
    faqs: [
      {
        question: `How do I buy ${fallbackName} wholesale?`,
        answer:
          "Browse the catalog, open a product, and use the WhatsApp enquiry button to confirm live stock, pricing, minimum order quantity, and dispatch details.",
      },
      {
        question: "Do you support reseller and boutique orders?",
        answer:
          "Yes. Ethnicaa is built for resellers, boutique owners, retailers, and export buyers who need reliable ethnic wear supply from Surat.",
      },
    ],
  };
}

export function buildProductDescription(product = {}) {
  const name = product.catalog || product.name || "this ethnic wear catalog";
  const category =
    product.categoryNames?.[0] ||
    product.category ||
    product.categories?.[0]?.replace(/-/g, " ") ||
    "ethnic wear";
  const fabric =
    product.fabricNames?.[0] ||
    product.fabric ||
    product.fabrics?.[0]?.replace(/-/g, " ") ||
    "premium fabric";
  const price = product.offer_price || product.price || product.avg_price;
  const pcs = product.pcs;
  const dispatch = product.dispatch || product.dispatchTime;
  const color = product.color;

  const details = [
    `${name} is a wholesale ${category} catalog selected for resellers, boutique owners, and bulk ethnic wear buyers.`,
    `The design uses ${fabric}, making it suitable for customers who want a balance of comfort, presentation, and resale value.`,
  ];

  if (color) {
    details.push(`Its ${color} tone gives the piece a clear visual identity for WhatsApp, Instagram, and boutique display selling.`);
  }

  if (price) {
    details.push(`Wholesale pricing starts around INR ${price} per piece, subject to live stock, catalog format, and quantity confirmation.`);
  }

  if (pcs) {
    details.push(`The catalog is suitable for set-wise buying with approximately ${pcs} pcs, depending on current manufacturer availability.`);
  }

  if (dispatch) {
    details.push(`Expected dispatch is ${dispatch}, helping buyers plan stock rotation and customer delivery commitments.`);
  }

  details.push(
    "Enquire on WhatsApp to confirm final price, packing details, live availability, images, and bulk order support from Ethnicaa's Surat wholesale network."
  );

  return details.join(" ");
}

export function buildProductFaqs(product = {}) {
  const name = product.catalog || product.name || "this product";
  const category = product.categoryNames?.[0] || product.category || "ethnic wear";
  const fabric = Array.isArray(product.fabricNames)
    ? product.fabricNames.join(", ")
    : product.fabric || product.fabrics?.join?.(", ") || "fabric details listed above";
  const dispatch = product.dispatch || product.dispatchTime || "confirmed during order verification";

  return [
    {
      question: `What is the fabric of ${name}?`,
      answer: `${name} uses ${fabric}. Please confirm live catalog details on WhatsApp before placing a bulk order.`,
    },
    {
      question: `Is ${name} available at wholesale price?`,
      answer: `Yes. ${name} is listed for wholesale ${category} buyers, resellers, boutiques, and bulk ethnic wear sourcing.`,
    },
    {
      question: `What is the dispatch time for ${name}?`,
      answer: `Dispatch is ${dispatch}. Final dispatch timing depends on live stock, packing, and order quantity.`,
    },
    {
      question: `How can I order ${name} in bulk?`,
      answer:
        "Use the WhatsApp enquiry button on this page. The Ethnicaa team will confirm live stock, final wholesale price, MOQ, payment, and shipping details.",
    },
  ];
}
