/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 🔥 THIS enables static export

  images: {
    unoptimized: true, // 🔥 REQUIRED for export mode

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
      }
    ],
  },

  reactStrictMode: false,
};

module.exports = nextConfig;