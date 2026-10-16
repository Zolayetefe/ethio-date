import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDate,
  formatEthiopianText,
  formatGregorianText,
} from '../dist/index.js';

test('formatDate template patterns', () => {
  const date = { year: 2019, month: 2, day: 6 };

  assert.equal(formatDate(date), '2019-02-06');
  assert.equal(formatDate(date, 'YYYY-MM-DD'), '2019-02-06');
  assert.equal(formatDate(date, 'DD/MM/YYYY'), '06/02/2019');
  assert.equal(formatDate(date, 'MM/DD/YYYY'), '02/06/2019');
  assert.equal(formatDate(date, 'YYYY/MM/DD'), '2019/02/06');
  assert.equal(formatDate(date, 'M/D/YYYY'), '2/6/2019');
  assert.equal(formatDate(date, 'Day D of Month M, YYYY'), 'Day 6 of Month 2, 2019');
});

test('formatDate padding behavior', () => {
  assert.equal(formatDate({ year: 8, month: 1, day: 1 }), '0008-01-01');
  assert.equal(formatDate({ year: 999, month: 9, day: 9 }), '0999-09-09');
  assert.equal(formatDate({ year: 2026, month: 12, day: 31 }), '2026-12-31');
});

test('formatEthiopianText English and Amharic', () => {
  const date = { year: 2016, month: 1, day: 1 };
  assert.equal(formatEthiopianText(date), 'Meskerem 1, 2016');
  assert.equal(formatEthiopianText(date, { lang: 'en' }), 'Meskerem 1, 2016');
  assert.equal(formatEthiopianText(date, { lang: 'am' }), 'መስከረም 1 ቀን 2016 ዓ.ም.');

  const pagume = { year: 2015, month: 13, day: 6 };
  assert.equal(formatEthiopianText(pagume), 'Pagume 6, 2015');
  assert.equal(formatEthiopianText(pagume, { lang: 'am' }), 'ጳጉሜ 6 ቀን 2015 ዓ.ም.');
});

test('formatGregorianText English', () => {
  assert.equal(formatGregorianText({ year: 2023, month: 9, day: 12 }), 'September 12, 2023');
  assert.equal(formatGregorianText({ year: 2024, month: 1, day: 1 }), 'January 1, 2024');
});

test('formatDate error handling on invalid inputs', () => {
  assert.throws(() => formatDate(null), (err) => err instanceof TypeError);
  assert.throws(() => formatDate('2024-01-01'), (err) => err instanceof TypeError);
  assert.throws(() => formatDate({ year: '2024', month: 1, day: 1 }), (err) => err instanceof TypeError);
  assert.throws(() => formatEthiopianText({ year: 2016, month: 14, day: 1 }), (err) => err instanceof RangeError);
});
