import SearchClient from "./SearchClient";

export const metadata = {
  title: "Search Products | Ethnicaa Wholesale",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SearchPage() {
  return <SearchClient />;
}
