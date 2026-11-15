const VacanciesLoading = () => (
  <div className="flex flex-col gap-3 py-6" aria-busy="true" aria-live="polite">
    <span className="sr-only">Loading vacancies…</span>
    {Array.from({ length: 5 }, (_, index) => (
      <div key={index} className="h-24 animate-pulse rounded-lg bg-slate-100" />
    ))}
  </div>
);

export default VacanciesLoading;
