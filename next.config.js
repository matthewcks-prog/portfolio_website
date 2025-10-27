/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],

  // Speed up compilation
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Optimize images
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Reduce bundle size
  experimental: {
    optimizePackageImports: ["@react-three/fiber", "@react-three/drei", "three", "framer-motion", "lucide-react"],
  },
};

module.exports = nextConfig;
