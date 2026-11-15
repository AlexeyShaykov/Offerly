'use server';

import { revalidatePath } from 'next/cache';

import { vacancyFormSchema, type VacancyFormInput } from '@/entities/vacancy';
import { createVacancy, revalidateVacancyStats } from '@/entities/vacancy/server';
import { failure, validationFailure, type ActionResult } from '@/shared/lib/action-result';
import { getSessionUserId } from '@/shared/lib/auth/get-session-user-id';

export const createVacancyAction = async (
  input: VacancyFormInput,
): Promise<ActionResult<{ id: string }>> => {
  const userId = await getSessionUserId();
  if (!userId) return failure('You must be signed in.');

  const parsed = vacancyFormSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    const id = await createVacancy(userId, parsed.data);
    revalidateVacancyStats(userId);
    revalidatePath('/vacancies');
    return { ok: true, data: { id } };
  } catch {
    return failure('Could not save the vacancy. Please try again.');
  }
};
