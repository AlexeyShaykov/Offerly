import { VacancyStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { canTransition, getAllowedTransitions } from './transitions';

const ALL = Object.values(VacancyStatus);

describe('status transitions', () => {
  it.each([
    ['SAVED', ['APPLIED', 'ARCHIVED']],
    ['APPLIED', ['SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'ARCHIVED']],
    ['SCREENING', ['INTERVIEW', 'OFFER', 'REJECTED', 'ARCHIVED']],
    ['INTERVIEW', ['OFFER', 'REJECTED', 'ARCHIVED']],
    ['OFFER', ['ARCHIVED']],
    ['REJECTED', ['ARCHIVED']],
    ['ARCHIVED', ['SAVED']],
  ] as const)('%s can move only to %j', (from, allowed) => {
    expect([...getAllowedTransitions(from)]).toEqual(allowed);

    ALL.forEach((to) => {
      expect(canTransition(from, to)).toBe((allowed as readonly string[]).includes(to));
    });
  });

  it('never allows a transition to the same status', () => {
    ALL.forEach((status) => expect(canTransition(status, status)).toBe(false));
  });

  it('does not allow moving backwards along the funnel', () => {
    expect(canTransition('INTERVIEW', 'APPLIED')).toBe(false);
    expect(canTransition('APPLIED', 'SAVED')).toBe(false);
    expect(canTransition('OFFER', 'INTERVIEW')).toBe(false);
  });

  it('allows leaving a dead end only through archive and restoring only to SAVED', () => {
    expect(canTransition('REJECTED', 'APPLIED')).toBe(false);
    expect(canTransition('ARCHIVED', 'APPLIED')).toBe(false);
    expect(canTransition('ARCHIVED', 'SAVED')).toBe(true);
  });
});
