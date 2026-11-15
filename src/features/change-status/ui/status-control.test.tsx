// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { changeStatusAction } from '../change-status-action';

import { StatusControl } from './status-control';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('../change-status-action', () => ({ changeStatusAction: vi.fn() }));

const refresh = vi.fn();
const action = vi.mocked(changeStatusAction);

const renderControl = (initialStatus: 'SAVED' | 'APPLIED' = 'SAVED') =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <StatusControl vacancyId="v1" initialStatus={initialStatus} />
    </QueryClientProvider>,
  );

describe('StatusControl', () => {
  beforeEach(() => {
    action.mockReset();
    refresh.mockClear();
  });

  it('offers only the allowed transitions', () => {
    renderControl('SAVED');

    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move to Applied' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move to Archived' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Move to Interview' })).not.toBeInTheDocument();
  });

  it('updates the status optimistically, before the server answers', async () => {
    let resolve: (value: { ok: true; data: { status: 'APPLIED' } }) => void = () => undefined;
    action.mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    renderControl('SAVED');

    await userEvent.click(screen.getByRole('button', { name: 'Move to Applied' }));

    // The server has not answered yet, but the new status and its transitions are already shown.
    expect(await screen.findByRole('button', { name: 'Move to Screening' })).toBeDisabled();
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(action).toHaveBeenCalledWith({ vacancyId: 'v1', status: 'APPLIED' });

    resolve({ ok: true, data: { status: 'APPLIED' } });

    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: 'Move to Screening' })).toBeEnabled();
  });

  it('rolls back and shows the error when the server rejects the change', async () => {
    action.mockResolvedValue({ ok: false, error: { message: 'Something broke' } });
    renderControl('SAVED');

    await userEvent.click(screen.getByRole('button', { name: 'Move to Applied' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Something broke');
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move to Applied' })).toBeEnabled();
    await waitFor(() => expect(refresh).toHaveBeenCalled());
  });
});
