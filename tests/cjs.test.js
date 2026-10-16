import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cjs = require('../dist/index.cjs');

test('CommonJS bundle exports and functionality', () => {
  assert.equal(typeof cjs.toEthiopian, 'function');
  assert.equal(typeof cjs.toGregorian, 'function');
  assert.equal(typeof cjs.isValidEthiopianDate, 'function');
  assert.equal(typeof cjs.isValidGregorianDate, 'function');
  assert.equal(typeof cjs.isEthiopianLeapYear, 'function');
  assert.equal(typeof cjs.isGregorianLeapYear, 'function');

  // Convert Gregorian to Ethiopian
  const eth = cjs.toEthiopian(2026, 10, 16);
  assert.deepEqual(eth, { year: 2019, month: 2, day: 6 });

  // Convert Ethiopian to Gregorian
  const greg = cjs.toGregorian(2019, 2, 6);
  assert.deepEqual(greg, { year: 2026, month: 10, day: 16 });

  // CommonJS Leap year test
  assert.equal(cjs.isEthiopianLeapYear(2015), true);
  assert.equal(cjs.isEthiopianLeapYear(2016), false);

  // CommonJS validation
  assert.throws(() => cjs.toGregorian(2016, 13, 6), (err) => err instanceof RangeError);
});
