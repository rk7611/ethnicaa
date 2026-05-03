import { blogs } from "@/lib/blog-data";
import BlogPost from "@/app/blog/[slug]/page";
import { LANGUAGES } from "@/lib/seo-utils";
import { notFound } from "next/navigation";
import { blogLanguageAlternates, cleanTitle } from "@/lib/metadata-utils";

export async function generateMetadata({ params }) {
  const { lang, slug } = params;
  const post = blogs.find(b => b.slug === slug && b.lang === lang);
  if (!post) return {};

  return {
    title: cleanTitle(post.title),
    description: post.excerpt,
    alternates: {
      canonical: `https://ethnicaa.com/${lang}/blog/${slug}`,
      languages: blogLanguageAlternates(slug, lang),
    }
  };
}

export default function VernacularBlogPostPage({ params }) {
  const { lang, slug } = params;
  if (!LANGUAGES[lang]) notFound();

  const post = blogs.find(b => b.slug === slug && b.lang === lang);
  if (!post) notFound();

  return <BlogPost params={params} />;
}
