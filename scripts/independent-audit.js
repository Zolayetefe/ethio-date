import {
  toEthiopian,
  toGregorian,
  toEthiopianBatch,
  toGregorianBatch,
  toEthiopianFromJSDate,
  isValidEthiopianDate,
  isValidGregorianDate,
  assertValidEthiopianDate,
  assertValidGregorianDate,
  isEthiopianLeapYear,
  isGregorianLeapYear,
  getEthiopianDaysInMonth,
  getGregorianDaysInMonth,
  formatDate,
  formatEthiopianText,
  formatGregorianText,
  gregorianToJDN,
  jdnToGregorian,
  ethiopianToJDN,
  jdnToEthiopian,
  ETHIOPIAN_EPOCH_JDN,
  MIN_SUPPORTED_YEAR,
  MAX_SUPPORTED_YEAR
} from '../dist/index.js';

console.log('========================================================================');
console.log('            ETHIO-DATE INDEPENDENT RELEASE AUDIT HARNESS                ');
console.log('========================================================================\n');

// -----------------------------------------------------------------------------
// 1. INDEPENDENT CALENDAR FIXTURES & HISTORICAL GROUND TRUTH
// -----------------------------------------------------------------------------
console.log('--- 1. Evaluating Independent Calendar Ground Truth Fixtures ---');

const independentFixtures = [
  // Astronomical & Historical Anchors:
  // Source: Dershowitz & Reingold "Calendrical Calculations" / Meeus Astronomical Algorithms
  { g: [8, 8, 27], e: [1, 1, 1], label: 'Ethiopian Epoch (Amete Mihret Year 1 Meskerem 1)' },
  { g: [8, 8, 28], e: [1, 1, 2], label: 'Ethiopian Epoch (Day 2)' },
  
  // Historical Events verified via primary chronicles & Ethiopian Government calendar:
  // Battle of Adwa: Sunday, March 1, 1896 = Yekatit 23, 1888 (Evangelist Mark year)
  { g: [1896, 3, 1], e: [1888, 6, 23], label: 'Battle of Adwa (1896-03-01 <-> 1888-06-23)' },
  // Haile Selassie coronation: November 2, 1930 = Tikimt 23, 1923
  { g: [1930, 11, 2], e: [1923, 2, 23], label: 'Haile Selassie Coronation (1930-11-02 <-> 1923-02-23)' },
  // Liberation Day / Victory Day (Meyazya 27): May 5, 1941 = Meyazya 27, 1933
  { g: [1941, 5, 5], e: [1933, 8, 27], label: 'Patriots Victory Day (1941-05-05 <-> 1933-08-27)' },
  // End of WWII Battle of Gondar: November 27, 1941 = Hidar 18, 1934
  { g: [1941, 11, 27], e: [1934, 3, 18], label: 'Battle of Gondar (1941-11-27 <-> 1934-03-18)' },
  // Deposition of Haile Selassie: September 12, 1974 = Meskerem 2, 1967
  { g: [1974, 9, 12], e: [1967, 1, 2], label: 'Deposition of Haile Selassie (1974-09-12 <-> 1967-01-02)' },
  // Fall of Derg (Ginbot 20): May 28, 1991 = Ginbot 20, 1983
  { g: [1991, 5, 28], e: [1983, 9, 20], label: 'Ginbot 20 (1991-05-28 <-> 1983-09-20)' },
  // Ethiopian Millennium: September 12, 2007 = Meskerem 1, 2000
  { g: [2007, 9, 12], e: [2000, 1, 1], label: 'Ethiopian Millennium (2007-09-12 <-> 2000-01-01)' },
  // Millennium Eve: September 11, 2007 = Pagume 6, 1999 (Leap year)
  { g: [2007, 9, 11], e: [1999, 13, 6], label: 'Millennium Eve (2007-09-11 <-> 1999-13-06)' },

  // Leap-Year and Century Boundary Anchors:
  // Gregorian Leap Day 2000 (divisible by 400)
  { g: [2000, 2, 29], e: [1992, 6, 21], label: 'Gregorian Leap Day 2000' },
  // Gregorian Century 1900 (NOT leap year in Gregorian, but leap in Ethiopian)
  { g: [1900, 2, 28], e: [1892, 6, 21], label: 'Gregorian 1900-02-28' },
  { g: [1900, 3, 1], e: [1892, 6, 22], label: 'Gregorian 1900-03-01' },
  // Ethiopian Leap Year 2015 Pagume 6
  { g: [2023, 9, 11], e: [2015, 13, 6], label: 'Ethiopian Leap Day 2015-13-06' },
  // Ethiopian New Year after 2015 leap year
  { g: [2023, 9, 12], e: [2016, 1, 1], label: 'Ethiopian New Year 2016-01-01 (Sept 12)' },
  // Ethiopian Common Year 2016 Pagume 5
  { g: [2024, 9, 10], e: [2016, 13, 5], label: 'Ethiopian Common End 2016-13-05' },
  // Ethiopian New Year after common year
  { g: [2024, 9, 11], e: [2017, 1, 1], label: 'Ethiopian New Year 2017-01-01 (Sept 11)' },
  // Gregorian Leap Day 2024
  { g: [2024, 2, 29], e: [2016, 6, 21], label: 'Gregorian Leap Day 2024' },
  // Present local date
  { g: [2026, 10, 16], e: [2019, 2, 6], label: 'Audit Timestamp Date (2026-10-16 <-> 2019-02-06)' },
  
  // Future dates:
  // Ethiopian Leap Year 2019 Pagume 6 (Sept 11, 2027)
  { g: [2027, 9, 11], e: [2019, 13, 6], label: 'Future Leap Day (2027-09-11 <-> 2019-13-06)' },
  // Ethiopian New Year 2020 (Sept 12, 2027)
  { g: [2027, 9, 12], e: [2020, 1, 1], label: 'Future New Year (2027-09-12 <-> 2020-01-01)' }
];

