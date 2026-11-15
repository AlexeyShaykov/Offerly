import { CreateVacancyForm } from '@/features/create-vacancy';

const NewVacancyPage = () => (
  <main className="flex flex-col gap-6 py-6">
    <h1 className="text-2xl font-semibold">New vacancy</h1>
    <CreateVacancyForm />
  </main>
);

export default NewVacancyPage;
