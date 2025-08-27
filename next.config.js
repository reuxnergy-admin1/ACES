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

// Security headers
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' https://use.typekit.net https://p.typekit.net",
  "style-src 'self' 'unsafe-inline' https://use.typekit.net",
  "script-src 'self' https://use.typekit.net",
  "connect-src 'self'",
  "object-src 'none'",
].join('; ');

module.exports = {
  ...nextConfig,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
        ],
      },
    ];
  },
};
