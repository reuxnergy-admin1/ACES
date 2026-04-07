# Chronicle UI Implementation

## Overview

Chronicle UI is a feature flag system that allows switching between different user interface modes whilst maintaining the same underlying functionality and data structure.

## Feature Flag System

### Cookie-Based Implementation

**Location**: `middleware.ts`

**Mechanism**:

```typescript
// Feature flag cookie for Chronicle UI controlled via ?ui=chronicle|default
const ui = req.nextUrl.searchParams.get('ui');
if (ui === 'chronicle') {
  res.cookies.set('feature-chronicle-ui', '1', { path: '/', httpOnly: false, sameSite: 'lax' });
} else if (ui === 'default') {
  res.cookies.delete('feature-chronicle-ui');
}
```

### URL Parameter Control

- **Enable Chronicle UI**: Add `?ui=chronicle` to any URL
- **Disable Chronicle UI**: Add `?ui=default` to any URL
- **Persistent State**: Cookie maintains selection across navigation

## Layout Integration

### Root Layout Implementation

**Location**: `app/layout.tsx`

```typescript
const chronicleOn = cookieStore.get('feature-chronicle-ui')?.value === '1';
return (
  <html lang="en" className={chronicleOn ? 'feature-chronicle-ui' : undefined}>
    {/* Layout content */}
  </html>
);
```

### CSS Selector Pattern

The feature flag applies the `feature-chronicle-ui` class to the `<html>` element, enabling targeted styling:

```css
/* Default UI styles */
.component {
  /* Standard styling */
}

/* Chronicle UI overrides */
.feature-chronicle-ui .component {
  /* Alternative styling */
}
```

## Current Implementation Status

### Infrastructure Complete

- ✅ **Cookie management** via middleware
- ✅ **URL parameter switching**
- ✅ **Root layout integration**
- ✅ **CSS selector pattern**

### UI Variants Pending

The infrastructure is in place, but specific Chronicle UI variants need to be designed and implemented:

- 📋 **Component styling overrides**
- 📋 **Layout adjustments**
- 📋 **Typography variations**
- 📋 **Interaction patterns**

## Implementation Guidelines

### Adding Chronicle Variants

1. **CSS Approach** (Recommended for styling changes):

```css
/* component.module.css or globals.css */
.nav-item {
  padding: 1rem;
  background: var(--surface-color);
}

.feature-chronicle-ui .nav-item {
  padding: 0.75rem;
  background: var(--chronicle-surface-color);
  border-radius: 0.25rem;
}
```

1. **Component Logic** (For functionality changes):

```typescript
// components/SomeComponent.tsx
import { cookies } from 'next/headers';

export default async function SomeComponent() {
  const cookieStore = await cookies();
  const isChronicle = cookieStore.get('feature-chronicle-ui')?.value === '1';
  
  return (
    <div className={isChronicle ? 'chronicle-variant' : 'default-variant'}>
      {/* Component content */}
    </div>
  );
}
```

1. **Client Component Access**:

```typescript
// For client components, read from document.documentElement.classList
'use client';
import { useEffect, useState } from 'react';

export default function ClientComponent() {
  const [isChronicle, setIsChronicle] = useState(false);
  
  useEffect(() => {
    setIsChronicle(document.documentElement.classList.contains('feature-chronicle-ui'));
  }, []);
  
  // Component logic
}
```

## Design System Integration

### CSS Custom Properties

Define Chronicle-specific design tokens:

```css
:root {
  /* Default tokens */
  --surface-color: #1a1a1a;
  --text-primary: #ffffff;
  --spacing-unit: 1rem;
}

.feature-chronicle-ui {
  /* Chronicle tokens */
  --surface-color: #2a2a2a;
  --text-primary: #f0f0f0;
  --spacing-unit: 0.875rem;
  --chronicle-accent: #007acc;
}
```

### Component Architecture

- **Server Components**: Access feature flag via cookies
- **Client Components**: Access via document class or context
- **Shared Logic**: Create utilities for consistent feature detection

## Testing Strategy

### E2E Testing

```typescript
// tests/chronicle-ui.spec.ts
test('Chronicle UI toggle', async ({ page }) => {
  // Test default UI
  await page.goto('/');
  await expect(page.locator('.component')).toHaveClass(/default-variant/);
  
  // Enable Chronicle UI
  await page.goto('/?ui=chronicle');
  await expect(page.locator('html')).toHaveClass(/feature-chronicle-ui/);
  await expect(page.locator('.component')).toHaveClass(/chronicle-variant/);
  
  // Persistence test
  await page.goto('/about');
  await expect(page.locator('html')).toHaveClass(/feature-chronicle-ui/);
});
```

### Visual Regression Testing

- Maintain separate snapshots for default and Chronicle UI variants
- Use URL parameters to test both modes in Playwright

## Future Enhancements

### Potential Improvements

- **Admin Interface**: UI for managing feature flags
- **User Preferences**: Personal UI mode selection
- **A/B Testing**: Random assignment for user research
- **Progressive Enhancement**: Graceful fallbacks for JS-disabled environments

### Design System Evolution

- **Chronicle Design Tokens**: Complete colour, typography, and spacing systems
- **Component Library**: Chronicle-specific component variants
- **Documentation**: Visual design guide for Chronicle UI patterns

The Chronicle implementation provides a robust foundation for UI experimentation whilst maintaining code maintainability and user experience consistency.
