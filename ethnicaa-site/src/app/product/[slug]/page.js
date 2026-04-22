import ProductClient from "./ProductClient";
import { doc, getDoc } from "firebase/firestore";
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

export default function Page({ params, searchParams }) {
  return (
    <ProductClient 
      slug={params.slug} 
      searchParams={searchParams}
    />
  );
}