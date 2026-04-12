import ProductClient from "./ProductClient";

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