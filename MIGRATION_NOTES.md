# Migration Notes

## Recent Architectural Changes

### Security Implementation (CSP + Nonce)

**Migration**: Moved from static export to server/edge runtime deployment

- **Before**: Static export with CDN-level security headers
- **After**: Server-side CSP with per-request nonces via middleware
- **Impact**: Enhanced security with strict script policies whilst maintaining compatibility

**Files Changed**:

- `middleware.ts` — CSP nonce generation and header injection
- `lib/csp.ts` — Server component nonce access
- `app/layout.tsx` — Inline pre-hydration script with nonce

### Testing Infrastructure

**Migration**: Production build testing for deterministic VRT

- **Before**: Development server testing
- **After**: Production build (`pnpm build && pnpm start`) for stable snapshots
- **Impact**: Eliminates dev overlays and HMR interference in visual tests

**Files Changed**:

- `playwright.config.ts` — Updated webServer command
- `tests/setup/global-setup.ts` — Route pre-warming
- Test specifications — Reduced motion emulation and masking

### Page Transition Lifecycle

**Migration**: Enhanced pointer event handling and reduced motion support

- **Before**: Basic overlay activation
- **After**: Synchronous reduced motion checks, pointer-events management, automation detection
- **Impact**: Improved accessibility and reliable navigation

**Files Changed**:

- `components/PageTransition.tsx` — Enhanced lifecycle management
- Tests — Updated lifecycle validation

## Breaking Changes

### Component Architecture

- **Server Components**: Several components migrated from client to server rendering
- **Props Interface**: Some component props may have changed during server migration
- **Import Paths**: Verify import paths if moving components between client/server boundaries

### Testing Updates

- **Snapshot Baselines**: VRT snapshots updated for production build rendering
- **Test Commands**: Use `pnpm test:e2e` (includes production build step)
- **Browser Installation**: Run `pnpm test:e2e:install` for Playwright browsers

## Backwards Compatibility

### Environment Requirements

- **Node**: Minimum version 22+ (see `.nvmrc`)
- **pnpm**: Version 9.12.3+ required for lockfile compatibility
- **Dependencies**: All major dependencies updated to latest stable versions

### Feature Flags

- **Chronicle UI**: Feature flag system maintains backwards compatibility
- **Reduced Motion**: Enhanced support whilst maintaining existing behaviour

## Migration Checklist

For projects extending this codebase:

- [ ] Update Node to version 22+
- [ ] Update pnpm to 9.12.3+
- [ ] Run `pnpm install` to update dependencies
- [ ] Review CSP configuration in `middleware.ts` for your domain requirements
- [ ] Update any custom components to use server-first architecture
- [ ] Run full test suite: `pnpm test:e2e`
- [ ] Verify background rendering stack functionality
- [ ] Test page transitions and reduced motion behaviour

## Rollback Procedures

### Revert to Static Export

If server deployment is not feasible:

1. Add `output: 'export'` to `next.config.js`
2. Configure security headers at CDN level (see `README-OPS.md`)
3. Remove CSP nonce usage from components
4. Update testing configuration for static build

### Component Rollbacks

- Server components can be reverted to client by adding `"use client"` directive
- Restore client-side functionality if server-side equivalents cause issues
- Test thoroughly after any component architecture changes
