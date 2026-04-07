# ACES Aerodynamics — Website

**Production URL:** [www.acesaerodynamics.com](https://www.acesaerodynamics.com)

Modern, high-performance website built with Next.js 15, React 19, TypeScript, and Tailwind 4. Features server-first rendering, advanced motion system, comprehensive accessibility support, and production-grade security.

## Quick Start

### Prerequisites

- **Node.js:** 22+ (see `.nvmrc`)
- **Package Manager:** pnpm 9.12.3+
- **Browser:** Chrome/Edge for Playwright tests (auto-installed)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
http://localhost:3000
```

### Development Workflow

```bash
# Development
pnpm dev              # Start dev server on port 3000

# Quality Checks
pnpm lint             # Run ESLint
pnpm build            # Create production build
pnpm start            # Serve production build locally

# Testing
pnpm test:e2e:install # Install Playwright browsers (first time only)
pnpm test:e2e         # Run E2E tests against production build
pnpm test:e2e:update  # Update visual regression snapshots

# Quality Assurance
pnpm guard:bg         # Verify background asset integrity
pnpm lh:ci            # Run Lighthouse CI audits

# Diagrams
pnpm diagram:build:all # Generate all Mermaid diagrams
```

## Project Structure

```
aces-aerodynamics/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with CSP, navigation, background
│   ├── page.tsx           # Homepage
│   ├── about/             # About section pages
│   ├── products/          # Product pages
│   ├── services/          # Services page
│   ├── contact/           # Contact page
│   ├── blog/              # Blog with theme inversion
│   ├── legal/             # Legal pages (privacy, cookies)
│   └── (examples)/        # Example layouts for reference
├── components/            # React components
│   ├── layout/           # Layout primitives (Grid, Container, etc.)
│   ├── motion/           # Motion and animation components
│   ├── ui/               # UI components (Toast, etc.)
│   ├── Nav.tsx           # Main navigation with a11y
│   ├── Footer.tsx        # Site footer
│   └── ResponsiveContours.tsx # Background rendering system
├── lib/                   # Utilities and helpers
│   ├── csp.ts            # CSP nonce utilities
│   ├── motion/           # Motion utilities
│   └── runtimeCaps.ts    # Runtime capability detection
├── tests/                 # Playwright E2E tests
├── public/               # Static assets
├── docs/                 # Additional documentation
└── middleware.ts         # Security headers and routing
```

## Key Features

### Architecture
- **Server-First Rendering:** Most components are React Server Components for optimal performance
- **CSP with Nonces:** Per-request Content Security Policy nonces for inline scripts
- **Progressive Enhancement:** SVG background fallback with WebGL upgrade when capable
- **Edge Runtime:** Deployed on server/edge for dynamic capabilities

### Accessibility (WCAG 2.2 AA)
- Skip links to main content
- Keyboard navigation with roving focus in menubar
- Mobile dialog with focus trap and inert background
- Reduced motion support throughout
- Touch targets ≥24×24px
- Comprehensive ARIA attributes

### Performance
- Optimised bundle sizes (~102-107kB first load)
- Dynamic imports for heavy components (WebGL)
- Server-side rendering for instant paint
- Lazy loading and code splitting
- Core Web Vitals optimisation

### Motion & Interaction
- IntersectionObserver-based reveal system
- Page transitions with noise blob overlay
- Cursor trail (fine-pointer devices only)
- Reduced motion fallbacks
- Background contour animation (SVG → WebGL)

## Scripts Reference

### Essential Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (port 3000) |
| `pnpm build` | Create optimised production build |
| `pnpm start` | Serve production build locally |
| `pnpm lint` | Run ESLint checks |

### Testing

| Command | Description |
|---------|-------------|
| `pnpm test:e2e:install` | Install Playwright browsers with deps |
| `pnpm test:e2e` | Run E2E tests against production build |
| `pnpm test:e2e:update` | Update Playwright snapshots |
| `pnpm test:reference` | Run external reference audit |

### Quality Assurance

| Command | Description |
|---------|-------------|
| `pnpm guard:bg` | Verify background asset integrity |
| `pnpm guard:bg:update` | Update background asset checksums |
| `pnpm lh:ci` | Run Lighthouse CI performance audits |

### Utilities

| Command | Description |
|---------|-------------|
| `pnpm diagram:build` | Generate market map SVG |
| `pnpm diagram:build:all` | Generate all Mermaid diagrams |
| `pnpm merge:intelligent` | Intelligent branch merge utility |
| `pnpm merge:report` | View merge operation report |

## Documentation

- **[HANDOVER.md](HANDOVER.md)** — Complete technical handover for developers
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — Branch, commit, and test conventions
- **[README-OPS.md](README-OPS.md)** — Operations, security, and deployment
- **[README-LAYOUT.md](README-LAYOUT.md)** — Layout system and design tokens
- **[UI-UX-PATTERNS.md](UI-UX-PATTERNS.md)** — Comprehensive design system and UI patterns
- **[AUDIT.md](AUDIT.md)** — Repository audit and quality targets
- **[QC-REPORT.md](QC-REPORT.md)** — Quality control report and production readiness
- **[BRAND.md](BRAND.md)** — Brand guidelines and logo usage

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Runtime:** React 19
- **Language:** TypeScript 5.9 (strict mode)
- **Styling:** Tailwind CSS 4 + CSS custom properties
- **Motion:** Framer Motion + GSAP
- **3D/Graphics:** Three.js + React Three Fiber
- **Testing:** Playwright with visual regression
- **Quality:** ESLint, Lighthouse CI

## UI/UX/UID Best Practices

This project adheres to industry-standard best practices:

### Design System
- **Consistent Tokens:** Colours, spacing, typography defined in CSS variables
- **12-Column Grid:** Responsive grid system with configurable gutters
- **Fluid Typography:** Scales smoothly across viewport sizes
- **Container System:** Max-width constraints with safe padding
- **Z-Index Stack:** Defined layers for predictable stacking

### User Experience
- **Mobile-First:** Responsive design from 320px upwards
- **Touch-Friendly:** Minimum 44×44px touch targets
- **Reduced Motion:** Respects user preferences
- **Fast Loading:** Optimised assets and code splitting
- **Accessible Navigation:** Keyboard, screen reader, and touch support

### User Interface
- **Clear Hierarchy:** Visual weight and spacing guide attention
- **Consistent Patterns:** Reusable components with variants
- **Interactive Feedback:** Hover, focus, and active states
- **Error Handling:** Graceful degradation and fallbacks
- **Readable Content:** Optimal line length (60-72ch for body text)

### Universal Design
- **WCAG 2.2 AA Compliance:** Full accessibility support
- **Semantic HTML:** Proper heading hierarchy and landmarks
- **Colour Contrast:** ≥4.5:1 for text, ≥3:1 for UI components
- **Focus Management:** Visible focus indicators and skip links
- **Screen Reader Support:** ARIA labels and live regions

## Development Notes

- **Server Components:** Prefer server components; only use `'use client'` when browser APIs required
- **CSP Nonces:** Use `getRequestNonce()` for inline scripts in server components
- **Background Changes:** Run `pnpm guard:bg:update` after modifying contour components
- **Motion:** Use `InViewReveals` data attributes for consistent reveal animations
- **Testing:** Always test against production build for deterministic rendering

## Production Deployment

The site is optimized for deployment to modern hosting platforms with full Next.js support:

### Recommended: Netlify (Full Guide Available)

See **[docs/NETLIFY.md](./docs/NETLIFY.md)** for comprehensive step-by-step instructions including:
- Automated builds with pnpm
- Environment variable configuration
- Custom domain and SSL setup
- Continuous deployment from GitHub

### Alternative: Vercel

1. **Build:** `pnpm build`
2. **Environment:** Set `NODE_ENV=production`
3. **Domain:** Configure DNS to point to `www.acesaerodynamics.com`
4. **Security:** Middleware applies security headers automatically
5. **Monitoring:** Consider adding error tracking and analytics

### Backend Integration

For database, authentication, and backend features, see **[docs/SUPABASE.md](./docs/SUPABASE.md)** for:
- PostgreSQL database setup
- User authentication
- Real-time features
- File storage
- Row Level Security configuration

### Complete Deployment Workflow

See **[docs/DEPLOYMENT-GUIDE.md](./docs/DEPLOYMENT-GUIDE.md)** for the complete end-to-end deployment process with Netlify + Supabase integration.

For static export alternative, see `README-OPS.md`.

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Branch naming conventions
- Commit message format (Conventional Commits)
- Pull request requirements
- Testing guidelines
- Code standards

## Support

- **Technical Issues:** Open an issue in the repository
- **Business Enquiries:** info@acesaerodynamics.com
- **Documentation:** Start with [HANDOVER.md](HANDOVER.md)

---

**Current Version:** 0.1.0 (Alpha)  
**License:** Private  
**Maintained by:** ACES Aerodynamics Development Team
