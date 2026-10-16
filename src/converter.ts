import {
  ethiopianToJDN,
  gregorianToJDN,
  jdnToEthiopian,
  jdnToGregorian,
} from './jdn.js';
import type {
  CalendarDate,
  DateInput,
  DateTuple,
  EthiopianDate,
  GregorianDate,
  JSDateOptions,
} from './types.js';
import {
  assertValidEthiopianDate,
  assertValidGregorianDate,
  parseDateInput,
} from './validation.js';

/**
 * Converts a Gregorian date to its corresponding Ethiopian calendar date.
 *
 * Supports three input formats:
 * - ISO string: `toEthiopian("2026-10-16")`
 * - Date object: `toEthiopian({ year: 2026, month: 10, day: 16 })`
 * - Positional numbers: `toEthiopian(2026, 10, 16)`
 *
 * Guaranteed timezone-independent calendar conversion.
 * Throws TypeError or RangeError on invalid input.
 */
export function toEthiopian(dateString: string): EthiopianDate;
export function toEthiopian(dateObject: CalendarDate): EthiopianDate;
export function toEthiopian(dateTuple: DateTuple): EthiopianDate;
export function toEthiopian(input: DateInput): EthiopianDate;
export function toEthiopian(year: number, month: number, day: number): EthiopianDate;
export function toEthiopian(
  arg1: DateInput | number,
  arg2?: number,
  arg3?: number
): EthiopianDate {
  let y: number;
  let m: number;
  let d: number;

  if (typeof arg1 === 'number') {
    if (typeof arg2 !== 'number' || typeof arg3 !== 'number') {
      throw new TypeError(
        'Positional arguments require 3 numbers: toEthiopian(year, month, day).'
      );
    }
    y = arg1;
    m = arg2;
    d = arg3;
  } else {
    const parsed = parseDateInput(arg1);
    y = parsed.year;
    m = parsed.month;
    d = parsed.day;
  }

  assertValidGregorianDate(y, m, d);
  const jdn = gregorianToJDN(y, m, d);
  return jdnToEthiopian(jdn);
}

/**
 * Converts an Ethiopian date to its corresponding Gregorian calendar date.
 *
 * Supports three input formats:
 * - ISO string: `toGregorian("2019-02-06")`
 * - Date object: `toGregorian({ year: 2019, month: 2, day: 6 })`
 * - Positional numbers: `toGregorian(2019, 2, 6)`
 *
 * Guaranteed timezone-independent calendar conversion.
 * Throws TypeError or RangeError on invalid input.
 */
export function toGregorian(dateString: string): GregorianDate;
export function toGregorian(dateObject: CalendarDate): GregorianDate;
export function toGregorian(dateTuple: DateTuple): GregorianDate;
export function toGregorian(input: DateInput): GregorianDate;
export function toGregorian(year: number, month: number, day: number): GregorianDate;
export function toGregorian(
  arg1: DateInput | number,
  arg2?: number,
  arg3?: number
): GregorianDate {
  let y: number;
  let m: number;
  let d: number;

  if (typeof arg1 === 'number') {
    if (typeof arg2 !== 'number' || typeof arg3 !== 'number') {
      throw new TypeError(
        'Positional arguments require 3 numbers: toGregorian(year, month, day).'
      );
    }
    y = arg1;
    m = arg2;
    d = arg3;
  } else {
    const parsed = parseDateInput(arg1);
    y = parsed.year;
    m = parsed.month;
    d = parsed.day;
  }

  assertValidEthiopianDate(y, m, d);
  const jdn = ethiopianToJDN(y, m, d);
  return jdnToGregorian(jdn);
}

/**
 * Converts a JavaScript `Date` instance to an Ethiopian calendar date with explicit
 * time zone resolution.
 *
 * @param date A JavaScript Date object
 * @param options Timezone configuration (defaults to 'UTC' for deterministic results)
 * @returns EthiopianDate object { year, month, day }
 */
export function toEthiopianFromJSDate(
  date: Date,
  options: JSDateOptions = { timeZone: 'UTC' }
): EthiopianDate {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('Expected a valid JavaScript Date instance.');
  }

  const timeZone = options.timeZone ?? 'UTC';

  // Extract year, month, and day in the target time zone
  if (timeZone.toUpperCase() === 'UTC') {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return toEthiopian(year, month, day);
  }

  // Use Intl.DateTimeFormat to reliably resolve target calendar parts without locale skew
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const parts = formatter.formatToParts(date);
  let year = 0;
  let month = 0;
  let day = 0;

  for (const part of parts) {
    if (part.type === 'year') year = Number.parseInt(part.value, 10);
    else if (part.type === 'month') month = Number.parseInt(part.value, 10);
    else if (part.type === 'day') day = Number.parseInt(part.value, 10);
  }

  return toEthiopian(year, month, day);
}

/**
 * High-performance batch conversion from Gregorian to Ethiopian dates.
 * Pre-allocates result buffer for maximum throughput.
 *
 * @param inputs Array of DateInput items
 * @returns Array of converted EthiopianDate objects
 */
export function toEthiopianBatch(inputs: readonly DateInput[]): EthiopianDate[] {
  if (!Array.isArray(inputs)) {
    throw new TypeError('Expected an array of date inputs.');
  }
  const len = inputs.length;
  const results = new Array<EthiopianDate>(len);
  for (let i = 0; i < len; i++) {
    const item = inputs[i];
    if (item === undefined) {
      throw new TypeError(`Batch item at index ${i} is undefined.`);
    }
    results[i] = toEthiopian(item);
  }
  return results;
}

/**
 * High-performance batch conversion from Ethiopian to Gregorian dates.
 * Pre-allocates result buffer for maximum throughput.
 *
 * @param inputs Array of DateInput items
 * @returns Array of converted GregorianDate objects
 */
export function toGregorianBatch(inputs: readonly DateInput[]): GregorianDate[] {
  if (!Array.isArray(inputs)) {
    throw new TypeError('Expected an array of date inputs.');
  }
  const len = inputs.length;
  const results = new Array<GregorianDate>(len);
  for (let i = 0; i < len; i++) {
    const item = inputs[i];
    if (item === undefined) {
      throw new TypeError(`Batch item at index ${i} is undefined.`);
    }
    results[i] = toGregorian(item);
  }
  return results;
}
