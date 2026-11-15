import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { formatDate, StatusHistory, VacancyInfo } from '@/entities/vacancy';
import { getVacancyById } from '@/entities/vacancy/server';
import { StatusControl } from '@/features/change-status';
import { getSessionUserId } from '@/shared/lib/auth/get-session-user-id';

type VacancyPageProps = { params: Promise<{ id: string }> };

const VacancyPage = async ({ params }: VacancyPageProps) => {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const { id } = await params;
  const vacancy = await getVacancyById(userId, id);
  if (!vacancy) notFound();

  return (
    <main className="flex flex-col gap-8 py-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/vacancies"
          className="w-fit text-sm text-slate-600 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          ← All vacancies
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{vacancy.title}</h1>
            <p className="text-slate-600">{vacancy.company?.name ?? 'No company'}</p>
          </div>
          <Link
            href={`/vacancies/${vacancy.id}/edit`}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Edit
          </Link>
        </div>
      </div>

      <StatusControl vacancyId={vacancy.id} initialStatus={vacancy.status} />

      <VacancyInfo vacancy={vacancy} />

      {vacancy.description ? (
        <section aria-labelledby="description-heading" className="flex flex-col gap-2">
          <h2 id="description-heading" className="text-lg font-semibold">
            Description
          </h2>
          <p className="whitespace-pre-wrap">{vacancy.description}</p>
        </section>
      ) : null}

      <section aria-labelledby="history-heading" className="flex flex-col gap-3">
        <h2 id="history-heading" className="text-lg font-semibold">
          Status history
        </h2>
        <StatusHistory changes={vacancy.statusChanges} />
      </section>

      {vacancy.coverLetters.length > 0 ? (
        <section aria-labelledby="letters-heading" className="flex flex-col gap-3">
          <h2 id="letters-heading" className="text-lg font-semibold">
            Cover letters
          </h2>
          {vacancy.coverLetters.map((letter) => (
            <article key={letter.id} className="rounded-lg border border-slate-200 p-4">
              <p className="mb-2 text-xs text-slate-500">{formatDate(letter.createdAt)}</p>
              <p className="whitespace-pre-wrap">{letter.content}</p>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
};

export default VacancyPage;
