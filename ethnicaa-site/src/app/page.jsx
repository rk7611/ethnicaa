import HomeClient from "./HomeClient";

export const metadata = {
  title: "Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits",
  description: "Buy direct from Surat manufacturers at factory rates. India's top B2B wholesale marketplace for latest catalogs with worldwide shipping.",
  keywords: "Surat textile market wholesale, ethnic wear wholesale Surat, wholesale sarees Surat, wholesale kurtis Surat, Pakistani suits wholesale price, direct factory wholesale, Surat catalog wholesale, B2B clothing suppliers India, ethnic wear for resellers",
  alternates: {
    canonical: "https://ethnicaa.com",
  },
  openGraph: {
    title: "Ethnicaa: Surat Wholesale Sarees, Kurtis & Pakistani Suits",
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
