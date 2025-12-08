import type { MetadataRoute } from "next";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.acesaerodynamics.com";
  const now = new Date();

  // Define routes with specific priorities and change frequencies
  const routes: Array<{
    path: string;
    changeFrequency:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/products/", changeFrequency: "weekly", priority: 0.9 },
    { path: "/services/", changeFrequency: "weekly", priority: 0.9 },
    { path: "/about/history/", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about/industries/", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about/philosophy/", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about/quality/", changeFrequency: "monthly", priority: 0.7 },
    { path: "/products/aircraft/", changeFrequency: "monthly", priority: 0.8 },
    {
      path: "/products/helicopters/",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/products/motorsport/",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { path: "/contact/", changeFrequency: "monthly", priority: 0.8 },
    { path: "/order/", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog/", changeFrequency: "weekly", priority: 0.7 },
    { path: "/signin/", changeFrequency: "monthly", priority: 0.5 },
    { path: "/legal/cookies/", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/privacy/", changeFrequency: "yearly", priority: 0.3 },
  ];

  return routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
