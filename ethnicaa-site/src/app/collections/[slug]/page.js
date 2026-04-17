import CollectionsClient from "./CollectionsClient";
import { 
  parseCollectionSlug, 
  generateCollectionTitle, 
  generateCollectionDescription 
} from "@/lib/seo-utils";

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

export default function Page({ params }) {
  return <CollectionsClient slug={params.slug} />;
}
