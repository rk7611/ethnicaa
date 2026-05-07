import HomeClient from "./HomeClient";
import { collection, query, where, orderBy, limit, getDocs, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isValidImageUrl } from "@/utils/imageUtils";
import { brandsData } from "@/lib/brands-data";
import { cleanTitle } from "@/lib/metadata-utils";
import FAQSchema from "@/components/FAQSchema";

const homeFaqs = [
  {
    question: "How do I buy wholesale from Ethnicaa?",
    answer: "Buying wholesale is easy! Browse our catalogs for Kurtis, Sarees, and Suits. Once you find a product you like, click the 'Enquire on WhatsApp' button to get live stock availability and the best bulk pricing direct from our Surat warehouse."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, Ethnicaa ships to over 50+ countries including USA, UK, Canada, Australia, and UAE. We use express shipping partners to ensure your wholesale orders reach you safely and quickly."
  },
  {
    question: "What is the minimum order quantity (MOQ)?",
    answer: "Most of our catalogs are available as full sets (one of each size/color in a design). For many items, we also support custom bulk orders. Contact our wholesale managers on WhatsApp for specific product MOQs."
  },
  {
    question: "Are these direct factory prices from Surat?",
    answer: "Absolutely. Ethnicaa is based in the heart of the Surat textile market. We work directly with manufacturers to bring you factory-direct rates, eliminating middlemen and helping you maximize your margins."
  }
];

export async function generateMetadata({ searchParams }) {
  const page = parseInt(searchParams?.page) || 1;
  const baseUrl = "https://ethnicaa.com";
  const url = page > 1 ? `${baseUrl}/?page=${page}` : baseUrl;
  
  const title = page > 1 
    ? `Page ${page} | Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits` 
    : "Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits";

  return {
    title: cleanTitle(title),
    description: "Ethnicaa: Buy wholesale Kurtis, Sarees & Suits direct from Surat manufacturers. Best pricing & fast global shipping for resellers.",
    keywords: "Surat textile market wholesale, ethnic wear wholesale Surat, wholesale sarees Surat, wholesale kurtis Surat, Pakistani suits wholesale price, direct factory wholesale, Surat catalog wholesale, B2B clothing suppliers India, ethnic wear for resellers",
    alternates: {
      canonical: url,
      languages: {
        "en-in": url,
        "x-default": url,
      },
    },
    openGraph: {
      title: cleanTitle(title),
      description: "Shop wholesale sarees, kurtis & Pakistani suits direct from Surat manufacturers. Best B2B prices, verified catalogs, dispatch in 24-48hrs.",
      url,
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
      title: cleanTitle(title),
      description: "Shop wholesale sarees, kurtis & Pakistani suits direct from Surat manufacturers. Best B2B prices.",
      images: ["https://ethnicaa.com/logo.png"],
    },
  };
}

export const revalidate = 3600;

    description: "Ethnicaa: Buy wholesale Kurtis, Sarees & Suits direct from Surat manufacturers. Best pricing & fast global shipping for resellers.",
    keywords: "Surat textile market wholesale, ethnic wear wholesale Surat, wholesale sarees Surat, wholesale kurtis Surat, Pakistani suits wholesale price, direct factory wholesale, Surat catalog wholesale, B2B clothing suppliers India, ethnic wear for resellers",
    alternates: {
      canonical: url,
      languages: {
        "en-in": url,
        "x-default": url,
      },
    },
    openGraph: {
      title: cleanTitle(title),
      description: "Shop wholesale sarees, kurtis & Pakistani suits direct from Surat manufacturers. Best B2B prices, verified catalogs, dispatch in 24-48hrs.",
      url,
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
      title: cleanTitle(title),
      description: "Shop wholesale sarees, kurtis & Pakistani suits direct from Surat manufacturers. Best B2B prices.",
      images: ["https://ethnicaa.com/logo.png"],
    },
  };
}

export const revalidate = 3600;

import { consolidateCategories } from "@/lib/category-utils";

function toPlain(value) {
  return JSON.parse(JSON.stringify(value));
}

async function getHomeData(page = 1) {
  const PAGE_SIZE = 30;
  
  // Parallel fetch for counts and initial data
  const [bannersSnap, catsSnap, countSnap, offersSnap] = await Promise.all([
    getDocs(query(collection(db, "banners"), orderBy("order", "asc"))),
    getDocs(collection(db, "categories")),
    getCountFromServer(query(collection(db, "products"), where("status", "in", ["published", "active"]))),
    getCountFromServer(query(collection(db, "products"), where("status", "in", ["published", "active"]), where("offer", "==", true)))
  ]);

  const totalProductsCount = countSnap.data().count;
  const totalOffersCount = offersSnap.data().count;
  const totalPages = Math.ceil(totalProductsCount / PAGE_SIZE);

  // Optimized Product Query: 
  // Since we can't easily use startAfter without a snapshot in a stateless SSR,
  // we fetch just what we need for the current page if possible, 
  // or use the current offset-like limit.
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

  // Only take the slice for the current page to keep the initial state small
  const start = (page - 1) * PAGE_SIZE;
  const allFetchedProducts = prodsSnap.docs.map(d => {
    const data = d.data();
    const createdAt = data.createdAt?.seconds || data.updatedAt?.seconds || data.timestamp || 0;
    return { id: d.id, ...data, _order: createdAt };
  });
  const products = allFetchedProducts.slice(start, start + PAGE_SIZE);

  const brands = Object.entries(brandsData).map(([slug, data]) => ({
    slug,
    name: data.name,
    image: data.image || "/logo.png"
  })).slice(0, 10);

  return { banners, categories, products, totalPages, totalProductsCount, brands };
}

import HomeSEOContent from "@/components/HomeSEOContent";

export default async function Home({ searchParams }) {
  const page = parseInt(searchParams?.page) || 1;
  const { banners, categories, products, totalPages, brands } = await getHomeData(page);

  return (
    <>
      <FAQSchema faqs={homeFaqs} id="home-faq-schema" />
      <HomeClient 
        initialBanners={toPlain(banners)}
        initialCategories={toPlain(categories)}
        initialProducts={toPlain(products)}
        initialBrands={toPlain(brands)}
        homeFaqs={homeFaqs}
        currentPage={page}
        totalPages={totalPages}
      >
        {page === 1 && <HomeSEOContent />}
      </HomeClient>
    </>
  );
}
