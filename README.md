# ACES Aerodynamics — Website

Next.js 15 + TypeScript + Tailwind 4 site with motion/a11y patterns and Playwright tests.

## Getting started

- Requirements: Node 22+ (see `.nvmrc`), pnpm 9+
- Install: `pnpm install`
- Dev: `pnpm dev` then open <http://localhost:3000>

## Key scripts

- `pnpm build` — production build
- `pnpm start` — serve production build
- `pnpm lint` — ESLint
- `pnpm test:e2e` — Playwright tests
- `pnpm guard:bg` — checks background assets integrity
- `pnpm diagram:build` — generate Mermaid SVG for market map

More operational details: see `README-OPS.md`.

## Handoff notes

- Components live under `components/` and pages under `app/`
- Motion utilities are in `components/motion` and `lib/motion`
- Security/CSP guidance in `middleware.ts` and `README-OPS.md`
- Diagrams (Mermaid) in `docs/diagrams/`

## Contributing

See `CONTRIBUTING.md` for branch/commit/test conventions.
