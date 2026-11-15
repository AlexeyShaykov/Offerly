import Link from 'next/link';

const VacancyNotFound = () => (
  <main className="flex flex-col items-start gap-3 py-6">
    <h1 className="text-xl font-semibold">Vacancy not found</h1>
    <p className="text-slate-600">It may have been removed, or it never existed.</p>
    <Link
      href="/vacancies"
      className="text-slate-900 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
    >
      Back to vacancies
    </Link>
  </main>
);

export default VacancyNotFound;
