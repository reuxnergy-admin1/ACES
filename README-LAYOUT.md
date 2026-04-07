# Layout Decisions (Canonical)

## Tokens

- **Containers**: `--container-max: 80rem` (row) / `--container-max-wide: 96rem` (wide); fluid uses safe padding
- **Container alignment**: Left-anchored at wide viewports with shared baseline. `container-wide` and `container-row` both compute the left edge from the wide container width so headers, heroes, and body sections align on the same grid regardless of the section's maximum width
- **Reading width**: `72ch` for longform content via `Prose` component
- **Grid system**: 12-column from 768px; `.span-{4|6|8|12}` helper classes
- **Gutters**: `--grid-gutter`: 1.5rem base, 2rem ≥640px, 2.5rem ≥768px, 3rem ≥1024px, 4rem ≥1280px, 5rem ≥1536px
- **Container padding**: `--container-pad` used for all containers (side padding via clamp), safe-area aware
- **Z-index stack**: `.z-bg 0`, `.z-content 10`, `.z-header 90`, `.z-overlay 100`

## Policies

- **Line length**: Hero content 40–55ch; longform content 60–72ch. Use `ContainerWide` for heroes/visuals, `ContainerRow` for copy-heavy blocks
- **Full-bleed media**: Must use `.full-bleed` class which upgrades vw→svw/dvw; never use `width:100vw` in normal flow
- **Overflow guards**: `min-width:0` on grids/flex containers and children; children also `max-width:100%`. Media elements `max-width:100%`
- **Accessibility requirements**: Touch targets ≥24×24 CSS pixels; global `:focus-visible` rings; anchor targets use `scroll-margin-top` to avoid sticky-header occlusion; honours `prefers-reduced-motion`

## Migration Checklist

- [ ] Wrap sections with `SectionBand`; use `ContainerRow` or `ContainerWide` per content type
- [ ] Use `Grid12` + `Span` components instead of ad-hoc widths
- [ ] Replace any `100vw` usage with `.full-bleed` class
- [ ] Avoid fixed widths; rely on spans + maximum/reading widths
- [ ] Run `pnpm test:e2e` and verify overflow/screenshot results
- [ ] Ensure touch targets meet minimum size requirements
- [ ] Validate reduced motion behaviour
