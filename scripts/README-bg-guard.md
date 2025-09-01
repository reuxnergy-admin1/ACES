# Background Guard (documentation)

This project includes a sensitive background rendering stack (SVG fallback + idle WebGL upgrade).
To avoid accidental regressions, files are annotated with IMPORTANT comments and should be edited cautiously.

Files

- components/ResponsiveContours.tsx
- components/ContoursIsolines.tsx
- components/ContoursSVG.tsx
- components/BackgroundPortal.tsx

Recommended workflow

1. Discuss proposed changes in a PR.
2. Manually test on: low-end device, reduced motion, mobile Safari, and desktop.
3. Verify that the body.bg-gl-ready toggle correctly fades the SVG fallback.
4. Validate pointer-events pass-through and header hide-on-scroll.

No automated hash guard is enforced yet to keep builds frictionless. If needed later, we can add a simple checksum pre-commit.
