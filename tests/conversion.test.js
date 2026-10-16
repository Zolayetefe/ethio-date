import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toEthiopian,
  toGregorian,
  formatDate,
} from '../dist/index.js';

test('Basic Gregorian to Ethiopian conversions with known fixtures', async (t) => {
  const fixtures = [
    // [Gregorian Y, M, D, Ethiopian Y, M, D, description]
    [2026, 10, 16, 2019, 2, 6, 'Regular modern date'],
    [2024, 1, 1, 2016, 4, 22, 'Gregorian New Year 2024'],
    [2024, 6, 15, 2016, 10, 8, 'Mid-year 2024'],
    [2024, 12, 31, 2017, 4, 22, 'Gregorian New Year Eve 2024'],
    [2020, 1, 1, 2012, 4, 22, 'Gregorian New Year 2020'],
    [2000, 1, 1, 1992, 4, 22, 'Millennium Jan 1, 2000'],
    [1991, 5, 28, 1983, 9, 20, 'Ginbot 20 (historical date)'],
    [1896, 3, 1, 1888, 6, 23, 'Battle of Adwa (historical date)'],
  ];

  for (const [gy, gm, gd, ey, em, ed, desc] of fixtures) {
    await t.test(`G -> E: ${desc} (${gy}-${gm}-${gd} -> ${ey}-${em}-${ed})`, () => {
      // 1. Positional numbers
      const resNum = toEthiopian(gy, gm, gd);
      assert.deepEqual(resNum, { year: ey, month: em, day: ed });

      // 2. Object input
      const resObj = toEthiopian({ year: gy, month: gm, day: gd });
      assert.deepEqual(resObj, { year: ey, month: em, day: ed });

      // 3. String input "YYYY-MM-DD"
      const strInput = `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
      const resStr = toEthiopian(strInput);
      assert.deepEqual(resStr, { year: ey, month: em, day: ed });

      // 4. Tuple input
      const resTuple = toEthiopian([gy, gm, gd]);
      assert.deepEqual(resTuple, { year: ey, month: em, day: ed });
    });
  }
});

test('Basic Ethiopian to Gregorian conversions with known fixtures', async (t) => {
  const fixtures = [
    [2019, 2, 6, 2026, 10, 16, 'Regular modern date'],
    [2016, 4, 22, 2024, 1, 1, 'Tahsas 22, 2016'],
    [2016, 10, 8, 2024, 6, 15, 'Sene 8, 2016'],
    [2017, 4, 22, 2024, 12, 31, 'Tahsas 22, 2017'],
    [1992, 4, 22, 2000, 1, 1, 'Tahsas 22, 1992'],
    [1983, 9, 20, 1991, 5, 28, 'Ginbot 20, 1983'],
    [1888, 6, 23, 1896, 3, 1, 'Yekatit 23, 1888 (Battle of Adwa)'],
  ];

  for (const [ey, em, ed, gy, gm, gd, desc] of fixtures) {
    await t.test(`E -> G: ${desc} (${ey}-${em}-${ed} -> ${gy}-${gm}-${gd})`, () => {
      const resNum = toGregorian(ey, em, ed);
      assert.deepEqual(resNum, { year: gy, month: gm, day: gd });

      const resObj = toGregorian({ year: ey, month: em, day: ed });
      assert.deepEqual(resObj, { year: gy, month: gm, day: gd });

      const strInput = `${ey}-${String(em).padStart(2, '0')}-${String(ed).padStart(2, '0')}`;
      const resStr = toGregorian(strInput);
      assert.deepEqual(resStr, { year: gy, month: gm, day: gd });

      const resTuple = toGregorian([ey, em, ed]);
      assert.deepEqual(resTuple, { year: gy, month: gm, day: gd });
    });
  }
});

test('Bidirectional round-trip for sample dates', () => {
  const sampleDates = [
    { year: 2024, month: 1, day: 1 },
    { year: 2024, month: 2, day: 29 },
    { year: 2024, month: 9, day: 11 },
    { year: 2024, month: 9, day: 12 },
    { year: 2023, month: 9, day: 11 },
    { year: 2023, month: 9, day: 12 },
    { year: 2026, month: 10, day: 16 },
    { year: 1999, month: 12, day: 31 },
    { year: 1900, month: 3, day: 1 },
  ];

  for (const gDate of sampleDates) {
    const eth = toEthiopian(gDate);
    const backToGreg = toGregorian(eth);
    assert.deepEqual(backToGreg, gDate, `Round-trip failed for ${formatDate(gDate)}`);
  }
});
