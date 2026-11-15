import type { VacancyStatus } from '@prisma/client';

export const FUNNEL_STAGES = ['SAVED', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER'] as const;

export type FunnelStage = (typeof FUNNEL_STAGES)[number];
export type FunnelStep = { status: FunnelStage; count: number; conversion: number | null };
// weekStart is an ISO date (YYYY-MM-DD) of the week's Monday in UTC; plain data keeps it cache-safe.
export type WeekBucket = { weekStart: string; count: number };
export type VacancyStats = {
  total: number;
  rejected: number;
  funnel: FunnelStep[];
  weeks: WeekBucket[];
};

export const WEEKS_COUNT = 12;

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const stageRank = new Map(
  FUNNEL_STAGES.map((stage, index): [VacancyStatus, number] => [stage, index]),
);

// A stage counts as reached if the vacancy was in it or in any later stage,
// because transitions may skip steps (APPLIED → INTERVIEW).
export const buildFunnel = (
  total: number,
  reached: { vacancyId: string; toStatus: VacancyStatus }[],
): FunnelStep[] => {
  const furthestRank = new Map<string, number>();

  for (const { vacancyId, toStatus } of reached) {
    const rank = stageRank.get(toStatus);
    if (rank === undefined) continue;
    furthestRank.set(vacancyId, Math.max(furthestRank.get(vacancyId) ?? 0, rank));
  }

  const ranks = [...furthestRank.values()];
  const counts = FUNNEL_STAGES.map((_, index) =>
    index === 0 ? total : ranks.filter((rank) => rank >= index).length,
  );

  return FUNNEL_STAGES.map((status, index) => {
    const count = counts[index] ?? 0;
    const previous = counts[index - 1];
    const conversion = previous ? Math.round((count / previous) * 100) : null;
    return { status, count, conversion };
  });
};

const startOfUtcWeek = (date: Date) => {
  const daysFromMonday = (date.getUTCDay() + 6) % 7;
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - daysFromMonday);
};

export const getWeeklyWindowStart = (now: Date, weeks = WEEKS_COUNT) =>
  new Date(startOfUtcWeek(now) - (weeks - 1) * WEEK_MS);

// Weeks start on Monday (UTC); weeks without applications are kept with a zero count.
export const buildWeeklyApplications = (
  appliedDates: Date[],
  now: Date,
  weeks = WEEKS_COUNT,
): WeekBucket[] => {
  const firstWeek = getWeeklyWindowStart(now, weeks).getTime();
  const counts = Array.from({ length: weeks }, () => 0);

  for (const date of appliedDates) {
    const index = Math.floor((startOfUtcWeek(date) - firstWeek) / WEEK_MS);
    if (index >= 0 && index < weeks) {
      counts[index] = (counts[index] ?? 0) + 1;
    }
  }

  return counts.map((count, index) => ({
    weekStart: new Date(firstWeek + index * WEEK_MS).toISOString().slice(0, 10),
    count,
  }));
};
