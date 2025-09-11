# Stagger Reveal Animation System

## Overview

The stagger reveal system provides coordinated animations for content that enters the viewport, creating elegant progressive disclosure patterns whilst respecting user motion preferences.

## Core Components

### StaggerReveal Component

**Location**: `components/StaggerReveal.tsx`

**Purpose**: Orchestrates staggered animations for child elements using Intersection Observer

**Usage**:

```tsx
<StaggerReveal>
  <div>First item</div>
  <div>Second item</div>
  <div>Third item</div>
</StaggerReveal>
```

### CSS Classes

**Base Classes** (defined in `app/globals.css`):

- `.fade-stagger` — Applied to containers for staggered animations
- `.fade-stagger > *` — Individual child element animations

**Animation Properties**:

- **Timing**: 0.6s ease-out with 0.1s stagger delay between elements
- **Transform**: Translates from `translateY(1rem)` to `translateY(0)`
- **Opacity**: Fades from 0 to 1

## Implementation Details

### Intersection Observer

- **Threshold**: 0.1 (triggers when 10% of element is visible)
- **Root Margin**: "-10% 0px" (starts animation slightly before element fully enters viewport)
- **Performance**: Uses passive observation for optimal scroll performance

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .fade-stagger > * {
    transition: none;
    transform: none;
    opacity: 1;
  }
}
```

### Animation Lifecycle

1. **Initial State**: Children have `opacity: 0` and `transform: translateY(1rem)`
2. **Intersection**: Observer detects element entry
3. **Trigger**: `.in-view` class added to container
4. **Stagger**: Each child animates with incremental delay
5. **Complete**: All children reach final state with `opacity: 1` and `transform: translateY(0)`

## Usage Patterns

### Basic Content Sections

```tsx
<section>
  <StaggerReveal>
    <h2>Section Title</h2>
    <p>Section content...</p>
    <Button>Call to Action</Button>
  </StaggerReveal>
</section>
```

### Card Grids

```tsx
<Grid12>
  <StaggerReveal>
    {cards.map(card => (
      <Span key={card.id} span={4}>
        <Card {...card} />
      </Span>
    ))}
  </StaggerReveal>
</Grid12>
```

### Navigation Elements

Applied automatically to `main` content areas via `.fade-stagger` class in layout.

## Performance Considerations

### Optimisation Strategies

- **Observer Cleanup**: Automatically disconnects observers when components unmount
- **Batch Updates**: Groups DOM modifications to minimise layout thrash
- **Hardware Acceleration**: Uses `transform` and `opacity` for optimal performance

### Testing Considerations

- Tests run with reduced motion to ensure deterministic visual snapshots
- Animation states are mockable for unit testing
- Intersection Observer is polyfilled in test environment

## Accessibility

### Motion Sensitivity

- **Reduced Motion**: Completely disables animations when `prefers-reduced-motion: reduce`
- **Fallback State**: Content remains fully accessible without animations
- **Progressive Enhancement**: Animations enhance experience but don't break functionality

### Screen Reader Compatibility

- No impact on screen reader navigation or content announcement
- ARIA properties and semantic HTML preserved during animations
- Focus management unaffected by animation states

## Customisation

### Timing Adjustments

Modify stagger timing in `app/globals.css`:

```css
.fade-stagger > * {
  transition-delay: calc(var(--stagger-index, 0) * 0.1s); /* Adjust multiplier */
  transition-duration: 0.6s; /* Adjust duration */
}
```

### Animation Variants

Create custom reveal animations by extending the base pattern:

```css
.slide-stagger > * {
  transform: translateX(-2rem);
  transition: transform 0.8s ease-out, opacity 0.8s ease-out;
}

.slide-stagger.in-view > * {
  transform: translateX(0);
}
```

## Integration with Page Transitions

The stagger system works in coordination with `PageTransition.tsx` to ensure:

- Reveals are properly scheduled during page transitions
- Animation timing doesn't conflict with overlay lifecycle
- Fallback reveals trigger if intersection observer doesn't fire

This creates a cohesive motion system across the entire application whilst maintaining accessibility and performance standards.
