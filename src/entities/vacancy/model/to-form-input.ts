import type { VacancyDetails } from './types';
import type { VacancyFormInput } from './schema';

export const vacancyToFormInput = (vacancy: VacancyDetails): VacancyFormInput => ({
  title: vacancy.title,
  companyName: vacancy.company?.name ?? '',
  url: vacancy.url ?? '',
  source: vacancy.source,
  workFormat: vacancy.workFormat,
  salaryFrom: vacancy.salaryFrom === null ? '' : String(vacancy.salaryFrom),
  salaryTo: vacancy.salaryTo === null ? '' : String(vacancy.salaryTo),
  description: vacancy.description ?? '',
});
