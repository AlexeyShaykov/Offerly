import 'server-only';

import { db } from '@/shared/lib/db';

import { VACANCIES_PAGE_SIZE, type VacancyFilters } from '../model/filters';
import { vacancyListInclude } from '../model/types';

export const getVacancies = async (userId: string, filters: VacancyFilters) => {
  const where = { userId, status: filters.status, workFormat: filters.format };

  const [items, total] = await db.$transaction([
    db.vacancy.findMany({
      where,
      include: vacancyListInclude,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (filters.page - 1) * VACANCIES_PAGE_SIZE,
      take: VACANCIES_PAGE_SIZE,
    }),
    db.vacancy.count({ where }),
  ]);

  return { items, total };
};
