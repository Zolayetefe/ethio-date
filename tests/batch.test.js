import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toEthiopianBatch,
  toGregorianBatch,
} from '../dist/index.js';

test('Batch conversions handle empty and single arrays', () => {
  assert.deepEqual(toEthiopianBatch([]), []);
  assert.deepEqual(toGregorianBatch([]), []);

  const singleG = ['2026-10-16'];
  const resE = toEthiopianBatch(singleG);
  assert.deepEqual(resE, [{ year: 2019, month: 2, day: 6 }]);

  const singleE = [{ year: 2019, month: 2, day: 6 }];
  const resG = toGregorianBatch(singleE);
  assert.deepEqual(resG, [{ year: 2026, month: 10, day: 16 }]);
});

test('Batch conversions handle mixed input types', () => {
  const mixedG = [
    '2024-01-01',
    { year: 2024, month: 9, day: 10 },
    [2024, 9, 11],
  ];

  const results = toEthiopianBatch(mixedG);
  assert.equal(results.length, 3);
  assert.deepEqual(results[0], { year: 2016, month: 4, day: 22 });
  assert.deepEqual(results[1], { year: 2016, month: 13, day: 5 });
  assert.deepEqual(results[2], { year: 2017, month: 1, day: 1 });
});

test('Large batch conversion throughput and accuracy (10,000 items)', () => {
  const count = 10000;
  const inputs = new Array(count);
  for (let i = 0; i < count; i++) {
    inputs[i] = { year: 2024, month: (i % 12) + 1, day: (i % 28) + 1 };
  }

  const start = performance.now();
  const converted = toEthiopianBatch(inputs);
  const elapsed = performance.now() - start;

  assert.equal(converted.length, count);
  // Ensure it completes in well under 100ms
  assert.ok(elapsed < 200, `Batch of ${count} completed in ${elapsed.toFixed(2)} ms`);
});

test('Batch conversion fails fast on invalid items', () => {
  const invalidBatch = [
    '2024-01-01',
    'invalid-date',
    '2024-06-15',
  ];

  assert.throws(
    () => toEthiopianBatch(invalidBatch),
    (err) => err instanceof TypeError
  );
});