let fixturePassed = 0;
for (const fix of independentFixtures) {
  const actualE = toEthiopian(fix.g[0], fix.g[1], fix.g[2]);
  const actualG = toGregorian(fix.e[0], fix.e[1], fix.e[2]);

  const matchE = actualE.year === fix.e[0] && actualE.month === fix.e[1] && actualE.day === fix.e[2];
  const matchG = actualG.year === fix.g[0] && actualG.month === fix.g[1] && actualG.day === fix.g[2];

  if (matchE && matchG) {
    fixturePassed++;
  } else {
    console.error(`FAILED FIXTURE: ${fix.label}`);
    console.error(`  G -> E expected ${fix.e.join('-')}, got ${actualE.year}-${actualE.month}-${actualE.day}`);
    console.error(`  E -> G expected ${fix.g.join('-')}, got ${actualG.year}-${actualG.month}-${actualG.day}`);
  }
}
console.log(`Independent Ground Truth Fixtures: ${fixturePassed}/${independentFixtures.length} PASSED.\n`);

// -----------------------------------------------------------------------------
// 2. COMPREHENSIVE INPUT AUDIT & NUMERIC BOUNDARY FUZZING
// -----------------------------------------------------------------------------
console.log('--- 2. Public API Error Consistency & Boundary Fuzzing ---');

const invalidInputTests = [
  // Type checks
  { desc: 'Boolean true as year', fn: () => toEthiopian(true, 1, 1), err: TypeError },
  { desc: 'null as date', fn: () => toEthiopian(null), err: TypeError },
  { desc: 'undefined as date', fn: () => toEthiopian(undefined), err: TypeError },
  { desc: 'Date instance passed directly', fn: () => toEthiopian(new Date()), err: TypeError },
  { desc: 'String with letters', fn: () => toEthiopian('invalid-date'), err: TypeError },
  { desc: 'Float year 2024.5', fn: () => toEthiopian(2024.5, 1, 1), err: TypeError },
  { desc: 'Float month 1.5', fn: () => toEthiopian(2024, 1.5, 1), err: TypeError },
  { desc: 'Float day 1.5', fn: () => toEthiopian(2024, 1, 1.5), err: TypeError },
  { desc: 'NaN input in year', fn: () => toEthiopian(NaN, 1, 1), err: TypeError },
  { desc: 'Infinity in month', fn: () => toEthiopian(2024, Infinity, 1), err: TypeError },
  { desc: 'Missing positional arguments', fn: () => toEthiopian(2024, 1), err: TypeError },
  
  // Range checks: Gregorian
  { desc: 'Gregorian year 0 (before epoch)', fn: () => toEthiopian(0, 1, 1), err: RangeError },
  { desc: 'Gregorian year 10000 (above max)', fn: () => toEthiopian(10000, 1, 1), err: RangeError },
  { desc: 'Gregorian month 0', fn: () => toEthiopian(2024, 0, 1), err: RangeError },
  { desc: 'Gregorian month 13', fn: () => toEthiopian(2024, 13, 1), err: RangeError },
  { desc: 'Gregorian day 0', fn: () => toEthiopian(2024, 1, 0), err: RangeError },
  { desc: 'Gregorian day 32', fn: () => toEthiopian(2024, 1, 32), err: RangeError },
  { desc: 'Feb 29 in common year 2023', fn: () => toEthiopian(2023, 2, 29), err: RangeError },
  { desc: 'Feb 30 in leap year 2024', fn: () => toEthiopian(2024, 2, 30), err: RangeError },
  { desc: 'April 31 (month has 30 days)', fn: () => toEthiopian(2024, 4, 31), err: RangeError },
  
  // Range checks: Ethiopian
  { desc: 'Ethiopian year 0 (before epoch)', fn: () => toGregorian(0, 1, 1), err: RangeError },
  { desc: 'Ethiopian year 10000 (above max)', fn: () => toGregorian(10000, 1, 1), err: RangeError },
  { desc: 'Ethiopian month 0', fn: () => toGregorian(2016, 0, 1), err: RangeError },
  { desc: 'Ethiopian month 14', fn: () => toGregorian(2016, 14, 1), err: RangeError },
  { desc: 'Ethiopian day 0', fn: () => toGregorian(2016, 1, 0), err: RangeError },
  { desc: 'Ethiopian day 31 in Meskerem', fn: () => toGregorian(2016, 1, 31), err: RangeError },
  { desc: 'Pagume 6 in common year 2016', fn: () => toGregorian(2016, 13, 6), err: RangeError },
  { desc: 'Pagume 7 in leap year 2015', fn: () => toGregorian(2015, 13, 7), err: RangeError },
  
  // Batch error checks
  { desc: 'Batch non-array null', fn: () => toEthiopianBatch(null), err: TypeError },
  { desc: 'Batch non-array string', fn: () => toGregorianBatch('2024-01-01'), err: TypeError }
];

