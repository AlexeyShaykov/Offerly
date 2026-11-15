import Link from 'next/link';
import { redirect } from 'next/navigation';

import {
  buildVacanciesHref,
  parseVacancyFilters,
  VACANCIES_PAGE_SIZE,
  VacancyCard,
} from '@/entities/vacancy';
import { getVacancies } from '@/entities/vacancy/server';
import { VacancyFilters } from '@/features/filter-vacancies';
import { getSessionUserId } from '@/shared/lib/auth/get-session-user-id';
import { Pagination } from '@/shared/ui';

type VacanciesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const VacanciesPage = async ({ searchParams }: VacanciesPageProps) => {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const filters = parseVacancyFilters(await searchParams);
  const { items, total } = await getVacancies(userId, filters);
  const totalPages = Math.max(1, Math.ceil(total / VACANCIES_PAGE_SIZE));

  if (filters.page > totalPages) {
    redirect(buildVacanciesHref(filters, totalPages));
  }

  const renderList = () => {
    if (items.length === 0) {
      return (
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-600">
          No vacancies found.
        </p>
      );
    }

    return (
      <ul className="flex flex-col gap-3">
        {items.map((vacancy) => (
          <li key={vacancy.id}>
            <VacancyCard vacancy={vacancy} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <main className="flex flex-col gap-6 py-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Vacancies</h1>
        <Link
          href="/vacancies/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Add vacancy
        </Link>
      </div>
      <VacancyFilters filters={filters} />
      <p className="text-sm text-slate-600">{total} found</p>
      {renderList()}
      <Pagination
        page={filters.page}
        totalPages={totalPages}
        getHref={(page) => buildVacanciesHref(filters, page)}
      />
    </main>
  );
};

export default VacanciesPage;
