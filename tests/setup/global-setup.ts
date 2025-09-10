import { request, type FullConfig } from '@playwright/test';

// Pre-warm key routes to avoid first-hit compilation/streaming races in Next.js dev server.
export default async function globalSetup(config: FullConfig) {
  const project = config.projects[0];
  // extract baseURL from project.use if present
  const useConfig = (project?.use ?? {}) as { baseURL?: string };
  const baseURL = useConfig.baseURL;
  // Only prewarm when baseURL is defined and we're running the dev server (heuristic)
  if (!baseURL) return;
  const ctx = await request.newContext({ baseURL });
  const routes = ['/', '/blog/'];
  for (const r of routes) {
    try {
      const res = await ctx.get(r, { timeout: 10000 });
      // Touch body to force full stream consumption in dev
      await res.text();
    } catch {
      // best-effort; don't fail the suite for warmup hiccups
    }
  }
  await ctx.dispose();
}
