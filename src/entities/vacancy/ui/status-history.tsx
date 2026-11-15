import { formatDate } from '../lib/format';
import type { VacancyDetails } from '../model/types';

import { StatusBadge } from './status-badge';

export const StatusHistory = ({ changes }: { changes: VacancyDetails['statusChanges'] }) => (
  <ol className="flex flex-col gap-2">
    {changes.map((change) => (
      <li key={change.id} className="flex flex-wrap items-center gap-2 text-sm">
        <time dateTime={change.changedAt.toISOString()} className="w-28 text-slate-500">
          {formatDate(change.changedAt)}
        </time>
        {change.fromStatus ? (
          <>
            <StatusBadge status={change.fromStatus} />
            <span aria-hidden="true">→</span>
          </>
        ) : null}
        <StatusBadge status={change.toStatus} />
      </li>
    ))}
  </ol>
);
