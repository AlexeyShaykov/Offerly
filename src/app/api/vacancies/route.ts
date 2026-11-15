import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { toVacancyDto, vacancyApiSchema } from '@/entities/vacancy';
import { createVacancy, getVacancyById, revalidateVacancyStats } from '@/entities/vacancy/server';
import { apiError } from '@/shared/lib/api-error';
import { getSessionUserId } from '@/shared/lib/auth/get-session-user-id';

// Authentication is a session cookie (Auth.js). Requiring a JSON content type also blocks
// cross-site form posts: a browser cannot send it without a CORS preflight, which we never allow.
export const POST = async (request: Request) => {
  const userId = await getSessionUserId();
  if (!userId) return apiError(401, 'UNAUTHORIZED', 'Authentication required.');

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return apiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Content-Type must be application/json.');
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError(400, 'INVALID_JSON', 'Request body is not valid JSON.');
  }

  const parsed = vacancyApiSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(422, 'VALIDATION_ERROR', 'Validation failed.', {
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  try {
    const id = await createVacancy(userId, parsed.data);
    const vacancy = await getVacancyById(userId, id);
    if (!vacancy) return apiError(500, 'INTERNAL_ERROR', 'Could not create the vacancy.');

    revalidatePath('/vacancies');
    revalidateVacancyStats(userId);

    return NextResponse.json({ data: toVacancyDto(vacancy) }, { status: 201 });
  } catch {
    return apiError(500, 'INTERNAL_ERROR', 'Could not create the vacancy.');
  }
};
