import Link from 'next/link';
import { redirect } from 'next/navigation';

import { FunnelChart, StatsSummary, WeeklyChart } from '@/entities/vacancy';
import { getVacancyStats } from '@/entities/vacancy/server';
import { getSessionUserId } from '@/shared/lib/auth/get-session-user-id';

const StatsPage = async () => {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const stats = await getVacancyStats(userId);

  if (stats.total === 0) {
    return (
      <main className="flex flex-col items-start gap-3 py-6">
        <h1 className="text-2xl font-semibold">Statistics</h1>
        <p className="text-slate-600">There is nothing to show yet.</p>
        <Link href="/vacancies/new" className="text-slate-900 underline">
          Add your first vacancy
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-8 py-6">
      <div>
        <h1 className="text-2xl font-semibold">Statistics</h1>
        <p className="text-sm text-slate-500">
          Refreshed at most once an hour and right after a status change.
        </p>
      </div>
      <StatsSummary stats={stats} />
      <section aria-labelledby="funnel-heading" className="flex flex-col gap-4">
        <h2 id="funnel-heading" className="text-lg font-semibold">
          Application funnel
        </h2>
        <FunnelChart steps={stats.funnel} />
        <p className="text-sm text-slate-600">Rejected: {stats.rejected}</p>
      </section>
      <section aria-labelledby="weekly-heading" className="flex flex-col gap-4">
        <h2 id="weekly-heading" className="text-lg font-semibold">
          Applications per week
        </h2>
        <WeeklyChart weeks={stats.weeks} />
      </section>
    </main>
  );
};

export default StatsPage;
