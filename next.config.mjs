/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  reactStrictMode: true,

  // Optimize production builds
  swcMinify: true,

  // Disable on-demand compilation
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    pagesBufferLength: 10,
  },

  // Reduce unnecessary logging
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      "@tanstack/react-query",
      "framer-motion",
      "motion",
    ],

    turbo: {
      rules: {
        "*.scss": {
          loaders: ["sass-loader"],
        },
      },
    },
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
};

export default nextConfig;
