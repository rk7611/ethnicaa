import { getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  parseCollectionSlug, 
  generateCollectionTitle, 
  generateCollectionDescription,
  LANGUAGES
} from "@/lib/seo-utils";
import CollectionsClient from "@/app/collections/[slug]/CollectionsClient";
import { notFound } from "next/navigation";
import { cleanTitle, collectionLanguageAlternates } from "@/lib/metadata-utils";

export async function generateMetadata({ params }) {
  const { lang, slug } = params;
  if (!LANGUAGES[lang]) return {};

  const components = parseCollectionSlug(slug, lang);
  const title = cleanTitle(generateCollectionTitle(components, lang));
  const description = generateCollectionDescription(components, lang);

  // hreflang alternates
  const alternates = {
    canonical: `https://ethnicaa.com/${lang}/collections/${slug}`,
    languages: collectionLanguageAlternates(slug),
  };

  return {
    title,
    description,
    alternates,
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function VernacularCollectionPage({ params }) {
  const { lang, slug } = params;
  if (!LANGUAGES[lang]) notFound();

  const components = parseCollectionSlug(slug, lang);
  const { category } = components;

  let products = [];
  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "published"),
      where("categories", "array-contains", category || "Sarees"),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const snap = await getDocs(q);
    products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error(e);
  }

  return (
    <CollectionsClient 
      slug={slug} 
      lang={lang} 
      initialProducts={JSON.parse(JSON.stringify(products))} 
    />
  );
}
