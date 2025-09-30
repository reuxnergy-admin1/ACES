# Branch Comparison and Merge Analysis

## Repository Structure

The ACES repository contains multiple feature branches with **unrelated histories** due to repository grafting. This document provides a detailed comparison to aid in merge decisions.

## Branch Timeline and Relationships

```
main (18d752e) ← Latest official state
    └─ Merge pull request #12 (copilot fixes)

feat/ui-polish-aug29 (9214939) ← Most recent feature work
    └─ Merge PR #6 (copilot motion system)
        └─ Chronicle-grade motion implementation
            └─ Multiple prior commits

codex/fix-layout-issues-in-project (0699838) ← Integrated branch
    └─ Fix skip link ID
        └─ Merge PR #4 (docs/audit)
            └─ Merge PR #3 (feat/ci-seo-a11y)
                └─ Merge PR #2 (feat/rsc-hydration-diet)

feat/rsc-hydration-diet (91d7dd7) ← Performance branch
feat/ci-seo-a11y (482bad7) ← Infrastructure branch
docs/audit (86b7589) ← Documentation branch
renovate/configure (cc101c4) ← Maintenance branch
```

## Detailed Commit Analysis

### Main Branch (18d752e)
- **Last Updated:** Latest
- **Base:** Grafted history
- **Key Commit:** Merge pull request #12 from IAmJonoBo/copilot/fix-359d647f-18b4-4a32-8476-1d90342a8e9e
- **Status:** Official production state

**Unique Features:**
- All scripts and documentation
- Complete project structure
- Latest layout fixes
- Intelligent merge utilities

### feat/ui-polish-aug29 (9214939) - Motion System Branch
**Commits:** 15+ commits
**Last Commit:** Merge pull request #6 (copilot motion system work)

**Key Features:**
- Chronicle-grade motion system implementation
- GSAP-based animations and reveals
- Intersection Observer stagger system
- Magnetic cursor effects
- Logo sheen animations
- Products stagger reveal
- Enhanced UI polish
- Refined button/link interactions
- Focus-visible rings
- Safe view transitions
- Header backdrop and scrim effects

**Notable Commits:**
1. `86299c1` - feat(motion): Complete Chronicle-grade motion system implementation and migration
2. `088b080` - refactor(landing): apply IO-stagger reveals to hero
3. `4409494` - feat(motion): add reveal primitives and gsap pin section
4. `9b2d51c` - feat(ui): header sheen + CTA polish
5. `740d784` - chore(cursor): remove legacy cursor overlay components

### feat/rsc-hydration-diet (91d7dd7) - Performance Branch
**Commits:** 10 commits
**Focus:** React Server Components and performance optimization

**Key Features:**
- Lazy-load cursor overlay and WebGL background
- Server SVG first-paint optimization
- Fine-pointer gating for better UX
- ContoursSVG and SheenCard as server components
- Order page converted to RSC with client OrderForm
- Desktop nav: slide-down animations with hover-intent persistence
- Mobile nav: accordion-style dropdowns with ARIA sections
- Rise-like desktop dropdowns with accessibility improvements
- Pointer-aware utility functions
- Layout refinements: centered nav, increased gutters
- Magnetic cursor + ripple effects
- Logo sheen effects

**Notable Commits:**
1. `91d7dd7` - perf: lazy-load cursor overlay and WebGL background
2. `1f6c3e6` - refactor(rsc): move ContoursSVG and SheenCard to server components
3. `50abd94` - feat(order): convert order page to RSC
4. `5d98ee5` - nav/desktop: add slide-down animation for dropdown
5. `d79e8a7` - nav/mobile: accordion-style dropdowns with ARIA sections

### feat/ci-seo-a11y (482bad7) - Infrastructure Branch
**Commits:** 4 commits
**Focus:** CI/CD, SEO, and accessibility improvements

**Key Features:**
- GitHub Actions CI pipeline setup
- pnpm global installation fixes (PATH issues resolved)
- Lighthouse CI expanded to multiple routes (/, /products, /services, /blog)
- robots.txt and sitemap.xml generation
- Security headers configuration (not applied on static export)
- ESLint a11y rules integration
- PageTransition kept as client import (RSC compatibility)
- Cursor visibility controls (hide system cursor only when overlay active)

**Notable Commits:**
1. `482bad7` - ci: use global pnpm only (install + verify)
2. `1d00fee` - ci: install pnpm globally to ensure PATH
3. `cbebf16` - ci: expand Lighthouse CI coverage
4. `014d613` - ci+seo+a11y: comprehensive setup

