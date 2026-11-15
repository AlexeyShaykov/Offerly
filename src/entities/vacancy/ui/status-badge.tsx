import type { VacancyStatus } from '@prisma/client';

import { STATUS_LABELS } from '../model/labels';

const STATUS_STYLES: Record<VacancyStatus, string> = {
  SAVED: 'bg-slate-100 text-slate-700',
  APPLIED: 'bg-blue-100 text-blue-800',
  SCREENING: 'bg-amber-100 text-amber-800',
  INTERVIEW: 'bg-violet-100 text-violet-800',
  OFFER: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  ARCHIVED: 'bg-slate-200 text-slate-600',
};

export const StatusBadge = ({ status }: { status: VacancyStatus }) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
  >
    {STATUS_LABELS[status]}
  </span>
);
