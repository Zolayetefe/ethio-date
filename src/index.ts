// Core conversion functions
export {
  toEthiopian,
  toEthiopianBatch,
  toEthiopianFromJSDate,
  toGregorian,
  toGregorianBatch,
} from './converter.js';

// Validation, assertion, and leap-year rules
export {
  assertValidEthiopianDate,
  assertValidGregorianDate,
  getEthiopianDaysInMonth,
  getGregorianDaysInMonth,
  isEthiopianLeapYear,
  isGregorianLeapYear,
  isValidEthiopianDate,
  isValidGregorianDate,
  parseDateInput,
} from './validation.js';

// Formatting helpers
export {
  formatDate,
  formatEthiopianText,
  formatGregorianText,
  type EthiopianFormatOptions,
} from './format.js';

// Low-level JDN calendar arithmetic
export {
  ethiopianToJDN,
  gregorianToJDN,
  jdnToEthiopian,
  jdnToGregorian,
} from './jdn.js';

// Constants and metadata
export {
  ETHIOPIAN_EPOCH_JDN,
  ETHIOPIAN_MONTH_NAMES_AM,
  ETHIOPIAN_MONTH_NAMES_EN,
  GREGORIAN_MONTH_DAYS,
  GREGORIAN_MONTH_NAMES_EN,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} from './constants.js';

// Domain types
export type {
  CalendarDate,
  DateFormatPattern,
  DateInput,
  DateTuple,
  EthiopianDate,
  EthiopianMonth,
  GregorianDate,
  GregorianMonth,
  JSDateOptions,
} from './types.js';
