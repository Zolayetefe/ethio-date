import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const testDir = path.join(rootDir, '.consumer-test');

console.log('--- Verifying packed tarball in isolated consumer project ---');

if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true, force: true });
}
fs.mkdirSync(testDir);

fs.writeFileSync(
  path.join(testDir, 'package.json'),
  JSON.stringify(
    {
      name: 'isolated-consumer-test',
      version: '1.0.0',
      type: 'module',
    },
    null,
    2
  )
);

const tarballPath = path.join(rootDir, 'ethio-date-1.0.0.tgz');
if (!fs.existsSync(tarballPath)) {
  console.log('Generating fresh npm package tarball via npm pack...');
  execSync('npm pack', { cwd: rootDir, stdio: 'inherit' });
}
console.log(`Installing ${tarballPath}...`);
execSync(`npm install "${tarballPath}"`, { cwd: testDir, stdio: 'inherit' });

// 1. ESM Consumer test
console.log('Testing ESM consumer import...');
const esmCode = [
  "import { toEthiopian, toGregorian, isValidEthiopianDate } from 'ethio-date';",
  "const eth = toEthiopian('2026-10-16');",
  "if (eth.year !== 2019 || eth.month !== 2 || eth.day !== 6) throw new Error('ESM fail');",
  'const greg = toGregorian(eth);',
  "if (greg.year !== 2026 || greg.month !== 10 || greg.day !== 16) throw new Error('ESM reverse fail');",
  "if (!isValidEthiopianDate(2015, 13, 6)) throw new Error('Predicate fail');",
  "console.log('✔ ESM consumer works!');",
].join('\n');

fs.writeFileSync(path.join(testDir, 'test-esm.js'), esmCode);
execSync('node test-esm.js', { cwd: testDir, stdio: 'inherit' });

// 2. CommonJS Consumer test
console.log('Testing CommonJS consumer require...');
const cjsCode = [
  "const { toEthiopian, toGregorian, isEthiopianLeapYear } = require('ethio-date');",
  "const eth = toEthiopian(2026, 10, 16);",
  "if (eth.year !== 2019 || eth.month !== 2 || eth.day !== 6) throw new Error('CJS fail');",
  'const greg = toGregorian(eth);',
  "if (greg.year !== 2026 || greg.month !== 10 || greg.day !== 16) throw new Error('CJS reverse fail');",
  "if (!isEthiopianLeapYear(2015)) throw new Error('Leap year fail');",
  "console.log('✔ CommonJS consumer works!');",
].join('\n');

fs.writeFileSync(path.join(testDir, 'test-cjs.cjs'), cjsCode);
execSync('node test-cjs.cjs', { cwd: testDir, stdio: 'inherit' });

// 3. TypeScript Consumer test
console.log('Testing TypeScript consumer types...');
fs.writeFileSync(
  path.join(testDir, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        strict: true,
      },
    },
    null,
    2
  )
);

const tsCode = [
  "import { toEthiopian, toGregorian, type EthiopianDate, type GregorianDate } from 'ethio-date';",
  "const e: EthiopianDate = toEthiopian('2026-10-16');",
  'const g: GregorianDate = toGregorian(e);',
  "console.log('✔ TypeScript typecheck passed for consumer!');",
].join('\n');

fs.writeFileSync(path.join(testDir, 'test-ts.ts'), tsCode);
execSync('npx tsc --noEmit', { cwd: testDir, stdio: 'inherit' });

// 4. Cleanup
fs.rmSync(testDir, { recursive: true, force: true });
if (fs.existsSync(tarballPath)) {
  fs.unlinkSync(tarballPath);
}

console.log('✔ All consumer integration tests passed! Cleaned up temporary test artifacts.');
