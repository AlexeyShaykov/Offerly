const VacancyLoading = () => (
  <div className="flex flex-col gap-4 py-6" aria-busy="true" aria-live="polite">
    <span className="sr-only">Loading…</span>
    <div className="h-8 w-2/3 animate-pulse rounded bg-slate-100" />
    <div className="h-40 animate-pulse rounded-lg bg-slate-100" />
  </div>
);

export default VacancyLoading;
