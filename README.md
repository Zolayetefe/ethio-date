# ethio-date

> Ultra-fast, zero-dependency Ethiopian ↔ Gregorian calendar date converter with strict validation and full TypeScript support.

[![CI](https://github.com/Zolayetefe/ethio-date/actions/workflows/ci.yml/badge.svg)](https://github.com/Zolayetefe/ethio-date/actions)
[![npm version](https://img.shields.io/npm/v/ethio-date?color=blue)](https://www.npmjs.com/package/ethio-date)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](src/types.ts)

---

## Highlights

- ⚡ **Ultra-Fast**: Converts over **27 million dates/second** via constant-time $O(1)$ Julian Day Number arithmetic.
- 📦 **Zero Dependencies**: Pure standard JavaScript/TypeScript (`dependencies: {}`).
- 🛡️ **Strict Validation**: Accurately handles Pagume (5 or 6 days), leap years, and month lengths; throws explicit errors instead of returning corrupt dates.
- 🌐 **Timezone-Safe**: Parses ISO date strings like `"2026-10-16"` directly as calendar dates without accidental UTC/local timezone shifts.
- 🧩 **Universal Support**: First-class dual ESM & CommonJS builds for Node.js, Next.js, Vite, Bun, Deno, and modern browsers.
- 📘 **TypeScript Ready**: Shipped with comprehensive `.d.ts` and `.d.cts` type definitions.

---

## Installation

```bash
# npm
npm install ethio-date

# pnpm
pnpm add ethio-date

# yarn
yarn add ethio-date

# bun
bun add ethio-date
```

---

## Quick Start

```typescript
import { toEthiopian, toGregorian } from 'ethio-date';

// Gregorian to Ethiopian
const eth = toEthiopian('2026-10-16');
console.log(eth);
// => { year: 2019, month: 2, day: 6 }

// Ethiopian to Gregorian
const greg = toGregorian({ year: 2019, month: 2, day: 6 });
console.log(greg);
// => { year: 2026, month: 10, day: 16 }
```

---

## Usage Guide

### 1. Flexible Input Types

Functions accept ISO strings, date objects, positional arguments, or tuples:

```typescript
import { toEthiopian } from 'ethio-date';

toEthiopian('2026-10-16');                 // ISO string
toEthiopian({ year: 2026, month: 10, day: 16 }); // CalendarDate object
toEthiopian(2026, 10, 16);                 // Positional arguments (fastest)
toEthiopian([2026, 10, 16]);               // Tuple [year, month, day]
```

### 2. Validation & Leap Years

Check validity or check leap years without throwing:

```typescript
import {
  isValidEthiopianDate,
  isValidGregorianDate,
  isEthiopianLeapYear,
  toGregorian,
} from 'ethio-date';

// Ethiopian leap years have 6 Pagume days (month 13); common years have 5
isEthiopianLeapYear(2015); // true (Evangelist Luke / ዘመነ ሉቃስ)
isEthiopianLeapYear(2016); // false

isValidEthiopianDate(2015, 13, 6); // true (Leap year allows Pagume 6)
isValidEthiopianDate(2016, 13, 6); // false (Common year allows 1-5 only)

// Invalid dates throw explicit errors on conversion
try {
  toGregorian(2016, 13, 6);
} catch (err) {
  console.error(err.message);
  // RangeError: Invalid day 6 for Ethiopian month 13 (Pagume) in year 2016...
}
```

### 3. Date Formatting

Format dates using format patterns or localized month names:

```typescript
import {
  formatDate,
  formatEthiopianText,
  formatGregorianText,
} from 'ethio-date';

const ethDate = { year: 2016, month: 1, day: 1 };

// Token patterns (YYYY, MM, M, DD, D)
formatDate(ethDate, 'YYYY-MM-DD'); // "2016-01-01"
formatDate(ethDate, 'DD/MM/YYYY'); // "01/01/2016"

// Localized text (English or Amharic / Ge'ez)
formatEthiopianText(ethDate, { lang: 'en' }); // "Meskerem 1, 2016"
formatEthiopianText(ethDate, { lang: 'am' }); // "መስከረም 1 ቀን 2016 ዓ.ም."

// Gregorian text
formatGregorianText({ year: 2023, month: 9, day: 12 }); // "September 12, 2023"
```

### 4. JavaScript `Date` Objects & Timezones

When working with JavaScript `Date` instances, specify the desired timezone (defaults to UTC):

```typescript
import { toEthiopianFromJSDate } from 'ethio-date';

const instant = new Date('2026-10-15T23:30:00.000Z');

// UTC calendar date
toEthiopianFromJSDate(instant);
// => { year: 2019, month: 2, day: 5 }

// Addis Ababa (UTC+3) calendar date
toEthiopianFromJSDate(instant, { timeZone: 'Africa/Addis_Ababa' });
// => { year: 2019, month: 2, day: 6 }
```

### 5. High-Throughput Batch Conversions

For bulk operations, migrations, and reporting:

```typescript
import { toEthiopianBatch, toGregorianBatch } from 'ethio-date';

const items = ['2024-01-01', '2024-06-15', '2024-09-11'];
const results = toEthiopianBatch(items);
// Converts ~27 million dates/second using pre-allocated arrays
```

---

## API Reference

### Conversion

| Function | Signature | Description |
| :--- | :--- | :--- |
| `toEthiopian` | `(input: DateInput \| (y, m, d)) => EthiopianDate` | Converts Gregorian date to Ethiopian date |
| `toGregorian` | `(input: DateInput \| (y, m, d)) => GregorianDate` | Converts Ethiopian date to Gregorian date |
| `toEthiopianFromJSDate` | `(date: Date, options?: JSDateOptions) => EthiopianDate` | Converts JS `Date` with explicit timezone |
| `toEthiopianBatch` | `(inputs: readonly DateInput[]) => EthiopianDate[]` | Optimized batch conversion to Ethiopian |
| `toGregorianBatch` | `(inputs: readonly DateInput[]) => GregorianDate[]` | Optimized batch conversion to Gregorian |

### Validation & Calendar Rules

| Function | Signature | Description |
| :--- | :--- | :--- |
| `isValidEthiopianDate` | `(year, month, day) => boolean` | Checks if Ethiopian date is valid without throwing |
| `isValidGregorianDate` | `(year, month, day) => boolean` | Checks if Gregorian date is valid without throwing |
| `assertValidEthiopianDate` | `(year, month, day) => void` | Validates Ethiopian date; throws `RangeError`/`TypeError` |
| `assertValidGregorianDate` | `(year, month, day) => void` | Validates Gregorian date; throws `RangeError`/`TypeError` |
| `isEthiopianLeapYear` | `(year: number) => boolean` | Returns `true` if Ethiopian leap year (Pagume has 6 days) |
| `isGregorianLeapYear` | `(year: number) => boolean` | Returns `true` if Gregorian leap year (Feb has 29 days) |
| `getEthiopianDaysInMonth` | `(year, month) => number` | Returns days in Ethiopian month (30, or 5/6 for Pagume) |
| `getGregorianDaysInMonth` | `(year, month) => number` | Returns days in Gregorian month (28, 29, 30, or 31) |

### Formatting

| Function | Signature | Description |
| :--- | :--- | :--- |
| `formatDate` | `(date: CalendarDate, pattern?: string) => string` | Formats date with tokens (`YYYY`, `MM`, `DD`) |
| `formatEthiopianText` | `(date: CalendarDate, options?: { lang?: 'en' \| 'am' }) => string` | Formats date with English or Amharic month name |
| `formatGregorianText` | `(date: CalendarDate) => string` | Formats date with English month name |

### Julian Day Number (JDN) Utilities

| Function | Signature | Description |
| :--- | :--- | :--- |
| `gregorianToJDN` | `(year, month, day) => number` | Calculates Julian Day Number from Gregorian date |
| `jdnToGregorian` | `(jdn: number) => GregorianDate` | Converts Julian Day Number to Gregorian date |
| `ethiopianToJDN` | `(year, month, day) => number` | Calculates Julian Day Number from Ethiopian date |
| `jdnToEthiopian` | `(jdn: number) => EthiopianDate` | Converts Julian Day Number to Ethiopian date |

---

## Performance

Benchmarked with 1,000,000 iterations on Node.js (x64):

| Operation | Throughput | Latency |
| :--- | :--- | :--- |
| `toEthiopian(y, m, d)` | **27.3M ops/sec** | 36.6 ns |
| `toEthiopian({ year, month, day })` | **23.7M ops/sec** | 42.2 ns |
| `toEthiopian("YYYY-MM-DD")` | **5.6M ops/sec** | 178.9 ns |
| `toGregorian(y, m, d)` | **22.2M ops/sec** | 45.0 ns |
| `isValidEthiopianDate(y, m, d)` | **123.5M ops/sec** | 8.1 ns |
| `toEthiopianBatch` (10,000 dates) | **26.8M dates/sec** | 372 µs / batch |

Run benchmarks locally:
```bash
npm run benchmark
```

---

## Supported Range

- **Ethiopian Calendar**: Year 1 Meskerem 1 to Year 9999 Pagume 6
- **Gregorian Calendar**: August 27, 8 CE to December 31, 9999 CE

---

## License

[MIT](LICENSE) © [Zolayetefe](https://github.com/Zolayetefe)
