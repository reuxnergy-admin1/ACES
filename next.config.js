/** @type {import('next').NextConfig} */
const path = require('path');
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  // Ensure Next selects this folder as the workspace root in monorepos or when multiple lockfiles exist
  outputFileTracingRoot: path.join(__dirname),
  ...(isProd ? { output: 'export' } : {}),
  reactStrictMode: true,
  images: { 
    unoptimized: true 
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
