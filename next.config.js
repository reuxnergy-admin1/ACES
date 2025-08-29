/** @type {import('next').NextConfig} */
const path = require('path');
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
  }
};

module.exports = {
  ...nextConfig,
  async headers() {
  // Security headers are applied via middleware to support per-request nonces and 'strict-dynamic' CSP.
  return [];
  },
};
