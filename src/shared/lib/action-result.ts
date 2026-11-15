import { z } from 'zod';

export type ActionError = {
  message: string;
  fieldErrors?: Partial<Record<string, string[]>>;
};

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: ActionError };

export const failure = (message: string): { ok: false; error: ActionError } => ({
  ok: false,
  error: { message },
});

export const validationFailure = (error: z.ZodError): { ok: false; error: ActionError } => ({
  ok: false,
  error: {
    message: 'Please fix the highlighted fields.',
    fieldErrors: z.flattenError(error).fieldErrors,
  },
});