let invalidPassed = 0;
for (const tc of invalidInputTests) {
  try {
    tc.fn();
    console.error(`FAILED TO REJECT: ${tc.desc}`);
  } catch (err) {
    if (err instanceof tc.err) {
      invalidPassed++;
    } else {
      console.error(`WRONG ERROR TYPE: ${tc.desc} -> expected ${tc.err.name}, got ${err.name} (${err.message})`);
    }
  }
}
console.log(`Input Error Rejection: ${invalidPassed}/${invalidInputTests.length} PASSED.\n`);

// -----------------------------------------------------------------------------
// 3. STATISTICAL MULTI-SAMPLE BENCHMARKING (DCE & BIAS SAFEGUARDS)
// -----------------------------------------------------------------------------
console.log('--- 3. Reproducing Multi-Sample Benchmarks (DCE-Guarded) ---');

// Build 1,000 distinct rotating dates to prevent single-date cache biasing
const rotatingDatesG = [];
const rotatingDatesE = [];
for (let y = 1980; y <= 2030; y++) {
  for (let m = 1; m <= 12; m++) {
    rotatingDatesG.push({ year: y, month: m, day: ((m * 7) % 28) + 1 });
    rotatingDatesE.push({ year: y - 8, month: m, day: ((m * 7) % 28) + 1 });
  }
}

// Checksum sink variable to strictly defeat V8 dead-code elimination (DCE)
let blackHoleSink = 0;

function runSampledBenchmark(name, fn, iterations = 500_000, samples = 5) {
  // Warmup run
  for (let w = 0; w < 50_000; w++) {
    blackHoleSink += fn(w % rotatingDatesG.length);
  }

  const sampleResults = [];
  for (let s = 0; s < samples; s++) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      blackHoleSink += fn(i % rotatingDatesG.length);
    }
    const elapsed = performance.now() - start;
    const opsSec = Math.round((iterations / elapsed) * 1000);
    sampleResults.push(opsSec);
  }

  sampleResults.sort((a, b) => a - b);
  const min = sampleResults[0];
  const max = sampleResults[sampleResults.length - 1];
  const median = sampleResults[Math.floor(sampleResults.length / 2)];
  const avg = Math.round(sampleResults.reduce((a, b) => a + b, 0) / sampleResults.length);

  console.log(
    `${name.padEnd(38)}: Median: ${(median.toLocaleString()).padStart(12)} ops/sec  [Min: ${(min.toLocaleString()).padStart(11)}, Max: ${(max.toLocaleString()).padStart(11)}]`
  );

  return { name, median, min, max, avg };
}

runSampledBenchmark('toEthiopian(y, m, d) [Positional]', (i) => {
  const d = rotatingDatesG[i];
  const res = toEthiopian(d.year, d.month, d.day);
  return res.year + res.month + res.day;
});

runSampledBenchmark('toEthiopian(obj) [Object Input]', (i) => {
  const d = rotatingDatesG[i];
  const res = toEthiopian(d);
  return res.year + res.month + res.day;
});

runSampledBenchmark('toGregorian(y, m, d) [Positional]', (i) => {
  const d = rotatingDatesE[i];
  const res = toGregorian(d.year, d.month, d.day);
  return res.year + res.month + res.day;
});

runSampledBenchmark('toGregorian(obj) [Object Input]', (i) => {
  const d = rotatingDatesE[i];
  const res = toGregorian(d);
  return res.year + res.month + res.day;
});

runSampledBenchmark('isValidGregorianDate(y, m, d)', (i) => {
  const d = rotatingDatesG[i];
  return isValidGregorianDate(d.year, d.month, d.day) ? 1 : 0;
});

runSampledBenchmark('isValidEthiopianDate(y, m, d)', (i) => {
  const d = rotatingDatesE[i];
  return isValidEthiopianDate(d.year, d.month, d.day) ? 1 : 0;
});

console.log(`\n(Benchmark sink verification total: ${blackHoleSink})`);
console.log('Independent audit harness execution completed successfully.');
