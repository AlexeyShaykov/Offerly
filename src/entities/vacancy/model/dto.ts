import type { VacancyDetails } from './types';

// Public shape of a vacancy for the REST API: no userId and no internal relations.
export const toVacancyDto = (vacancy: VacancyDetails) => ({
  id: vacancy.id,
  title: vacancy.title,
  companyName: vacancy.company?.name ?? null,
  url: vacancy.url,
  source: vacancy.source,
  workFormat: vacancy.workFormat,
  salaryFrom: vacancy.salaryFrom,
  salaryTo: vacancy.salaryTo,
  description: vacancy.description,
  status: vacancy.status,
  appliedAt: vacancy.appliedAt,
  createdAt: vacancy.createdAt,
  updatedAt: vacancy.updatedAt,
});

export type VacancyDto = ReturnType<typeof toVacancyDto>;
