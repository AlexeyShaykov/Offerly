import { VacancySource, WorkFormat } from '@prisma/client';
import { z } from 'zod';

const MAX_SALARY = 100_000_000;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be at most ${max} characters`)
    .transform((value) => value || undefined);

const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

const optionalUrl = z
  .string()
  .trim()
  .max(2000, 'Must be at most 2000 characters')
  .refine((value) => value === '' || isHttpUrl(value), 'Enter a valid http(s) link')
  .transform((value) => value || undefined);

// The form keeps salary as text; empty means "not set", otherwise a whole number.
const optionalSalary = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : Number(value)))
  .pipe(
    z
      .number({ error: 'Enter a whole number' })
      .int('Enter a whole number')
      .min(0, 'Must not be negative')
      .max(MAX_SALARY, 'That number is too large')
      .optional(),
  );

export const vacancyFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Must be at most 200 characters'),
    companyName: optionalText(200),
    url: optionalUrl,
    source: z.enum(VacancySource),
    workFormat: z.enum(WorkFormat),
    salaryFrom: optionalSalary,
    salaryTo: optionalSalary,
    description: optionalText(10_000),
  })
  .refine(
    ({ salaryFrom, salaryTo }) =>
      salaryFrom === undefined || salaryTo === undefined || salaryFrom <= salaryTo,
    { path: ['salaryTo'], error: 'Must not be less than the lower bound' },
  );

// Input is what the form holds (strings); output is what the server stores.
export type VacancyFormInput = z.input<typeof vacancyFormSchema>;
export type VacancyFormValues = z.output<typeof vacancyFormSchema>;

export const EMPTY_VACANCY_FORM: VacancyFormInput = {
  title: '',
  companyName: '',
  url: '',
  source: 'HH',
  workFormat: 'REMOTE',
  salaryFrom: '',
  salaryTo: '',
  description: '',
};
