# Contributing

## Branching

- `main` is protected; use feature branches: `feat/*`, `fix/*`, `docs/*`, `chore/*`
- Keep branch names descriptive and use conventional prefixes

## Commits

- Conventional Commits preferred (e.g., `feat: add hero animation`, `fix: resolve navigation focus trap`)
- Keep messages imperative and scoped to the affected component/area
- Use British English in commit messages and code comments

## Pull Requests

- Include screenshots/videos for UI changes
- Test locally before opening PR:
  - `pnpm lint` — ESLint validation
  - `pnpm build` — Production build validation
  - `pnpm test:e2e` — Full Playwright test suite
  - `pnpm diagram:build` — Ensures SVGs match sources (if diagrams modified)
  - `pnpm guard:bg` — Background asset integrity check

## Tests

- Playwright specs live in `tests/`; keep them fast and deterministic
- Tests run against production build for consistent rendering
- Update snapshots intentionally with `pnpm test:e2e:update`
- VRT tests include masking for dynamic content and reduced motion emulation
- Add specific test coverage for accessibility improvements and component changes

## Code Standards

- Use TypeScript with strict mode enabled
- Follow ESLint configuration (Next.js recommended + custom rules)
- Components should be server-first unless client-side state/effects are required
- Use British English in comments, documentation, and user-facing strings
- Maintain accessibility standards (WCAG 2.2 AA compliance)

## Documentation

- Update relevant README files when making architectural changes
- Keep `README-OPS.md` current with deployment and security configurations
- Update `AUDIT.md` when resolving catalogued issues
- Document new components in appropriate README sections
