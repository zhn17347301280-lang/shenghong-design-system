import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(projectRoot, 'dist');
const sourcePath = resolve(distDir, '.vite/index.html');
const outputPath = resolve(projectRoot, 'index.html');

/**
 * 将 dist/.vite/index.html 中引用的 JS / CSS 全部内联，产出可直接双击打开的根目录 index.html。
 * 供 build-standalone 命令与 vite 构建插件（含 watch 模式）复用。
 */
export function inlineStandalone() {
  let html = readFileSync(sourcePath, 'utf8');

  html = html.replace(
    /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi,
    (_tag, src) => {
      const assetPath = resolve(distDir, String(src).replace(/^\.?\//, '').replace(/^\//, ''));
      const javascript = readFileSync(assetPath, 'utf8').replace(/<\/script/gi, '<\\/script');
      return `<script type="module">${javascript}</script>`;
    },
  );

  html = html.replace(
    /<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi,
    (_tag, href) => {
      const assetPath = resolve(distDir, String(href).replace(/^\.?\//, '').replace(/^\//, ''));
      return `<style>${readFileSync(assetPath, 'utf8')}</style>`;
    },
  );

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
  return outputPath;
}

// 直接执行时（node scripts/build-standalone.mjs）生成一次。
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Standalone HTML: ${inlineStandalone()}`);
}
