/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
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

module.exports = nextConfig;
