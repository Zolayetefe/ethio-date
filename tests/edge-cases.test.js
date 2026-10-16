import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toEthiopian,
  toGregorian,
  isEthiopianLeapYear,
  isGregorianLeapYear,
  getEthiopianDaysInMonth,
  getGregorianDaysInMonth,
} from '../dist/index.js';

test('Ethiopian leap years follow Evangelist Luke 4-year cycle', () => {
  // Ethiopian leap years have (year + 1) % 4 === 0 (or year % 4 === 3)
  const leapYears = [3, 7, 11, 15, 1999, 2003, 2007, 2011, 2015, 2019, 2023, 2027];
  const commonYears = [1, 2, 4, 5, 6, 8, 2016, 2017, 2018, 2020, 2021, 2022];

  for (const yr of leapYears) {
    assert.equal(isEthiopianLeapYear(yr), true, `Year ${yr} should be an Ethiopian leap year`);
    assert.equal(getEthiopianDaysInMonth(yr, 13), 6, `Year ${yr} Pagume should have 6 days`);
  }

  for (const yr of commonYears) {
    assert.equal(isEthiopianLeapYear(yr), false, `Year ${yr} should be an Ethiopian common year`);
    assert.equal(getEthiopianDaysInMonth(yr, 13), 5, `Year ${yr} Pagume should have 5 days`);
  }
});

test('Ethiopian New Year transition after Leap Year (2015 -> 2016)', () => {
  // 2015 was an Ethiopian leap year (Zemene Luqas)
  // Pagume had 6 days (Sept 6 to Sept 11, 2023)
  // Meskerem 1, 2016 started on Sept 12, 2023
  assert.deepEqual(toEthiopian(2023, 9, 10), { year: 2015, month: 13, day: 5 });
  assert.deepEqual(toEthiopian(2023, 9, 11), { year: 2015, month: 13, day: 6 });
  assert.deepEqual(toEthiopian(2023, 9, 12), { year: 2016, month: 1, day: 1 });

  // Reverse conversions
  assert.deepEqual(toGregorian(2015, 13, 5), { year: 2023, month: 9, day: 10 });
  assert.deepEqual(toGregorian(2015, 13, 6), { year: 2023, month: 9, day: 11 });
  assert.deepEqual(toGregorian(2016, 1, 1), { year: 2023, month: 9, day: 12 });
});

test('Ethiopian New Year transition after Common Year (2016 -> 2017)', () => {
  // 2016 was an Ethiopian common year (Zemene Yohannes)
  // Pagume had 5 days (Sept 6 to Sept 10, 2024)
  // Meskerem 1, 2017 started on Sept 11, 2024
  assert.deepEqual(toEthiopian(2024, 9, 10), { year: 2016, month: 13, day: 5 });
  assert.deepEqual(toEthiopian(2024, 9, 11), { year: 2017, month: 1, day: 1 });

  // Reverse conversions
  assert.deepEqual(toGregorian(2016, 13, 5), { year: 2024, month: 9, day: 10 });
  assert.deepEqual(toGregorian(2017, 1, 1), { year: 2024, month: 9, day: 11 });
});

test('Gregorian Leap Day handling (February 29)', () => {
  // 2024 is a Gregorian leap year
  assert.equal(isGregorianLeapYear(2024), true);
  assert.equal(getGregorianDaysInMonth(2024, 2), 29);

  assert.deepEqual(toEthiopian(2024, 2, 28), { year: 2016, month: 6, day: 20 });
  assert.deepEqual(toEthiopian(2024, 2, 29), { year: 2016, month: 6, day: 21 });
  assert.deepEqual(toEthiopian(2024, 3, 1), { year: 2016, month: 6, day: 22 });

  // Reverse conversions
  assert.deepEqual(toGregorian(2016, 6, 20), { year: 2024, month: 2, day: 28 });
  assert.deepEqual(toGregorian(2016, 6, 21), { year: 2024, month: 2, day: 29 });
  assert.deepEqual(toGregorian(2016, 6, 22), { year: 2024, month: 3, day: 1 });
});

test('Century leap rules for Gregorian calendar (2000 vs 1900)', () => {
  // 2000 was divisible by 400 -> LEAP
  assert.equal(isGregorianLeapYear(2000), true);
  assert.deepEqual(toEthiopian(2000, 2, 29), { year: 1992, month: 6, day: 21 });
  assert.deepEqual(toGregorian(1992, 6, 21), { year: 2000, month: 2, day: 29 });

  // 1900 was divisible by 100 but not 400 -> NOT LEAP
  assert.equal(isGregorianLeapYear(1900), false);
  assert.equal(getGregorianDaysInMonth(1900, 2), 28);
  assert.deepEqual(toEthiopian(1900, 2, 28), { year: 1892, month: 6, day: 21 });
  assert.deepEqual(toEthiopian(1900, 3, 1), { year: 1892, month: 6, day: 22 });
});

test('Pagume 6 validity in leap year vs common year', () => {
  // 2015 is a leap year: Pagume 6 must succeed
  assert.doesNotThrow(() => toGregorian(2015, 13, 6));

  // 2016 is a common year: Pagume 6 must throw RangeError
  assert.throws(
    () => toGregorian(2016, 13, 6),
    (err) => err instanceof RangeError && err.message.includes('Pagume')
  );

  // Pagume 5 must succeed in both leap and common years
  assert.doesNotThrow(() => toGregorian(2015, 13, 5));
  assert.doesNotThrow(() => toGregorian(2016, 13, 5));
});

test('First and last days of all 13 Ethiopian months', () => {
  const year = 2015; // leap year
  for (let m = 1; m <= 13; m++) {
    const daysInM = m === 13 ? 6 : 30;

    // Day 1
    const g1 = toGregorian(year, m, 1);
    const e1 = toEthiopian(g1);
    assert.deepEqual(e1, { year, month: m, day: 1 });

    // Last day
    const gLast = toGregorian(year, m, daysInM);
    const eLast = toEthiopian(gLast);
    assert.deepEqual(eLast, { year, month: m, day: daysInM });
  }
});
