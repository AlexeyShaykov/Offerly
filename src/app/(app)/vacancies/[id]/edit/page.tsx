import { notFound, redirect } from 'next/navigation';

import { vacancyToFormInput } from '@/entities/vacancy';
import { getVacancyById } from '@/entities/vacancy/server';
import { EditVacancyForm } from '@/features/edit-vacancy';
import { getSessionUserId } from '@/shared/lib/auth/get-session-user-id';

type EditVacancyPageProps = { params: Promise<{ id: string }> };

const EditVacancyPage = async ({ params }: EditVacancyPageProps) => {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const { id } = await params;
  const vacancy = await getVacancyById(userId, id);
  if (!vacancy) notFound();

  return (
    <main className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-semibold">Edit vacancy</h1>
      <EditVacancyForm vacancyId={vacancy.id} defaultValues={vacancyToFormInput(vacancy)} />
    </main>
  );
};

export default EditVacancyPage;
