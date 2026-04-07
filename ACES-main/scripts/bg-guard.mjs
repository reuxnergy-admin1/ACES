#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const storePath = resolve(root, 'scripts/bg-guard.json');
const files = [
  'components/ResponsiveContours.tsx',
  'components/ContoursIsolines.tsx',
  'components/ContoursSVG.tsx',
  'components/BackgroundPortal.tsx',
];

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

function computeHashes() {
  const map = {};
  for (const rel of files) {
    const abs = resolve(root, rel);
    const content = readFileSync(abs);
    map[rel] = sha256(content);
  }
  return map;
}

function loadStore() {
  if (!existsSync(storePath)) return {};
  try { return JSON.parse(readFileSync(storePath, 'utf8')); }
  catch { return {}; }
}

const cmd = process.argv[2] || 'verify';
if (cmd === 'update') {
  const map = computeHashes();
  writeFileSync(storePath, JSON.stringify(map, null, 2));
  console.log('[bg-guard] hashes updated:', storePath);
  process.exit(0);
}

if (cmd === 'verify') {
  const stored = loadStore();
  const current = computeHashes();
  const diffs = [];
  for (const rel of files) {
    if (!stored[rel]) {
      diffs.push({ file: rel, reason: 'no stored hash' });
      continue;
    }
    if (stored[rel] !== current[rel]) {
      diffs.push({ file: rel, reason: 'content differs' });
    }
  }
  if (diffs.length) {
    console.error('\u001b[31m[bg-guard] Background files changed without updating hashes:\u001b[0m');
    for (const d of diffs) console.error(' -', d.file, '-', d.reason);
    console.error('Run `npm run guard:bg:update` after intentional changes.');
    process.exit(2);
  } else {
    console.log('\u001b[32m[bg-guard] OK: background files match stored hashes.\u001b[0m');
    process.exit(0);
  }
}

console.error('Usage: node scripts/bg-guard.mjs [verify|update]');
process.exit(1);
