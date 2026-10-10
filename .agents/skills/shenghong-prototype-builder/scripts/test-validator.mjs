#!/usr/bin/env node

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const validator = resolve(scriptDir, 'validate-prototype.mjs');
const fixtureDir = mkdtempSync(join(tmpdir(), 'shenghong-skill-validator-'));

try {
  const cases = [
    {
      name: 'compliant React source',
      file: 'GoodPrototype.tsx',
      source: `import { AppButton, DesignSystemProvider } from '@shenghong/design-system';\nexport function GoodPrototype() { return <DesignSystemProvider><AppButton>保存</AppButton></DesignSystemProvider>; }\n`,
      shouldPass: true,
    },
    {
      name: 'namespace import',
      file: 'NamespacePrototype.tsx',
      source: `import * as DS from '@shenghong/design-system';\nexport function NamespacePrototype() { return <DS.DesignSystemProvider><DS.AppButton>保存</DS.AppButton></DS.DesignSystemProvider>; }\n`,
      shouldPass: true,
    },
    {
      name: 'raw controls and direct Ant Design import',
      file: 'BadPrototype.tsx',
      source: `import { Button } from 'antd';\nexport function BadPrototype() { return <button style={{ color: '#fff', zIndex: 9999 }}>保存</button>; }\n`,
      shouldPass: false,
    },
    {
      name: 'provider-only source',
      file: 'ProviderOnly.tsx',
      source: `import { DesignSystemProvider } from '@shenghong/design-system';\nexport function ProviderOnly() { return <DesignSystemProvider><div>保存</div></DesignSystemProvider>; }\n`,
      shouldPass: false,
    },
    {
      name: 'lookalike table despite component import',
      file: 'LookalikeTable.tsx',
      source: `import { AppButton, DesignSystemProvider } from '@shenghong/design-system';\nexport function LookalikeTable() { return <DesignSystemProvider><AppButton>新增</AppButton><table><tbody><tr><td>策略</td></tr></tbody></table></DesignSystemProvider>; }\n`,
      shouldPass: false,
      expectedText: 'raw-interactive-control',
    },
    {
      name: 'component without provider',
      file: 'NoProvider.tsx',
      source: `import { AppButton } from '@shenghong/design-system';\nexport function NoProvider() { return <AppButton>保存</AppButton>; }\n`,
      shouldPass: false,
    },
    {
      name: 'hand-written single HTML',
      file: 'Standalone.html',
      source: '<html><body><button>保存</button></body></html>\n',
      shouldPass: false,
      expectedText: 'no-source-files',
    },
    {
      name: 'stylesheet without React source',
      file: 'OnlyStyles.css',
      source: '.prototype { display: block; }\n',
      shouldPass: false,
      expectedText: 'no-react-source',
    },
  ];

  for (const testCase of cases) {
    const target = join(fixtureDir, testCase.file);
    writeFileSync(target, testCase.source);
    const result = spawnSync(process.execPath, [validator, target], { encoding: 'utf8' });
    const passed = result.status === 0;
    const output = result.stdout + result.stderr;
    if (passed !== testCase.shouldPass || (testCase.expectedText && !output.includes(testCase.expectedText))) {
      console.error(`Unexpected result for ${testCase.name}: expected ${testCase.shouldPass ? 'pass' : 'fail'}.`);
      console.error(output);
      process.exit(1);
    }
  }

  const emptyDirectory = join(fixtureDir, 'empty');
  mkdirSync(emptyDirectory);
  const emptyResult = spawnSync(process.execPath, [validator, emptyDirectory], { encoding: 'utf8' });
  if (emptyResult.status === 0 || !(emptyResult.stdout + emptyResult.stderr).includes('no-source-files')) {
    console.error('Expected an empty prototype directory to fail.');
    console.error(emptyResult.stdout || emptyResult.stderr);
    process.exit(1);
  }

  const bundledDirectory = join(fixtureDir, 'bundled');
  mkdirSync(bundledDirectory);
  writeFileSync(join(bundledDirectory, 'App.tsx'), cases[0].source);
  writeFileSync(join(bundledDirectory, 'index.html'), '<!doctype html><html><body><div id="root"></div><script>/* bundled output */</script></body></html>\n');
  const bundledResult = spawnSync(process.execPath, [validator, bundledDirectory], { encoding: 'utf8' });
  if (bundledResult.status !== 0 || !bundledResult.stdout.includes('Checked 1 files: 0 error(s)')) {
    console.error('Expected React source plus a bundled HTML deliverable to pass.');
    console.error(bundledResult.stdout || bundledResult.stderr);
    process.exit(1);
  }

  console.log(`Validator self-test passed: ${cases.length} fixtures, empty-directory, and bundled-HTML checks.`);
} finally {
  rmSync(fixtureDir, { recursive: true, force: true });
}
