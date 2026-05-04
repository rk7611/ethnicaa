import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  metadataBase: new URL("https://ethnicaa.com"),

  title: {
    default: "Ethnicaa Wholesale | Surat Wholesale Market - Kurtis, Sarees & Suits",
    template: "%s | Ethnicaa",
  },

  description:
    "Ethnicaa Wholesale is India's leading B2B marketplace for wholesale Kurtis, Sarees, and Salwar Suits direct from Surat manufacturers. Best pricing for resellers.",

  authors: [{ name: "Ethnicaa Textiles", url: "https://ethnicaa.com" }],
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ethnicaa.com",
    siteName: "Ethnicaa Wholesale",
    title: "Ethnicaa Wholesale: B2B Ethnic Wear",
    description: "Direct Surat manufacturer rates for B2B wholesale ethnic wear.",
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
    site: "@ethnicaa",
    creator: "@ethnicaa",
    title: "Ethnicaa Wholesale",
    description: "Discover Ethnicaa Wholesale, your premier B2B source for Surat ethnic wear. Get factory-direct pricing on premium sarees, kurtis, and salwar suits with worldwide shipping.",
    images: ["https://ethnicaa.com/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "reX122ZQK9Yf0MgcGGYpvUIphSfjw-mkcS5p6BvVcSU",
  },

  alternates: {
    canonical: "https://ethnicaa.com",
  },
};

// JSON-LD Global Schema (Organization + Website + LocalBusiness)
const globalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ethnicaa.com/#organization",
      "name": "Ethnicaa Wholesale",
      "legalName": "Ethnicaa Textiles",
      "url": "https://ethnicaa.com",
      "logo": "https://ethnicaa.com/logo.png",
      "description": "India's premier B2B marketplace for wholesale ethnic wear, connecting global retailers directly with Surat's top manufacturers.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9586346332",
        "contactType": "customer service",
        "areaServed": "Global",
        "availableLanguage": ["Hindi", "English", "Gujarati"]
      },
      "sameAs": [
        "https://wa.me/9586346332",
        "https://www.instagram.com/rk7611"
      ]
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://ethnicaa.com/#localbusiness",
      "name": "Ethnicaa Wholesale",
      "image": "https://ethnicaa.com/logo.png",
      "url": "https://ethnicaa.com",
      "telephone": "+91-9586346332",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1028-29, Shree Om Market, Near RKTM, Ring Road",
        "addressLocality": "Surat",
        "addressRegion": "Gujarat",
        "postalCode": "395002",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 21.1702,
        "longitude": 72.8311
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "10:00",
        "closes": "20:00"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://ethnicaa.com/#website",
      "name": "Ethnicaa Wholesale",
      "url": "https://ethnicaa.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ethnicaa.com/search?keyword={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ],
};

import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

const inter = Inter({ subsets: ["latin"] });

import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <head>
        {/* Preconnect & DNS Prefetch for Speed */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Global Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>

      <body className={inter.className}>
        <GoogleAnalytics gaId="G-XF0XGW58DX" />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppPopup />
        <SpeedInsights />
      </body>
    </html>
  );
}
