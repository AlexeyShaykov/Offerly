import 'server-only';

import { db } from '@/shared/lib/db';

import { vacancyDetailsInclude } from '../model/types';

// Scoped by userId: someone else's vacancy is indistinguishable from a missing one.
export const getVacancyById = (userId: string, id: string) =>
  db.vacancy.findFirst({ where: { id, userId }, include: vacancyDetailsInclude });
