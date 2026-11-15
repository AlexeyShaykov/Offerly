import { VacancyStatus, WorkFormat } from '@prisma/client';
import { z } from 'zod';

export const VACANCIES_PAGE_SIZE = 10;

// Invalid values in the URL fall back to defaults instead of breaking the page.
const vacancyFiltersSchema = z.object({
  status: z.enum(VacancyStatus).optional().catch(undefined),
  format: z.enum(WorkFormat).optional().catch(undefined),
  page: z.coerce.number().int().min(1).catch(1),
});

export type VacancyFilters = z.infer<typeof vacancyFiltersSchema>;

export const parseVacancyFilters = (
  searchParams: Record<string, string | string[] | undefined>,
): VacancyFilters => vacancyFiltersSchema.parse(searchParams);

export const buildVacanciesHref = (filters: VacancyFilters, page: number) => {
  const params = new URLSearchParams();

  if (filters.status) params.set('status', filters.status);
  if (filters.format) params.set('format', filters.format);
  if (page > 1) params.set('page', String(page));

  const query = params.toString();
  return query ? `/vacancies?${query}` : '/vacancies';
};
