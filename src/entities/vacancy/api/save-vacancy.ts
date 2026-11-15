import 'server-only';

import type { Prisma } from '@prisma/client';

import { db } from '@/shared/lib/db';

import type { VacancyFormValues } from '../model/schema';

// Finds the user's company by name (case-insensitive) or creates it.
const resolveCompanyId = async (
  tx: Prisma.TransactionClient,
  userId: string,
  name: string | undefined,
) => {
  if (!name) return null;

  const existing = await tx.company.findFirst({
    where: { userId, name: { equals: name, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await tx.company.create({ data: { userId, name }, select: { id: true } });
  return created.id;
};

// Optional values map to null explicitly: undefined would mean "leave unchanged" in Prisma.
const toFieldData = (values: VacancyFormValues) => ({
  title: values.title,
  url: values.url ?? null,
  source: values.source,
  workFormat: values.workFormat,
  salaryFrom: values.salaryFrom ?? null,
  salaryTo: values.salaryTo ?? null,
  description: values.description ?? null,
});

export const createVacancy = (userId: string, values: VacancyFormValues) =>
  db.$transaction(async (tx) => {
    const companyId = await resolveCompanyId(tx, userId, values.companyName);

    const vacancy = await tx.vacancy.create({
      data: {
        ...toFieldData(values),
        userId,
        companyId,
        status: 'SAVED',
        statusChanges: { create: { fromStatus: null, toStatus: 'SAVED' } },
      },
      select: { id: true },
    });

    return vacancy.id;
  });

// Returns null when the vacancy does not exist or belongs to someone else.
export const updateVacancy = (userId: string, id: string, values: VacancyFormValues) =>
  db.$transaction(async (tx) => {
    const existing = await tx.vacancy.findFirst({ where: { id, userId }, select: { id: true } });
    if (!existing) return null;

    const companyId = await resolveCompanyId(tx, userId, values.companyName);

    await tx.vacancy.update({
      where: { id: existing.id },
      data: { ...toFieldData(values), companyId },
    });

    return existing.id;
  });
