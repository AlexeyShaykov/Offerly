import { describe, expect, it } from 'vitest';

import { buildVacanciesHref, parseVacancyFilters } from './filters';

describe('parseVacancyFilters', () => {
  it('returns defaults for an empty query', () => {
    expect(parseVacancyFilters({})).toEqual({ page: 1 });
  });

  it('parses valid values', () => {
    expect(parseVacancyFilters({ status: 'OFFER', format: 'REMOTE', page: '2' })).toEqual({
      status: 'OFFER',
      format: 'REMOTE',
      page: 2,
    });
  });

  it.each([
    [{ status: 'bogus' }],
    [{ status: '' }],
    [{ status: ['OFFER', 'SAVED'] }],
    [{ format: 'moon' }],
  ])('falls back to "no filter" for %j', (query) => {
    const filters = parseVacancyFilters(query);

    expect(filters.status).toBeUndefined();
    expect(filters.format).toBeUndefined();
  });

  it.each(['-3', '0', 'abc', '1.5', ''])('falls back to page 1 for page "%s"', (page) => {
    expect(parseVacancyFilters({ page }).page).toBe(1);
  });
});

describe('buildVacanciesHref', () => {
  it('omits empty filters and the first page', () => {
    expect(buildVacanciesHref({ page: 1 }, 1)).toBe('/vacancies');
  });

  it('keeps filters and adds the page', () => {
    expect(buildVacanciesHref({ status: 'OFFER', format: 'REMOTE', page: 1 }, 3)).toBe(
      '/vacancies?status=OFFER&format=REMOTE&page=3',
    );
  });
});
