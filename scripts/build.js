import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

console.log('--- Building ethio-date package ---');

// 1. Clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Build ESM and type declarations with tsc
console.log('Compiling ESM modules and TypeScript declarations...');
execSync('npx tsc --project tsconfig.json', { stdio: 'inherit', cwd: rootDir });

// 3. Build CommonJS bundle
console.log('Generating CommonJS bundle (dist/index.cjs)...');

// We bundle the compiled ESM files into a clean CommonJS file without external tooling
// Or transpile with tsc. Let's create tsconfig.cjs.json to emit CJS cleanly.
const cjsConfig = {
  extends: './tsconfig.json',
  compilerOptions: {
    module: 'CommonJS',
    moduleResolution: 'Node',
    outDir: './dist/cjs',
    declaration: false,
    declarationMap: false,
    sourceMap: true,
  },
};

const cjsConfigPath = path.join(rootDir, 'tsconfig.cjs.json');
fs.writeFileSync(cjsConfigPath, JSON.stringify(cjsConfig, null, 2));

try {
  execSync('npx tsc --project tsconfig.cjs.json', { stdio: 'inherit', cwd: rootDir });

  // Move cjs/index.js to dist/index.cjs and update any .js requires to .cjs
  const cjsFiles = fs.readdirSync(path.join(distDir, 'cjs'));
  for (const file of cjsFiles) {
    if (file.endsWith('.js')) {
      const srcPath = path.join(distDir, 'cjs', file);
      const destPath = path.join(distDir, file.replace(/\.js$/, '.cjs'));
      let content = fs.readFileSync(srcPath, 'utf8');
      // Replace require('./xxx.js') with require('./xxx.cjs')
      content = content.replace(/require\(["']\.\/([a-zA-Z0-9_-]+)\.js["']\)/g, 'require("./$1.cjs")');
      fs.writeFileSync(destPath, content, 'utf8');
    }
  }

  // Create dist/index.d.cts pointing to or re-exporting declarations
  const dtsContent = fs.readFileSync(path.join(distDir, 'index.d.ts'), 'utf8');
  fs.writeFileSync(path.join(distDir, 'index.d.cts'), dtsContent, 'utf8');

  // Remove temporary cjs directory
  fs.rmSync(path.join(distDir, 'cjs'), { recursive: true, force: true });
} finally {
  if (fs.existsSync(cjsConfigPath)) {
    fs.unlinkSync(cjsConfigPath);
  }
}

console.log('Build complete. Generated dist files:');
const distFiles = fs.readdirSync(distDir);
distFiles.forEach(f => {
  const stat = fs.statSync(path.join(distDir, f));
  console.log(`  ${f.padEnd(25)} (${stat.size} bytes)`);
});
