**Project Overview**
- **Name:** ACES Aerodynamics — Website
- **Production URL:** [www.acesaerodynamics.com](https://www.acesaerodynamics.com)
- **Stack:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind 4 + Playwright + Lighthouse CI
- **Runtime:** Server/Edge with CSP nonces (production). Deterministic E2E tests against production build.
- **Design:** Server-first rendering with a motion system, robust accessibility, and a responsive layout grid. Background uses instant SVG with idle WebGL upgrade.
- **Status:** Alpha - Production-ready codebase with comprehensive documentation

**Environment & Tooling**
- **Node:** 22+ (`.nvmrc`)
- **Package manager:** `pnpm@9.12.3+` (CI pins pnpm 10; lockfile compatible)
- **Dev server:** `pnpm dev` (port 3000)
- **Build/serve:** `pnpm build` then `pnpm start`
- **Tests:** Playwright against production server
- **Audits:** Lighthouse CI, optional axe-core logging in Playwright

**Quick Start**
- **Install:** `pnpm install`
- **Dev:** `pnpm dev` then open http://localhost:3000
- **Build:** `pnpm build`
- **Serve:** `pnpm start`
- **Lint:** `pnpm lint`
- **E2E:** `pnpm test:e2e` (first run: `pnpm test:e2e:install`)

**Key Scripts**
- `dev`: Run Next dev server
- `build` / `start`: Production build and server
- `lint`: ESLint
- `test:e2e` / `test:e2e:update`: Playwright tests and snapshot updates
- `test:e2e:install`: Install Playwright browsers + deps
- `guard:bg` / `guard:bg:update`: Background rendering stack integrity guard
- `diagram:build(:all)`: Build Mermaid diagrams in `docs/diagrams`
- `lh:ci`: Lighthouse CI collect + assert

**Architecture**
- **App Router:** Server-first pages; client-only where browser APIs are required.
  - Root layout wires motion, background, a11y, and CSP nonce usage: `app/layout.tsx:1`
  - Example routes for layout testing under `app/(examples)/*`.
- **Security (CSP Nonce):** Per-request nonce injected by middleware and read server-side.
  - Middleware generates nonce and sets headers: `middleware.ts:1`
  - Helper to read nonce in server components: `lib/csp.ts:1`
  - Root layout uses the nonce for pre-hydration script: `app/layout.tsx:1`
- **Background Rendering Stack:** SVG fallback paints instantly; WebGL upgrades when idle and device-appropriate.
  - SVG fallback component: `components/ContoursSVG.tsx:1`
  - WebGL renderer (isolines shader): `components/ContoursIsolines.tsx:1`
  - Runtime orchestration and dynamic import: `components/ResponsiveContours.tsx:1`
  - Body portal and z-index discipline: `components/BackgroundPortal.tsx:1`
  - Runtime capability detection: `lib/runtimeCaps.ts:1`
- **Page Transitions:** Click-initiated overlay with noise “blob” cover/reveal, locks interaction safely, honors reduced motion, includes watchdog.
  - Implementation: `components/PageTransition.tsx:1`
  - Pre-hydration capture improves perceived responsiveness: `app/layout.tsx:1`
- **Navigation & A11y:**
  - Desktop menubar with roving focus, scroll-hide header, sheen (feature-flagged): `components/Nav.tsx:1`
  - Mobile dialog with inert background, focus trap, Escape to close: `components/Nav.tsx:1`
  - Global skip link targets main content: `components/SkipLink.tsx:1`
- **Reveals & Motion:** IntersectionObserver-based reveal system with robust fallbacks and reduced-motion guards.
  - Orchestrator: `components/InViewReveals.tsx:1`
  - Additional reveal/motion helpers and CSS in `app/globals.css:1`
- **Styling & Layout:** Tailwind v4 + CSS custom properties for tokens; 12-col grid utilities and container primitives.
  - Tokens, layout variables, global resets: `app/globals.css:1`
  - Tailwind config with tokens mapped: `tailwind.config.ts:1`
  - Layout primitives: `components/layout/*`
  - Blog theme inversion via scoped wrapper: `app/blog/layout.tsx:1`
- **Feature Flags (Chronicle UI):** URL param toggles cookie; layout adds root class for CSS overrides.
  - Spec and examples: `CHRONICLE_IMPLEMENTATION.md:1`
  - Cookie handling in middleware: `middleware.ts:1`
  - Root class toggle in layout: `app/layout.tsx:1`

**Configuration**
- **Next.js:**
  - `next.config.js:1` — strict mode, trailingSlash, output file tracing root. Security headers are handled in middleware (per-request nonce).
- **TypeScript:**
  - `tsconfig.json:1` — `strict:true`, bundler module resolution, path aliases under `@/*` to `app`, `components`, `lib`.
- **Tailwind:**
  - `tailwind.config.ts:1` — content globs for `app` and `components`, CSS variables mapped to theme colors, typography plugin enabled.
- **Playwright:**
  - `playwright.config.ts:1` — production server (`pnpm build && pnpm start`), dark scheme, trace/screenshot/video on failure, 1280×900 viewport.
- **Lighthouse CI:**
  - Config at `lighthouserc.json:1`, invoked via `pnpm lh:ci`.

**Security Model**
- **CSP Nonces:**
  - Middleware generates a per-request hex nonce; production headers include CSP with `script-src 'self' 'nonce-<value>' https: http:`.
  - Nonce is exposed as `x-nonce` header for server components, applied to inline pre-hydration script in `app/layout.tsx`.
  - Development mode relaxes CSP to avoid blocking HMR and source maps while retaining baseline security headers.
- **Headers:**
  - Middleware applies `Referrer-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, and `Permissions-Policy`.
- **Static Export Option:**
  - If required, add `output: 'export'` in `next.config.js` and move CSP/headers configuration to CDN; disable per-request nonces.

**Testing Strategy**
- **Deterministic E2E:** Playwright runs against the production server to avoid dev-only overlays and ensure stable rendering.
  - Start command configured in Playwright to build+start automatically: `playwright.config.ts:1`
  - Global setup prewarms routes to avoid first-hit races: `tests/setup/global-setup.ts:1`
- **Categories:**
  - Layout overflow + VRT masks for dynamic layers: `tests/layout-audit.spec.ts:1`
  - Page transition lifecycle locks and reveal watchdog: `tests/wipe-lifecycle.spec.ts:1`
  - Interaction and target sizing: `tests/reveals-and-buttons.spec.ts:1`
  - Menubar roving focus + keyboard nav: `tests/menubar-roving-focus.spec.ts:1`
  - Mobile dialog focus trap + skip link behavior: `tests/nav-focus-trap.spec.ts:1`
  - A11y logging via axe-core CDN (non-failing): `tests/a11y-audit.spec.ts:1`
- **Running:**
  - First time: `pnpm test:e2e:install`
  - Execute: `pnpm test:e2e`
  - Update VRT baselines: `pnpm test:e2e:update`
- **Notes:**
  - Tests enforce reduced motion where appropriate; VRT masks `[data-vrt-mask]`, background canvases, and debug overlays.

**Background Rendering Stack (Guarded)**
- **Contract:** SVG paints immediately; WebGL upgrades after idle time and only when device capability allows. Always non-blocking; pointer events pass through.
- **Files to treat as sensitive:** `components/ResponsiveContours.tsx`, `components/ContoursIsolines.tsx`, `components/ContoursSVG.tsx`, `components/BackgroundPortal.tsx`.
- **Guard:**
  - Verify: `pnpm guard:bg`
  - Update after intentional changes: `pnpm guard:bg:update` (commits new hashes to `scripts/bg-guard.json`)
- **Runtime controls:**
  - Force SVG/GL: add `#force-svg` or `#force-gl` to URL
  - Debug overlay flags available via `window.__bg` and `#debug-bg`/`localStorage.setItem('bgDebug','1')`

**Accessibility**
- **Focus management:** Mobile dialog traps focus; Skip link jumps to `main#main-content` with transient tabindex.
- **Reduced motion:** System setting honored in page transitions, background ripples, and reveal system.
- **Touch targets:** 24×24px minimum enforced by CSS; tests validate key button targets.
- **Menubar:** ArrowLeft/Right/Home/End roving focus for desktop primary nav.

**Styling & Layout System**
- **Tokens:** Colors, easing, durations, radii, shadows, container widths, grid gutter, fluid typography in `app/globals.css:1`.
- **Utilities:**
  - Grid shell, 12-col spans, container primitives in `components/layout/*`
  - Underline, wipe-link, button microinteractions in `app/globals.css:1`
  - Theme inversion for blog subtree: `app/blog/layout.tsx:1`
- **Overflow policy:** Strict `overflow-x: clip` on `html`, with component-level `min-width:0` and media `max-width:100%`. Tests enforce “no horizontal overflow”.

**Feature Flag: Chronicle UI**
- **Toggle:** `?ui=chronicle` to enable, `?ui=default` to disable (persists via cookie).
- **Selector:** Root `html.feature-chronicle-ui` enables CSS variants.
- **Guidance:** Keep behavioral changes minimal; prefer CSS overrides and design tokens. See `CHRONICLE_IMPLEMENTATION.md:1`.

**CI/CD**
- **GitHub Actions:** `./.github/workflows/ci.yml:1`
  - Steps: checkout, Node 22, pnpm install, lint, build, Lighthouse CI.
  - Note: Playwright tests are not executed in CI by default; run locally or extend workflow as needed.

**Operational Notes**
- **Business Domain:** www.acesaerodynamics.com
- **Business Email:** info@acesaerodynamics.com
- **Social Media:**
  - Facebook: facebook.com/acesaerodynamics
  - Instagram: instagram.com/acesaerodynamics
- **Fonts:** Adobe Typekit via `<link>` in `<head>`; CSP permits `https://use.typekit.net`.
- **Images:** Next Image optimizer on server/edge; for static export set `images.unoptimized: true`.
- **Robots/Sitemap:** `app/robots.ts:1`, `app/sitemap.ts:1` available; expand metadata as needed.

**Deployment Options**

**Option 1: Vercel (Recommended)**
1. Connect GitHub repository to Vercel
2. Configure build command: `pnpm build`
3. Set Node.js version to 22.x
4. Add custom domain: www.acesaerodynamics.com
5. Middleware automatically applies security headers
6. Automatic previews for pull requests

**Option 2: Netlify**
1. Connect repository
2. Build command: `pnpm build`
3. Publish directory: `.next`
4. Node version: 22
5. Configure custom domain
6. Headers are applied via middleware

**Option 3: Static Export (CDN)**
1. Add `output: 'export'` to `next.config.js`
2. Add `images.unoptimized: true` for static images
3. Run `pnpm build` (creates `out/` directory)
4. Configure security headers at CDN level (see README-OPS.md)
5. Note: Dynamic features (API routes, middleware) won't work
6. Upload `out/` directory to CDN (Cloudflare Pages, AWS S3, etc.)

**Environment Variables (if needed)**
- None required for basic operation
- Add analytics keys as needed (GA_MEASUREMENT_ID, etc.)
- Add error tracking DSN if using Sentry
- Form submission endpoint if implementing server-side forms

**Common Tasks**
- **Add a new route:** Create `app/your-route/page.tsx` (server by default). Only mark `use client` if directly using browser APIs/hooks.
- **Use CSP nonce in inline scripts:** Read via `getRequestNonce()` in server components and apply as `nonce` prop to the `<script>`.
- **Adjust background behavior:** Prefer `ResponsiveContours` prop tuning; avoid shader changes unless necessary. Re-run `guard:bg:update` after edits.
- **Add motion:** Prefer `InViewReveals` data attributes; ensure reduced-motion alternatives.
- **Tailwind additions:** Map new CSS variables in `tailwind.config.ts` if you add tokens to `:root`.

**Troubleshooting**
- **Playwright times out starting server:** Ensure Node 22+, no conflicting processes on port 3000, and enough memory on CI runners.
- **CSP blocks scripts in production:** Verify nonce applied to inline scripts and that middleware sets `x-nonce`. Inspect `Content-Security-Policy` header.
- **WebGL not appearing:** Check `window.__bg` flags, try `#force-gl`, ensure device has WebGL; verify `ResponsiveContours` is mounted and `body.bg-gl-ready` is toggled.
- **Horizontal overflow in tests:** Inspect layout snapshots; ensure containers use grid/row primitives and apply `min-width:0` to flex/grid parents.

**Production Deployment Checklist**
- [ ] Configure production domain DNS (www.acesaerodynamics.com)
- [ ] Set up SSL/TLS certificates (automatic with Vercel/Netlify)
- [ ] Configure environment variables if needed
- [ ] Enable error tracking (Sentry, etc.)
- [ ] Set up analytics (GA4, Plausible, etc.)
- [ ] Configure CDN if using static export
- [ ] Test all forms and contact methods
- [ ] Run full Lighthouse CI audit
- [ ] Verify CSP headers in production
- [ ] Test on multiple devices and browsers

**Future Enhancements**
- Expand SEO metadata and structured data (JSON-LD schemas)
- Consider enabling Playwright in CI with artifact upload of traces/videos
- Tighten ESLint rules with jsx-a11y and stricter TS options
- Chronicle UI: define full token set and component variants
- Add CMS integration for blog content
- Implement real-time form submission backend
- Add internationalization (i18n) if expanding to other markets

**File Index (Selected)**
- `README.md:1` — Quickstart and script overview
- `README-OPS.md:1` — Security, deployment, testing operations
- `README-LAYOUT.md:1` — Canonical layout decisions and policies
- `UI-UX-PATTERNS.md:1` — Comprehensive design system and UI patterns library
- `AUDIT.md:1` — Repository audit map and quality targets
- `QC-REPORT.md:1` — Quality control report and production readiness
- `CHRONICLE_IMPLEMENTATION.md:1` — Chronicle feature-flag implementation details

**Contact & Ownership**
- Code ownership: see `CODEOWNERS:1`
- Background stack changes require prior review (see Background Guard section)

