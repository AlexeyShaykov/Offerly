'use server';

import { revalidatePath } from 'next/cache';

import { vacancyFormSchema, type VacancyFormInput } from '@/entities/vacancy';
import { updateVacancy } from '@/entities/vacancy/server';
import { failure, validationFailure, type ActionResult } from '@/shared/lib/action-result';
import { getSessionUserId } from '@/shared/lib/auth/get-session-user-id';

export const editVacancyAction = async (
  vacancyId: string,
  input: VacancyFormInput,
): Promise<ActionResult<{ id: string }>> => {
  const userId = await getSessionUserId();
  if (!userId) return failure('You must be signed in.');

  const parsed = vacancyFormSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    const id = await updateVacancy(userId, vacancyId, parsed.data);
    if (!id) return failure('Vacancy not found.');

    revalidatePath('/vacancies');
    revalidatePath(`/vacancies/${id}`);
    return { ok: true, data: { id } };
  } catch {
    return failure('Could not save the vacancy. Please try again.');
  }
};
