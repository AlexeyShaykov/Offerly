import 'server-only';

import { db } from '@/shared/lib/db';

import {
  buildFunnel,
  buildWeeklyApplications,
  getWeeklyWindowStart,
  type VacancyStats,
} from '../model/stats';

// Uncached calculation; see get-stats.ts for the cached entry point.
export const loadVacancyStats = async (userId: string, now = new Date()): Promise<VacancyStats> => {
  const [total, rejected, reached, applied] = await Promise.all([
    db.vacancy.count({ where: { userId } }),
    db.vacancy.count({ where: { userId, status: 'REJECTED' } }),
    db.statusChange.findMany({
      where: { vacancy: { userId } },
      select: { vacancyId: true, toStatus: true },
      distinct: ['vacancyId', 'toStatus'],
    }),
    db.vacancy.findMany({
      where: { userId, appliedAt: { gte: getWeeklyWindowStart(now) } },
      select: { appliedAt: true },
    }),
  ]);

  const appliedDates = applied.flatMap(({ appliedAt }) => (appliedAt ? [appliedAt] : []));

  return {
    total,
    rejected,
    funnel: buildFunnel(total, reached),
    weeks: buildWeeklyApplications(appliedDates, now),
  };
};
