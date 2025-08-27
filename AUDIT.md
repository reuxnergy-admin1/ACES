# Repository Audit — ACES Aerodynamics (Next.js 15 / React 19)

This document catalogs routes, components, CSS tokens, and highlights issues/opportunities across performance, accessibility, UX/IxD, code quality, security/SEO, and tooling.

> Sources referenced inline are authoritative (Next.js/React docs, MDN, WCAG, OWASP). Targets are mobile-first and field-oriented (Core Web Vitals).

## Map: routes, layouts, components

- App Router (app/)
  - Root: `app/layout.tsx` (Server) — imports Nav (Client), ResponsiveContours (Client), Footer (Server), CursorDotOverlay (Client), PageTransition (Client)
  - Pages (all Server unless noted):
    - `/` home, `/about/*`, `/products/*`, `/services`, `/contact`, `/signin`, `/order` (now Server + client OrderForm), `/legal/*`, `/blog` (theme-invert), `/blog/[slug]/layout` (theme-invert)
- Client components:
  - `components/Nav.tsx` — complex a11y/dialog/inert, must stay client
  - `components/ResponsiveContours.tsx` — runtime detection + dynamic import of WebGL; client
  - `components/BackgroundPortal.tsx` — portal to document.body; client
  - `components/ContoursIsolines.tsx` — WebGL; client
  - `components/PageTransition.tsx` — uses router pathname to re-trigger fade; client
  - `components/CursorDotOverlay.tsx` — pointer tracking; client
  - `components/Tooltip.tsx` — hover/focus w/ aria-describedby; client
  - `components/StaggerReveal.tsx` — IO-based animations; client
  - `components/SheenCard.tsx` — has pointer/focus effects; could be CSS-only; currently client
- Server-compatible components:
  - `components/ContoursSVG.tsx` (no state/effects)
  - `components/ClientCarousel.tsx` (pure render; reduced-motion via CSS)
  - `components/Footer.tsx`

## CSS tokens/utilities

- `app/globals.css` defines variables under `:root`:
  - Colors, easing, container max, padding, grid gutter; z-index layers (`.z-bg/.z-content/.z-header/.z-overlay`)
  - Layout utils: `grid-shell`, `container-row` (capped via `--container-max`), `grid-12` with responsive columns
  - Surface overlays: `.surface`, `.surface-90`, `.surface-opaque`, `.surface--sm|md|lg` with optional backdrop-filter
  - Interactions: `.link-underline`, `.wipe-link`, `.sheen-card` wipe, page fade, stagger
  - Blog theme inversion: `.theme-invert` + media counter-inversion
  - Marquee utilities for client badges; reduced-motion guard

## Issues & Opportunities (excerpt)

| ID | Title | Area | Sev | Effort | Rationale | Proposed Fix | Links |
|---|---|---|---|---|---|---|---|
| P1-001 | Reduce unnecessary client components | Perf | P1 | M | Many components are marked `use client` without needing state/effects | Convert `ContoursSVG`, potentially `SheenCard`, `ClientCarousel`, `Footer` to Server. Keep Nav/overlays as client. | [RSC docs](https://nextjs.org/docs/app/building-your-application/rendering/server-components) |
| P1-002 | Confirm background lazy-load path | Perf | P1 | S | WebGL is lazy via dynamic import and idle scheduling; ensure SVG path is Server for zero-JS first paint | Make `ContoursSVG` a Server Component | [Lazy loading](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading) |
| P1-003 | Horizontal overflow from marquee/cards | UX | P1 | S | Fixed now by `overflow-x:hidden`, container max, `min-width:0` on grid children | Keep guards; write regression test (axe/pa11y/lighthouse) |  |
| P1-004 | Dialog a11y parity | A11y | P1 | M | Nav dialog has aria-modal, focus restore, inert; verify keyboard order, Escape, tabindex on hidden accordions | Add axe checks; manual QA | [APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/) |
| P2-005 | Tooltip semantics | A11y | P2 | S | Good base with aria-describedby; consider ESC close and hover-intent | Add ESC handler and optional dismiss on Escape | [APG Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) |
| P2-006 | TypeScript strictness | Code | P2 | S | strict:true already. Add `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` | Update tsconfig, fix fallout | TS Handbook |
| P2-007 | ESLint a11y & hooks | Code | P2 | S | Add jsx-a11y plugin & enforce hooks rules | Update ESLint config | ESLint docs |
| P2-008 | Security headers | Security | P2 | M | Add CSP, COOP/COEP/CORP, Referrer-Policy, Permissions-Policy | next.config.js headers() or middleware | MDN/OWASP |
| P2-009 | SEO sitemap/robots | SEO | P2 | S | Add `/sitemap.xml`, `/robots.txt`; expand metadata | Next sitemap/robots | [Next metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) |
| P3-010 | CI quality gates | Tooling | P3 | M | Add GH Actions: typecheck, lint, build, Lighthouse CI, axe/pa11y | .github/workflows | Lighthouse CI |
| P3-011 | Design tokens consolidation | UI | P3 | M | Remove magic numbers; clamp gaps; document tokens | Update globals.css, docs |  |

Full details and more items to be added as we implement PRs.

## Targets & Budgets

- Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1, TTFB < 800ms
- WCAG 2.2 AA; keyboard complete; visible focus; reduced-motion

## Notes

- Keep Nav/inert logic unchanged. Maintain reduced-motion and SVG fallback for background. Keep pnpm and Node ≥ 22.
