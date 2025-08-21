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
  // Optional: configure Turbopack here. Zero-config is fine.
  // Example aliases or extensions can go here if needed.
  }
};

module.exports = nextConfig;
