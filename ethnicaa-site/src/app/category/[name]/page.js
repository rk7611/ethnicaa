import CategoryClient from "./CategoryClient";
import { doc, getDoc, collection, query, where, getDocs, limit, orderBy, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCategorySeoContent } from "@/lib/commerce-seo-content";
import { cleanTitle } from "@/lib/metadata-utils";

export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";

const PAGE_SIZE = 40;

function toPlain(value) {
  return JSON.parse(JSON.stringify(value));
}

const VALID_STATIC_CATEGORIES = [
  "sarees",
  "saree",
  "kurtis",
  "kurti",
  "pakistani-suits",
  "pakistani-suit",
  "salwar-suits",
  "salwar-suit",
  "readymade-salwar-suit",
  "readymade-suits",
  "lehenga",
  "lahanga",
  "gowns",
  "gown",
  "designer-gowns",
  "designer-gown",
  "all-products",
  "offers"
];

async function getCategoryData(categorySlug) {
  const ref = doc(db, "categories", categorySlug);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { slug: categorySlug, ...snap.data() };
  }
  
  if (VALID_STATIC_CATEGORIES.includes(categorySlug)) {
    return {
      slug: categorySlug,
      name: categorySlug.replace(/-/g, " "),
    };
  }
  
  return null;
}

async function getProductsData(categorySlug, sort = "latest", page = 1) {
  try {
    const constraints = [where("status", "==", "published")];
    
    if (categorySlug === "offers") {
      constraints.push(where("offer", "==", true));
    } else if (categorySlug !== "all-products") {
      const categoryMap = {
        "sarees": "sarees",
        "saree": "sarees",
        "kurtis": "kurti",
        "kurti": "kurti",
        "gowns": "gown",
        "gown": "gown",
        "designer-gowns": "gown",
        "designer-gown": "gown",
        "lehenga": "lahanga",
        "lahanga": "lahanga",
        "pakistani-suits": "pakistani-suits",
        "pakistani-suit": "pakistani-suits",
        "salwar-suits": "salwar-suits",
        "salwar-suit": "salwar-suits",
        "readymade-salwar-suit": "readymade-salwar-suits",
        "readymade-suits": "readymade-salwar-suits",
        "semi-stitched": "semi-stitched-salwar-suit"
      };
      const categoryQuery = categoryMap[categorySlug] || categorySlug;
      constraints.push(where("categories", "array-contains", categoryQuery));
    }

    let sortField = "createdAt";
    let sortDir = "desc";

    if (sort === "oldest") sortDir = "asc";
    else if (sort === "low-high") {
      sortField = "price";
      sortDir = "asc";
    } else if (sort === "high-low") {
      sortField = "price";
      sortDir = "desc";
    }

    // --- PAGINATION LOGIC ---
    let q = query(
      collection(db, "products"),
      ...constraints,
      orderBy(sortField, sortDir),
      limit(page * PAGE_SIZE)
    );

    const [snap, countSnap] = await Promise.all([
      getDocs(q),
      getCountFromServer(query(collection(db, "products"), ...constraints)),
    ]);
    const allDocs = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // Slice for the specific page
    const start = (page - 1) * PAGE_SIZE;
    return {
      products: allDocs.slice(start, start + PAGE_SIZE),
      totalCount: countSnap.data().count,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalCount: 0 };
  }
}

const CATEGORY_META = {
  "sarees": {
    title: "Wholesale Sarees in Surat | Factory Prices | Ethnicaa B2B",
    description: "Buy wholesale sarees in Surat at factory prices. Silk, georgette, organza, cotton & designer catalogs. Best rates for resellers & boutique owners. COD available."
  },
  "kurtis": {
    title: "Wholesale Kurtis from Surat Manufacturers",
    description: "Wholesale kurtis from Surat manufacturers. Cotton, rayon, georgette & anarkali styles. Bulk pricing for resellers, boutique owners & retailers across India."
  },
  "pakistani-suits": {
    title: "Wholesale Pakistani Suits Surat | Factory Price",
    description: "Wholesale Pakistani suits from Surat — lawn, cotton, embroidered readymade sets. Direct factory price, pan-India delivery. Best B2B rates for resellers."
  },
  "salwar-suits": {
    title: "Wholesale Salwar Suits Surat | Ethnicaa B2B",
    description: "Wholesale salwar suits catalog from Surat. Designer, printed & embroidered collections for bulk buyers. Reseller-friendly pricing, fast dispatch."
  }
};

