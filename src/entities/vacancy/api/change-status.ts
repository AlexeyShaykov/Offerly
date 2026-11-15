import 'server-only';

import type { VacancyStatus } from '@prisma/client';

import { db } from '@/shared/lib/db';

export type ChangeStatusResult =
  | { ok: true; data: { status: VacancyStatus; changedAt: Date } }
  | { ok: false; reason: 'not_found' | 'invalid_transition' | 'conflict' };

type TransitionRule = (from: VacancyStatus, to: VacancyStatus) => boolean;

// The status update and its StatusChange record are written in one transaction.
// Transition rules belong to the change-status feature, so they are injected by the caller.
export const changeVacancyStatus = (
  userId: string,
  id: string,
  to: VacancyStatus,
  isAllowed: TransitionRule,
) =>
  db.$transaction(async (tx): Promise<ChangeStatusResult> => {
    const current = await tx.vacancy.findFirst({
      where: { id, userId },
      select: { status: true, appliedAt: true },
    });
    if (!current) return { ok: false, reason: 'not_found' };
    if (!isAllowed(current.status, to)) return { ok: false, reason: 'invalid_transition' };

    const changedAt = new Date();

    // The status in `where` guards against a concurrent change between the read and the write.
    const { count } = await tx.vacancy.updateMany({
      where: { id, userId, status: current.status },
      data: {
        status: to,
        appliedAt: to === 'APPLIED' && !current.appliedAt ? changedAt : undefined,
      },
    });
    if (count === 0) return { ok: false, reason: 'conflict' };

    await tx.statusChange.create({
      data: { vacancyId: id, fromStatus: current.status, toStatus: to, changedAt },
    });

    return { ok: true, data: { status: to, changedAt } };
  });
