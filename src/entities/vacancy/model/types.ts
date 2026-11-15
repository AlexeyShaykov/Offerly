import type { Prisma } from '@prisma/client';

export const vacancyListInclude = {
  company: { select: { name: true } },
} satisfies Prisma.VacancyInclude;

export const vacancyDetailsInclude = {
  company: true,
  statusChanges: { orderBy: { changedAt: 'desc' } },
  coverLetters: { orderBy: { createdAt: 'desc' } },
} satisfies Prisma.VacancyInclude;

export type VacancyListItem = Prisma.VacancyGetPayload<{ include: typeof vacancyListInclude }>;
export type VacancyDetails = Prisma.VacancyGetPayload<{ include: typeof vacancyDetailsInclude }>;
