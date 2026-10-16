import {
  GREGORIAN_MONTH_DAYS,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} from './constants.js';
import type { CalendarDate } from './types.js';

/**
 * Checks whether an Ethiopian calendar year is a leap year.
 * The Ethiopian calendar follows a strict 4-year cycle named after the Evangelists:
 * - Remainder 0: John (Yohannes) - 5 Pagume days
 * - Remainder 1: Matthew (Matiwos) - 5 Pagume days
 * - Remainder 2: Mark (Marqos) - 5 Pagume days
 * - Remainder 3: Luke (Luqas) - 6 Pagume days (Leap Year)
 *
 * @param year Ethiopian calendar year (1-based integer)
 * @returns true if leap year (Pagume has 6 days), false otherwise
 */
export function isEthiopianLeapYear(year: number): boolean {
  if (
    !Number.isInteger(year) ||
    year < MIN_SUPPORTED_YEAR ||
    year > MAX_SUPPORTED_YEAR
  ) {
    return false;
  }
  return (year + 1) % 4 === 0;
}

/**
 * Checks whether a Gregorian calendar year is a leap year.
 * Follows standard Gregorian leap rules:
 * - Divisible by 4 AND NOT divisible by 100, OR
 * - Divisible by 400.
 *
 * @param year Gregorian calendar year (integer)
 * @returns true if leap year (February has 29 days), false otherwise
 */
export function isGregorianLeapYear(year: number): boolean {
  if (
    !Number.isInteger(year) ||
    year < MIN_SUPPORTED_YEAR ||
    year > MAX_SUPPORTED_YEAR
  ) {
    return false;
  }
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the exact number of days in a given Ethiopian month.
 * Months 1-12 always have 30 days.
 * Month 13 (Pagume) has 6 days in a leap year and 5 days in a common year.
 *
 * @param year Ethiopian year
 * @param month Ethiopian month (1 to 13)
 * @returns Number of days (30, 5, or 6)
 * @throws RangeError if month is not between 1 and 13
 */
export function getEthiopianDaysInMonth(year: number, month: number): number {
  if (!Number.isInteger(month) || month < 1 || month > 13) {
    throw new RangeError(`Invalid Ethiopian month: ${month}. Must be an integer between 1 and 13.`);
  }
  if (month <= 12) {
    return 30;
  }
  return isEthiopianLeapYear(year) ? 6 : 5;
}

/**
 * Returns the exact number of days in a given Gregorian month.
 *
 * @param year Gregorian year
 * @param month Gregorian month (1 to 12)
 * @returns Number of days (28, 29, 30, or 31)
 * @throws RangeError if month is not between 1 and 12
 */
export function getGregorianDaysInMonth(year: number, month: number): number {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError(`Invalid Gregorian month: ${month}. Must be an integer between 1 and 12.`);
  }
  if (month === 2) {
    return isGregorianLeapYear(year) ? 29 : 28;
  }
  return GREGORIAN_MONTH_DAYS[month] ?? 30;
}

/**
 * Validates if the given parameters represent a valid Ethiopian calendar date.
 * Does not throw; returns false for any invalid or out-of-range inputs.
 */
export function isValidEthiopianDate(year: number, month: number, day: number): boolean {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    year < MIN_SUPPORTED_YEAR ||
    year > MAX_SUPPORTED_YEAR ||
    month < 1 ||
    month > 13 ||
    day < 1
  ) {
    return false;
  }
  const maxDay = month === 13 ? (isEthiopianLeapYear(year) ? 6 : 5) : 30;
  return day <= maxDay;
}

/**
 * Validates if the given parameters represent a valid Gregorian calendar date.
 * Does not throw; returns false for any invalid or out-of-range inputs.
 */
export function isValidGregorianDate(year: number, month: number, day: number): boolean {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    year < MIN_SUPPORTED_YEAR ||
    year > MAX_SUPPORTED_YEAR ||
    month < 1 ||
    month > 12 ||
    day < 1
  ) {
    return false;
  }
  const maxDay = month === 2
    ? (isGregorianLeapYear(year) ? 29 : 28)
    : (GREGORIAN_MONTH_DAYS[month] ?? 30);
  return day <= maxDay;
}

/**
 * Asserts that the provided values represent a valid Ethiopian date.
 * Throws TypeError or RangeError with an explicit, descriptive explanation on failure.
 */
