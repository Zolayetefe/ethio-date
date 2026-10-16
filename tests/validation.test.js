import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toEthiopian,
  toGregorian,
  toEthiopianBatch,
  toGregorianBatch,
  isValidEthiopianDate,
  isValidGregorianDate,
  assertValidEthiopianDate,
  assertValidGregorianDate,
} from '../dist/index.js';

test('isValidEthiopianDate predicates', () => {
  assert.equal(isValidEthiopianDate(2016, 1, 1), true);
  assert.equal(isValidEthiopianDate(2016, 12, 30), true);
  assert.equal(isValidEthiopianDate(2016, 13, 5), true);
  assert.equal(isValidEthiopianDate(2016, 13, 6), false); // 2016 is common year
  assert.equal(isValidEthiopianDate(2015, 13, 6), true);  // 2015 is leap year
  assert.equal(isValidEthiopianDate(2015, 13, 7), false); // Pagume 7 never exists
  assert.equal(isValidEthiopianDate(2016, 14, 1), false); // Month 14 does not exist
  assert.equal(isValidEthiopianDate(2016, 0, 1), false);  // Month 0 does not exist
  assert.equal(isValidEthiopianDate(2016, 1, 31), false); // Meskerem has 30 days
  assert.equal(isValidEthiopianDate(0, 1, 1), false);     // Year 0 before epoch
  assert.equal(isValidEthiopianDate(NaN, 1, 1), false);
  assert.equal(isValidEthiopianDate(2016, 1.5, 1), false);
});

test('isValidGregorianDate predicates', () => {
  assert.equal(isValidGregorianDate(2024, 1, 1), true);
  assert.equal(isValidGregorianDate(2024, 2, 29), true);  // 2024 is leap year
  assert.equal(isValidGregorianDate(2023, 2, 29), false); // 2023 is common year
  assert.equal(isValidGregorianDate(2024, 2, 30), false); // Feb 30 never exists
  assert.equal(isValidGregorianDate(2024, 4, 31), false); // April has 30 days
  assert.equal(isValidGregorianDate(2024, 13, 1), false); // Month 13 does not exist
  assert.equal(isValidGregorianDate(2024, 0, 1), false);
  assert.equal(isValidGregorianDate(0, 1, 1), false);
  assert.equal(isValidGregorianDate(10000, 1, 1), false);
  assert.equal(isValidGregorianDate(NaN, 1, 1), false);
});

test('assertValidEthiopianDate throws explicit TypeError on non-integers', () => {
  assert.throws(
    () => assertValidEthiopianDate('2016', 1, 1),
    (err) => err instanceof TypeError && err.message.includes('integer')
  );
  assert.throws(
    () => assertValidEthiopianDate(2016, '1', 1),
    (err) => err instanceof TypeError && err.message.includes('integer')
  );
  assert.throws(
    () => assertValidEthiopianDate(2016, 1, NaN),
    (err) => err instanceof TypeError
  );
  assert.throws(
    () => assertValidEthiopianDate(2016.5, 1, 1),
    (err) => err instanceof TypeError
  );
});

test('assertValidGregorianDate throws explicit TypeError on non-integers', () => {
  assert.throws(
    () => assertValidGregorianDate('2024', 1, 1),
    (err) => err instanceof TypeError && err.message.includes('integer')
  );
  assert.throws(
    () => assertValidGregorianDate(2024, null, 1),
    (err) => err instanceof TypeError
  );
  assert.throws(
    () => assertValidGregorianDate(2024, 1, 1.5),
    (err) => err instanceof TypeError
  );
});

test('toGregorian throws RangeError for impossible Ethiopian dates', () => {
  // Month 14
  assert.throws(
    () => toGregorian(2016, 14, 1),
    (err) => err instanceof RangeError && err.message.includes('month: 14')
  );

  // Month 0
  assert.throws(
    () => toGregorian(2016, 0, 1),
    (err) => err instanceof RangeError && err.message.includes('month: 0')
  );

  // Day 31 in 30-day month
  assert.throws(
    () => toGregorian(2016, 1, 31),
    (err) => err instanceof RangeError && err.message.includes('day 31')
  );

  // Pagume 6 in common year
  assert.throws(
    () => toGregorian(2016, 13, 6),
    (err) => err instanceof RangeError && err.message.includes('common year')
  );

  // Pagume 7 in leap year
  assert.throws(
    () => toGregorian(2015, 13, 7),
    (err) => err instanceof RangeError && err.message.includes('day 7')
  );
});

test('toEthiopian throws RangeError for impossible Gregorian dates', () => {
  // Feb 29 in common year
  assert.throws(
    () => toEthiopian(2023, 2, 29),
    (err) => err instanceof RangeError && err.message.includes('February')
  );

  // Feb 30
  assert.throws(
    () => toEthiopian(2024, 2, 30),
    (err) => err instanceof RangeError
  );

  // April 31
  assert.throws(
    () => toEthiopian(2024, 4, 31),
    (err) => err instanceof RangeError && err.message.includes('has 30 days')
  );

  // Month 13
  assert.throws(
    () => toEthiopian(2024, 13, 1),
    (err) => err instanceof RangeError && err.message.includes('month: 13')
  );
});

test('Malformed date strings throw TypeError', () => {
  const malformed = [
    '',
    'hello',
    '2024/01/01', // not ISO dash format
    '2024-1-1-1',
    '2024-MM-DD',
    '2024',
  ];

  for (const s of malformed) {
    assert.throws(
      () => toEthiopian(s),
      (err) => err instanceof TypeError && err.message.includes('Invalid date string')
    );
  }
});

test('Passing a Date instance directly throws a helpful TypeError', () => {
  assert.throws(
    () => toEthiopian(new Date()),
    (err) => err instanceof TypeError && err.message.includes('toEthiopianFromJSDate')
  );
  assert.throws(
    () => toGregorian(new Date()),
    (err) => err instanceof TypeError && err.message.includes('toEthiopianFromJSDate')
  );
});

test('Batch converters reject non-array inputs', () => {
  assert.throws(() => toEthiopianBatch(null), (err) => err instanceof TypeError);
  assert.throws(() => toEthiopianBatch('2024-01-01'), (err) => err instanceof TypeError);
  assert.throws(() => toGregorianBatch(undefined), (err) => err instanceof TypeError);
});

