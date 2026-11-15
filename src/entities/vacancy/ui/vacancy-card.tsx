import Link from 'next/link';

import { formatDate, formatSalary } from '../lib/format';
import { SOURCE_LABELS, WORK_FORMAT_LABELS } from '../model/labels';
import type { VacancyListItem } from '../model/types';

import { StatusBadge } from './status-badge';

export const VacancyCard = ({ vacancy }: { vacancy: VacancyListItem }) => {
  const salary = formatSalary(vacancy.salaryFrom, vacancy.salaryTo);

  return (
    <article className="relative rounded-lg border border-slate-200 p-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-slate-900 hover:border-slate-400">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold">
            <Link
              href={`/vacancies/${vacancy.id}`}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {vacancy.title}
            </Link>
          </h2>
          <p className="text-sm text-slate-600">{vacancy.company?.name ?? 'No company'}</p>
        </div>
        <StatusBadge status={vacancy.status} />
      </div>
      <p className="mt-3 text-sm text-slate-600">
        {[WORK_FORMAT_LABELS[vacancy.workFormat], SOURCE_LABELS[vacancy.source], salary]
          .filter(Boolean)
          .join(' · ')}
      </p>
      <p className="mt-1 text-xs text-slate-500">Saved {formatDate(vacancy.createdAt)}</p>
    </article>
  );
};
