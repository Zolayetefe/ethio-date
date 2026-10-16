import { ETHIOPIAN_EPOCH_JDN } from './constants.js';
import type { EthiopianDate, GregorianDate } from './types.js';

/**
 * Converts a Gregorian calendar date to its corresponding Julian Day Number (JDN).
 * Assumes validated Gregorian date input.
 *
 * Mathematical formula based on the Fliegel-Van Flandern / Hatcher algorithm
 * for the proleptic Gregorian calendar.
 *
 * @param year Full Gregorian year
 * @param month 1-based month (1-12)
 * @param day 1-based day of month (1-31)
 * @returns Julian Day Number (integer)
 */
export function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Converts a Julian Day Number (JDN) to its corresponding Gregorian calendar date.
 * Pure O(1) integer arithmetic, no lookup loops or Date allocations.
 *
 * @param jdn Julian Day Number (integer >= 0)
 * @returns GregorianDate object { year, month, day }
 */
export function jdnToGregorian(jdn: number): GregorianDate {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
}

/**
 * Converts an Ethiopian calendar date to its corresponding Julian Day Number (JDN).
 * Assumes validated Ethiopian date input.
 *
 * The Ethiopian calendar has 12 months of 30 days plus Pagume (5 or 6 days).
 * Every 4 years (when (year + 1) % 4 === 0), Pagume has 6 days, making the cycle
 * exactly 1461 days (3 * 365 + 366).
 *
 * @param year Ethiopian year (>= 1)
 * @param month Ethiopian month (1-13)
 * @param day Ethiopian day (1-30, or 1-6 in Pagume)
 * @returns Julian Day Number (integer)
 */
export function ethiopianToJDN(year: number, month: number, day: number): number {
  return (
    (year - 1) * 365 +
    Math.floor(year / 4) +
    (month - 1) * 30 +
    day -
    1 +
    ETHIOPIAN_EPOCH_JDN
  );
}

/**
 * Converts a Julian Day Number (JDN) to its corresponding Ethiopian calendar date.
 * Pure O(1) closed-form calculation:
 * Solves the exact position within the 4-year (1461-day) cycle:
 * - Year 1 (Matiwos): 365 days (days 0-364)
 * - Year 2 (Marqos): 365 days (days 365-729)
 * - Year 3 (Luqas - Leap): 366 days (days 730-1095)
 * - Year 4 (Yohannes): 365 days (days 1096-1460)
 *
 * @param jdn Julian Day Number
 * @returns EthiopianDate object { year, month, day }
 */
export function jdnToEthiopian(jdn: number): EthiopianDate {
  const r = jdn - ETHIOPIAN_EPOCH_JDN;
  const cycle = Math.floor(r / 1461);
  const dayInCycle = r % 1461;

  let yearInCycle: number;
  let dayInYear: number;

  if (dayInCycle < 365) {
    yearInCycle = 0;
    dayInYear = dayInCycle;
  } else if (dayInCycle < 730) {
    yearInCycle = 1;
    dayInYear = dayInCycle - 365;
  } else if (dayInCycle < 1096) {
    yearInCycle = 2; // Leap year
    dayInYear = dayInCycle - 730;
  } else {
    yearInCycle = 3;
    dayInYear = dayInCycle - 1096;
  }

  const year = cycle * 4 + yearInCycle + 1;
  const month = Math.floor(dayInYear / 30) + 1;
  const day = (dayInYear % 30) + 1;

  return { year, month, day };
}
