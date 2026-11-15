import type { VacancyStats } from '../model/stats';

const Card = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg border border-slate-200 p-4">
    <dt className="text-sm text-slate-500">{label}</dt>
    <dd className="mt-1 text-2xl font-semibold">{value}</dd>
  </div>
);

export const StatsSummary = ({ stats }: { stats: VacancyStats }) => {
  const countOf = (status: string) =>
    stats.funnel.find((step) => step.status === status)?.count ?? 0;

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Card label="Vacancies" value={stats.total} />
      <Card label="Applied" value={countOf('APPLIED')} />
      <Card label="Interviews" value={countOf('INTERVIEW')} />
      <Card label="Offers" value={countOf('OFFER')} />
    </dl>
  );
};
