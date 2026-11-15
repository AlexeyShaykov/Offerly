import type { VacancyStatus } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { changeStatusAction } from '../change-status-action';

import { getAllowedTransitions } from './transitions';

export const useVacancyStatus = (vacancyId: string, initialStatus: VacancyStatus) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const queryKey = ['vacancy-status', vacancyId] as const;

  const { data: status } = useQuery({
    queryKey,
    queryFn: () => Promise.resolve(initialStatus),
    initialData: initialStatus,
    staleTime: Infinity,
    gcTime: 0,
  });

  const mutation = useMutation({
    mutationFn: async (next: VacancyStatus) => {
      const result = await changeStatusAction({ vacancyId, status: next });
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<VacancyStatus>(queryKey);
      queryClient.setQueryData(queryKey, next);
      return { previous };
    },
    onError: (_error, _next, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSuccess: (data) => queryClient.setQueryData(queryKey, data.status),
    // Re-render server components so the status history shows the new record.
    onSettled: () => router.refresh(),
  });

  return {
    status,
    allowedTransitions: getAllowedTransitions(status),
    changeStatus: (next: VacancyStatus) => mutation.mutate(next),
    isPending: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
