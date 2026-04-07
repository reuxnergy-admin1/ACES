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

# Netlify Deployment Configuration issue

# 1. Important File name

netlify.toml

# Issue:
Netlify build failed because of duplicated keys in CSP path rule.

# Fix
# Before (Invalid)
conditions = {path = "!/**/", path = "!/*.{js,json,xml,txt,png,jpg,jpeg,gif,svg,webp,ico}"}

# After (Correct)
conditions = { path = ["!/**/", "!/*.{js,json,xml,txt,png,jpg,jpeg,gif,svg,webp,ico}"] }


# 2. Runtime Issues & Fixes

# Netlify CSP (Content Security Policy) Blocking Scripts issue

# Error in console:

Refused to execute inline script because it violates Content Security Policy...

# Cause:

The CSP header included both:

- a dynamic nonce

- 'unsafe-inline'