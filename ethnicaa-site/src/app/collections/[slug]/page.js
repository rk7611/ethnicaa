import CollectionsClient from "./CollectionsClient";
import { 
  parseCollectionSlug, 
  generateCollectionTitle, 
  generateCollectionDescription 
} from "@/lib/seo-utils";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

async function getCollectionProducts(slug) {
  const components = parseCollectionSlug(slug);
  const { fabric, category } = components;

  try {
    let q = query(
      collection(db, "products"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
      limit(300)
    );

    const snap = await getDocs(q);
    let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Filter by Category in JS
    if (category) {
      const catLower = category.toLowerCase();
      list = list.filter(p => {
         const prodCat = (p.category || "").toLowerCase();
         const prodCats = (p.categoryNames || []).map(c => c.toLowerCase());
         return prodCat.includes(catLower) || catLower.includes(prodCat) || prodCats.some(c => c.includes(catLower));
      });
    }

    // Filter by Fabric in JS
    if (fabric) {
      const fabLower = fabric.toLowerCase();
      list = list.filter(p => {
        const prodFabrics = (p.fabricNames || []).map(f => f.toLowerCase());
        const prodFabricStr = (p.fabric || "").toLowerCase();
        return prodFabrics.includes(fabLower) || prodFabricStr.includes(fabLower);
      });
    }

    return list.slice(0, 40);
  } catch (error) {
    console.error("Error fetching collection products:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const components = parseCollectionSlug(slug);
  
  const title = generateCollectionTitle(components);
  const description = generateCollectionDescription(components);
  const url = `https://ethnicaa.com/collections/${slug}`;

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

export default async function Page({ params }) {
  const products = await getCollectionProducts(params.slug);
  const components = parseCollectionSlug(params.slug);

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
          name: "Collections",
          item: "https://ethnicaa.com",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: components.label,
          item: `https://ethnicaa.com/collections/${params.slug}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: components.label,
      url: `https://ethnicaa.com/collections/${params.slug}`,
      description: generateCollectionDescription(components),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://ethnicaa.com/product/${p.slug}`,
          name: p.catalog || p.name,
          image: p.images?.[0] || "",
        })),
      },
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaList) }}
      />
      <CollectionsClient slug={params.slug} initialProducts={products} />
    </>
  );
}
