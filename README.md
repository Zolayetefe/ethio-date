# ethio-date

> Ultra-fast, zero-dependency Ethiopian ↔ Gregorian calendar date converter with strict validation, mathematically proven round-trip invariants, and full TypeScript support.

[![CI](https://github.com/Henok/ethio-date/actions/workflows/ci.yml/badge.svg)](https://github.com/Henok/ethio-date/actions)
[![npm version](https://img.shields.io/npm/v/ethio-date.svg)](https://www.npmjs.com/package/ethio-date)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](src/types.ts)

---

## Overview

`ethio-date` provides a high-performance, predictable, and mathematically verified date conversion engine between the **Ethiopian (Ge'ez)** and **Gregorian** calendar systems.

Unlike monolithic calendar frameworks that bundle heavy holiday databases or computus calculations, `ethio-date` focuses exclusively on doing one thing with production-grade excellence: **converting and validating calendar dates with constant-time $O(1)$ arithmetic, zero runtime dependencies, and strict type safety**.

### Why `ethio-date`?

- ⚡ **Ultra-Fast**: Converts over **27,000,000 dates/second** in V8. Up to 40× faster than alternatives.
- 📦 **Zero Dependencies**: 0 runtime dependencies (`dependencies: {}`). Clean, tiny footprint (17.9 kB packed).
- 🔒 **Mathematically Proven Correctness**: Verified across **73,000+ consecutive days** (1900–2100) and **100,000+ historical dates** with guaranteed $G \to E \to G$ and $E \to G \to E$ round-trip identity.
- 🛡️ **Strict Input Validation**: Rejects impossible dates (e.g., month 14, Feb 30, Pagume 6 in common years) with explicit `RangeError` or `TypeError` instead of silently corrupting dates.
- 🌐 **Timezone-Safe**: ISO date-only strings like `"2026-10-16"` are parsed purely as calendar dates on paper, eliminating machine timezone offsets and daylight saving glitches.
- 🧩 **Dual ESM & CommonJS**: Full compatibility with modern bundlers (Vite, Next.js, Webpack, Rollup) and traditional Node.js CommonJS environments.
- 📘 **First-Class TypeScript**: Ships with bundled `.d.ts` and `.d.cts` declarations, comprehensive JSDoc comments, and strict parameter typing.

---

## Installation

Install using your package manager of choice:

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

### JavaScript (ESM / CommonJS)

```javascript
// ESM
import { toEthiopian, toGregorian } from 'ethio-date';

// CommonJS
// const { toEthiopian, toGregorian } = require('ethio-date');

// Gregorian -> Ethiopian
const ethDate = toEthiopian('2026-10-16');
console.log(ethDate);
// Output: { year: 2019, month: 2, day: 6 }

// Ethiopian -> Gregorian
const gregDate = toGregorian({ year: 2019, month: 2, day: 6 });
console.log(gregDate);
// Output: { year: 2026, month: 10, day: 16 }
```

### TypeScript

```typescript
import {
  toEthiopian,
  toGregorian,
  type EthiopianDate,
  type GregorianDate,
} from 'ethio-date';

// Accepts ISO string, object, tuple, or positional numbers
const eth: EthiopianDate = toEthiopian(2026, 10, 16);
const greg: GregorianDate = toGregorian(eth);

console.log(`${eth.year}-${eth.month}-${eth.day}`); // 2019-2-6
console.log(`${greg.year}-${greg.month}-${greg.day}`); // 2026-10-16
```

---

## Key Features & Examples

### 1. Flexible Input Formats

Both `toEthiopian` and `toGregorian` accept multiple input formats:

```typescript
import { toEthiopian } from 'ethio-date';

// 1. ISO string (timezone-safe)
toEthiopian('2026-10-16');

// 2. Calendar date object
toEthiopian({ year: 2026, month: 10, day: 16 });

// 3. Positional numbers (Fastest execution path)
toEthiopian(2026, 10, 16);

// 4. Numeric tuple
toEthiopian([2026, 10, 16]);
```

### 2. Strict Calendar Validation

`ethio-date` strictly enforces calendar bounds and leap-year rules.

```typescript
import {
  isValidEthiopianDate,
  isValidGregorianDate,
  toGregorian,
  toEthiopian,
} from 'ethio-date';

// Predicates return boolean without throwing
isValidEthiopianDate(2015, 13, 6); // true  (2015 is a leap year; Pagume has 6 days)
isValidEthiopianDate(2016, 13, 6); // false (2016 is a common year; Pagume has 5 days)

isValidGregorianDate(2024, 2, 29); // true  (2024 is a leap year)
isValidGregorianDate(2023, 2, 29); // false (2023 is a common year)

// Conversion functions throw explicit RangeError on impossible dates
try {
  toGregorian(2016, 13, 6);
} catch (err) {
  console.error(err.message);
  // RangeError: Invalid day 6 for Ethiopian month 13 (Pagume) in year 2016. Year 2016 is a common year (allows days 1-5).
}

try {
  toEthiopian(2023, 2, 29);
} catch (err) {
  console.error(err.message);
  // RangeError: Invalid day 29 for February in year 2023. Year 2023 is a common year (allows days 1-28).
}
```

### 3. Pagume and Leap-Year Mechanics

The Ethiopian calendar consists of 12 months of 30 days each, followed by a 13th month called **Pagume (ጳጉሜ)**:
- **Common Years**: Pagume has 5 days (365 days total).
- **Leap Years (Evangelist Luke / ዘመነ ሉቃስ)**: Pagume has 6 days (366 days total). A leap year occurs every 4 years when `(year + 1) % 4 === 0` (or `year % 4 === 3`).
- Because of this 6th Pagume day, Ethiopian New Year (*Enkutatash / እንቁጣጣሽ*) falls on **September 12** in Gregorian years immediately following an Ethiopian leap year, and **September 11** in common years.

```typescript
import { isEthiopianLeapYear, toEthiopian } from 'ethio-date';

// 2015 was an Ethiopian leap year
console.log(isEthiopianLeapYear(2015)); // true
console.log(isEthiopianLeapYear(2016)); // false

// New Year following Ethiopian leap year falls on Sept 12
toEthiopian(2023, 9, 11); // { year: 2015, month: 13, day: 6 } (Pagume 6)
toEthiopian(2023, 9, 12); // { year: 2016, month: 1, day: 1 }  (Meskerem 1)

// New Year following common year falls on Sept 11
toEthiopian(2024, 9, 10); // { year: 2016, month: 13, day: 5 } (Pagume 5)
toEthiopian(2024, 9, 11); // { year: 2017, month: 1, day: 1 }  (Meskerem 1)
```

### 4. High-Performance Batch Processing

For bulk imports, financial reports, or database migrations, use `toEthiopianBatch` and `toGregorianBatch`:

```typescript
import { toEthiopianBatch } from 'ethio-date';

const dates = [
  '2024-01-01',
  { year: 2024, month: 6, day: 15 },
  [2024, 9, 11],
];

const results = toEthiopianBatch(dates);
// Converts 10,000 items in ~370 microseconds (~26.8 million conversions/sec)
```

### 5. String Formatting & Localization

Format calendar dates with standard tokens or localized month names:

```typescript
import {
  formatDate,
  formatEthiopianText,
  formatGregorianText,
} from 'ethio-date';

const ethDate = { year: 2016, month: 1, day: 1 };

// Standard pattern formatting
formatDate(ethDate, 'YYYY-MM-DD'); // "2016-01-01"
formatDate(ethDate, 'DD/MM/YYYY'); // "01/01/2016"

// Localized month name formatting
formatEthiopianText(ethDate, { lang: 'en' }); // "Meskerem 1, 2016"
formatEthiopianText(ethDate, { lang: 'am' }); // "መስከረም 1 ቀን 2016 ዓ.ም."

// Gregorian formatting
formatGregorianText({ year: 2023, month: 9, day: 12 }); // "September 12, 2023"
```

### 6. Working with JavaScript `Date` Objects (Explicit Timezones)

JavaScript `Date` instances represent an instantaneous UTC timestamp, not a calendar date. To avoid accidental local machine timezone shifts, `toEthiopianFromJSDate` provides explicit timezone control:

```typescript
import { toEthiopianFromJSDate } from 'ethio-date';

const instant = new Date('2026-10-15T23:00:00.000Z');

// 1. Default UTC conversion (machine-independent)
const inUtc = toEthiopianFromJSDate(instant);
// { year: 2019, month: 2, day: 5 }

// 2. Explicit IANA time zone (e.g., East Africa Time UTC+3)
const inAddis = toEthiopianFromJSDate(instant, { timeZone: 'Africa/Addis_Ababa' });
// In Addis Ababa, it was already 2026-10-16 02:00:00 AM -> { year: 2019, month: 2, day: 6 }
```

---

## Performance Benchmarks

Measured on Node.js v25.2.1 (x64, Windows 11) with 1,000,000 iterations:

| Operation | Throughput | Latency |
| :--- | :--- | :--- |
| **`toEthiopian(y, m, d)`** | **27,299,133 ops/sec** | **36.6 ns/op** |
| **`toEthiopian({ year, month, day })`** | **23,719,503 ops/sec** | **42.2 ns/op** |
| **`toEthiopian("YYYY-MM-DD")`** | **5,591,215 ops/sec** | **178.9 ns/op** |
| **`toGregorian(y, m, d)`** | **22,240,113 ops/sec** | **45.0 ns/op** |
| **`toGregorian({ year, month, day })`** | **16,717,125 ops/sec** | **59.8 ns/op** |
| **`toGregorian("YYYY-MM-DD")`** | **4,673,633 ops/sec** | **214.0 ns/op** |
| **`isValidGregorianDate(y, m, d)`** | **123,736,343 ops/sec** | **8.1 ns/op** |
| **`isValidEthiopianDate(y, m, d)`** | **123,523,890 ops/sec** | **8.1 ns/op** |
| **`toEthiopianBatch` (10,000 dates)** | **26,870,000 dates/sec** | **372.1 µs / batch** |

See [docs/BENCHMARKS.md](docs/BENCHMARKS.md) for full reproducible benchmarking data and competitor comparisons.

---

## Complete API Reference

### Core Conversion Functions

#### `toEthiopian(input: DateInput): EthiopianDate`
#### `toEthiopian(year: number, month: number, day: number): EthiopianDate`
Converts a Gregorian date to an Ethiopian calendar date `{ year, month, day }`.
- **Throws**: `TypeError` if input format or types are invalid.
- **Throws**: `RangeError` if date components exceed calendar bounds.

#### `toGregorian(input: DateInput): GregorianDate`
#### `toGregorian(year: number, month: number, day: number): GregorianDate`
Converts an Ethiopian date to a Gregorian calendar date `{ year, month, day }`.
- **Throws**: `TypeError` if input format or types are invalid.
- **Throws**: `RangeError` if date components exceed calendar bounds.

#### `toEthiopianBatch(inputs: readonly DateInput[]): EthiopianDate[]`
High-throughput batch conversion from Gregorian to Ethiopian dates using pre-allocated buffers.

#### `toGregorianBatch(inputs: readonly DateInput[]): GregorianDate[]`
High-throughput batch conversion from Ethiopian to Gregorian dates using pre-allocated buffers.

#### `toEthiopianFromJSDate(date: Date, options?: JSDateOptions): EthiopianDate`
Converts a native JavaScript `Date` instance using explicit timezone resolution (defaults to UTC).

---

### Validation & Calendar Predicates

#### `isValidEthiopianDate(year: number, month: number, day: number): boolean`
Returns `true` if the year, month, and day form a valid Ethiopian date. Returns `false` otherwise without throwing.

#### `isValidGregorianDate(year: number, month: number, day: number): boolean`
Returns `true` if the year, month, and day form a valid Gregorian date. Returns `false` otherwise without throwing.

#### `assertValidEthiopianDate(year: number, month: number, day: number): void`
Validates an Ethiopian date and throws an informative `TypeError` or `RangeError` if invalid.

#### `assertValidGregorianDate(year: number, month: number, day: number): void`
Validates a Gregorian date and throws an informative `TypeError` or `RangeError` if invalid.

#### `isEthiopianLeapYear(year: number): boolean`
Returns `true` if the Ethiopian year is a leap year (Luke / ሉቃስ) with 6 Pagume days.

#### `isGregorianLeapYear(year: number): boolean`
Returns `true` if the Gregorian year is a leap year with 29 February days.

#### `getEthiopianDaysInMonth(year: number, month: number): number`
Returns the exact day count for an Ethiopian month (30 for months 1–12; 5 or 6 for month 13).

#### `getGregorianDaysInMonth(year: number, month: number): number`
Returns the exact day count for a Gregorian month (28, 29, 30, or 31).

---

### Formatting Functions

#### `formatDate(date: CalendarDate, pattern?: string): string`
Formats a calendar date object according to pattern tokens:
- `YYYY`: 4-digit padded year
- `MM`: 2-digit padded month (01–13)
- `M`: Unpadded month (1–13)
- `DD`: 2-digit padded day (01–30)
- `D`: Unpadded day (1–30)

#### `formatEthiopianText(date: CalendarDate, options?: { lang?: 'en' | 'am' }): string`
Formats an Ethiopian date with transliterated English or Ge'ez/Amharic month names.

#### `formatGregorianText(date: CalendarDate): string`
Formats a Gregorian date with standard English month names.

---

### Low-Level JDN Utilities

#### `gregorianToJDN(year: number, month: number, day: number): number`
Calculates the Julian Day Number for a valid Gregorian date.

#### `jdnToGregorian(jdn: number): GregorianDate`
Converts a Julian Day Number to its corresponding Gregorian date.

#### `ethiopianToJDN(year: number, month: number, day: number): number`
Calculates the Julian Day Number for a valid Ethiopian date.

#### `jdnToEthiopian(jdn: number): EthiopianDate`
Converts a Julian Day Number to its corresponding Ethiopian date.

---

## Supported Date Range

- **Ethiopian Calendar**: Year 1 Meskerem 1 through Year 9999 Pagume 6.
  - Year 1 Meskerem 1 corresponds to Julian August 29, 8 CE (proleptic Gregorian August 27, 8 CE).
- **Gregorian Calendar**: Year 8 CE through Year 9999 CE.

---

## Compatibility

- **Node.js**: >= 18.0.0
- **Deno / Bun**: Fully supported
- **Browsers**: All modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- **Module Systems**: ESM (`import`) and CommonJS (`require`)
- **TypeScript**: >= 4.7 (supports both `Node16`/`NodeNext` and `bundler` resolution)

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Clone the repository and install dev dependencies:
   ```bash
   npm install
   ```
2. Run type checking and automated tests:
   ```bash
   npm run test:types
   npm test
   ```
3. Run benchmarks:
   ```bash
   npm run benchmark
   ```
4. Ensure all code edits maintain zero runtime dependencies and 100% test pass rates.

---

## License

MIT © [Henok](LICENSE)
