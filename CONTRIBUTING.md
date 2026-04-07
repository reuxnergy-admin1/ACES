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

### UI/UX/UID Best Practices

When adding or modifying UI components, ensure adherence to these standards:

**Design Tokens**
- Use CSS variables from `app/globals.css` for colours, spacing, typography
- Never use magic numbers; reference design tokens
- Maintain consistency with existing patterns

**Accessibility (A11y)**
- Minimum touch target size: 44×44px (or 24×24px with adequate spacing)
- Colour contrast: ≥4.5:1 for text, ≥3:1 for UI components
- Include focus indicators on all interactive elements (`:focus-visible`)
- Use semantic HTML (`<nav>`, `<main>`, `<article>`, etc.)
- Provide ARIA labels where visual context is insufficient
- Test with keyboard navigation
- Honour `prefers-reduced-motion` for animations
- Maintain logical heading hierarchy

**Layout & Typography**
- Mobile-first: Design for 320px minimum width
- Use `Grid12` + `Span` components for layout
- Respect max-width constraints: 80rem (row), 96rem (wide)
- Body text: 60-72ch optimal line length
- Use fluid typography that scales with viewport
- Avoid horizontal overflow (test with `pnpm test:e2e`)

**Motion & Interaction**
- Provide reduced motion alternatives
- Animation duration: 200-400ms for UI, 600-1200ms for transitions
- Use easing functions from design tokens
- Ensure animations don't interfere with usability
- Provide visual feedback for all interactions (hover, focus, active)

**Performance**
- Lazy load heavy components (WebGL, large images)
- Use Next.js Image component for images
- Prefer server components over client components
- Minimize JavaScript bundle size
- Optimize for Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)

**Responsive Design**
- Test at multiple breakpoints: 320px, 640px, 768px, 1024px, 1280px, 1536px
- Use `@media` queries from Tailwind breakpoints
- Ensure touch targets are appropriately sized on mobile
- Test on real devices when possible

## Documentation

- Update relevant README files when making architectural changes
- Keep `README-OPS.md` current with deployment and security configurations
- Update `AUDIT.md` when resolving catalogued issues
- Document new components in appropriate README sections

## Alpha State Guidelines

The project is currently in **Alpha** state, meaning:

**Production-Ready Aspects**
- ✅ Core architecture and infrastructure
- ✅ Security headers and CSP implementation
- ✅ Accessibility compliance (WCAG 2.2 AA)
- ✅ Performance optimisation
- ✅ Testing infrastructure
- ✅ Documentation

**Remaining for Beta/Production**
- ⏳ Content finalisation and copywriting
- ⏳ Real backend integration for forms
- ⏳ Analytics and monitoring setup
- ⏳ Comprehensive browser/device testing
- ⏳ SEO metadata expansion
- ⏳ Error tracking integration

**What This Means for Contributors**
- Focus on code quality and maintainability
- Document all architectural decisions
- Ensure backward compatibility
- Add tests for new features
- Keep dependencies up to date
- Report bugs with detailed reproduction steps

## Getting Help

- **Documentation:** Start with [HANDOVER.md](HANDOVER.md) for technical overview
- **Architecture:** See [AUDIT.md](AUDIT.md) for component inventory
- **Operations:** Check [README-OPS.md](README-OPS.md) for deployment details
- **Questions:** Open a GitHub issue with the `question` label
