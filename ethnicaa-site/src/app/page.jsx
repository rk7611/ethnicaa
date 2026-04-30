import HomeClient from "./HomeClient";
import { collection, query, where, orderBy, limit, getDocs, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isValidImageUrl } from "@/utils/imageUtils";
import { brandsData } from "@/lib/brands-data";

export const metadata = {
  title: "Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits",
  description: "Ethnicaa: Buy wholesale Kurtis, Sarees & Suits direct from Surat manufacturers. Best pricing & fast global shipping for resellers.",
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

export const revalidate = 3600;

import { consolidateCategories } from "@/lib/category-utils";

async function getHomeData(page = 1) {
  const PAGE_SIZE = 12;
  const bannersQuery = query(collection(db, "banners"), orderBy("order", "asc"));
  const categoriesQuery = query(collection(db, "categories"));
  
  const totalCountQuery = query(
    collection(db, "products"),
    where("status", "in", ["published", "active"])
  );

  const offersCountQuery = query(
    collection(db, "products"),
    where("status", "in", ["published", "active"]),
    where("offer", "==", true)
  );

  const [bannersSnap, catsSnap, countSnap, offersSnap] = await Promise.all([
    getDocs(bannersQuery),
    getDocs(categoriesQuery),
    getCountFromServer(totalCountQuery),
    getCountFromServer(offersCountQuery)
  ]);

  const totalProductsCount = countSnap.data().count;
  const totalOffersCount = offersSnap.data().count;
  const totalPages = Math.ceil(totalProductsCount / PAGE_SIZE);

  const productsQuery = query(
    collection(db, "products"),
    where("status", "in", ["published", "active"]),
    orderBy("createdAt", "desc"),
    limit(page * PAGE_SIZE)
  );

  const prodsSnap = await getDocs(productsQuery);
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

  const categories = consolidateCategories(rawCategories, totalProductsCount, totalOffersCount);

  const allProducts = prodsSnap.docs.map(d => {
    const data = d.data();
    const createdAt = data.createdAt?.seconds || data.updatedAt?.seconds || data.timestamp || 0;
    return { id: d.id, ...data, _order: createdAt };
  });
  
  // Slice for current page
  const start = (page - 1) * PAGE_SIZE;
  const products = allProducts.slice(start, start + PAGE_SIZE);

  const brands = Object.entries(brandsData).map(([slug, data]) => ({
    slug,
    name: data.name,
    image: data.image || "/logo.png"
  })).slice(0, 10); // Show top 10 brands

  return { banners, categories, products, totalPages, totalProductsCount, brands };
}

export default async function Home({ searchParams }) {
  const page = parseInt(searchParams?.page) || 1;
  const { banners, categories, products, totalPages, brands } = await getHomeData(page);

  return (
    <HomeClient 
      initialBanners={banners} 
      initialCategories={categories} 
      initialProducts={products} 
      initialBrands={brands}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}
