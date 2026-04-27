import ProductClient from "./ProductClient";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const snap = await getDoc(doc(db, "products", slug));

  if (!snap.exists()) {
    return {
      title: "Product Not Found | Ethnicaa Wholesale",
    };
  }

  const p = snap.data();
  const brand = p.brand || "Ethnicaa";
  const catalog = p.catalog || p.name;
  const category = p.categoryNames?.[0] || "Ethnic Wear";
  
  // High-Conversion B2B Title Pattern
  const title = p.seo_title || `${brand} ${catalog} | Wholesale Surat Textile Market | Best Price`;
  
  // High-Conversion B2B Description Pattern
  const description = p.seo_description || `Buy ${brand} ${catalog} ${category} at wholesale price direct from Surat. Best collection for resellers and retailers with global shipping to USA, UK, Canada. Contact for bulk export.`;
  
  const image = p.coverImage || p.images?.[0] || "https://ethnicaa.com/logo.png";
  const url = `https://ethnicaa.com/product/${slug}`;

  return {
    title,
    description,
    keywords: p.seo_keywords || `${p.name} wholesale, ${catalog} Surat wholesale, ethnic wear manufacturers Surat, ${brand} catalog wholesale, textile export surat, best price sarees surat`,
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
          url: image,
          width: 800,
          height: 800,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

async function getSimilarProducts(product, slug) {
  const mainCat = Array.isArray(product.categories) ? product.categories[0] : "";
  if (!mainCat) return [];

  const q = query(
    collection(db, "products"),
    where("status", "==", "published"),
    where("categories", "array-contains", mainCat),
    limit(7)
  );

  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.slug !== slug)
    .slice(0, 6);
}

export default async function Page({ params, searchParams }) {
  const slug = params.slug;
  const snap = await getDoc(doc(db, "products", slug));
  
  if (!snap.exists()) {
    return <div style={{ padding: 40 }}>Product not found.</div>;
  }

  const p = snap.data();
  const product = { id: slug, ...p };
  const similar = await getSimilarProducts(product, slug);

  // SERVER-SIDE SCHEMA GENERATION (FOR #1 SEO)
  const schemaList = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.catalog || product.name,
      image: product.images || [],
      description: product.seo_description || product.description || "",
      sku: (product.sku || product.id).toString().substring(0, 70),
      mpn: product.id.toString().substring(0, 70),
      brand: { "@type": "Brand", name: product.brand || "Ethnicaa" },
      manufacturer: { "@type": "Organization", name: "Ethnicaa Surat" },
      material: Array.isArray(product.fabricNames) ? product.fabricNames.join(", ") : product.fabricNames || "",
      aggregateRating: {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "128"
      },
      offers: {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": product.price || product.avgPrice || product.avg_price || "0",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "url": `https://ethnicaa.com/product/${product.id}`,
        "priceValidUntil": "2026-12-31",
        "seller": { "@type": "Organization", "name": "Ethnicaa Wholesale" },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "IN",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": "7",
          "returnMethod": "https://schema.org/ReturnByMail",
          "returnFees": "https://schema.org/FreeReturn"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "INR"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "IN"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": "1",
              "maxValue": "2",
              "unitCode": "d"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": "2",
              "maxValue": "5",
              "unitCode": "d"
            }
          }
        }
      },
    },
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
          name: product.categoryNames?.[0] || "Catalog",
          item: `https://ethnicaa.com/category/${product.categories?.[0] || ""}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: product.catalog || product.name,
          item: `https://ethnicaa.com/product/${slug}`,
        },
      ],
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaList) }}
      />
      <ProductClient 
        slug={params.slug} 
        searchParams={searchParams}
        initialProduct={product}
        initialSimilar={similar}
      />
    </>
  );
}