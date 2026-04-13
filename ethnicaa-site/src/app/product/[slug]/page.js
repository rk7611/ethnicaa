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
  const title = p.seo_title || `${p.catalog || p.name} | Ethnicaa Wholesale`;
  const description = p.seo_description || p.description || p.name;
  const image = p.coverImage || p.images?.[0] || "https://ethnicaa.com/logo.png";
  const url = `https://ethnicaa.com/product/${slug}`;

  return {
    title,
    description,
    keywords: p.seo_keywords || `${p.name}, wholesale ${slug}`,
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