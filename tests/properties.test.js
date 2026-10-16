import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toEthiopian,
  toGregorian,
  isGregorianLeapYear,
  isEthiopianLeapYear,
  getGregorianDaysInMonth,
  getEthiopianDaysInMonth,
  gregorianToJDN,
  ethiopianToJDN,
} from '../dist/index.js';

test('Invariant 1 & 2: Full round-trip across 50,000+ consecutive days (1900 to 2050)', () => {
  let consecutiveDays = 0;
  let previousJDN = -1;

  for (let gy = 1900; gy <= 2050; gy++) {
    for (let gm = 1; gm <= 12; gm++) {
      const maxD = getGregorianDaysInMonth(gy, gm);
      for (let gd = 1; gd <= maxD; gd++) {
        consecutiveDays++;

        // 1. Gregorian -> Ethiopian
        const eth = toEthiopian(gy, gm, gd);

        // 2. Ethiopian -> Gregorian (Round-trip check)
        const gregBack = toGregorian(eth);
        assert.equal(gregBack.year, gy);
        assert.equal(gregBack.month, gm);
        assert.equal(gregBack.day, gd);

        // 3. Reverse round-trip: Ethiopian -> Gregorian -> Ethiopian
        const ethBack = toEthiopian(gregBack);
        assert.equal(ethBack.year, eth.year);
        assert.equal(ethBack.month, eth.month);
        assert.equal(ethBack.day, eth.day);

        // Invariant 3: Consecutive dates advance by exactly 1 day in JDN
        const currentJDN = gregorianToJDN(gy, gm, gd);
        const ethJDN = ethiopianToJDN(eth.year, eth.month, eth.day);
        assert.equal(currentJDN, ethJDN, 'JDN of converted dates must match exactly');

        if (previousJDN !== -1) {
          assert.equal(currentJDN, previousJDN + 1, 'Consecutive date must advance by exactly 1 day');
        }
        previousJDN = currentJDN;

        // Invariant 4: Month bounds on resulting Ethiopian date
        const maxEthDay = getEthiopianDaysInMonth(eth.year, eth.month);
        assert.ok(eth.day >= 1 && eth.day <= maxEthDay);
      }
    }
  }

  assert.ok(consecutiveDays > 50000, `Verified ${consecutiveDays} consecutive days`);
});

test('Invariant: Ethiopian calendar days strictly advance by 1 across all 13 months', () => {
  // Test 4 full Ethiopian years (including leap year 2015 and common years 2014, 2016, 2017)
  let prevGregDate = null;

  for (let ey = 2014; ey <= 2017; ey++) {
    for (let em = 1; em <= 13; em++) {
      const maxDay = getEthiopianDaysInMonth(ey, em);
      for (let ed = 1; ed <= maxDay; ed++) {
        const greg = toGregorian(ey, em, ed);
        const ethBack = toEthiopian(greg);
        assert.deepEqual(ethBack, { year: ey, month: em, day: ed });

        if (prevGregDate !== null) {
          const prevJDN = gregorianToJDN(prevGregDate.year, prevGregDate.month, prevGregDate.day);
          const currJDN = gregorianToJDN(greg.year, greg.month, greg.day);
          assert.equal(currJDN, prevJDN + 1);
        }
        prevGregDate = greg;
      }
    }
  }
});
