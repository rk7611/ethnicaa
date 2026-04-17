export default function manifest() {
  return {
    name: "Ethnicaa Wholesale Marketplace",
    short_name: "Ethnicaa",
    description: "India's leading B2B marketplace for Surat ethnic wear. Direct from manufacturers.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
