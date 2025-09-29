# ACES Aerodynamics — Website

Next.js 15 + TypeScript + Tailwind 4 site with motion/a11y patterns and Playwright tests.

## Getting started

- Requirements: Node 22+ (see `.nvmrc`), pnpm 9.12.3+
- Install: `pnpm install`
- Dev: `pnpm dev` then open <http://localhost:3000>

## Key scripts

- `pnpm build` — production build
- `pnpm start` — serve production build
- `pnpm lint` — ESLint
- `pnpm test:e2e` — Playwright tests (runs against production build)
- `pnpm test:e2e:update` — update Playwright snapshots
- `pnpm test:e2e:install` — install Playwright browsers with dependencies
- `pnpm guard:bg` — checks background assets integrity
- `pnpm guard:bg:update` — refresh background asset checksums
- `pnpm merge:intelligent` — intelligently merge all feature branches
- `pnpm merge:demo` — demonstrate intelligent merge process
- `pnpm merge:report` — view last merge operation report
- `pnpm diagram:build` — generate Mermaid SVG for market map
- `pnpm diagram:build:all` — generate all Mermaid SVGs in docs/diagrams
- `pnpm lh:ci` — run Lighthouse CI audit

More operational details: see `README-OPS.md`.

## Handoff notes

- Components live under `components/` and pages under `app/`
- Motion utilities are in `components/motion` and `lib/motion`
- Security/CSP with nonce implementation in `middleware.ts` and `lib/csp.ts`
- Intelligent branch merging system in `scripts/intelligent-merge.mjs`
- Background guard system protects sensitive rendering components
- Diagrams (Mermaid) in `docs/diagrams/`
- Tests configured for production server to ensure deterministic rendering

## Contributing

See `CONTRIBUTING.md` for branch/commit/test conventions.
