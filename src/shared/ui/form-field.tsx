import type { ReactNode } from 'react';

export const fieldClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 aria-[invalid=true]:border-red-600';

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

// The input inside should set aria-describedby={`${id}-error`} and aria-invalid when there is an error.
export const FormField = ({ id, label, error, children }: FormFieldProps) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="text-sm text-red-700">
        {error}
      </p>
    ) : null}
  </div>
);
