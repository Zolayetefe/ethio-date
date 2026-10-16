import {
  ETHIOPIAN_MONTH_NAMES_AM,
  ETHIOPIAN_MONTH_NAMES_EN,
  GREGORIAN_MONTH_NAMES_EN,
} from './constants.js';
import type { CalendarDate, DateFormatPattern } from './types.js';

/**
 * Formats a CalendarDate into a string according to a pattern.
 * Default pattern is 'YYYY-MM-DD'.
 *
 * Supported pattern tokens:
 * - `YYYY`: 4-digit year (padded to at least 4 digits, e.g. "2026")
 * - `MM`: 2-digit month (01-13)
 * - `M`: 1-2 digit month (1-13)
 * - `DD`: 2-digit day (01-30)
 * - `D`: 1-2 digit day (1-30)
 *
 * @param date CalendarDate object
 * @param pattern Formatting template (default 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export function formatDate(
  date: CalendarDate,
  pattern: DateFormatPattern = 'YYYY-MM-DD'
): string {
  if (!date || typeof date !== 'object') {
    throw new TypeError('Expected a CalendarDate object { year, month, day }.');
  }

  const { year, month, day } = date;
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new TypeError('Date components { year, month, day } must be integers.');
  }

  const yyyy = String(year).padStart(4, '0');
  const mm = String(month).padStart(2, '0');
  const m = String(month);
  const dd = String(day).padStart(2, '0');
  const d = String(day);

  return pattern
    .replace(/\bYYYY\b/g, yyyy)
    .replace(/\bMM\b/g, mm)
    .replace(/\bM\b/g, m)
    .replace(/\bDD\b/g, dd)
    .replace(/\bD\b/g, d);
}

/**
 * Options for localized Ethiopian date text formatting.
 */
export interface EthiopianFormatOptions {
  /** Language for month names: 'en' for transliterated English, 'am' for Ge'ez/Amharic. */
  readonly lang?: 'en' | 'am';
}

/**
 * Formats an Ethiopian date with its localized month name.
 * Example:
 * - English: "Meskerem 1, 2016"
 * - Amharic: "መስከረም 1 ቀን 2016 ዓ.ም."
 *
 * @param date Ethiopian date
 * @param options Localization options
 * @returns Formatted string
 */
export function formatEthiopianText(
  date: CalendarDate,
  options: EthiopianFormatOptions = { lang: 'en' }
): string {
  const { year, month, day } = date;
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new TypeError('Date components { year, month, day } must be integers.');
  }
  if (month < 1 || month > 13) {
    throw new RangeError(`Invalid Ethiopian month: ${month}. Must be between 1 and 13.`);
  }

  if (options.lang === 'am') {
    const monthName = ETHIOPIAN_MONTH_NAMES_AM[month] ?? '';
    return `${monthName} ${day} ቀን ${year} ዓ.ም.`;
  }

  const monthName = ETHIOPIAN_MONTH_NAMES_EN[month] ?? '';
  return `${monthName} ${day}, ${year}`;
}

/**
 * Formats a Gregorian date with its standard English month name.
 * Example: "September 12, 2023"
 */
export function formatGregorianText(date: CalendarDate): string {
  const { year, month, day } = date;
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new TypeError('Date components { year, month, day } must be integers.');
  }
  if (month < 1 || month > 12) {
    throw new RangeError(`Invalid Gregorian month: ${month}. Must be between 1 and 12.`);
  }

  const monthName = GREGORIAN_MONTH_NAMES_EN[month] ?? '';
  return `${monthName} ${day}, ${year}`;
}
