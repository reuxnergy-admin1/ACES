# Intelligent Branch Merger

A sophisticated system for automatically merging multiple feature branches while minimizing conflicts and preserving important functionality.

## Overview

The intelligent merger analyzes all feature branches in the repository, detects potential conflicts, and creates an optimal merge strategy based on:

- **Branch priority**: Stable branches (main) take precedence over feature branches
- **Change types**: Performance, infrastructure, documentation, bugfixes have different merge priorities
- **File sensitivity**: Critical files like background rendering components are handled with extra care
- **Conflict resolution**: Automatic resolution strategies for common conflict patterns

## Branch Priority System

1. `main` - Stable baseline (highest priority)
2. `feat/rsc-hydration-diet` - Performance optimizations
3. `feat/ui-polish-aug29` - UI/motion improvements  
4. `feat/ci-seo-a11y` - CI/CD improvements
5. `docs/audit` - Documentation updates
6. `codex/fix-layout-issues-in-project` - Layout fixes
7. `renovate/configure` - Dependency management (lowest priority)

## Protected Files

The merger treats these files with special care due to their critical nature:

- `package.json`, `package-lock.json`, `pnpm-lock.yaml` - Dependencies
- `components/ResponsiveContours.tsx`, `components/ContoursIsolines.tsx`, `components/ContoursSVG.tsx`, `components/BackgroundPortal.tsx` - Background rendering stack
- `middleware.ts` - Security implementation
- `next.config.js` - Build configuration

## Usage

### Run Intelligent Merge

```bash
pnpm merge:intelligent
```

This will:
1. Create a backup branch (`backup/pre-merge-TIMESTAMP`)
2. Fetch all remote branches
3. Analyze each branch for conflicts and changes
4. Create an optimal merge strategy
5. Execute merges in priority order
6. Resolve conflicts automatically where possible
7. Validate the final result with linting
8. Generate a detailed report

### View Merge Report

```bash
pnpm merge:report
```

Shows the detailed log from the last merge operation, including:
- Which branches were merged successfully
- How conflicts were resolved
- Backup branch location
- Validation results

## Merge Strategies

### Automatic Conflict Resolution

- **Non-overlapping files**: Merged automatically without conflicts
- **Documentation files**: Latest changes preferred
- **Configuration files**: Stable branch version preferred
- **Code files**: Priority branch version with manual review suggested

### Safe Rollback

If the merge doesn't work as expected:

```bash
git checkout BACKUP_BRANCH_NAME  # From the merge report
git branch -M main               # Replace main with the backup
```

## Integration with Background Guard

The merger respects the background guard system (`pnpm guard:bg`) and will:
- Preserve background rendering component integrity
- Update hashes automatically if background files are modified
- Warn about sensitive file changes requiring manual review

## Validation

After merging, the system automatically:
- Runs `pnpm lint` to check code quality
- Verifies critical files exist
- Checks for basic build compatibility
- Generates a comprehensive report

## Examples

### Successful Merge Output

```
[2025-01-20T10:30:00.000Z] INFO: Starting intelligent branch merger...
[2025-01-20T10:30:01.000Z] INFO: Creating backup branch: backup/pre-merge-2025-01-20T10-30-01-000Z
[2025-01-20T10:30:02.000Z] INFO: Found branches to merge: feat/rsc-hydration-diet, feat/ui-polish-aug29, docs/audit
[2025-01-20T10:30:05.000Z] INFO: Merge order: main(stable) → feat/rsc-hydration-diet(performance) → feat/ui-polish-aug29(feature)
[2025-01-20T10:30:10.000Z] INFO: Successfully merged feat/rsc-hydration-diet
[2025-01-20T10:30:15.000Z] INFO: Successfully merged feat/ui-polish-aug29
[2025-01-20T10:30:20.000Z] INFO: Lint check passed
[2025-01-20T10:30:20.000Z] INFO: Intelligent merge completed successfully!
```

### Handling Conflicts

When conflicts occur, the merger automatically resolves them based on branch priority:

```
[2025-01-20T10:30:12.000Z] WARN: Potential conflict in components/ResponsiveContours.tsx: feat/rsc-hydration-diet, feat/ui-polish-aug29
[2025-01-20T10:30:12.000Z] INFO: Conflict resolution for components/ResponsiveContours.tsx: use version from feat/rsc-hydration-diet
[2025-01-20T10:30:13.000Z] INFO: Resolved conflict in components/ResponsiveContours.tsx: taking version from feat/rsc-hydration-diet
```

## Best Practices

1. **Review before merging**: Check what branches exist and their recent changes
2. **Test after merging**: Always run the full test suite after an intelligent merge
3. **Keep backups**: The system creates backups, but you can create additional ones manually
4. **Update documentation**: After successful merges, update relevant documentation
5. **Background guard**: Run `pnpm guard:bg:update` if background rendering files were modified

## Troubleshooting

### Common Issues

**"No branches found to merge"**
- Ensure branches exist in the remote repository
- Check that branch names match the configuration

**"Merge validation failed"**  
- Check the lint output for code quality issues
- Verify all critical files are present
- Review the merge report for specific error details

**"Critical file missing"**
- Some branches might have removed important files
- Check the backup branch and restore missing files manually

### Recovery

If something goes wrong:
1. Check the merge report: `pnpm merge:report`
2. Switch to backup branch: `git checkout BACKUP_BRANCH_NAME`
3. Create a new main branch: `git checkout -b main`
4. Review what went wrong and try a manual merge approach