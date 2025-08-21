/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: { 
    unoptimized: true 
  },
  trailingSlash: true,
  outputFileTracingRoot: '/Users/jonathanbotha/Downloads/aces-aerodynamics',
  turbopack: {
    // Enable turbopack for faster builds in Next.js 15
  }
};

module.exports = nextConfig;
