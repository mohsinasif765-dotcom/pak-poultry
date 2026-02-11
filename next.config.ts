import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
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
  // Turbo ka error khatam karne k liye hum isay acknowledge karte hain
  // Agar Next.js 16 hai to turbopack: {} direct nextConfig mein chalta hai
  // @ts-ignore: Next.js version types conflict handle karne k liye
  turbopack: {}, 
  
  // Webhook ya APIs k liye agar zaroorat paray
  experimental: {
    // Yahan mazeed koi experimental settings agar hon
  },
};

export default withPWA(nextConfig);