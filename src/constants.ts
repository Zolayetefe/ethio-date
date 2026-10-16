/**
 * Julian Day Number (JDN) of Ethiopian calendar epoch:
 * Year 1, Meskerem 1 corresponds to JDN 1,724,221
 * (August 29, 8 CE in the Julian proleptic calendar; August 27, 8 CE in proleptic Gregorian).
 */
export const ETHIOPIAN_EPOCH_JDN = 1724221;

/**
 * Minimum supported calendar year (proleptic Ethiopian year 1).
 */
export const MIN_SUPPORTED_YEAR = 1;

/**
 * Maximum supported calendar year for 4-digit arithmetic safety.
 */
export const MAX_SUPPORTED_YEAR = 9999;

/**
 * Standard days in Gregorian months (1-indexed, index 0 unused).
 * February (index 2) is 28 in common years, 29 in leap years.
 */
export const GREGORIAN_MONTH_DAYS: readonly number[] = [
  0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
];

/**
 * Standard transliterated English names of Ethiopian months (1-indexed).
 */
export const ETHIOPIAN_MONTH_NAMES_EN: readonly string[] = [
  '',
  'Meskerem',
  'Tikimt',
  'Hidar',
  'Tahsas',
  'Tir',
  'Yekatit',
  'Megabit',
  'Meyazya',
  'Ginbot',
  'Sene',
  'Hamle',
  'Nehase',
  'Pagume',
];

/**
 * Ge'ez / Amharic names of Ethiopian months (1-indexed).
 */
export const ETHIOPIAN_MONTH_NAMES_AM: readonly string[] = [
  '',
  'መስከረም',
  'ጥቅምት',
  'ኅዳር',
  'ታኅሣሥ',
  'ጥር',
  'የካቲት',
  'መጋቢት',
  'ሚያዝያ',
  'ግንቦት',
  'ሰኔ',
  'ሐምሌ',
  'ነሐሴ',
  'ጳጉሜ',
];

/**
 * Standard English names of Gregorian months (1-indexed).
 */
export const GREGORIAN_MONTH_NAMES_EN: readonly string[] = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
