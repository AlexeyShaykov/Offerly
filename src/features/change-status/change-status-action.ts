'use server';

import { VacancyStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { changeVacancyStatus, revalidateVacancyStats } from '@/entities/vacancy/server';
import { failure, validationFailure, type ActionResult } from '@/shared/lib/action-result';
import { getSessionUserId } from '@/shared/lib/auth/get-session-user-id';

import { canTransition } from './model/transitions';

const changeStatusSchema = z.object({
  vacancyId: z.string().min(1),
  status: z.enum(VacancyStatus),
});

const FAILURE_MESSAGES = {
  not_found: 'Vacancy not found.',
  invalid_transition: 'This status change is not allowed.',
  conflict: 'The status was changed elsewhere. Please reload the page.',
} as const;

export const changeStatusAction = async (
  input: z.input<typeof changeStatusSchema>,
): Promise<ActionResult<{ status: VacancyStatus }>> => {
  const userId = await getSessionUserId();
  if (!userId) return failure('You must be signed in.');

  const parsed = changeStatusSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const { vacancyId, status } = parsed.data;

  try {
    const result = await changeVacancyStatus(userId, vacancyId, status, canTransition);
    if (!result.ok) return failure(FAILURE_MESSAGES[result.reason]);
    revalidateVacancyStats(userId);

    revalidatePath('/vacancies');
    revalidatePath(`/vacancies/${vacancyId}`);
    return { ok: true, data: { status: result.data.status } };
  } catch {
    return failure('Could not change the status. Please try again.');
  }
};
