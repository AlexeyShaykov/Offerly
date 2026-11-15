import { VacancyForm, type VacancyFormInput } from '@/entities/vacancy';

import { editVacancyAction } from './edit-vacancy-action';

type EditVacancyFormProps = { vacancyId: string; defaultValues: VacancyFormInput };

export const EditVacancyForm = ({ vacancyId, defaultValues }: EditVacancyFormProps) => (
  <VacancyForm
    defaultValues={defaultValues}
    submitLabel="Save changes"
    cancelHref={`/vacancies/${vacancyId}`}
    onSubmit={editVacancyAction.bind(null, vacancyId)}
  />
);
