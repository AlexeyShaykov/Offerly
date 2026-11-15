import { VacancyForm } from '@/entities/vacancy';

import { createVacancyAction } from './create-vacancy-action';

export const CreateVacancyForm = () => (
  <VacancyForm
    submitLabel="Create vacancy"
    cancelHref="/vacancies"
    onSubmit={createVacancyAction}
  />
);
