import { describe, expect, it } from 'vitest';

import { vacancyFormSchema, type VacancyFormInput } from './schema';

const valid: VacancyFormInput = {
  title: 'Frontend Developer',
  companyName: 'Acme',
  url: '',
  source: 'HH',
  workFormat: 'REMOTE',
  salaryFrom: '',
  salaryTo: '',
  description: '',
};

const errorsOf = (input: VacancyFormInput) => {
  const result = vacancyFormSchema.safeParse(input);
  return result.success
    ? {}
    : Object.fromEntries(result.error.issues.map((i) => [i.path[0], i.message]));
};

describe('vacancyFormSchema', () => {
  it('trims text and turns empty optional fields into undefined', () => {
    const result = vacancyFormSchema.parse({ ...valid, title: '  Dev  ', companyName: '   ' });

    expect(result.title).toBe('Dev');
    expect(result.companyName).toBeUndefined();
    expect(result.url).toBeUndefined();
    expect(result.description).toBeUndefined();
  });

  it('requires a non-blank title', () => {
    expect(errorsOf({ ...valid, title: '   ' }).title).toBe('Title is required');
  });

  it('rejects a title longer than 200 characters', () => {
    expect(errorsOf({ ...valid, title: 'a'.repeat(201) }).title).toMatch(/at most 200/);
  });

  describe('url', () => {
    it.each(['https://example.com/job', 'http://example.com'])('accepts %s', (url) => {
      expect(errorsOf({ ...valid, url }).url).toBeUndefined();
    });

    it.each(['javascript:alert(1)', 'ftp://example.com', 'not a url', 'example.com'])(
      'rejects %s',
      (url) => {
        expect(errorsOf({ ...valid, url }).url).toBe('Enter a valid http(s) link');
      },
    );
  });

  describe('salary', () => {
    it('parses whole numbers and keeps empty as undefined', () => {
      const result = vacancyFormSchema.parse({ ...valid, salaryFrom: ' 150000 ', salaryTo: '' });

      expect(result.salaryFrom).toBe(150000);
      expect(result.salaryTo).toBeUndefined();
    });

    it.each(['abc', '1.5', '1e3x'])('rejects "%s" as not a whole number', (salaryFrom) => {
      expect(errorsOf({ ...valid, salaryFrom }).salaryFrom).toBe('Enter a whole number');
    });

    it('rejects negative and too large values', () => {
      expect(errorsOf({ ...valid, salaryFrom: '-1' }).salaryFrom).toBe('Must not be negative');
      expect(errorsOf({ ...valid, salaryTo: '999999999' }).salaryTo).toBe(
        'That number is too large',
      );
    });

    it('puts the range error on salaryTo when from is greater than to', () => {
      expect(errorsOf({ ...valid, salaryFrom: '500', salaryTo: '100' }).salaryTo).toBe(
        'Must not be less than the lower bound',
      );
    });

    it('allows equal bounds', () => {
      expect(errorsOf({ ...valid, salaryFrom: '100', salaryTo: '100' })).toEqual({});
    });
  });

  it('rejects unknown source and work format', () => {
    const input = { ...valid, source: 'NOPE', workFormat: 'MOON' };
    // @ts-expect-error: deliberately invalid enum values
    const errors = errorsOf(input);

    expect(errors.source).toBeDefined();
    expect(errors.workFormat).toBeDefined();
  });
});
