import { describe, expect, it, vi } from 'vitest';

import { createDemoData, vacancies, type DemoDataClient } from './demo-data';

const NOW = new Date('2026-11-15T12:00:00Z');

const createFakeClient = () => {
  let nextId = 0;
  const companyCreate = vi.fn<DemoDataClient['company']['create']>(async () => ({
    id: `company-${(nextId += 1)}`,
  }));
  const vacancyCreate = vi.fn<DemoDataClient['vacancy']['create']>(async () => ({}));
  return {
    client: { company: { create: companyCreate }, vacancy: { create: vacancyCreate } },
    companyCreate,
    vacancyCreate,
  };
};

describe('createDemoData', () => {
  it('creates every fixture for the given user', async () => {
    const { client, companyCreate, vacancyCreate } = createFakeClient();

    await createDemoData(client, 'user-1', NOW);

    expect(companyCreate).toHaveBeenCalledTimes(6);
    expect(vacancyCreate).toHaveBeenCalledTimes(vacancies.length);
    const everythingBelongsToUser = [
      ...companyCreate.mock.calls,
      ...vacancyCreate.mock.calls,
    ].every(([args]) => args.data.userId === 'user-1');
    expect(everythingBelongsToUser).toBe(true);
  });

  it('links vacancies only to companies that were created', async () => {
    const { client, companyCreate, vacancyCreate } = createFakeClient();

    await createDemoData(client, 'user-1', NOW);

    const companyIds = new Set(
      await Promise.all(companyCreate.mock.results.map(async (r) => (await r.value).id)),
    );
    vacancyCreate.mock.calls.forEach(([args]) => {
      if (args.data.companyId) expect(companyIds.has(args.data.companyId)).toBe(true);
    });
  });

  it('keeps status history consistent with the current status and appliedAt', async () => {
    const { client, vacancyCreate } = createFakeClient();

    await createDemoData(client, 'user-1', NOW);

    for (const [{ data }] of vacancyCreate.mock.calls) {
      const created = data.statusChanges?.create;
      const changes = Array.isArray(created) ? created : created ? [created] : [];

      expect(changes[0]?.fromStatus).toBeNull();
      expect(changes.at(-1)?.toStatus).toBe(data.status);
      changes.slice(1).forEach((change, index) => {
        expect(change.fromStatus).toBe(changes[index]?.toStatus);
      });
      expect(Boolean(data.appliedAt)).toBe(changes.some((change) => change.toStatus === 'APPLIED'));
    }
  });

  it('places all history in the past', async () => {
    const { client, vacancyCreate } = createFakeClient();

    await createDemoData(client, 'user-1', NOW);

    for (const [{ data }] of vacancyCreate.mock.calls) {
      expect(new Date(data.updatedAt ?? NOW).getTime()).toBeLessThanOrEqual(NOW.getTime());
    }
  });
});
