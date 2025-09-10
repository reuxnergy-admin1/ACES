# Contributing

## Branching

- main is protected; use feature branches: `feat/*`, `fix/*`, `docs/*`

## Commits

- Conventional Commits preferred (e.g., `feat: add hero animation`)
- Keep messages imperative and scoped

## PRs

- Include screenshots/videos for UI changes
- Run locally before opening PR:
  - `pnpm lint`
  - `pnpm build`
  - `pnpm test:e2e`
  - `pnpm diagram:build` (ensures SVGs match sources)

## Tests

- Playwright specs live in `tests/`; keep them fast and deterministic
- Update snapshots intentionally with `pnpm test:e2e:update`
