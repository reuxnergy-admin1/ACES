# UI/UX/UID Pattern Library

This document catalogues the design system, UI patterns, and user experience guidelines for the ACES Aerodynamics website. All patterns follow WCAG 2.2 AA accessibility standards and modern UX best practices.

## Design Tokens

### Colour System

Defined in `app/globals.css` as CSS custom properties:

```css
--color-background: rgb(0, 0, 0)      /* #000000 - Background */
--color-foreground: rgb(255, 255, 255) /* #FFFFFF - Primary text */
--color-muted: rgba(255, 255, 255, 0.5) /* Text secondary */
--color-subtle: rgba(255, 255, 255, 0.1) /* Borders, dividers */
--color-line: rgba(255, 255, 255, 0.12) /* UI lines */
```

**Usage in Tailwind:**
- `bg-bg` → Background colour
- `text-fg` → Foreground/text colour
- `text-muted` → Secondary text
- `text-subtle` → Tertiary text
- `border-line` → Border colour

**Accessibility:**
- All text maintains ≥4.5:1 contrast ratio against backgrounds
- Interactive elements maintain ≥3:1 contrast
- Theme inversion available for blog section

### Typography

**Font Stack:**
- Primary: Adobe Typekit (loaded via CDN)
- Fallback: System fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`)

**Scale:**
- `.heading-1` — 2.5rem (40px) base, scales fluid
- `.heading-2` — 2rem (32px) base, scales fluid
- `.heading-3` — 1.5rem (24px) base, scales fluid
- `.body` — 1rem (16px) base
- `.small` — 0.875rem (14px)

**Line Height:**
- Headings: 1.2
- Body: 1.6 (optimal readability)

**Line Length:**
- Body text: 60-72ch (characters)
- Headlines: 40-55ch
- Helper: Use `max-w-reading` class (72ch)

### Spacing Scale

Universal spacing scale based on 0.25rem increments:

```
2  → 0.5rem  (8px)
3  → 0.75rem (12px)
4  → 1rem    (16px)
6  → 1.5rem  (24px)
8  → 2rem    (32px)
12 → 3rem    (48px)
16 → 4rem    (64px)
```

**Usage:**
- `gap-4` → 1rem gap
- `p-6` → 1.5rem padding
- `mb-8` → 2rem margin bottom

### Layout System

**Container Widths:**
- `--container-max: 80rem` (1280px) — Standard content
- `--container-max-wide: 96rem` (1536px) — Hero sections
- `--container-pad: clamp(1rem, 5vw, 3rem)` — Responsive padding

**Grid System:**
- 12-column grid at 768px+
- Responsive gutters: 1.5rem → 5rem
- Components: `Grid12`, `Span` in `components/layout/`

**Breakpoints:**
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Z-Index Stack

Defined layers for predictable stacking:

```
z-bg      →  0   (Background layer)
z-content → 10   (Main content)
z-header  → 90   (Navigation/header)
z-overlay → 100  (Modals, overlays)
```

### Motion & Animation

**Easing Functions:**
```css
--ease-in-out-smooth: cubic-bezier(0.45, 0, 0.55, 1)
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1)
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

**Duration:**
- Micro interactions: 150-200ms
- UI transitions: 300-400ms
- Page transitions: 600-800ms

**Reduced Motion:**
All animations respect `prefers-reduced-motion: reduce`:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

## Component Patterns

### Navigation

**Desktop Menubar**
- Horizontal menubar with roving focus (Arrow keys)
- `Home`/`End` keys jump to first/last item
- Visual focus indicators (ring)
- Hover states with smooth transitions

**Mobile Dialog**
- Full-screen overlay with backdrop blur
- Focus trap within dialog
- Close on `Escape` key
- Inert background (no interaction)
- Smooth slide-in animation

**Implementation:** `components/Nav.tsx`

### Buttons & Interactive Elements

**Touch Target Size:**
- Minimum: 44×44px (WCAG AAA)
- Acceptable: 24×24px with adequate spacing

**States:**
- `:hover` → Background lighten, colour shift
- `:focus-visible` → 2px ring, offset 2px
- `:active` → Slight scale or translate
- `:disabled` → Reduced opacity, no pointer events

**Classes:**
- `.link-underline` → Animated underline on hover
- `.wipe-link` → Background wipe effect
- `.sheen-card` → Metallic sheen on hover

### Forms

**Input Fields:**
- Clear labels (always visible, not placeholder-only)
- Error states with red border and icon
- Help text below input
- `aria-describedby` for accessibility
- Focus states with ring

**Validation:**
- Client-side validation with immediate feedback
- Error messages visible and descriptive
- Success states with green accent

**Current Implementation:**
- Contact form: `app/contact/page.tsx`
- Order form: `app/order/page.tsx`

### Cards & Surfaces

**Surface Layers:**
```css
.surface       → rgba(255, 255, 255, 0.03)
.surface-90    → rgba(255, 255, 255, 0.06)
.surface-opaque → rgba(255, 255, 255, 0.1)
```

**Backdrop Blur:**
- Small: 8px
- Medium: 16px
- Large: 24px

**Usage:**
- Use for overlays, cards, modal backgrounds
- Combine with backdrop-filter for depth

### Loading & States

**Loading Indicators:**
- Spinner for indeterminate progress
- Progress bar for determinate operations
- Skeleton screens for content loading

**Empty States:**
- Clear icon or illustration
- Descriptive message
- Call-to-action if applicable

**Error States:**
- Error icon
- Clear error message
- Suggested action to resolve

## Layout Patterns

### Page Structure

Standard page structure:
```tsx
<SectionBand>
  <ContainerRow>
    <Grid12>
      <Span lg={8}>
        <Prose>
          {/* Content */}
        </Prose>
      </Span>
    </Grid12>
  </ContainerRow>
</SectionBand>
```

