import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { inlineStandalone } from './scripts/build-standalone.mjs';

const previewEntry = fileURLToPath(new URL('./.vite/index.html', import.meta.url));

/**
 * 每次产物写入 dist 后，自动把 JS/CSS 内联到根目录的 index.html。
 * 开发入口独立放在 .vite/index.html，避免与可双击打开的单文件产物冲突。
 */
function standaloneHtmlPlugin(): Plugin {
  return {
    name: 'sh-standalone-html',
    apply: 'build',
    closeBundle() {
      try {
        const out = inlineStandalone();
        console.log(`[standalone] 已更新 ${out}`);
      } catch (err) {
        console.error('[standalone] 生成失败', err);
      }
    },
  };
}

export default defineConfig({
  // Pages 发布到 /<仓库名>/ 子路径；本地构建仍生成可双击打开的单文件预览。
  base: process.env.GITHUB_PAGES_BASE || '/',
  plugins: [react(), ...(process.env.GITHUB_PAGES_BASE ? [] : [standaloneHtmlPlugin()])],
  build: {
    rollupOptions: {
      input: previewEntry,
    },
  },
});
