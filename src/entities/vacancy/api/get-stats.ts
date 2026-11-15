import 'server-only';

import { revalidateTag, unstable_cache } from 'next/cache';

import { loadVacancyStats } from './load-stats';

const STATS_REVALIDATE_SECONDS = 3600;

const statsTag = (userId: string) => `stats:${userId}`;

// The page reads the session, so it is dynamic and `revalidate` on the page would do nothing.
// Instead the calculation is cached per user for an hour and dropped on demand.
export const getVacancyStats = (userId: string) =>
  unstable_cache(() => loadVacancyStats(userId), ['vacancy-stats', userId], {
    revalidate: STATS_REVALIDATE_SECONDS,
    tags: [statsTag(userId)],
  })();

export const revalidateVacancyStats = (userId: string) => revalidateTag(statsTag(userId));
