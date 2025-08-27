import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.acesaerodynamics.com';
  const now = new Date();
  const routes = [
    '',
    '/about/history/',
    '/about/industries/',
    '/about/philosophy/',
    '/about/quality/',
    '/products/',
    '/products/aircraft/',
    '/products/helicopters/',
    '/products/motorsport/',
    '/services/',
    '/blog/',
    '/contact/',
    '/order/',
    '/signin/',
    '/legal/cookies/',
    '/legal/privacy/',
  ];
  return routes.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: p === '' ? 1 : 0.6,
  }));
}
