import type { NextConfig } from "next";

// @ts-ignore
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Next.js 16 k liye Turbopack error silencer
  // @ts-ignore
  turbopack: {},
  
  // Webpack ko acknowledge karein taake PWA plugin sahi chale
  webpack: (config) => {
    return config;
  },
};

export default withPWA(nextConfig);