const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,

  // Performance optimizations
  reactStrictMode: false,

  sassOptions: {
    includePaths: [new URL("./src/styles", import.meta.url).pathname],
    prependData: `@use "@/styles/variables" as vars;`,
  },

  // Disable on-demand compilation
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 10,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "graph.facebook.com",
      },
    ],
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ["@tanstack/react-query", "motion/react"],
  },

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "development",
  },

  // Reduce unnecessary logging
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: `https://${firebaseProjectId}.firebaseapp.com/__/auth/:path*`,
      },
      {
        source: "/__/firebase/:path*",
        destination: `https://${firebaseProjectId}.firebaseapp.com/__/firebase/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
