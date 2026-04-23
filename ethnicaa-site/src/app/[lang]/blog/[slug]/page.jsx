import { blogs } from "@/lib/blog-data";
import BlogPost from "@/app/blog/[slug]/page";
import { LANGUAGES } from "@/lib/seo-utils";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang, slug } = params;
  const post = blogs.find(b => b.slug === slug && b.lang === lang);
  if (!post) return {};

  return {
    title: `${post.title} | Ethnicaa`,
    description: post.excerpt,
    alternates: {
      languages: {
        "en": `https://ethnicaa.com/blog/${slug}`,
        [lang]: `https://ethnicaa.com/${lang}/blog/${slug}`,
      }
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
