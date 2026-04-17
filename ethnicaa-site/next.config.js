/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {

    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/ethnicaa-8402c.firebasestorage.app/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/ethnicaa-8402c.firebasestorage.app/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      }
    ],
  },

  reactStrictMode: false,
};

module.exports = nextConfig;