### docs/audit (86b7589) - Documentation Branch
**Commits:** 4 commits
**Focus:** Repository audit and documentation

**Key Features:**
- Comprehensive AUDIT.md document
- Repository issues and opportunities identified
- Implementation references
- Best practices documentation

**Notable Commits:**
1. `86b7589` - Update AUDIT.md (final version)
2. `549203a` - Update AUDIT.md
3. `78bef79` - Update AUDIT.md
4. `a9c310c` - docs(audit): add repository audit

### codex/fix-layout-issues-in-project (0699838) - Integration Branch
**Commits:** Includes merges from multiple branches
**Status:** Most integrated feature branch

**Key Features:**
- Skip link ID fix (avoids URL hash issues)
- **Includes all commits from:**
  - docs/audit branch (via PR #4)
  - feat/ci-seo-a11y branch (via PR #3)
  - feat/rsc-hydration-diet branch (via PR #2)
- Most complete feature set among feature branches
- Active development branch with multiple integrations

**Notable Commits:**
1. `0699838` - Fix skip link ID to avoid URL hash issues
2. `5919a52` - Merge PR #4 (docs/audit)
3. `8790223` - Merge PR #3 (feat/ci-seo-a11y)
4. `79f31ed` - Merge PR #2 (feat/rsc-hydration-diet)

### renovate/configure (cc101c4) - Maintenance Branch
**Commits:** 2 commits
**Focus:** Dependency management automation

**Key Features:**
- Renovate bot configuration
- Automated dependency updates setup

## File Differences Summary

### Main vs Feature Branches

**Files unique to main:**
- Enhanced documentation (BRAND.md, CHRONICLE_IMPLEMENTATION.md, HANDOVER.md, etc.)
- Example pages in app/(examples)/
- Complete scripts directory with merge utilities
- Extended README files (README-LAYOUT.md, README-OPS.md, README-STAGGER.md)

**Files modified across branches:**
- All page components (app/**/*.tsx)
- Core components (components/*.tsx)
- Configuration files (next.config.js, eslint, etc.)
- Styling (app/globals.css)
- Layout (app/layout.tsx)

## Merge Compatibility Matrix

| From Branch | To Main | Conflicts Expected | Recommended Strategy |
|-------------|---------|-------------------|---------------------|
| feat/ui-polish-aug29 | ⚠️ | HIGH | Cherry-pick specific commits |
| feat/rsc-hydration-diet | ⚠️ | HIGH | Evaluate performance gains, selective merge |
| feat/ci-seo-a11y | ⚠️ | MEDIUM | Check if features already in main |
| docs/audit | ✅ | LOW | Documentation may be outdated in main |
| codex/fix-layout-issues-in-project | ⚠️ | HIGH | Contains other branch merges |
| renovate/configure | ✅ | LOW | Easy to integrate |

## Recommendations

### Short Term (Current Sprint)
1. **Continue with main branch** as production state
2. **Document feature branch improvements** for future integration
3. **Run full test suite** on main in proper environment

### Medium Term (Next Sprint)
1. **Evaluate motion system** from feat/ui-polish-aug29
   - Create new branch from main
   - Cherry-pick Chronicle motion commits
   - Test thoroughly
2. **Review performance optimizations** from feat/rsc-hydration-diet
   - Measure current performance baseline
   - Compare with RSC implementation
   - Integrate if significant improvement
3. **Update documentation** from docs/audit if newer

### Long Term (Future Sprints)
1. **Consolidate branches** into single development flow
2. **Establish clear branching strategy** to avoid unrelated histories
3. **Set up automated testing** in CI/CD pipeline
4. **Regular dependency updates** using Renovate

## Integration Priority

1. **High Priority:**
   - renovate/configure (easy to integrate, low risk)
   - docs/audit documentation updates (if newer than main)

2. **Medium Priority:**
   - feat/ci-seo-a11y improvements (check if already in main)
   - Skip link fix from codex branch

3. **Evaluate & Plan:**
   - feat/ui-polish-aug29 motion system (requires testing)
   - feat/rsc-hydration-diet performance optimizations (requires benchmarking)

## Conclusion

The repository's grafted history creates challenges for traditional git merging. The **main branch represents the official state**, while feature branches contain valuable improvements that should be **selectively integrated** through cherry-picking or manual porting rather than direct merging.

**Next Steps:**
1. ✅ QC report completed
2. ✅ Branch analysis documented
3. 📋 Create integration plan for high-value features
4. 🧪 Set up proper testing environment for E2E validation

---
**Document Version:** 1.0
**Last Updated:** 2025-09-30
**Maintained by:** Development Team
