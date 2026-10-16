import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toEthiopian,
  toEthiopianFromJSDate,
} from '../dist/index.js';

test('ISO string date-only inputs are strictly timezone-independent', () => {
  // A date-only string represents a calendar date on paper.
  // It must never shift by +1 or -1 day based on host machine timezone.
  const str = '2026-10-16';
  const res = toEthiopian(str);
  assert.deepEqual(res, { year: 2019, month: 2, day: 6 });

  // Boundary string: Dec 31
  const endOfYear = toEthiopian('2024-12-31');
  assert.deepEqual(endOfYear, { year: 2017, month: 4, day: 22 });

  // Boundary string: Jan 1
  const startOfYear = toEthiopian('2024-01-01');
  assert.deepEqual(startOfYear, { year: 2016, month: 4, day: 22 });
});

test('toEthiopianFromJSDate with explicit timezone configuration', () => {
  // 2026-10-15 at 23:00:00 UTC
  // In UTC: Date is 2026-10-15
  // In Africa/Addis_Ababa (UTC+3): Time is 2026-10-16 02:00:00 -> Date is 2026-10-16
  const date = new Date('2026-10-15T23:00:00.000Z');

  // Default UTC
  const inUTC = toEthiopianFromJSDate(date);
  assert.deepEqual(inUTC, { year: 2019, month: 2, day: 5 });

  // Explicit UTC
  const inExplicitUTC = toEthiopianFromJSDate(date, { timeZone: 'UTC' });
  assert.deepEqual(inExplicitUTC, { year: 2019, month: 2, day: 5 });

  // In Addis Ababa timezone (EAT = UTC+3)
  const inAddis = toEthiopianFromJSDate(date, { timeZone: 'Africa/Addis_Ababa' });
  assert.deepEqual(inAddis, { year: 2019, month: 2, day: 6 });

  // In New York timezone (EDT = UTC-4)
  const inNY = toEthiopianFromJSDate(date, { timeZone: 'America/New_York' });
  assert.deepEqual(inNY, { year: 2019, month: 2, day: 5 });
});

test('toEthiopianFromJSDate rejects invalid Date instances', () => {
  assert.throws(() => toEthiopianFromJSDate(new Date('invalid')), (err) => err instanceof TypeError);
  assert.throws(() => toEthiopianFromJSDate('2026-10-16'), (err) => err instanceof TypeError);
  assert.throws(() => toEthiopianFromJSDate(null), (err) => err instanceof TypeError);
});
