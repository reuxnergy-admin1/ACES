#!/usr/bin/env node
/**
 * Branch Merge Utility
 * 
 * A simplified version of the intelligent merger that can work with
 * locally available branches and provides manual merge assistance.
 */

import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

class BranchMergeUtility {
  constructor() {
    this.log = [];
  }

  logMessage(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    this.log.push(logEntry);
    console.log(logEntry);
  }

  exec(command, allowError = false) {
    try {
      return execSync(command, { encoding: 'utf8', cwd: process.cwd() }).trim();
    } catch (error) {
      if (!allowError) {
        throw new Error(`Command failed: ${command}\n${error.message}`);
      }
      return null;
    }
  }

  listAvailableBranches() {
    this.logMessage('Scanning for available branches...');
    
    const remoteBranches = this.exec('git branch -r', true);
    const localBranches = this.exec('git branch', true);
    
    const remote = remoteBranches ? remoteBranches.split('\n')
      .map(b => b.trim())
      .filter(b => b && !b.includes('HEAD'))
      .map(b => ({ name: b, type: 'remote' })) : [];
      
    const local = localBranches ? localBranches.split('\n')
      .map(b => b.trim().replace('* ', ''))
      .filter(b => b && b !== '')
      .map(b => ({ name: b, type: 'local', current: localBranches.includes(`* ${b}`) })) : [];

    this.logMessage(`Found ${remote.length} remote branches and ${local.length} local branches`);
    
    return { remote, local };
  }

  analyzeCurrentState() {
    const currentBranch = this.exec('git rev-parse --abbrev-ref HEAD', true);
    const status = this.exec('git status --porcelain', true);
    const hasUncommitted = status && status.trim().length > 0;
    
    this.logMessage(`Current branch: ${currentBranch || 'unknown'}`);
    this.logMessage(`Working tree: ${hasUncommitted ? 'has uncommitted changes' : 'clean'}`);
    
    return {
      branch: currentBranch,
      hasUncommitted,
      canMerge: !hasUncommitted
    };
  }

  createMergePlan(branches) {
    // For the current repository structure, create a plan based on available branches
    const knownBranches = [
      { pattern: 'main', priority: 1, description: 'Main stable branch' },
      { pattern: 'feat/', priority: 2, description: 'Feature branches' },
      { pattern: 'fix/', priority: 3, description: 'Bug fix branches' },
      { pattern: 'docs/', priority: 4, description: 'Documentation branches' },
      { pattern: 'chore/', priority: 5, description: 'Maintenance branches' }
    ];

    const mergePlan = [];
    
    // Categorize available branches
    const allBranchNames = [...branches.remote.map(b => b.name.replace('origin/', '')), 
                           ...branches.local.map(b => b.name)];
    const uniqueBranches = [...new Set(allBranchNames)];

    for (const branchName of uniqueBranches) {
      const match = knownBranches.find(kb => 
        branchName === kb.pattern || branchName.startsWith(kb.pattern)
      );
      
      if (match) {
        mergePlan.push({
          name: branchName,
          priority: match.priority,
          description: match.description,
          available: true
        });
      }
    }

    // Sort by priority
    mergePlan.sort((a, b) => a.priority - b.priority);
    
    this.logMessage('Created merge plan:');
    mergePlan.forEach((branch, index) => {
      this.logMessage(`  ${index + 1}. ${branch.name} (${branch.description})`);
    });

    return mergePlan;
  }

  generateMergeScript(plan) {
    const script = [
      '#!/bin/bash',
      '# Generated Intelligent Merge Script',
      '# Run this script to merge branches in the optimal order',
      '',
      'set -e  # Exit on error',
      '',
      '# Create backup',
      'BACKUP_BRANCH="backup/pre-merge-$(date +%Y%m%d-%H%M%S)"',
      'echo "Creating backup branch: $BACKUP_BRANCH"',
      'git checkout -b "$BACKUP_BRANCH"',
      'git checkout -  # Return to previous branch',
      '',
      '# Start merge process',
      'echo "Starting intelligent merge..."',
      ''
    ];

    // Add merge commands for each branch
    plan.forEach((branch, index) => {
      if (branch.name === 'main') return; // Skip main as it's the base
      
      script.push(`# Step ${index}: Merge ${branch.name}`);
      script.push(`echo "Merging ${branch.name}..."`);
      script.push(`if git merge --no-commit ${branch.name}; then`);
      script.push(`  echo "  ✓ Clean merge of ${branch.name}"`);
      script.push(`  git commit -m "merge: ${branch.name} - ${branch.description}"`);
      script.push(`else`);
      script.push(`  echo "  ⚠ Merge conflict in ${branch.name}"`);
      script.push(`  echo "  Please resolve conflicts manually and run:"`);
      script.push(`  echo "    git add ."`);
      script.push(`  echo "    git commit -m 'merge: ${branch.name} - resolved conflicts'"`);
      script.push(`  read -p "Press Enter after resolving conflicts..."`);
      script.push(`fi`);
      script.push('');
    });

    script.push('echo "Merge process completed!"');
    script.push('echo "Run validation: pnpm lint && pnpm build"');

    return script.join('\n');
  }

  saveReport(branches, plan, currentState) {
    const report = {
      timestamp: new Date().toISOString(),
      currentState,
      branches,
      mergePlan: plan,
      recommendations: [
        'Review each branch before merging',
        'Test thoroughly after each merge',
        'Keep the backup branch until merge is validated',
        'Run pnpm lint and pnpm build after merging'
      ],
      log: this.log
    };

    writeFileSync('merge-analysis-report.json', JSON.stringify(report, null, 2));
    this.logMessage('Merge analysis report saved to: merge-analysis-report.json');
    
    return report;
  }

  run() {
    try {
      this.logMessage('Starting Branch Merge Utility...');
      
      // Analyze current state
      const currentState = this.analyzeCurrentState();
      
      if (!currentState.canMerge) {
        this.logMessage('Cannot merge: uncommitted changes detected', 'error');
        this.logMessage('Please commit or stash changes first', 'error');
        return;
      }

      // List available branches
      const branches = this.listAvailableBranches();
      
      // Create merge plan
      const plan = this.createMergePlan(branches);
      
      // Generate merge script
      const script = this.generateMergeScript(plan);
      writeFileSync('intelligent-merge.sh', script);
      this.exec('chmod +x intelligent-merge.sh', true);
      this.logMessage('Generated executable merge script: intelligent-merge.sh');
      
      // Save analysis report
      const report = this.saveReport(branches, plan, currentState);
      
      console.log('\n' + '='.repeat(50));
      console.log('BRANCH MERGE ANALYSIS COMPLETE');
      console.log('='.repeat(50));
      console.log(`Current branch: ${currentState.branch}`);
      console.log(`Branches found: ${branches.remote.length + branches.local.length}`);
      console.log(`Merge plan: ${plan.length} branches`);
      console.log('\nNext steps:');
      console.log('1. Review the merge plan in merge-analysis-report.json');
      console.log('2. Execute: ./intelligent-merge.sh');
      console.log('3. Validate: pnpm lint && pnpm build');
      console.log('='.repeat(50));

      this.logMessage('Branch merge utility completed successfully');
      
    } catch (error) {
      this.logMessage(`Utility failed: ${error.message}`, 'error');
      throw error;
    }
  }
}

// Run the utility
const utility = new BranchMergeUtility();
utility.run();