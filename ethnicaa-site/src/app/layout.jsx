import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  metadataBase: new URL("https://ethnicaa.com"),

  title: {
    default: "Ethnicaa Wholesale",
    template: "%s | Ethnicaa Wholesale",
  },

  description:
    "Ethnicaa Wholesale offers latest wholesale Sarees, Kurtis, Pakistani Suits, Salwar Suits, Gowns, Lehengas and more. Daily new arrivals with best wholesale pricing.",

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ethnicaa.com",
    siteName: "Ethnicaa Wholesale",
    title: "Ethnicaa Wholesale",
    description:
      "India’s fastest growing wholesale ethnic wear marketplace for Sarees, Kurtis, Salwar Suits, Lehengas & more.",
    images: [
      {
        url: "https://ethnicaa.com/logo.png",
        width: 800,
        height: 600,
        alt: "Ethnicaa Wholesale",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ethnicaa Wholesale",
    description:
      "Latest wholesale ethnic wear with daily new catalog uploads.",
    images: ["https://ethnicaa.com/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://ethnicaa.com",
  },
};

// JSON-LD Global Schema (Organization + Website)
const globalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Ethnicaa Wholesale",
      url: "https://ethnicaa.com",
      logo: "https://ethnicaa.com/logo.png",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-9586346332",
        contactType: "sales",
      },
      sameAs: [
        "https://www.instagram.com",
        "https://www.facebook.com",
      ],
    },
    {
      "@type": "WebSite",
      name: "Ethnicaa Wholesale",
      url: "https://ethnicaa.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://ethnicaa.com/search?keyword={search}",
        "query-input": "required name=search",
      },
    },
  ],
};

import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for Speed */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Global Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>

      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <GoogleAnalytics gaId="G-XF0XGW58DX" />
      </body>
    </html>
  );
}
