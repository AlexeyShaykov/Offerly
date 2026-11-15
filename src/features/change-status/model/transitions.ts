import type { VacancyStatus } from '@prisma/client';

// Forward-only along the funnel, so the history stays truthful.
// Any active vacancy can be archived; an archived one can be restored to SAVED.
const TRANSITIONS: Record<VacancyStatus, readonly VacancyStatus[]> = {
  SAVED: ['APPLIED', 'ARCHIVED'],
  APPLIED: ['SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'ARCHIVED'],
  SCREENING: ['INTERVIEW', 'OFFER', 'REJECTED', 'ARCHIVED'],
  INTERVIEW: ['OFFER', 'REJECTED', 'ARCHIVED'],
  OFFER: ['ARCHIVED'],
  REJECTED: ['ARCHIVED'],
  ARCHIVED: ['SAVED'],
};

export const getAllowedTransitions = (from: VacancyStatus): readonly VacancyStatus[] =>
  TRANSITIONS[from];

export const canTransition = (from: VacancyStatus, to: VacancyStatus) =>
  TRANSITIONS[from].includes(to);
