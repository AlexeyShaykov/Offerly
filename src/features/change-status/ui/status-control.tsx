'use client';

import type { VacancyStatus } from '@prisma/client';

import { STATUS_LABELS, StatusBadge } from '@/entities/vacancy';

import { useVacancyStatus } from '../model/use-vacancy-status';

type StatusControlProps = { vacancyId: string; initialStatus: VacancyStatus };

export const StatusControl = ({ vacancyId, initialStatus }: StatusControlProps) => {
  const { status, allowedTransitions, changeStatus, isPending, errorMessage } = useVacancyStatus(
    vacancyId,
    initialStatus,
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Status</span>
        <StatusBadge status={status} />
      </div>
      <div role="group" aria-label="Change status" className="flex flex-wrap gap-2">
        {allowedTransitions.map((next) => (
          <button
            key={next}
            type="button"
            disabled={isPending}
            onClick={() => changeStatus(next)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-60"
          >
            Move to {STATUS_LABELS[next]}
          </button>
        ))}
      </div>
      {errorMessage ? (
        <p role="alert" className="text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};
