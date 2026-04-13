import HomeClient from "./HomeClient";

export const metadata = {
  title: "Ethnicaa: Surat Textile Market Wholesale — Sarees, Kurtis & Pakistani Suits",
  description: "Direct Surat Manufacturer Rates! Ethnicaa Wholesale is India's leading B2B supplier for latest Wholesale Catalogs, Salwar Suits, Kurtis, and Pakistani Suits. Shop at factory prices with worldwide shipping.",
  keywords: "Surat textile market wholesale, ethnic wear wholesale Surat, wholesale sarees Surat, wholesale kurtis Surat, Pakistani suits wholesale price, direct factory wholesale, Surat catalog wholesale, B2B clothing suppliers India, ethnic wear for resellers",
  alternates: {
    canonical: "https://ethnicaa.com",
  },
  openGraph: {
    title: "Ethnicaa: Surat Textile Market Wholesale — Sarees, Kurtis & Pakistani Suits",
    description: "Shop directly from Surat manufacturers at factory prices. Latest wholesale catalogs with daily new arrivals.",
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