export function assertValidEthiopianDate(year: number, month: number, day: number): void {
  if (typeof year !== 'number' || Number.isNaN(year) || !Number.isInteger(year)) {
    throw new TypeError(`Ethiopian year must be an integer, received: ${String(year)}`);
  }
  if (typeof month !== 'number' || Number.isNaN(month) || !Number.isInteger(month)) {
    throw new TypeError(`Ethiopian month must be an integer, received: ${String(month)}`);
  }
  if (typeof day !== 'number' || Number.isNaN(day) || !Number.isInteger(day)) {
    throw new TypeError(`Ethiopian day must be an integer, received: ${String(day)}`);
  }

  if (year < MIN_SUPPORTED_YEAR || year > MAX_SUPPORTED_YEAR) {
    throw new RangeError(
      `Ethiopian year ${year} is outside supported range [${MIN_SUPPORTED_YEAR}, ${MAX_SUPPORTED_YEAR}].`
    );
  }

  if (month < 1 || month > 13) {
    throw new RangeError(`Invalid Ethiopian month: ${month}. Must be between 1 and 13.`);
  }

  const maxDay = month === 13 ? (isEthiopianLeapYear(year) ? 6 : 5) : 30;
  if (day < 1 || day > maxDay) {
    if (month === 13) {
      const leapText = isEthiopianLeapYear(year)
        ? 'leap year (allows days 1-6)'
        : 'common year (allows days 1-5)';
      throw new RangeError(
        `Invalid day ${day} for Ethiopian month 13 (Pagume) in year ${year}. Year ${year} is a ${leapText}.`
      );
    }
    throw new RangeError(
      `Invalid day ${day} for Ethiopian month ${month}. Must be between 1 and 30.`
    );
  }
}

/**
 * Asserts that the provided values represent a valid Gregorian date.
 * Throws TypeError or RangeError with an explicit, descriptive explanation on failure.
 */
export function assertValidGregorianDate(year: number, month: number, day: number): void {
  if (typeof year !== 'number' || Number.isNaN(year) || !Number.isInteger(year)) {
    throw new TypeError(`Gregorian year must be an integer, received: ${String(year)}`);
  }
  if (typeof month !== 'number' || Number.isNaN(month) || !Number.isInteger(month)) {
    throw new TypeError(`Gregorian month must be an integer, received: ${String(month)}`);
  }
  if (typeof day !== 'number' || Number.isNaN(day) || !Number.isInteger(day)) {
    throw new TypeError(`Gregorian day must be an integer, received: ${String(day)}`);
  }

  if (year < MIN_SUPPORTED_YEAR || year > MAX_SUPPORTED_YEAR) {
    throw new RangeError(
      `Gregorian year ${year} is outside supported range [${MIN_SUPPORTED_YEAR}, ${MAX_SUPPORTED_YEAR}].`
    );
  }

  if (month < 1 || month > 12) {
    throw new RangeError(`Invalid Gregorian month: ${month}. Must be between 1 and 12.`);
  }

  const maxDay = month === 2
    ? (isGregorianLeapYear(year) ? 29 : 28)
    : (GREGORIAN_MONTH_DAYS[month] ?? 30);

  if (day < 1 || day > maxDay) {
    if (month === 2) {
      const leapText = isGregorianLeapYear(year)
        ? 'leap year (allows days 1-29)'
        : 'common year (allows days 1-28)';
      throw new RangeError(
        `Invalid day ${day} for February in year ${year}. Year ${year} is a ${leapText}.`
      );
    }
    throw new RangeError(
      `Invalid day ${day} for month ${month}. Month ${month} has ${maxDay} days.`
    );
  }
}

const ISO_DATE_REGEX = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/;

/**
 * Parses a DateInput (string, object, or tuple) into a standard CalendarDate.
 * For string inputs like "2026-10-16", extracts the exact calendar numbers
 * without any Date instantiation or timezone skew.
 */
export function parseDateInput(input: unknown): CalendarDate {
  if (input instanceof Date) {
    throw new TypeError(
      'JavaScript Date instances represent UTC timestamps. Use toEthiopianFromJSDate(date, options) for explicit timezone control.'
    );
  }

  if (typeof input === 'string') {
    const match = ISO_DATE_REGEX.exec(input.trim());
    if (!match || !match[1] || !match[2] || !match[3]) {
      throw new TypeError(
        `Invalid date string: "${input}". Expected format "YYYY-MM-DD" or "YYYY-M-D".`
      );
    }
    const year = Number.parseInt(match[1], 10);
    const month = Number.parseInt(match[2], 10);
    const day = Number.parseInt(match[3], 10);
    return { year, month, day };
  }

  if (Array.isArray(input)) {
    if (input.length !== 3) {
      throw new TypeError(`Date tuple must contain exactly 3 numbers [year, month, day].`);
    }
    const [y, m, d] = input;
    if (typeof y !== 'number' || typeof m !== 'number' || typeof d !== 'number') {
      throw new TypeError(`Date tuple elements must be numbers.`);
    }
    return { year: y, month: m, day: d };
  }

  if (typeof input === 'object' && input !== null) {
    const obj = input as Record<string, unknown>;
    if ('year' in obj && 'month' in obj && 'day' in obj) {
      const { year, month, day } = obj;
      if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') {
        throw new TypeError(`Date object properties { year, month, day } must be numbers.`);
      }
      return { year, month, day };
    }
  }

  throw new TypeError(
    `Unsupported date input: expected ISO string ("YYYY-MM-DD"), date object ({ year, month, day }), or tuple ([year, month, day]).`
  );
}
