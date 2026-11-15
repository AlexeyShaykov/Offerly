import { describe, expect, it } from 'vitest';

import { buildFunnel, buildWeeklyApplications } from './stats';

describe('buildFunnel', () => {
  const reached = [
    { vacancyId: 'a', toStatus: 'SAVED' },
    { vacancyId: 'a', toStatus: 'APPLIED' },
    { vacancyId: 'a', toStatus: 'INTERVIEW' }, // skipped SCREENING
    { vacancyId: 'a', toStatus: 'REJECTED' },
    { vacancyId: 'b', toStatus: 'SAVED' },
    { vacancyId: 'b', toStatus: 'APPLIED' },
    { vacancyId: 'c', toStatus: 'APPLIED' },
    { vacancyId: 'c', toStatus: 'OFFER' },
    { vacancyId: 'c', toStatus: 'ARCHIVED' },
    { vacancyId: 'd', toStatus: 'SAVED' },
  ] as const;

  it('counts a stage as reached when the vacancy was in it or in a later one', () => {
    const funnel = buildFunnel(4, [...reached]);

    expect(funnel.map(({ status, count }) => [status, count])).toEqual([
      ['SAVED', 4],
      ['APPLIED', 3],
      ['SCREENING', 2],
      ['INTERVIEW', 2],
      ['OFFER', 1],
    ]);
  });

  it('calculates conversion relative to the previous step', () => {
    const funnel = buildFunnel(4, [...reached]);

    expect(funnel.map((step) => step.conversion)).toEqual([null, 75, 67, 100, 50]);
  });

  it('ignores REJECTED and ARCHIVED when ranking stages', () => {
    const funnel = buildFunnel(1, [
      { vacancyId: 'a', toStatus: 'SAVED' },
      { vacancyId: 'a', toStatus: 'ARCHIVED' },
    ]);

    expect(funnel.map((step) => step.count)).toEqual([1, 0, 0, 0, 0]);
  });

  it('returns zeros and no conversion for empty data without dividing by zero', () => {
    const funnel = buildFunnel(0, []);

    expect(funnel.map((step) => step.count)).toEqual([0, 0, 0, 0, 0]);
    expect(funnel.map((step) => step.conversion)).toEqual([null, null, null, null, null]);
  });
});

describe('buildWeeklyApplications', () => {
  // Wednesday: the current week starts on Monday 2026-11-16 (UTC).
  const now = new Date('2026-11-18T12:00:00Z');

  it('returns the requested number of weeks, oldest first, starting on Monday', () => {
    const weeks = buildWeeklyApplications([], now, 3);

    expect(weeks.map((week) => week.weekStart)).toEqual(['2026-11-02', '2026-11-09', '2026-11-16']);
    expect(weeks.every((week) => week.count === 0)).toBe(true);
  });

  it('puts Sunday 23:59 and Monday 00:00 into different weeks', () => {
    const weeks = buildWeeklyApplications(
      [new Date('2026-11-15T23:59:59Z'), new Date('2026-11-16T00:00:00Z')],
      now,
      3,
    );

    expect(weeks.map((week) => week.count)).toEqual([0, 1, 1]);
  });

  it('drops dates outside the window', () => {
    const weeks = buildWeeklyApplications(
      [new Date('2020-01-01T00:00:00Z'), new Date('2027-01-01T00:00:00Z')],
      now,
      3,
    );

    expect(weeks.reduce((sum, week) => sum + week.count, 0)).toBe(0);
  });

  it('defaults to 12 weeks', () => {
    expect(buildWeeklyApplications([], now)).toHaveLength(12);
  });
});
