# Layout Decisions (canonical)

Tokens

- Containers: `--container-max: 80rem` (row) / `--container-max-wide: 96rem` (wide); fluid uses safe padding.
- Containers are left-anchored at wide viewports and share the same baseline. `container-wide` and `container-row` both compute the left edge from the wide container width so headers, heroes and body sections align on the same grid regardless of the section's max width.
- Reading width: `72ch` for longform via `Prose`.
- Grid: 12-col from 768px; `.span-{4|6|8|12}` helpers.
- Gutters: `--grid-gutter`: 1.5rem base, 2rem ≥640px, 2.5rem ≥768px, 3rem ≥1024px, 4rem ≥1280px, 5rem ≥1536px.
- Container pad: `--container-pad` used for all containers (side padding via clamp), safe-area aware.
- Z stack: `.z-bg 0`, `.z-content 10`, `.z-header 90`, `.z-overlay 100`.

Policies

- Line length: hero 40–55ch; longform 60–72ch. Use `ContainerWide` for heroes/visuals, `ContainerRow` for copy-heavy blocks.
- Full-bleed media must use `.full-bleed` which upgrades vw→svw/dvw; never use `width:100vw` in normal flow.
- Overflow guards: `min-width:0` on grids/flex and children; children also `max-width:100%`. Media `max-width:100%`.
- Accessibility: touch targets ≥24×24 CSS px; global `:focus-visible` rings; anchor targets use `scroll-margin-top` to avoid sticky-header occlusion; honours `prefers-reduced-motion`.

Migration Checklist

- [ ] Wrap sections with `SectionBand`; use `ContainerRow` or `ContainerWide` per content type.
- [ ] Use `Grid12` + `Span` instead of ad-hoc widths.
- [ ] Replace any `100vw` with `.full-bleed`.
- [ ] Avoid fixed widths; rely on spans + max/reading widths.
- [ ] Run `pnpm test:e2e` and check overflow/screenshot results.
