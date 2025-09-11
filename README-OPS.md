# Operations and Security

This project runs on a server/edge runtime with per-request CSP nonces for enhanced security. The CSP implementation supports strict script policies whilst maintaining compatibility with required third-party resources.

## Current Configuration — Server/Edge Runtime

- The project is configured as a Next.js server/edge deployment with CSP nonces
- `middleware.ts` generates per-request nonces and injects comprehensive security headers
- Pre-hydration scripts use the CSP nonce for secure inline execution
- Stronger CSP policy enabled: `script-src 'self' 'nonce-...' 'strict-dynamic'`

## Security Headers (Applied via Middleware)

Production headers applied automatically via `middleware.ts`:

```http
Content-Security-Policy: default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: blob:; font-src 'self' https://use.typekit.net https://p.typekit.net; style-src 'self' 'unsafe-inline' https://use.typekit.net; script-src 'self' 'nonce-<generated>' https: http:; connect-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Development Mode**: CSP is relaxed to avoid interfering with Next.js dev server, HMR, and source maps. Only essential security headers are applied.

## Alternative Deployment — Static Export

If you need to deploy as static files (e.g., to a CDN):

1. Update `next.config.js` to add `output: 'export'`
2. Configure security headers at your CDN level using the headers above
3. Note: CSP nonces cannot be used with static export; you'll need to adjust the CSP policy accordingly

## Fonts

- Adobe Typekit fonts are loaded in `<head>` with appropriate CSP directives
- For self-hosted fonts, use `next/font/local` with `font-display: swap` and preload woff2 weights

## Images

- Next.js Image optimisation is enabled for server/edge deployments
- For static export, set `images.unoptimized: true` in `next.config.js`

## Accessibility and QA

- Enable the grid overlay by adding `#debug-grid` to the URL or `localStorage.setItem('gridDebug','1')`
- A11y auditing runs in Playwright via axe-core and logs violations without failing CI
- Upgrade to fail-on-violation once content stabilises

## Developer Scripts (Quick Reference)

- `dev` — Start Next.js development server
- `build` — Production build
- `start` — Start production server
- `lint` — Run ESLint
- `test:e2e` — Playwright tests (against production build for deterministic rendering)
- `test:e2e:update` — Update Playwright snapshots
- `test:reference` — External reference audit
- `test:e2e:install` — Install Playwright browsers with dependencies
- `guard:bg` — Verify background contour assets integrity
- `guard:bg:update` — Refresh background contour checksums
- `diagram:build` — Build the market-map Mermaid SVG (`docs/diagrams`)
- `diagram:build:all` — Build all Mermaid SVGs in `docs/diagrams`
- `lh:ci` — Run Lighthouse CI audit

## Docs & Diagrams

Mermaid source files live in `docs/diagrams/*.mmd` and compile to SVG alongside the sources.

- Edit `docs/diagrams/market-map.mmd`
- Build once: `pnpm diagram:build`
- Build all: `pnpm diagram:build:all`

The Mermaid CLI configuration includes:

- Custom theme: `docs/diagrams/theme.json`
- Puppeteer config: `docs/diagrams/puppeteer-config.json`
- Deterministic rendering for consistent outputs

## Testing Configuration

- Playwright tests run against the production build (`pnpm build && pnpm start`) for deterministic rendering
- VRT (Visual Regression Testing) includes masking for dynamic content
- Tests include reduced motion emulation for consistent snapshots
- Global setup includes route pre-warming to avoid first-hit RSC stream races

## CSP and Nonce Implementation

- CSP nonces are generated per-request using Web Crypto API
- Nonces are exposed via `x-nonce` header and accessible in server components via `getRequestNonce()`
- Pre-hydration scripts in layout use nonce for secure inline execution
- Development mode disables CSP to support HMR and dev tooling

