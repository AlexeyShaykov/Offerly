import { formatDate, formatSalary } from '../lib/format';
import { SOURCE_LABELS, WORK_FORMAT_LABELS } from '../model/labels';
import type { VacancyDetails } from '../model/types';

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:gap-4">
    <dt className="w-36 shrink-0 text-sm text-slate-500">{label}</dt>
    <dd>{children}</dd>
  </div>
);

export const VacancyInfo = ({ vacancy }: { vacancy: VacancyDetails }) => (
  <dl className="flex flex-col gap-3">
    <Row label="Work format">{WORK_FORMAT_LABELS[vacancy.workFormat]}</Row>
    <Row label="Source">{SOURCE_LABELS[vacancy.source]}</Row>
    <Row label="Salary">{formatSalary(vacancy.salaryFrom, vacancy.salaryTo) ?? '—'}</Row>
    <Row label="Applied">{vacancy.appliedAt ? formatDate(vacancy.appliedAt) : '—'}</Row>
    <Row label="Link">
      {vacancy.url ? (
        <a
          href={vacancy.url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-blue-700 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          {vacancy.url}
        </a>
      ) : (
        '—'
      )}
    </Row>
  </dl>
);
