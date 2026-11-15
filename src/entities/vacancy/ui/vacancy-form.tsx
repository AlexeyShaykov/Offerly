'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { ActionResult } from '@/shared/lib/action-result';
import { fieldClass, FormField } from '@/shared/ui';

import { SOURCE_LABELS, WORK_FORMAT_LABELS } from '../model/labels';
import {
  EMPTY_VACANCY_FORM,
  vacancyFormSchema,
  type VacancyFormInput,
  type VacancyFormValues,
} from '../model/schema';

type VacancyFormProps = {
  defaultValues?: VacancyFormInput;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (input: VacancyFormInput) => Promise<ActionResult<{ id: string }>>;
};

const FIELD_NAMES = Object.keys(EMPTY_VACANCY_FORM).filter(
  (name): name is keyof VacancyFormInput => name in EMPTY_VACANCY_FORM,
);

export const VacancyForm = ({
  defaultValues = EMPTY_VACANCY_FORM,
  submitLabel,
  cancelHref,
  onSubmit,
}: VacancyFormProps) => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VacancyFormInput, unknown, VacancyFormValues>({
    resolver: zodResolver(vacancyFormSchema),
    defaultValues,
  });

  const fieldProps = (name: keyof VacancyFormInput) => ({
    id: name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: fieldClass,
    ...register(name),
  });

  // The server re-validates the same schema, so the raw (string) form values are sent.
  const submit = handleSubmit(async () => {
    setFormError(null);
    const result = await onSubmit(getValues());

    if (result.ok) {
      router.push(`/vacancies/${result.data.id}`);
      return;
    }

    setFormError(result.error.message);
    FIELD_NAMES.forEach((name) => {
      const message = result.error.fieldErrors?.[name]?.[0];
      if (message) setError(name, { message });
    });
  });

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <FormField id="title" label="Title" error={errors.title?.message}>
        <input type="text" autoComplete="off" {...fieldProps('title')} />
      </FormField>
      <FormField id="companyName" label="Company" error={errors.companyName?.message}>
        <input type="text" autoComplete="off" {...fieldProps('companyName')} />
      </FormField>
      <FormField id="url" label="Link to the vacancy" error={errors.url?.message}>
        <input type="url" inputMode="url" autoComplete="off" {...fieldProps('url')} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="source" label="Source" error={errors.source?.message}>
          <select {...fieldProps('source')}>
            {Object.entries(SOURCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="workFormat" label="Work format" error={errors.workFormat?.message}>
          <select {...fieldProps('workFormat')}>
            {Object.entries(WORK_FORMAT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="salaryFrom" label="Salary from, ₽" error={errors.salaryFrom?.message}>
          <input type="text" inputMode="numeric" {...fieldProps('salaryFrom')} />
        </FormField>
        <FormField id="salaryTo" label="Salary to, ₽" error={errors.salaryTo?.message}>
          <input type="text" inputMode="numeric" {...fieldProps('salaryTo')} />
        </FormField>
      </div>
      <FormField id="description" label="Description" error={errors.description?.message}>
        <textarea rows={6} {...fieldProps('description')} />
      </FormField>

      {formError ? (
        <p role="alert" className="text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="text-sm text-slate-600 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
};