export async function generateMetadata({ params, searchParams }) {
  const slug = params.name;
  const page = parseInt(searchParams?.page) || 1;
  const name = decodeURIComponent(slug).toLowerCase();
  const category = await getCategoryData(slug);
  if (!category) return notFound();
  
  const custom = CATEGORY_META[name];
  const baseTitle = category.category_seo_title || custom?.title || `${category.name} Wholesale Catalog 2026 — Factory Price Surat`;
  const title = cleanTitle(page > 1 ? `Page ${page} | ${baseTitle}` : baseTitle);
  
  const description = category.category_seo_description || custom?.description || `Buy ${category.name} at wholesale rates direct from Surat manufacturers. Perfect for bulk buyers & resellers with worldwide delivery.`;
  
  // Normalize canonical URL to /category/lehenga for SEO consistency
  const canonicalSlug = slug === "lahanga" ? "lehenga" : slug;
  const baseUrl = `https://ethnicaa.com/category/${canonicalSlug}`;
  const url = page > 1 ? `${baseUrl}/?page=${page}` : baseUrl;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
        "x-default": url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Ethnicaa Wholesale",
      images: [
        {
          url: "https://ethnicaa.com/logo.png",
          width: 800,
          height: 600,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://ethnicaa.com/logo.png"],
    },
  };
}

export default async function Page({ params, searchParams }) {
  const categorySlug = decodeURIComponent(params.name);
  const sort = searchParams?.sort || "latest";
  const page = Math.min(parseInt(searchParams?.page) || 1, 50); // Hard limit to prevent Firestore timeouts

  const [category, productsResult] = await Promise.all([
    getCategoryData(categorySlug),
    getProductsData(categorySlug, sort, page)
  ]);
  
  if (!category) return notFound();

  // Redirect /category/lahanga to /category/lehenga for SEO and to fix broken links
  if (categorySlug === "lahanga") {
    redirect(`/category/lehenga${searchParams?.page ? `?page=${searchParams.page}` : ""}`);
  }

  const categorySeo = getCategorySeoContent(categorySlug, category);
  const products = productsResult.products.map(p => ({
    id: p.id,
    slug: p.slug || p.id,
    name: p.name || "",
    catalog: p.catalog || "",
    images: p.images?.slice(0, 1) || [],
    price: p.price || 0,
    offer: p.offer || false,
    discount_percent: p.discount_percent || 0,
  }));

  const totalCount = productsResult.totalCount;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // SERVER-SIDE SCHEMAS
  const schemaList = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://ethnicaa.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: category.name,
          item: `https://ethnicaa.com/category/${categorySlug}`,
        },
      ],
    }
  ];

  schemaList.push({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categorySeo.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });

  if (products.length > 0) {
    schemaList.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.name,
      url: `https://ethnicaa.com/category/${categorySlug}`,
      description: category.category_seo_description || `Wholesale collection of ${category.name}.`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: products.slice(0, 50).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://ethnicaa.com/product/${p.slug}`,
          name: p.catalog || p.name,
          image: p.images?.[0] || "",
        })),
      },
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaList) }}
      />
      <CategoryClient 
        name={params.name} 
        searchParams={searchParams}
        initialCategory={toPlain(category)}
        initialProducts={toPlain(products)}
        currentPage={page}
        totalPages={totalPages}
        categorySeo={categorySeo}
      />
    </>
  );
}
