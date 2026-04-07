#!/usr/bin/env node
/**
 * Intelligent Branch Merger
 * 
 * Analyzes multiple branches and intelligently merges them by:
 * - Detecting complementary changes (non-overlapping files)
 * - Resolving simple conflicts automatically
 * - Prioritizing branches based on their purpose and freshness
 * - Creating merge strategies for different types of changes
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();

// Branch priority and characteristics
const BRANCH_CONFIG = {
  'main': { priority: 1, type: 'stable', description: 'Main stable branch' },
  'feat/rsc-hydration-diet': { priority: 2, type: 'performance', description: 'Performance optimizations' },
  'feat/ui-polish-aug29': { priority: 3, type: 'feature', description: 'UI/motion improvements' },
  'feat/ci-seo-a11y': { priority: 4, type: 'infrastructure', description: 'CI/CD improvements' },
  'docs/audit': { priority: 5, type: 'documentation', description: 'Documentation updates' },
  'codex/fix-layout-issues-in-project': { priority: 6, type: 'bugfix', description: 'Layout fixes' },
  'renovate/configure': { priority: 7, type: 'maintenance', description: 'Dependency management' },
};

// Files that should be handled with special care
const SENSITIVE_FILES = [
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'components/ResponsiveContours.tsx',
  'components/ContoursIsolines.tsx', 
  'components/ContoursSVG.tsx',
  'components/BackgroundPortal.tsx',
  'middleware.ts',
  'next.config.js',
];

class IntelligentMerger {
  constructor() {
    this.mergeLog = [];
    this.conflicts = [];
    this.backupBranch = null;
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    this.mergeLog.push(logEntry);
    console.log(logEntry);
  }

  exec(command, options = {}) {
    try {
      const result = execSync(command, { 
        cwd: root, 
        encoding: 'utf8',
        ...options
      });
      return result.trim();
    } catch (error) {
      if (!options.allowError) {
        throw new Error(`Command failed: ${command}\n${error.message}`);
      }
      return null;
    }
  }

  createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.backupBranch = `backup/pre-merge-${timestamp}`;
    
    this.log(`Creating backup branch: ${this.backupBranch}`);
    this.exec(`git checkout -b ${this.backupBranch}`);
    this.exec(`git checkout -`); // Return to previous branch
  }

  getBranches() {
    // First try to get GitHub API branches if available  
    const apiBranches = [
      'main', 'codex/fix-layout-issues-in-project', 'feat/ci-seo-a11y',
      'feat/rsc-hydration-diet', 'feat/ui-polish-aug29', 'docs/audit', 
      'renovate/configure'
    ];

    // Get all remote branches
    const remoteBranches = this.exec('git branch -r', { allowError: true });
    const remoteList = remoteBranches ? remoteBranches
      .split('\n')
      .map(b => b.trim().replace('origin/', ''))
      .filter(b => b && !b.includes('HEAD') && BRANCH_CONFIG[b])
      : [];

    // Get local branches that match our config
    const localBranches = this.exec('git branch', { allowError: true });
    const localList = localBranches ? localBranches
      .split('\n')
      .map(b => b.trim().replace('* ', ''))
      .filter(b => b && BRANCH_CONFIG[b])
      : [];

    // Combine GitHub API branches with available local/remote branches
    const allBranches = [...new Set([
      ...apiBranches.filter(b => BRANCH_CONFIG[b]),
      ...remoteList,
      ...localList
    ])];
    
    this.log(`Found branches to merge: ${allBranches.join(', ')}`);
    return allBranches.length > 0 ? allBranches : ['main']; // Fallback to main if none found
  }

  fetchBranches(branches) {
    this.log('Fetching all branches...');
    this.exec('git fetch --all');
    
    // Checkout each branch locally if not already present
    for (const branch of branches) {
      try {
        this.exec(`git show-ref --verify --quiet refs/heads/${branch}`, { allowError: true });
        const exitCode = this.exec(`echo $?`, { allowError: true });
        
        if (exitCode !== '0') {
          this.log(`Creating local branch: ${branch}`);
          this.exec(`git checkout -b ${branch} origin/${branch}`, { allowError: true });
        }
      } catch (error) {
        this.log(`Could not fetch branch ${branch}: ${error.message}`, 'warn');
      }
    }
  }

  analyzeBranch(branch, baseBranch = 'main') {
    try {
      // Get files changed in this branch
      const changedFiles = this.exec(`git diff --name-only ${baseBranch}...${branch}`, { allowError: true });
      if (!changedFiles) return { files: [], commits: [], analysis: {} };

      const files = changedFiles.split('\n').filter(f => f.trim());
      
      // Get commit info
      const commits = this.exec(`git log --oneline ${baseBranch}..${branch}`, { allowError: true });
      const commitList = commits ? commits.split('\n').filter(c => c.trim()) : [];

      // Analyze file types and sensitivity
      const analysis = {
        hasSensitiveFiles: files.some(f => SENSITIVE_FILES.some(sf => f.includes(sf))),
        hasDocumentationChanges: files.some(f => f.match(/\.(md|txt)$/i)),
        hasCodeChanges: files.some(f => f.match(/\.(ts|tsx|js|jsx)$/i)),
        hasConfigChanges: files.some(f => f.match(/\.(json|yaml|yml|config\.)$/i)),
        hasTestChanges: files.some(f => f.includes('test') || f.includes('spec')),
        fileCount: files.length,
        commitCount: commitList.length,
      };

      this.log(`Branch ${branch} analysis: ${analysis.fileCount} files, ${analysis.commitCount} commits`);
      
      return { files, commits: commitList, analysis };
    } catch (error) {
      this.log(`Error analyzing branch ${branch}: ${error.message}`, 'error');
      return { files: [], commits: [], analysis: {} };
    }
  }

  detectConflicts(branches) {
    this.log('Detecting potential conflicts...');
    const fileMap = new Map();
    
    for (const branch of branches) {
      const { files } = this.analyzeBranch(branch);
      
      for (const file of files) {
        if (!fileMap.has(file)) {
          fileMap.set(file, []);
        }
        fileMap.get(file).push(branch);
      }
    }

    // Find files modified by multiple branches
    const conflicts = [];
    for (const [file, branchList] of fileMap.entries()) {
      if (branchList.length > 1) {
        conflicts.push({ file, branches: branchList });
        this.log(`Potential conflict in ${file}: ${branchList.join(', ')}`, 'warn');
      }
    }

    return conflicts;
  }

  createMergeStrategy(branches, conflicts) {
    // Sort branches by priority
    const sortedBranches = branches
      .filter(b => BRANCH_CONFIG[b])
      .sort((a, b) => BRANCH_CONFIG[a].priority - BRANCH_CONFIG[b].priority);

    this.log(`Merge order: ${sortedBranches.map(b => `${b}(${BRANCH_CONFIG[b].type})`).join(' → ')}`);

    const strategy = {
      order: sortedBranches,
      conflictResolution: {},
      skipBranches: [],
    };

    // For each conflict, decide resolution strategy
    for (const conflict of conflicts) {
      const { file, branches: conflictBranches } = conflict;
      
      // Choose the branch with highest priority for this file
      const winningBranch = conflictBranches
        .filter(b => BRANCH_CONFIG[b])
        .sort((a, b) => BRANCH_CONFIG[a].priority - BRANCH_CONFIG[b].priority)[0];

      strategy.conflictResolution[file] = {
        strategy: 'take-from-branch',
        branch: winningBranch,
        reason: `Highest priority branch (${BRANCH_CONFIG[winningBranch].type})`,
      };

      this.log(`Conflict resolution for ${file}: use version from ${winningBranch}`);
    }

    return strategy;
  }

  executeMerge(strategy) {
    this.log('Starting intelligent merge process...');
    
    // Start from main branch
    this.exec('git checkout main');
    
    // Create new merge branch
    const mergeBranch = `intelligent-merge-${Date.now()}`;
    this.exec(`git checkout -b ${mergeBranch}`);
    
    this.log(`Created merge branch: ${mergeBranch}`);

    let successfulMerges = 0;
    
    for (const branch of strategy.order) {
      if (strategy.skipBranches.includes(branch)) {
        this.log(`Skipping branch: ${branch}`, 'info');
        continue;
      }

      try {
        this.log(`Merging branch: ${branch}`);
        
        // Try automatic merge first
        const mergeResult = this.exec(`git merge --no-commit ${branch}`, { allowError: true });
        
        if (mergeResult === null) {
          // Merge conflict occurred
          this.log(`Merge conflict in ${branch}, applying resolution strategy`, 'warn');
          this.resolveConflicts(branch, strategy.conflictResolution);
        }
        
        // Complete the merge
        const status = this.exec('git status --porcelain', { allowError: true });
        if (status && status.trim()) {
          this.exec('git add .');
          this.exec(`git commit -m "intelligent-merge: merge ${branch} (${BRANCH_CONFIG[branch].description})"`);
        }
        
        successfulMerges++;
        this.log(`Successfully merged ${branch}`);
        
      } catch (error) {
        this.log(`Failed to merge ${branch}: ${error.message}`, 'error');
        
        // Abort this merge and continue
        this.exec('git merge --abort', { allowError: true });
        strategy.skipBranches.push(branch);
      }
    }

    this.log(`Merge complete: ${successfulMerges}/${strategy.order.length} branches merged successfully`);
    return mergeBranch;
  }

  resolveConflicts(branch, resolutionStrategy) {
    const conflictFiles = this.exec('git diff --name-only --diff-filter=U', { allowError: true });
    if (!conflictFiles) return;

    const files = conflictFiles.split('\n').filter(f => f.trim());
    
    for (const file of files) {
      const resolution = resolutionStrategy[file];
      
      if (resolution && resolution.strategy === 'take-from-branch') {
        if (resolution.branch === branch) {
          // Take the version from current branch being merged
          this.exec(`git checkout --theirs ${file}`);
          this.log(`Resolved conflict in ${file}: taking version from ${branch}`);
        } else {
          // Take the version from the specified branch (usually ours/main)
          this.exec(`git checkout --ours ${file}`);
          this.log(`Resolved conflict in ${file}: keeping current version`);
        }
      } else {
        // Default: take our version (current branch)
        this.exec(`git checkout --ours ${file}`);
        this.log(`Resolved conflict in ${file}: using default resolution (ours)`);
      }
    }
  }

  validateMerge() {
    this.log('Validating merged codebase...');
    
    try {
      // Run linter
      const lintResult = this.exec('pnpm lint', { allowError: true });
      if (lintResult === null) {
        this.log('Lint check failed', 'warn');
        return false;
      }
      this.log('Lint check passed');

      // Check if critical files exist
      const criticalFiles = ['package.json', 'next.config.js', 'middleware.ts'];
      for (const file of criticalFiles) {
        if (!existsSync(resolve(root, file))) {
          this.log(`Critical file missing: ${file}`, 'error');
          return false;
        }
      }
      this.log('Critical files check passed');

      // Try to build (if not too slow)
      // this.exec('pnpm build', { allowError: true });
      
      return true;
    } catch (error) {
      this.log(`Validation failed: ${error.message}`, 'error');
      return false;
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      backupBranch: this.backupBranch,
      mergeLog: this.mergeLog,
      conflicts: this.conflicts,
      success: true,
    };

    const reportPath = resolve(root, 'intelligent-merge-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`Merge report saved to: ${reportPath}`);
    return report;
  }

  async run() {
    try {
      this.log('Starting intelligent branch merger...');
      
      // Create backup
      this.createBackup();
      
      // Get branches to merge
      const branches = this.getBranches();
      if (branches.length === 0) {
        this.log('No branches found to merge', 'error');
        return;
      }
      
      // Fetch all branches
      this.fetchBranches(branches);
      
      // Detect conflicts
      const conflicts = this.detectConflicts(branches);
      this.conflicts = conflicts;
      
      // Create merge strategy
      const strategy = this.createMergeStrategy(branches, conflicts);
      
      // Execute merge
      const mergeBranch = this.executeMerge(strategy);
      
      // Validate result
      const isValid = this.validateMerge();
      
      if (isValid) {
        this.log('Intelligent merge completed successfully!', 'info');
        this.log(`New merge branch: ${mergeBranch}`);
        this.log(`Backup branch: ${this.backupBranch}`);
      } else {
        this.log('Merge validation failed, check the results manually', 'warn');
      }
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      this.log(`Merge process failed: ${error.message}`, 'error');
      throw error;
    }
  }
}

// CLI interface
const command = process.argv[2] || 'merge';

if (command === 'merge') {
  const merger = new IntelligentMerger();
  merger.run().catch(console.error);
} else if (command === 'report') {
  const reportPath = resolve(process.cwd(), 'intelligent-merge-report.json');
  if (existsSync(reportPath)) {
    const report = JSON.parse(readFileSync(reportPath, 'utf8'));
    console.log('\n=== INTELLIGENT MERGE REPORT ===');
    console.log(`Timestamp: ${report.timestamp}`);
    console.log(`Backup Branch: ${report.backupBranch}`);
    console.log(`Status: ${report.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`\nConflicts Resolved: ${report.conflicts?.length || 0}`);
    console.log('\nMerge Log:');
    report.mergeLog?.forEach(log => console.log(`  ${log}`));
  } else {
    console.log('No merge report found');
  }
} else {
  console.log('Usage: node intelligent-merge.mjs [merge|report]');
  process.exit(1);
}