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
    description: "Daily new arrivals of Surat wholesale ethnic wear. Factory prices for resellers.",
    images: ["https://ethnicaa.com/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "GSC_VERIFICATION_CODE_HERE", // User to replace with actual code
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
      "url": "https://ethnicaa.com",
      "logo": "https://ethnicaa.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9586346332",
        "contactType": "customer service",
        "availableLanguage": ["Hindi", "English"]
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
        "streetAddress": "Ring Road",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for Speed */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Global Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />

        {/* Google Analytics (gtag.js) - Stable Fallback */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XF0XGW58DX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XF0XGW58DX', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>

      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppPopup />
      </body>
    </html>
  );
}
