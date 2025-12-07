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
    // Use Next Image optimizer in server/edge runtime
  },
  trailingSlash: true,
  turbopack: {
    // Optional: configure Turbopack here.
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

module.exports = withBundleAnalyzer({
  ...nextConfig,
  async headers() {
  // Security headers are applied via middleware to support per-request nonces and 'strict-dynamic' CSP.
  return [];
  },
});
