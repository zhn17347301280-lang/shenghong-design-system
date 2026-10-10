#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { extname, relative, resolve } from 'node:path';

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('Usage: node validate-prototype.mjs <file-or-directory> [more targets]');
  process.exit(2);
}

const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.scss']);
const reactExtensions = new Set(['.tsx', '.jsx']);
const ignoredDirectories = new Set(['node_modules', 'dist', 'build', 'coverage', '.git', '.agents']);

function collectFiles(target) {
  const absolute = resolve(target);
  if (!existsSync(absolute)) throw new Error(`Target does not exist: ${target}`);
  const stat = lstatSync(absolute);
  if (stat.isFile()) return allowedExtensions.has(extname(absolute)) ? [absolute] : [];
  return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return [];
    return collectFiles(resolve(absolute, entry.name));
  });
}

const rules = [
  {
    id: 'ui-library-import',
    severity: 'error',
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    pattern: /(?:from\s+|import\s*)['"](?:antd|@ant-design\/[^'"]+)['"]/g,
    message: 'Prototype code must import UI from @shenghong/design-system, not Ant Design directly.',
  },
  {
    id: 'raw-interactive-control',
    severity: 'error',
    extensions: ['.tsx', '.jsx'],
    pattern: /<(?:button|input|select|textarea|table)(?:\s|>)/gi,
    message: 'Use a public design-system component; record a gap if no component exists.',
  },
  {
    id: 'inline-svg',
    severity: 'error',
    extensions: ['.tsx', '.jsx'],
    pattern: /<svg(?:\s|>)/gi,
    message: 'Use LocalIcon with an approved repository SVG asset.',
  },
  {
    id: 'hardcoded-color',
    severity: 'error',
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
    pattern: /#[0-9a-f]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(/gi,
    message: 'Use an exported color or chart token instead of a hard-coded color.',
  },
  {
    id: 'arbitrary-z-index',
    severity: 'error',
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
    pattern: /(?:zIndex\s*:\s*|z-index\s*:\s*)(?:[1-9]\d*)/g,
    message: 'Overlay levels belong to the design system; do not add a local numeric z-index.',
  },
  {
    id: 'hardcoded-shape-style',
    severity: 'warning',
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    pattern: /(?:borderRadius|boxShadow)\s*:\s*['"`]?[^,}\n]+/g,
    message: 'Prefer component variants or exported radius/shadow tokens.',
  },
];

function lineNumber(source, index) {
  return source.slice(0, index).split('\n').length;
}

function isSuppressed(lines, lineIndex, ruleId) {
  const candidates = [lines[lineIndex], lines[lineIndex - 1]].filter(Boolean);
  return candidates.some((line) => {
    const match = line.match(new RegExp(`sh-design-system-allow:\\s*${ruleId}\\s*--\\s*(.+)$`));
    return Boolean(match?.[1]?.trim());
  });
}

const findings = [];
const files = [...new Set(targets.flatMap(collectFiles))];
if (files.length === 0) {
  console.error('ERROR no-source-files: No prototype source files were checked. A generated or hand-written HTML file alone is not a valid design-system prototype.');
  process.exit(1);
}

const reactFiles = files.filter((file) => reactExtensions.has(extname(file)));
const reactSources = reactFiles.map((file) => readFileSync(file, 'utf8'));
if (reactFiles.length === 0) {
  findings.push({ severity: 'error', id: 'no-react-source', file: files[0], line: 1, message: 'Keep React source that uses the public design-system components; validating CSS or scripts alone is insufficient.', excerpt: '' });
}

const importedComponents = new Set();
let importedProvider = false;
let providerRendered = false;
for (const source of reactSources) {
  for (const match of source.matchAll(/\bimport\s*\{([^}]+)\}\s*from\s*['"]@shenghong\/design-system['"]/g)) {
    for (const part of match[1].split(',')) {
      const imported = part.trim().match(/^(type\s+)?([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?/);
      if (!imported || imported[1]) continue;
      const exportedName = imported[2];
      const localName = imported[3] || exportedName;
      if (exportedName === 'DesignSystemProvider') {
        importedProvider = true;
        if (reactSources.some((text) => new RegExp(`<${localName}(?:\\s|>)`).test(text))) providerRendered = true;
      } else if (/^[A-Z]/.test(exportedName) && reactSources.some((text) => new RegExp(`<${localName}(?:\\s|>)`).test(text))) {
        importedComponents.add(exportedName);
      }
    }
  }
  for (const match of source.matchAll(/\bimport\s*\*\s*as\s*([A-Za-z_$][\w$]*)\s*from\s*['"]@shenghong\/design-system['"]/g)) {
    const namespace = match[1];
    if (reactSources.some((text) => new RegExp(`<${namespace}\\.DesignSystemProvider(?:\\s|>)`).test(text))) {
      importedProvider = true;
      providerRendered = true;
    }
    if (reactSources.some((text) => new RegExp(`<${namespace}\\.(?!DesignSystemProvider)[A-Z][\\w$]*(?:\\s|>)`).test(text))) {
      importedComponents.add(`${namespace}.*`);
    }
  }
}
if (reactFiles.length > 0 && !importedProvider) {
  findings.push({ severity: 'error', id: 'missing-provider-import', file: reactFiles[0], line: 1, message: 'Import DesignSystemProvider from @shenghong/design-system.', excerpt: '' });
} else if (reactFiles.length > 0 && !providerRendered) {
  findings.push({ severity: 'error', id: 'missing-provider-root', file: reactFiles[0], line: 1, message: 'Render DesignSystemProvider around the prototype root.', excerpt: '' });
}
if (reactFiles.length > 0 && importedComponents.size === 0) {
  findings.push({ severity: 'error', id: 'missing-library-component', file: reactFiles[0], line: 1, message: 'Import and render product UI components from @shenghong/design-system; a provider-only import is insufficient.', excerpt: '' });
}
for (const file of files) {
  const extension = extname(file);
  const source = readFileSync(file, 'utf8');
  const lines = source.split('\n');
  for (const rule of rules) {
    if (!rule.extensions.includes(extension)) continue;
    rule.pattern.lastIndex = 0;
    for (const match of source.matchAll(rule.pattern)) {
      const line = lineNumber(source, match.index ?? 0);
      if (isSuppressed(lines, line - 1, rule.id)) continue;
      findings.push({ ...rule, file, line, excerpt: lines[line - 1]?.trim() ?? '' });
    }
  }
}

const displayRoot = process.cwd();
for (const finding of findings) {
  console.log(`${finding.severity.toUpperCase()} ${finding.id} ${relative(displayRoot, finding.file)}:${finding.line}`);
  console.log(`  ${finding.message}`);
  console.log(`  ${finding.excerpt}`);
}

const errorCount = findings.filter((finding) => finding.severity === 'error').length;
const warningCount = findings.length - errorCount;
console.log(`Checked ${files.length} files: ${errorCount} error(s), ${warningCount} warning(s).`);
process.exit(errorCount > 0 ? 1 : 0);
