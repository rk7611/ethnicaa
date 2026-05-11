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
    question: "Where can I buy sarees and kurtis wholesale in Surat?",
    answer: "For the best wholesale sarees and kurtis in Surat, visit Ethnicaa Wholesale at Shree Om Market, Ring Road. We provide direct factory-access to the latest catalogs, eliminating middlemen to give you the best profit margins. You can also browse and order online via our website with pan-India and global shipping."
  },
  {
    question: "How can I start a boutique business with Ethnicaa?",
    answer: "Ethnicaa provides end-to-end support for new boutiques, including direct Surat manufacturer pricing and managed ecommerce infrastructure for approved partners."
  },
  {
    question: "Does Ethnicaa provide ecommerce website support for resellers?",
    answer: "Yes, we help approved partners launch their own branded online stores with live inventory integration and tech support."
  },
  {
    question: "How to source wholesale kurtis and sarees directly from Surat?",
    answer: "Ethnicaa is a direct Surat-based manufacturer. You can source premium ethnic wear at factory rates through our partner onboarding program."
  },
  {
    question: "What is the minimum order quantity for wholesale?",
    answer: "Ethnicaa focuses on supporting boutiques and resellers, offering flexible wholesale volumes to help businesses scale without massive inventory risk."
  },
  {
    question: "Are these direct factory prices from Surat?",
    answer: "Absolutely. Ethnicaa is based in the heart of the Surat textile market. We work directly with manufacturers to bring you factory-direct rates, eliminating middlemen and helping you maximize your margins."
  },
  {
    question: "Does Ethnicaa provide ecommerce support for resellers?",
    answer: "Yes, Ethnicaa offers professional ecommerce support for approved reseller partners. Selected buyers can apply for branded online store assistance to help them scale their fashion business globally."
  },
  {
    question: "Can Ethnicaa help me start an online boutique?",
    answer: "Absolutely. We help fashion entrepreneurs launch their online boutiques by providing not just wholesale products, but also the digital infrastructure and branded store assistance needed for a professional launch."
  },
  {
    question: "Do I need coding knowledge to sell online with Ethnicaa?",
    answer: "No coding knowledge is required. Our ecommerce support program handles the technical setup, allowing approved partners to focus on marketing and growing their boutique."
  },
  {
    question: "Does Ethnicaa support reseller growth?",
    answer: "Yes, we have a dedicated reseller ecosystem designed to help you scale from a home-based seller to a professional online brand with dedicated support and infrastructure."
  },
  {
    question: "Can approved buyers receive branded online store support?",
    answer: "Yes, as part of our reseller growth ecosystem, selected wholesale partners may receive branded online store assistance to streamline their sales and professionalize their brand presence."
  }
];

const globalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ethnicaa.com/#organization",
      "name": "Ethnicaa Wholesale",
      "url": "https://ethnicaa.com",
      "logo": "https://ethnicaa.com/logo.png",
      "description": "Ethnicaa is a leading Surat-based manufacturer and B2B infrastructure provider for ethnic wear boutiques and resellers.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Surat",
        "addressRegion": "Gujarat",
        "addressCountry": "IN"
      }
    }
  ]
};

export async function generateMetadata({ searchParams }) {
  const page = parseInt(searchParams?.page) || 1;
  const baseUrl = "https://ethnicaa.com";
  const url = page > 1 ? `${baseUrl}/?page=${page}` : baseUrl;

  const title = page > 1
    ? `Page ${page} | Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits`
    : "Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits | Boutique & Reseller Ecommerce Support";

  return {
    title: cleanTitle(title),
    description: "Ethnicaa: Buy wholesale Kurtis, Sarees & Suits direct from Surat manufacturers. We provide approved resellers and boutique owners with ecommerce support, branded online store assistance, and reseller growth infrastructure.",
    keywords: "Surat textile market wholesale, ethnic wear wholesale Surat, wholesale sarees Surat, wholesale kurtis Surat, Pakistani suits wholesale price, direct factory wholesale, Surat catalog wholesale, B2B clothing suppliers India, ethnic wear for resellers, boutique suppliers, reseller growth support, online boutique support, ecommerce setup for resellers, how to start clothing business, fashion reseller business",
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
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

function buildItemListSchema(products) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": products.length,
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://ethnicaa.com/product/${p.slug}`,
      "name": p.catalog || p.name,
      "image": p.images?.[0] || ""
    }))
  };
}

export const revalidate = 3600;

import { consolidateCategories } from "@/lib/category-utils";

let homeCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 600 * 1000; // 10 minutes

async function getHomeData(page = 1) {
  // Simple in-memory cache for the first page to ensure blazing fast TTFB
  if (page === 1 && homeCache && Date.now() - lastCacheUpdate < CACHE_DURATION) {
    return homeCache;
  }

  const PAGE_SIZE = 30;

  // Parallel fetch for counts and initial data
  // We use a faster query approach for home to ensure TTFB stays under 1s
  const [bannersSnap, catsSnap, countSnap] = await Promise.all([
    getDocs(query(collection(db, "banners"), orderBy("order", "asc"))),
    getDocs(collection(db, "categories")),
    getCountFromServer(query(collection(db, "products"), where("status", "in", ["published", "active"]))),
  ]);

  const totalProductsCount = countSnap.data().count;
  const totalOffersCount = 0; // Simplified for home page speed; actual count can load on /offers page
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
  const products = allFetchedProducts.slice(start, start + PAGE_SIZE).map(p => ({
    id: p.id,
    slug: p.slug || p.id,
    name: p.name || "",
    catalog: p.catalog || "",
    images: p.images?.slice(0, 1) || [],
    price: p.price || 0,
    offer_price: p.offer_price || 0,
    offer: p.offer || false,
    discount_percent: p.discount_percent || 0,
  }));

  const brands = Object.entries(brandsData).map(([slug, data]) => ({
    slug,
    name: data.name,
    image: data.image || "/logo.png"
  })).slice(0, 10);

  const result = { banners, categories, products, totalPages, totalProductsCount, brands };
  
  if (page === 1) {
    homeCache = result;
    lastCacheUpdate = Date.now();
  }

  return result;
}

function toPlain(value) {
  return JSON.parse(JSON.stringify(value));
}

import HomeSEOContent from "@/components/HomeSEOContent";

export default async function Home({ searchParams }) {
  const page = Math.min(parseInt(searchParams?.page) || 1, 50); // Prevent deep-crawl timeouts
  const { banners, categories, products, totalPages, brands, totalProductsCount } = await getHomeData(page);

  const itemListSchema = buildItemListSchema(products);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([globalSchema, itemListSchema]) }}
      />
      <FAQSchema faqs={homeFaqs} id="home-faq-schema" />
      <HomeClient
        initialBanners={toPlain(banners)}
        initialCategories={toPlain(categories)}
        initialProducts={toPlain(products)}
        initialBrands={toPlain(brands)}
        homeFaqs={homeFaqs}
        currentPage={page}
        totalPages={totalPages}
        totalProductsCount={totalProductsCount}
      >
        {page === 1 && <HomeSEOContent />}
      </HomeClient>
    </>
  );
}
