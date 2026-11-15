// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActionResult } from '@/shared/lib/action-result';

import type { VacancyFormInput } from '../model/schema';

import { VacancyForm } from './vacancy-form';

const push = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

type Submit = (input: VacancyFormInput) => Promise<ActionResult<{ id: string }>>;

const renderForm = (onSubmit: Submit) =>
  render(<VacancyForm submitLabel="Create vacancy" cancelHref="/vacancies" onSubmit={onSubmit} />);

describe('VacancyForm', () => {
  beforeEach(() => push.mockClear());

  it('shows a validation error and does not submit when the title is empty', async () => {
    const onSubmit = vi.fn<Submit>();
    renderForm(onSubmit);

    await userEvent.click(screen.getByRole('button', { name: 'Create vacancy' }));

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('validates salary fields', async () => {
    const onSubmit = vi.fn<Submit>();
    renderForm(onSubmit);

    await userEvent.type(screen.getByLabelText('Title'), 'Dev');
    await userEvent.type(screen.getByLabelText('Salary from, ₽'), '500');
    await userEvent.type(screen.getByLabelText('Salary to, ₽'), '100');
    await userEvent.click(screen.getByRole('button', { name: 'Create vacancy' }));

    expect(await screen.findByText('Must not be less than the lower bound')).toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText('Salary from, ₽'));
    await userEvent.type(screen.getByLabelText('Salary from, ₽'), 'abc');
    await userEvent.click(screen.getByRole('button', { name: 'Create vacancy' }));

    expect(await screen.findByText('Enter a whole number')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the raw form values and opens the vacancy on success', async () => {
    const onSubmit = vi.fn<Submit>().mockResolvedValue({ ok: true, data: { id: 'v1' } });
    renderForm(onSubmit);

    await userEvent.type(screen.getByLabelText('Title'), 'Frontend Developer');
    await userEvent.type(screen.getByLabelText('Company'), 'Acme');
    await userEvent.selectOptions(screen.getByLabelText('Work format'), 'HYBRID');
    await userEvent.type(screen.getByLabelText('Salary from, ₽'), '200000');
    await userEvent.click(screen.getByRole('button', { name: 'Create vacancy' }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/vacancies/v1'));
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Frontend Developer',
      companyName: 'Acme',
      url: '',
      source: 'HH',
      workFormat: 'HYBRID',
      salaryFrom: '200000',
      salaryTo: '',
      description: '',
    });
  });

  it('shows server field errors next to the fields and a general message', async () => {
    const onSubmit = vi.fn<Submit>().mockResolvedValue({
      ok: false,
      error: { message: 'Please fix the highlighted fields.', fieldErrors: { url: ['Bad link'] } },
    });
    renderForm(onSubmit);

    await userEvent.type(screen.getByLabelText('Title'), 'Dev');
    await userEvent.click(screen.getByRole('button', { name: 'Create vacancy' }));

    expect(await screen.findByText('Bad link')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Please fix the highlighted fields.');
    expect(screen.getByLabelText('Link to the vacancy')).toHaveAttribute('aria-invalid', 'true');
    expect(push).not.toHaveBeenCalled();
  });

  it('disables the button while the request is in flight', async () => {
    let resolve: (result: ActionResult<{ id: string }>) => void = () => undefined;
    const onSubmit = vi.fn<Submit>(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    renderForm(onSubmit);

    await userEvent.type(screen.getByLabelText('Title'), 'Dev');
    await userEvent.click(screen.getByRole('button', { name: 'Create vacancy' }));

    expect(await screen.findByRole('button', { name: 'Saving…' })).toBeDisabled();

    resolve({ ok: true, data: { id: 'v1' } });
    await waitFor(() => expect(push).toHaveBeenCalled());
  });

  it('prefills fields from default values', () => {
    render(
      <VacancyForm
        submitLabel="Save changes"
        cancelHref="/vacancies/v1"
        onSubmit={vi.fn<Submit>()}
        defaultValues={{
          title: 'Existing',
          companyName: 'Acme',
          url: '',
          source: 'TELEGRAM',
          workFormat: 'OFFICE',
          salaryFrom: '',
          salaryTo: '',
          description: '',
        }}
      />,
    );

    expect(screen.getByLabelText('Title')).toHaveValue('Existing');
    expect(screen.getByLabelText('Source')).toHaveValue('TELEGRAM');
    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute('href', '/vacancies/v1');
  });
});
