import CategoryClient from "./CategoryClient";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

async function getCategoryData(categorySlug) {
  const ref = doc(db, "categories", categorySlug);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { slug: categorySlug, ...snap.data() };
  }
  return {
    slug: categorySlug,
    name: categorySlug.replace(/-/g, " "),
  };
}

async function getProductsData(categorySlug) {
  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "published"),
      where("categories", "array-contains", categorySlug),
      limit(PAGE_SIZE * 2)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

const CATEGORY_META = {
  "sarees": {
    title: "Wholesale Sarees in Surat | Factory Prices | Ethnicaa B2B",
    description: "Buy wholesale sarees in Surat at factory prices. Silk, georgette, organza, cotton & designer catalogs. Best rates for resellers & boutique owners. COD available."
  },
  "kurtis": {
    title: "Wholesale Kurtis from Surat Manufacturers | Ethnicaa Wholesale",
    description: "Wholesale kurtis from Surat manufacturers. Cotton, rayon, georgette & anarkali styles. Bulk pricing for resellers, boutique owners & retailers across India."
  },
  "pakistani-suits": {
    title: "Wholesale Pakistani Suits Surat | Direct Factory Price | Ethnicaa",
    description: "Wholesale Pakistani suits from Surat — lawn, cotton, embroidered readymade sets. Direct factory price, pan-India delivery. Best B2B rates for resellers."
  },
  "salwar-suits": {
    title: "Wholesale Salwar Suits Catalog Surat | Ethnicaa B2B Marketplace",
    description: "Wholesale salwar suits catalog from Surat. Designer, printed & embroidered collections for bulk buyers. Reseller-friendly pricing, fast dispatch."
  }
};

export async function generateMetadata({ params }) {
  const slug = params.name;
  const name = decodeURIComponent(slug).toLowerCase();
  const category = await getCategoryData(slug);
  
  const custom = CATEGORY_META[name];
  const title = category.category_seo_title || custom?.title || `${category.name} Wholesale Catalog 2026 — Factory Price Surat`;
  const description = category.category_seo_description || custom?.description || `Buy ${category.name} at wholesale rates direct from Surat manufacturers. Perfect for bulk buyers & resellers with worldwide delivery.`;
  const url = `https://ethnicaa.com/category/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
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
  const [category, products] = await Promise.all([
    getCategoryData(categorySlug),
    getProductsData(categorySlug)
  ]);

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
        initialCategory={category}
        initialProducts={products}
      />
    </>
  );
}