### Full-Bleed Sections

For edge-to-edge backgrounds:
```tsx
<section className="full-bleed">
  {/* Background extends full viewport width */}
</section>
```

**Implementation:** Uses `svw`/`dvw` units, not `100vw` (prevents horizontal scroll)

### Grid Layouts

**12-Column Grid:**
```tsx
<Grid12>
  <Span md={6} lg={4}>{/* Column 1 */}</Span>
  <Span md={6} lg={4}>{/* Column 2 */}</Span>
  <Span md={12} lg={4}>{/* Column 3 */}</Span>
</Grid12>
```

**Auto Grids:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

## Motion Patterns

### In-View Reveals

Progressive reveal as user scrolls:

```tsx
<InViewReveals>
  <div data-reveal="fade-up" data-reveal-delay="0">
    {/* Content reveals on scroll */}
  </div>
</InViewReveals>
```

**Reveal Types:**
- `fade-up` — Fade in while moving up
- `fade-in` — Simple fade in
- `scale` — Scale from 95% to 100%

**Delay:** Stagger reveals with `data-reveal-delay` (100ms increments)

### Page Transitions

Automatic page transitions on navigation:
- Noise blob overlay covers screen
- Old page fades out
- New page fades in
- Overlay reveals new content

**Implementation:** `components/PageTransition.tsx`

### Hover Effects

**Link Underlines:**
```tsx
<a className="link-underline">
  Hover for animated underline
</a>
```

**Wipe Effects:**
```tsx
<a className="wipe-link">
  Background wipes on hover
</a>
```

## Accessibility Patterns

### Skip Links

Skip to main content for keyboard users:
```tsx
<SkipLink targetId="main-content" />
```

**Behaviour:**
- Hidden until focused
- Jumps to main content
- Adds temporary tabindex for focus

### Focus Management

**Dialog Focus Trap:**
- Focus locked within dialog when open
- Tab/Shift+Tab cycles through focusable elements
- Focus returns to trigger on close

**Roving Focus:**
- Arrow keys move focus in menubar
- Only one item in tab order at a time
- Current item has tabindex="0", others have tabindex="-1"

### ARIA Implementation

**Common Patterns:**
- `aria-label` → Descriptive labels for icon buttons
- `aria-labelledby` → Reference visible heading
- `aria-describedby` → Reference help text
- `aria-expanded` → Disclosure state
- `aria-current="page"` → Active navigation item
- `aria-modal="true"` → Modal dialogs
- `role="menubar"` → Desktop navigation

### Screen Reader Support

- Semantic HTML (`<nav>`, `<main>`, `<article>`, `<aside>`)
- Proper heading hierarchy (only one `<h1>`)
- Alt text for all images
- ARIA live regions for dynamic updates
- Hidden decorative elements with `aria-hidden="true"`

## Performance Patterns

### Code Splitting

**Dynamic Imports:**
```tsx
const ContoursIsolines = dynamic(() => import('./ContoursIsolines'), {
  ssr: false,
  loading: () => <ContoursSVG />,
});
```

**When to Use:**
- Heavy libraries (Three.js, GSAP)
- Components not in initial viewport
- Feature-flagged content

### Image Optimization

**Next.js Image:**
```tsx
<Image
  src="/image.jpg"
  alt="Descriptive text"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

**Best Practices:**
- Always provide width/height
- Use `loading="lazy"` for below-fold images
- Provide appropriate alt text
- Use WebP format when possible

### Progressive Enhancement

**Server-First:**
- Most components are Server Components
- Only use `'use client'` when necessary
- Progressive enhancement for JavaScript features

**Fallbacks:**
- SVG background renders immediately
- WebGL upgrades after idle
- Reduced motion fallback for animations

## Testing Patterns

### Visual Regression Testing

Playwright tests with snapshot comparison:
```tsx
await expect(page).toHaveScreenshot('page-name.png', {
  mask: [page.locator('[data-vrt-mask]')],
});
```

**Masking:**
- Use `data-vrt-mask` for dynamic content
- Masks background canvas, timestamps, etc.

### Accessibility Testing

Axe-core integration:
```tsx
// In tests/a11y-audit.spec.ts
// Logs violations without failing CI
```

**Manual Testing:**
- Keyboard navigation
- Screen reader (NVDA, VoiceOver, JAWS)
- Colour contrast verification
- Zoom to 200%
- Mobile touch targets

## Common Pitfalls

### Avoid

❌ **Magic Numbers:** Always use design tokens
❌ **100vw Width:** Causes horizontal overflow; use `.full-bleed` class
❌ **Client Components Overuse:** Prefer Server Components
❌ **Missing Alt Text:** All images need descriptive alt
❌ **Placeholder-Only Labels:** Always include visible labels
❌ **Fixed Widths:** Use responsive containers and grids
❌ **Animations Without Reduced Motion:** Always provide fallback

### Do

✅ **Use Design Tokens:** CSS variables for consistency
✅ **Server-First Rendering:** Better performance and SEO
✅ **Progressive Enhancement:** Core functionality without JS
✅ **Semantic HTML:** Proper element hierarchy
✅ **Test Accessibility:** Keyboard, screen reader, contrast
✅ **Optimize Images:** Next Image with lazy loading
✅ **Responsive Design:** Test at multiple breakpoints

## Resources

- **WCAG 2.2 Guidelines:** [w3.org/WAI/WCAG22/quickref](https://www.w3.org/WAI/WCAG22/quickref/)
- **MDN Web Docs:** [developer.mozilla.org](https://developer.mozilla.org)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind Docs:** [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

**Last Updated:** 2025-01-01  
**Maintained by:** ACES Aerodynamics Development Team
