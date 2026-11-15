import Link from 'next/link';

import {
  STATUS_LABELS,
  WORK_FORMAT_LABELS,
  type VacancyFilters as VacancyFiltersValue,
} from '@/entities/vacancy';

const selectClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900';

// A plain GET form: filters live in the URL and work without client JS.
export const VacancyFilters = ({ filters }: { filters: VacancyFiltersValue }) => (
  <form
    // Uncontrolled selects keep their DOM state across navigations; the key remounts the form when filters change (e.g. Reset).
    key={`${filters.status ?? ''}|${filters.format ?? ''}`}
    method="get"
    action="/vacancies"
    className="flex flex-col gap-3 sm:flex-row sm:items-end"
  >
    <div className="flex-1">
      <label htmlFor="status" className="mb-1 block text-sm font-medium">
        Status
      </label>
      <select id="status" name="status" defaultValue={filters.status ?? ''} className={selectClass}>
        <option value="">All statuses</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
    <div className="flex-1">
      <label htmlFor="format" className="mb-1 block text-sm font-medium">
        Work format
      </label>
      <select id="format" name="format" defaultValue={filters.format ?? ''} className={selectClass}>
        <option value="">All formats</option>
        {Object.entries(WORK_FORMAT_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
    <button
      type="submit"
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
    >
      Apply
    </button>
    {filters.status || filters.format ? (
      <Link
        href="/vacancies"
        className="rounded-md px-3 py-2 text-center text-sm text-slate-600 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Reset
      </Link>
    ) : null}
  </form>
);
