import CategoryClient from "./CategoryClient";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const categorySlug = decodeURIComponent(params.name);
  const ref = doc(db, "categories", categorySlug);
  const snap = await getDoc(ref);

  let category = null;
  if (snap.exists()) {
    category = { slug: categorySlug, ...snap.data() };
  } else {
    category = {
      slug: categorySlug,
      name: categorySlug.replace(/-/g, " "),
    };
  }

  const title = category.category_seo_title || `Latest ${category.name} Wholesale Catalog 2026 — Factory Price in Surat`;
  const description = category.category_seo_description || `Explore the largest collection of ${category.name} at wholesale rates. Direct from Surat textile market manufacturers. Perfect for bulk buyers and resellers. Daily new arrivals with worldwide delivery.`;
  const url = `https://ethnicaa.com/category/${categorySlug}`;

  return {
    title,
    description,
    keywords: category.category_seo_keywords || `${category.name}, wholesale ${category.slug}, ${category.name} catalog`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
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

export default function Page({ params, searchParams }) {
  return (
    <CategoryClient 
      name={params.name} 
      searchParams={searchParams}
    />
  );
}