import HomeClient from "./HomeClient";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isValidImageUrl } from "@/utils/imageUtils";

export const metadata = {
  title: "Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits",
  description: "Shop wholesale sarees, kurtis & Pakistani suits direct from Surat manufacturers. Best B2B prices, verified catalogs, dispatch in 24-48hrs. Join 10,000+ resellers.",
  keywords: "Surat textile market wholesale, ethnic wear wholesale Surat, wholesale sarees Surat, wholesale kurtis Surat, Pakistani suits wholesale price, direct factory wholesale, Surat catalog wholesale, B2B clothing suppliers India, ethnic wear for resellers",
  alternates: {
    canonical: "https://ethnicaa.com",
  },
  openGraph: {
    title: "Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits",
    description: "Shop wholesale sarees, kurtis & Pakistani suits direct from Surat manufacturers. Best B2B prices, verified catalogs, dispatch in 24-48hrs.",
    url: "https://ethnicaa.com",
    siteName: "Ethnicaa Wholesale",
    images: [
      {
        url: "https://ethnicaa.com/logo.png",
        width: 800,
        height: 600,
        alt: "Ethnicaa Wholesale",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits",
    description: "Shop wholesale sarees, kurtis & Pakistani suits direct from Surat manufacturers. Best B2B prices.",
    images: ["https://ethnicaa.com/logo.png"],
  },
};

export const dynamic = "force-dynamic";

import { consolidateCategories } from "@/lib/category-utils";

async function getHomeData() {
  const bannersQuery = query(collection(db, "banners"), orderBy("order", "asc"));
  const categoriesQuery = query(collection(db, "categories"));
  const productsQuery = query(
    collection(db, "products"),
    where("status", "in", ["published", "active"]),
    orderBy("createdAt", "desc"),
    limit(12)
  );

  const [bannersSnap, catsSnap, prodsSnap] = await Promise.all([
    getDocs(bannersQuery),
    getDocs(categoriesQuery),
    getDocs(productsQuery)
  ]);

  const banners = bannersSnap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(b => isValidImageUrl(b.imageURL));

  const rawCategories = catsSnap.docs.map(d => {
    const cat = d.data();
    return {
      slug: d.id,
      name: cat.name ?? d.id.replace(/-/g, " "),
      cover: isValidImageUrl(cat.cover) ? cat.cover : null,
      count: cat.count || 0,
    };
  });

  const categories = consolidateCategories(rawCategories);

  const products = prodsSnap.docs.map(d => {
    const data = d.data();
    const createdAt = data.createdAt?.seconds || data.updatedAt?.seconds || data.timestamp || 0;
    return { id: d.id, ...data, _order: createdAt };
  });
  products.sort((a, b) => b._order - a._order);

  return { banners, categories, products };
}

export default async function Home() {
  const { banners, categories, products } = await getHomeData();

  return (
    <HomeClient 
      initialBanners={banners} 
      initialCategories={categories} 
      initialProducts={products} 
    />
  );
}
