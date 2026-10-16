/**
 * Represents a calendar date with year, month, and day components.
 * Months are 1-based:
 * - Gregorian: 1 (January) through 12 (December)
 * - Ethiopian: 1 (Meskerem) through 13 (Pagume)
 */
export interface CalendarDate {
  /** Full calendar year (e.g., 2026 or 2019) */
  readonly year: number;
  /** 1-based calendar month */
  readonly month: number;
  /** 1-based calendar day of month */
  readonly day: number;
}

/**
 * An Ethiopian calendar date.
 * Meskerem = 1 ... Nehase = 12, Pagume = 13.
 */
export type EthiopianDate = CalendarDate;

/**
 * A Gregorian calendar date.
 * January = 1 ... December = 12.
 */
export type GregorianDate = CalendarDate;

/**
 * A 3-element tuple [year, month, day] representing a calendar date.
 */
export type DateTuple = readonly [year: number, month: number, day: number];

/**
 * Acceptable input representations for a date:
 * - ISO string: "YYYY-MM-DD" or "YYYY-M-D"
 * - Object: { year, month, day }
 * - Tuple: [year, month, day]
 */
export type DateInput = string | CalendarDate | DateTuple;

/**
 * 1-based Ethiopian month number:
 * 1: Meskerem, 2: Tikimt, 3: Hidar, 4: Tahsas, 5: Tir, 6: Yekatit,
 * 7: Megabit, 8: Meyazya, 9: Ginbot, 10: Sene, 11: Hamle, 12: Nehase, 13: Pagume.
 */
export type EthiopianMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

/**
 * 1-based Gregorian month number:
 * 1: January ... 12: December.
 */
export type GregorianMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Options for converting from a JavaScript Date instance.
 */
export interface JSDateOptions {
  /**
   * Target IANA time zone (e.g., 'UTC', 'Africa/Addis_Ababa', 'America/New_York').
   * Defaults to 'UTC' to guarantee deterministic, machine-independent behavior.
   */
  readonly timeZone?: string;
}

/**
 * Common date formatting patterns.
 */
export type DateFormatPattern =
  | 'YYYY-MM-DD'
  | 'DD/MM/YYYY'
  | 'MM/DD/YYYY'
  | 'YYYY/MM/DD'
  | string;
