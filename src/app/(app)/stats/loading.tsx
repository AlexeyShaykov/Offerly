const StatsLoading = () => (
  <div className="flex flex-col gap-4 py-6" aria-busy="true" aria-live="polite">
    <span className="sr-only">Loading statistics…</span>
    <div className="h-8 w-40 animate-pulse rounded bg-slate-100" />
    <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
    <div className="h-48 animate-pulse rounded-lg bg-slate-100" />
  </div>
);

export default StatsLoading;
