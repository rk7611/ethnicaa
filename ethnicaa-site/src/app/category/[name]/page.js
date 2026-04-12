import CategoryClient from "./CategoryClient";
export const dynamic = "force-dynamic";
export async function generateStaticParams() {
  return [];
}

export default function Page({ params, searchParams }) {
  return (
    <CategoryClient 
      name={params.name} 
      searchParams={searchParams}
    />
  );
}
