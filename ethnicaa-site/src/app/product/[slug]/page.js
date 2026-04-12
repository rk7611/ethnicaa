import ProductClient from "./ProductClient";
export const dynamic = "force-dynamic";
export async function generateStaticParams() {
  return [];
}

export default function Page({ params, searchParams }) {
  return (
    <ProductClient 
      slug={params.slug} 
      searchParams={searchParams}
    />
  );
}
