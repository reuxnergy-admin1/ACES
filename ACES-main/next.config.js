/** @type {import('next').NextConfig} */
const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Ensure Next selects this folder as the workspace root in monorepos or when multiple lockfiles exist
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  trailingSlash: true,
  allowedDevOrigins: ['*.replit.dev', '*.replit.app', '*.picard.replit.dev'],
  turbopack: {
    // Optional: configure Turbopack here.
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Tree-shake heavy packages so only used exports are bundled
  experimental: {
    optimizePackageImports: ['three', '@react-three/fiber', 'framer-motion', 'gsap', 'clsx'],
  },
  // Aggressive code-splitting & chunk optimization
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // Isolate Three.js into its own chunk so it doesn't block initial load
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three-vendor',
              chunks: 'all',
              priority: 30,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
};

module.exports = withBundleAnalyzer({
  ...nextConfig,
  async headers() {
  // Security headers are applied via middleware to support per-request nonces and 'strict-dynamic' CSP.
  return [];
  },
});
