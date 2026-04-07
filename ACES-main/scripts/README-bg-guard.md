# Background Guard (Documentation)

This project includes a sensitive background rendering stack (SVG fallback + idle WebGL upgrade).
To avoid accidental regressions, files are annotated with IMPORTANT comments and should be edited with caution.

## Protected Files

- `components/ResponsiveContours.tsx`
- `components/ContoursIsolines.tsx`
- `components/ContoursSVG.tsx`
- `components/BackgroundPortal.tsx`

## Recommended Workflow

1. Discuss proposed changes in a pull request
2. Test manually on: low-end device, reduced motion, mobile Safari, and desktop
3. Verify that the `body.bg-gl-ready` toggle correctly fades the SVG fallback
4. Validate pointer-events pass-through and header hide-on-scroll behaviour

## Background Guard Scripts

- `pnpm guard:bg` — Verify background asset integrity
- `pnpm guard:bg:update` — Refresh background asset checksums

No automated hash guard is enforced yet to keep builds frictionless. If needed later, we can add a simple checksum pre-commit hook.
