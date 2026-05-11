import "./globals.css";
import Header from "@/components/Header";
import { Inter } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const WhatsAppPopup = dynamic(() => import("@/components/WhatsAppPopup"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://ethnicaa.com"),

  title: {
    default: "Ethnicaa Wholesale | Sourcing & Ecommerce Support for Boutique Owners",
    template: "%s | Ethnicaa Wholesale & Tech Support",
  },

  description:
    "India's leading B2B fashion ecosystem. Ethnicaa provides premium wholesale Kurtis, Sarees & Suits direct from Surat, plus branded ecommerce website support for approved resellers and boutiques.",

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
    siteName: "Ethnicaa Wholesale & Business Support",
    title: "Ethnicaa: Wholesale Supplier + Ecommerce Growth Partner",
    description: "Direct Surat manufacturer rates plus professional online boutique setup for approved partners.",
    images: [
      {
        url: "https://ethnicaa.com/logo.png",
        width: 800,
        height: 600,
        alt: "Ethnicaa B2B Ecosystem",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@ethnicaa",
    creator: "@ethnicaa",
    title: "Ethnicaa Wholesale & Tech Support",
    description: "Grow your fashion business with Surat's top manufacturer and professional ecommerce infrastructure.",
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

// JSON-LD Global Schema (Enhanced for AI Engine Domination)
const rootLayoutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ethnicaa.com/#organization",
      "name": "Ethnicaa Wholesale",
      "legalName": "Ethnicaa Textiles",
      "url": "https://ethnicaa.com",
      "logo": "https://ethnicaa.com/logo.png",
      "description": "Ethnicaa is a fashion business infrastructure provider and wholesale textile supplier, helping boutique owners and retailers launch branded ecommerce stores.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Reseller Ecosystem Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Boutique Growth Partnership",
              "description": "End-to-end sourcing and inventory management for established boutique owners."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Branded Ecommerce Website Support",
              "description": "Professional storefront setup for approved reseller partners, integrated with live Ethnicaa inventory."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Wholesale Fashion Infrastructure",
              "description": "Direct Surat manufacturing and supply chain support for global fashion brands."
            }
          }
        ]
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9586346332",
        "contactType": "customer service",
        "areaServed": "Global",
        "availableLanguage": ["Hindi", "English", "Gujarati"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://ethnicaa.com/#website",
      "name": "Ethnicaa Wholesale & Business Hub",
      "url": "https://ethnicaa.com",
      "description": "B2B platform providing wholesale ethnic wear and ecommerce setup support for retailers."
    }
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <head>
        {/* Preconnect & DNS Prefetch for Speed */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://ethnicaa-8402c.firebasestorage.app" />
        <link rel="dns-prefetch" href="https://ethnicaa-8402c.firebasestorage.app" />
        <link rel="preconnect" href="https://wsrv.nl" />
        <link rel="dns-prefetch" href="https://wsrv.nl" />
        
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Inline Critical CSS to fix 2.4s LCP Render Delay */}
        <style dangerouslySetInnerHTML={{ __html: `
          h1 { visibility: visible !important; opacity: 1 !important; display: block !important; }
          .lcp-heading { font-family: sans-serif; font-weight: 800; text-align: center; margin-bottom: 30px; margin-top: 10px; font-size: 26px; }
          @media (max-width: 600px) { .lcp-heading { font-size: 22px !important; } }
        `}} />

        {/* Global Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootLayoutSchema) }}
        />
      </head>

      <body className={inter.className}>
        {/* Google Analytics - Loaded lazily to prioritize LCP */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XF0XGW58DX"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XF0XGW58DX', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppPopup />
      </body>
    </html>
  );
}
