import HomeClient from "./HomeClient";

export const metadata = {
  title: "Ethnicaa Wholesale — Latest Wholesale Catalogs, Sarees, Suits & Kurtis",
  description: "Ethnicaa Wholesale brings you the latest wholesale catalogs in Sarees, Kurtis, Salwar Suits, Pakistani Suits, Gowns, Lehengas & more. Best wholesale prices with daily new arrivals.",
  keywords: "Ethnicaa, wholesale suits, wholesale sarees, wholesale kurtis, pakistan suits wholesale, gown wholesale, ethnic wear wholesale, catalog wholesale",
  alternates: {
    canonical: "https://ethnicaa.com",
  },
  openGraph: {
    title: "Ethnicaa Wholesale — Latest Wholesale Catalogs, Sarees, Suits & Kurtis",
    description: "Ethnicaa Wholesale brings you the latest wholesale catalogs in Sarees, Kurtis, Salwar Suits, Pakistani Suits, Gowns, Lehengas & more.",
    url: "https://ethnicaa.com",
    siteName: "Ethnicaa Wholesale",
    images: [
      {
        url: "https://ethnicaa.com/logo.png",
        width: 800,
        height: 600,
        alt: "Ethnicaa Wholesale",
      },
    ],
    type: "website",
  },
};

export default function Page() {
  return <HomeClient />;
}
