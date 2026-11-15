'use client';

type VacanciesErrorProps = { reset: () => void };

const VacanciesError = ({ reset }: VacanciesErrorProps) => (
  <div role="alert" className="flex flex-col items-start gap-3 py-6">
    <h1 className="text-xl font-semibold">Something went wrong</h1>
    <p className="text-slate-600">We could not load your vacancies.</p>
    <button
      type="button"
      onClick={reset}
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
    >
      Try again
    </button>
  </div>
);

export default VacanciesError;
