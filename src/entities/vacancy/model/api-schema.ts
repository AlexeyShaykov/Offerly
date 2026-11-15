import { VacancySource, WorkFormat } from '@prisma/client';
import { z } from 'zod';

import { vacancyFormSchema, type VacancyFormInput } from './schema';

// JSON clients send numbers and null; the form schema works with strings.
// This thin adapter normalizes the JSON and hands it to the very same rules.
const apiBodySchema = z.object({
  title: z.string(),
  companyName: z.string().nullish(),
  url: z.string().nullish(),
  source: z.enum(VacancySource),
  workFormat: z.enum(WorkFormat),
  salaryFrom: z.number({ error: 'Enter a whole number' }).nullish(),
  salaryTo: z.number({ error: 'Enter a whole number' }).nullish(),
  description: z.string().nullish(),
});

const salaryToText = (value: number | null | undefined) =>
  value === null || value === undefined ? '' : String(value);

export const vacancyApiSchema = apiBodySchema
  .transform((body): VacancyFormInput => ({
    title: body.title,
    companyName: body.companyName ?? '',
    url: body.url ?? '',
    source: body.source,
    workFormat: body.workFormat,
    salaryFrom: salaryToText(body.salaryFrom),
    salaryTo: salaryToText(body.salaryTo),
    description: body.description ?? '',
  }))
  .pipe(vacancyFormSchema);
