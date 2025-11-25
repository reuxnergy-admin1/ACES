# ACES Aerodynamics Website - Replit Configuration

## Project Overview
Modern, high-performance website for ACES Aerodynamics built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4. Features server-first rendering, advanced motion system, comprehensive accessibility support (WCAG 2.2 AA), and production-grade security with CSP nonces.

**Production URL:** [www.acesaerodynamics.com](https://www.acesaerodynamics.com)

## Technology Stack
- **Framework:** Next.js 15 (App Router)
- **Runtime:** React 19
- **Language:** TypeScript 5.9 (strict mode)
- **Styling:** Tailwind CSS 4 + CSS custom properties
- **Motion:** Framer Motion + GSAP
- **3D/Graphics:** Three.js + React Three Fiber
- **Package Manager:** pnpm 9.12.3
- **Node Version:** 22+ (currently running on Node 20.19.3 in Replit)

## Replit Setup (Completed)

### Configuration Changes Made
1. **Development Server:** Configured to run on port 5000 with host 0.0.0.0
   - Updated `package.json` dev script: `next dev --port 5000 --hostname 0.0.0.0`
   
2. **Middleware Security Headers:** Modified for Replit environment
   - Removed `X-Frame-Options: DENY` in development mode to allow iframe preview
   - Kept other security headers for development safety
   
3. **Workflow:** Set up "Next.js Development Server" workflow
   - Command: `pnpm dev`
   - Port: 5000
   - Output: webview

4. **Deployment:** Configured for autoscale deployment
   - Build: `pnpm build`
   - Run: `pnpm start`

### Dependencies
All dependencies installed via pnpm. See `package.json` for complete list.

## Development Workflow

### Starting the Development Server
The workflow "Next.js Development Server" is configured to start automatically. To manually restart:
```bash
pnpm dev
```

The site will be available at port 5000.

### Building for Production
```bash
pnpm build
```

### Running Production Build Locally
```bash
pnpm start
```

### Other Commands
- `pnpm lint` - Run ESLint checks
- `pnpm test:e2e` - Run Playwright E2E tests
- `pnpm guard:bg` - Verify background asset integrity

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
│   └── legal/             # Legal pages (privacy, cookies)
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
├── middleware.ts         # Security headers and routing
└── public/               # Static assets
```

## Key Features
- **Server-First Rendering:** Most components are React Server Components
- **CSP with Nonces:** Per-request Content Security Policy nonces
- **Progressive Enhancement:** SVG background with WebGL upgrade
- **Accessibility:** WCAG 2.2 AA compliant with keyboard navigation
- **Performance:** Optimized bundle sizes (~102-107kB first load)
- **Motion & Interaction:** IntersectionObserver-based reveal system

## Development Notes
- **Server Components:** Prefer server components; only use `'use client'` when browser APIs required
- **CSP Nonces:** Use `getRequestNonce()` for inline scripts in server components
- **Background Changes:** Run `pnpm guard:bg:update` after modifying contour components
- **Testing:** Always test against production build for deterministic rendering

## Documentation
- **[HANDOVER.md](HANDOVER.md)** — Complete technical handover
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — Branch, commit, and test conventions
- **[README-OPS.md](README-OPS.md)** — Operations, security, and deployment
- **[README-LAYOUT.md](README-LAYOUT.md)** — Layout system and design tokens
- **[UI-UX-PATTERNS.md](UI-UX-PATTERNS.md)** — Design system and UI patterns

## Recent Changes (Nov 25, 2025 - Website Updates)

### Content Updates (from PDF requirements)
1. **Navigation:**
   - Added HOME link before INSIGHTS
   - Changed BLOG to INSIGHTS
   - Menu now: HOME, INSIGHTS, SIGN IN, ORDER

2. **Hero Section:**
   - New title: "Aerospace & Motorsport Specialist Engineering Components"
   - New subtitle about SACAA-approved (MP39) blanket approval
   - Removed "Request a Quote" and "Speak to a Specialist" buttons

3. **Products and Services Section:**
   - New 6-card grid layout:
     - Aircraft Transparencies
     - Helicopter Transparencies
     - Motorsport Components
     - Aerospace Components
     - Prototyping
     - Retrofitting and Reverse Engineering
   - Added "Request a Quote" button below cards

4. **Process Section:**
   - Simplified to 3 steps: Scope, Production, QA/Documentation/Delivery

5. **Compliance & QA Section:**
   - New content with CA21-19 airworthiness approval tag
   - Two transparent cards: MP39 SACAA Approved, CA21-19 Airworthiness Tag

6. **Insights Section:**
   - Made dormant (commented out) until first article is published

7. **Footer Updates:**
   - Changed "Work with ACES" to "Order with ACES"
   - Updated contact info: Email, WhatsApp (+27 82 893 5583)
   - Updated address: 5 Industria Street, Potchindustria, Potchefstroom, 2520
   - Added Google Maps link for address
   - Updated company links: About, Products and Services, Insights
   - Removed legal section
   - Updated copyright: "ACES Plastics CC t/a ACES Aerodynamics"

8. **Quote Page:**
   - Added proper email form with subject line format: "Website Lead – [Company Name]"
   - Improved form labels and input sizing

9. **Cursor:**
   - Removed cursor inversion effect - cursor now always stays white
   - Simplified cursor overlay component

### Technical Updates
- Fixed hydration errors related to automation detection timing
- Simplified pre-hydration script to avoid SVG attribute modifications

## Previous Changes (Replit Import - Nov 25, 2024)
- Configured Next.js development server for Replit environment (port 5000, host 0.0.0.0)
- Modified middleware to allow framing in development for Replit preview
- Set up workflow for automatic server start
- Configured deployment settings for production publishing
- Installed all dependencies via pnpm

## Known Issues
- Node version warning: Project specifies Node 22+, Replit running Node 20.19.3 (minor compatibility issue, not blocking)
- Hydration warning may appear intermittently in development with automated testing (does not affect production)
