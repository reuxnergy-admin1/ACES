# Repository Audit — ACES Aerodynamics (Next.js 15 / React 19)

This document catalogues routes, components, CSS tokens, and highlights issues/opportunities across performance, accessibility, UX/IxD, code quality, security/SEO, and tooling.

> Sources referenced inline are authoritative (Next.js/React docs, MDN, WCAG, OWASP). Targets are mobile-first and field-oriented (Core Web Vitals).

## Map: Routes, Layouts, Components

### App Router Structure (`app/`)

- **Root Layout**: `app/layout.tsx` (Server) — imports Nav (Client), ResponsiveContours (Client), Footer (Server), PageTransition (Client)
- **Pages** (all Server unless noted):
  - `/` home, `/about/*`, `/products/*`, `/services`, `/contact`, `/signin`, `/order` (Server + client OrderForm), `/legal/*`, `/blog` (theme-invert), `/blog/[slug]/layout` (theme-invert)

### Client Components (Requiring Browser APIs)

- `components/Nav.tsx` — Complex a11y/dialog/inert implementation; must remain client
- `components/ResponsiveContours.tsx` — Runtime detection + dynamic import of WebGL; client
- `components/BackgroundPortal.tsx` — Portal to document.body; client
- `components/ContoursIsolines.tsx` — WebGL rendering; client
- `components/PageTransition.tsx` — Uses router pathname for fade transitions; client
- `components/CursorDotOverlay.tsx` — Pointer tracking; client
- `components/Tooltip.tsx` — Hover/focus with aria-describedby; client
- `components/StaggerReveal.tsx` — Intersection Observer-based animations; client
- `components/SheenCard.tsx` — Pointer/focus effects; could potentially be CSS-only; currently client

### Server-Compatible Components

- `components/ContoursSVG.tsx` — No state/effects, pure render
- `components/ClientCarousel.tsx` — Pure render; reduced-motion handled via CSS
- `components/Footer.tsx` — Static server component

## CSS Tokens and Utilities

### Variables in `app/globals.css`

- **Colours**: Theme variables and colour system
- **Easing**: Motion timing functions
- **Layout**: Container max-widths, padding, grid gutters
- **Z-index layers**: `.z-bg/.z-content/.z-header/.z-overlay` with defined stacking context

### Layout Utilities

- **Grid system**: `grid-shell`, `container-row` (capped via `--container-max`), `grid-12` with responsive columns
- **Surface overlays**: `.surface`, `.surface-90`, `.surface-opaque`, `.surface--sm|md|lg` with optional backdrop-filter
- **Interactions**: `.link-underline`, `.wipe-link`, `.sheen-card` wipe effects
- **Page transitions**: Page fade and stagger animation utilities
- **Theme inversion**: `.theme-invert` + media counter-inversion for blog sections
- **Marquee utilities**: Client badge animations with reduced-motion guards

## Current Implementation Status

### ✅ Completed Improvements

- **Security**: CSP with per-request nonces implemented via middleware
- **Testing**: Production build testing for deterministic VRT snapshots
- **Performance**: Server-first component architecture
- **Accessibility**: Focus management, reduced motion support, ARIA implementations
- **Motion**: Page transition lifecycle with proper cleanup and watchdogs
- **Layout**: Overflow guards and responsive container system

### Issues & Opportunities

| ID | Title | Area | Severity | Effort | Status | Rationale | Proposed Fix |
|---|---|---|---|---|---|---|---|
| P1-001 | Reduce unnecessary client components | Performance | P1 | M | 🔄 Ongoing | Many components marked `use client` without requiring state/effects | Convert appropriate components to Server Components whilst preserving interactivity |
| P1-002 | Background lazy-load optimisation | Performance | P1 | S | ✅ Complete | WebGL lazy via dynamic import with SVG fallback | Maintained server-first SVG with client upgrade |
| P1-003 | Horizontal overflow prevention | UX | P1 | S | ✅ Complete | Resolved via `overflow-x:clip`, container constraints, grid guards | Regression tests in place |
| P1-004 | Dialog accessibility parity | A11y | P1 | M | ✅ Complete | Nav dialog implements aria-modal, focus management, inert | Comprehensive keyboard navigation support |
| P2-005 | Tooltip semantics enhancement | A11y | P2 | S | 📋 Pending | Good foundation with aria-describedby; consider ESC handling | Add ESC handler and hover-intent |
| P2-006 | TypeScript strictness | Code Quality | P2 | S | 🔄 Ongoing | `strict:true` enabled; consider additional strict options | Add `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` |
| P2-007 | ESLint accessibility plugins | Code Quality | P2 | S | 📋 Pending | Enhance linting with a11y rules | Add jsx-a11y plugin & enforce hooks rules |
| P2-008 | Security headers implementation | Security | P2 | M | ✅ Complete | CSP with nonces, comprehensive security headers via middleware | Production-grade security implementation |
| P2-009 | SEO sitemap/robots | SEO | P2 | S | 📋 Pending | Add structured metadata | Implement `/sitemap.xml`, `/robots.txt`; expand metadata |
| P3-010 | CI quality gates | Tooling | P3 | M | 📋 Pending | Automated quality checks | Add GitHub Actions: typecheck, lint, build, Lighthouse CI |
| P3-011 | Design tokens consolidation | UI | P3 | M | 🔄 Ongoing | Reduce magic numbers; improve token system | Update globals.css with comprehensive token system |

## Performance & Quality Targets

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **INP** (Interaction to Next Paint): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 800ms

### Accessibility Standards

- **WCAG 2.2 AA compliance**: Full keyboard navigation, screen reader compatibility
- **Visible focus indicators**: Clear focus states for all interactive elements
- **Reduced motion respect**: Honour `prefers-reduced-motion` user preference

## Implementation Notes

### Critical Architectural Decisions

- **Component Strategy**: Maintain Nav/inert logic unchanged; preserve reduced-motion and SVG fallback for background
- **Runtime Requirements**: Node ≥22, pnpm 9.12.3+ for consistent dependency resolution
- **Security**: CSP nonces with middleware-based header injection
- **Testing**: Production build testing ensures deterministic visual regression testing

### Development Workflow

- Tests run against production build (`pnpm build && pnpm start`) for consistent rendering
- VRT includes masking for dynamic content layers
- Background contour asset integrity checking via `guard:bg` scripts
- Automated Mermaid diagram generation with deterministic theming

This audit reflects the current implementation state as of the most recent updates, with focus on production-ready security, performance, and accessibility standards.
