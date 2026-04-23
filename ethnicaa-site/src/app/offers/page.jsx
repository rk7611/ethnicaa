import OffersClient from "./OffersClient";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sale & Offers: Lot Shot Kurti, Suits | Ethnicaa Wholesale",
  description: "Grab the best wholesale deals! Lot shot kurti, lot sot suit, lot shot salwar suit, and designer gowns in half rate. Ethnicaa B2B textile marketplace.",
  keywords: "lot shot kurti, lot sot suit, lot shot salwar suit, designer gowns in half rate, wholesale kurti sale, discount salwar suits, ethnicaa sale",
  alternates: {
    canonical: "https://ethnicaa.com/offers",
  },
};

async function getOfferProducts() {
  try {
    const q = query(
      collection(db, "products"),
      where("status", "in", ["published", "active"]),
      where("offer", "==", true),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Failed to fetch offers:", err);
    return [];
  }
}

export default async function OffersPage() {
  const products = await getOfferProducts();

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
          name: "Special Offers",
          item: "https://ethnicaa.com/offers",
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
      <OffersClient initialProducts={products} />
    </>
  );
}
