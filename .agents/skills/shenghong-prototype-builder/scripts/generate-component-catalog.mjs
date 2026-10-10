#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(scriptDir, '..');

function findDesignSystemRoot(start) {
  let current = resolve(start);
  while (true) {
    const packagePath = join(current, 'package.json');
    if (existsSync(packagePath)) {
      const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
      if (pkg.name === '@shenghong/design-system') return current;
    }
    const parent = dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function resolveModule(basePath) {
  const candidates = extname(basePath)
    ? [basePath]
    : [`${basePath}.tsx`, `${basePath}.ts`, join(basePath, 'index.ts'), join(basePath, 'index.tsx')];
  return candidates.find(existsSync);
}

function exportedSymbols(source) {
  const symbols = new Set();
  const declarationPattern = /export\s+(?:declare\s+)?(?:async\s+)?(?:function|class|const|let|var|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g;
  const listPattern = /export\s*\{([^}]+)\}/g;
  for (const match of source.matchAll(declarationPattern)) symbols.add(match[1]);
  for (const match of source.matchAll(listPattern)) {
    for (const part of match[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).at(-1)?.trim();
      if (name && /^[A-Za-z_$][\w$]*$/.test(name)) symbols.add(name);
    }
  }
  return [...symbols].sort();
}

const root = findDesignSystemRoot(process.cwd()) ?? findDesignSystemRoot(skillDir);
if (!root) {
  console.error('Could not find the @shenghong/design-system repository root.');
  process.exit(1);
}

const componentIndex = join(root, 'src/components/index.ts');
if (!existsSync(componentIndex)) {
  console.error(`Missing public component index: ${componentIndex}`);
  process.exit(1);
}

const indexSource = readFileSync(componentIndex, 'utf8');
const rows = [];
for (const match of indexSource.matchAll(/export\s+\*\s+from\s+['"](.+?)['"]/g)) {
  const specifier = match[1];
  const sourcePath = resolveModule(resolve(dirname(componentIndex), specifier));
  if (!sourcePath) {
    rows.push({ category: 'Unknown', module: specifier, symbols: ['UNRESOLVED'], sourcePath: '' });
    continue;
  }
  const category = specifier.replace(/^\.\//, '').split('/').filter(Boolean)[0] ?? 'Other';
  rows.push({
    category,
    module: specifier,
    symbols: exportedSymbols(readFileSync(sourcePath, 'utf8')),
    sourcePath: relative(root, sourcePath),
  });
}

rows.sort((a, b) => a.category.localeCompare(b.category) || a.module.localeCompare(b.module));
const output = [
  '# Generated public component catalog',
  '',
  '> Generated from `src/components/index.ts`. Do not edit by hand.',
  '',
  '- Package: `@shenghong/design-system`',
  `- Generated: ${new Date().toISOString()}`,
  `- Public modules: ${rows.length}`,
  '',
  '| Category | Public module | Exported symbols | Source |',
  '| --- | --- | --- | --- |',
  ...rows.map((row) => `| ${row.category} | \`${row.module}\` | ${row.symbols.map((symbol) => `\`${symbol}\``).join(', ') || '—'} | \`${row.sourcePath || 'unresolved'}\` |`),
  '',
  '## Interpretation',
  '',
  '- Import public symbols from `@shenghong/design-system`, never from the module paths shown above.',
  '- Read the referenced source and matching `src/catalog/*Showcase.tsx` before using unfamiliar props.',
  '- A missing public export is a component gap even if an internal implementation exists.',
  '',
].join('\n');

const outputPath = join(skillDir, 'references/component-catalog.generated.md');
writeFileSync(outputPath, output, 'utf8');
console.log(`Wrote ${relative(root, outputPath)} from ${relative(root, componentIndex)} (${rows.length} modules).`);
