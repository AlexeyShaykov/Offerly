import { describe, expect, it } from 'vitest';

import { formatDate, formatSalary } from './format';

// Intl uses non-breaking spaces as thousand separators, so compare with normalized spaces.
const normalize = (value: string | null) => value?.replace(/\s/g, ' ');

describe('formatSalary', () => {
  it('formats a range', () => {
    expect(normalize(formatSalary(250000, 350000))).toBe('250 000 – 350 000 ₽');
  });

  it('formats an open lower or upper bound', () => {
    expect(normalize(formatSalary(190000, null))).toBe('from 190 000 ₽');
    expect(normalize(formatSalary(null, 300000))).toBe('up to 300 000 ₽');
  });

  it('returns null when there is no salary', () => {
    expect(formatSalary(null, null)).toBeNull();
  });

  it('treats zero as a real value', () => {
    expect(normalize(formatSalary(0, null))).toBe('from 0 ₽');
  });
});

describe('formatDate', () => {
  it('formats in UTC regardless of the local timezone', () => {
    expect(formatDate(new Date('2026-11-15T23:30:00Z'))).toBe('15 Nov 2026');
  });
});
