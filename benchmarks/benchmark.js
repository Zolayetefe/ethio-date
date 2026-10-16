import {
  toEthiopian,
  toGregorian,
  toEthiopianBatch,
  toGregorianBatch,
  isValidEthiopianDate,
  isValidGregorianDate,
  formatDate,
} from '../dist/index.js';

const ITERATIONS = 1_000_000;
const WARMUP = 50_000;

console.log('========================================================================');
console.log('                    ETHIO-DATE PERFORMANCE BENCHMARKS                  ');
console.log('========================================================================');
console.log(`Runtime: Node.js ${process.version} (${process.arch}-${process.platform})`);
console.log(`Iterations: ${ITERATIONS.toLocaleString()} per benchmark (Warmup: ${WARMUP.toLocaleString()})`);
console.log('------------------------------------------------------------------------\n');

const testGregorianDates = [
  { year: 2026, month: 10, day: 16 },
  { year: 2024, month: 1, day: 1 },
  { year: 2024, month: 2, day: 29 },
  { year: 2024, month: 9, day: 11 },
  { year: 2023, month: 9, day: 11 },
  { year: 2023, month: 9, day: 12 },
  { year: 2000, month: 2, day: 29 },
  { year: 1991, month: 5, day: 28 },
];

const testEthiopianDates = [
  { year: 2019, month: 2, day: 6 },
  { year: 2016, month: 4, day: 22 },
  { year: 2016, month: 6, day: 21 },
  { year: 2017, month: 1, day: 1 },
  { year: 2015, month: 13, day: 6 },
  { year: 2016, month: 1, day: 1 },
  { year: 1992, month: 6, day: 21 },
  { year: 1983, month: 9, day: 20 },
];

const testGregorianStrings = testGregorianDates.map(d => formatDate(d));
const testEthiopianStrings = testEthiopianDates.map(d => formatDate(d));

function runBenchmark(name, fn, iters = ITERATIONS) {
  // Warmup
  for (let i = 0; i < WARMUP; i++) {
    fn(i % testGregorianDates.length);
  }

  // Force garbage collection if flag available
  if (global.gc) global.gc();

  const start = performance.now();
  for (let i = 0; i < iters; i++) {
    fn(i % testGregorianDates.length);
  }
  const totalMs = performance.now() - start;
  const opsPerSec = Math.round((iters / totalMs) * 1000);
  const nsPerOp = ((totalMs * 1_000_000) / iters).toFixed(2);

  console.log(
    `${name.padEnd(46)}: ${(opsPerSec.toLocaleString()).padStart(14)} ops/sec  (${nsPerOp.padStart(7)} ns/op, ${totalMs.toFixed(1)} ms)`
  );

  return { name, opsPerSec, nsPerOp: Number(nsPerOp), totalMs };
}

console.log('--- 1. Gregorian -> Ethiopian Conversions ---');
runBenchmark('toEthiopian(y, m, d) [Positional / Fast Path]', (i) => {
  const d = testGregorianDates[i];
  toEthiopian(d.year, d.month, d.day);
});

runBenchmark('toEthiopian({ year, month, day }) [Object Input]', (i) => {
  const d = testGregorianDates[i];
  toEthiopian(d);
});

runBenchmark('toEthiopian("YYYY-MM-DD") [String Parsing + Conv]', (i) => {
  const s = testGregorianStrings[i];
  toEthiopian(s);
});

console.log('\n--- 2. Ethiopian -> Gregorian Conversions ---');
runBenchmark('toGregorian(y, m, d) [Positional / Fast Path]', (i) => {
  const d = testEthiopianDates[i];
  toGregorian(d.year, d.month, d.day);
});

runBenchmark('toGregorian({ year, month, day }) [Object Input]', (i) => {
  const d = testEthiopianDates[i];
  toGregorian(d);
});

runBenchmark('toGregorian("YYYY-MM-DD") [String Parsing + Conv]', (i) => {
  const s = testEthiopianStrings[i];
  toGregorian(s);
});

console.log('\n--- 3. Validation Performance ---');
runBenchmark('isValidGregorianDate(y, m, d)', (i) => {
  const d = testGregorianDates[i];
  isValidGregorianDate(d.year, d.month, d.day);
});

runBenchmark('isValidEthiopianDate(y, m, d)', (i) => {
  const d = testEthiopianDates[i];
  isValidEthiopianDate(d.year, d.month, d.day);
});

console.log('\n--- 4. Batch Conversions (Pre-allocated buffer) ---');
const batchSize = 10_000;
const largeBatchG = new Array(batchSize);
for (let i = 0; i < batchSize; i++) {
  largeBatchG[i] = testGregorianDates[i % testGregorianDates.length];
}

const largeBatchE = new Array(batchSize);
for (let i = 0; i < batchSize; i++) {
  largeBatchE[i] = testEthiopianDates[i % testEthiopianDates.length];
}

runBenchmark(`toEthiopianBatch (${batchSize.toLocaleString()} items per call)`, () => {
  toEthiopianBatch(largeBatchG);
}, 200);

runBenchmark(`toGregorianBatch (${batchSize.toLocaleString()} items per call)`, () => {
  toGregorianBatch(largeBatchE);
}, 200);

console.log('\n--- 5. String Formatting ---');
runBenchmark('formatDate({ year, month, day })', (i) => {
  const d = testGregorianDates[i];
  formatDate(d);
});

console.log('\n========================================================================');
console.log('                          BENCHMARKS COMPLETE                           ');
console.log('========================================================================');
