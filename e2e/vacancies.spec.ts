import { expect, test, type Page } from '@playwright/test';

const uniqueTitle = (label: string) => `${label} ${Date.now()}`;

const createVacancy = async (page: Page, title: string, workFormat: 'Remote' | 'Hybrid') => {
  await page.goto('/vacancies/new');
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Company').fill('E2E Corp');
  await page.getByLabel('Work format').selectOption({ label: workFormat });
  await page.getByRole('button', { name: 'Create vacancy' }).click();

  await expect(page).toHaveURL(/\/vacancies\/[^/]+$/);
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
};

test('creates a vacancy and shows it in the list', async ({ page }) => {
  const title = uniqueTitle('Created');
  await createVacancy(page, title, 'Remote');

  await expect(page.getByRole('region', { name: 'Status history' })).toContainText('Saved');

  await page.goto('/vacancies');
  await expect(page.getByRole('link', { name: title })).toBeVisible();
});

test('shows validation errors instead of submitting an empty form', async ({ page }) => {
  await page.goto('/vacancies/new');
  await page.getByRole('button', { name: 'Create vacancy' }).click();

  await expect(page.getByText('Title is required')).toBeVisible();
  await expect(page).toHaveURL(/\/vacancies\/new$/);
});

test('changes the status and records it in the history', async ({ page }) => {
  await createVacancy(page, uniqueTitle('Status'), 'Remote');

  await page.getByRole('button', { name: 'Move to Applied' }).click();

  // "Move to Screening" is only offered from APPLIED, so it proves the new status is in effect.
  await expect(page.getByRole('button', { name: 'Move to Screening' })).toBeEnabled();
  await expect(page.getByRole('region', { name: 'Status history' })).toContainText('Applied');

  await page.reload();
  await expect(page.getByRole('button', { name: 'Move to Screening' })).toBeVisible();
});

test('filters the list by status and work format', async ({ page }) => {
  const applied = uniqueTitle('FilterApplied');
  const hybrid = uniqueTitle('FilterHybrid');

  await createVacancy(page, applied, 'Remote');
  await page.getByRole('button', { name: 'Move to Applied' }).click();
  await expect(page.getByRole('button', { name: 'Move to Screening' })).toBeEnabled();
  await createVacancy(page, hybrid, 'Hybrid');

  await page.goto('/vacancies');
  await page.getByLabel('Status').selectOption({ label: 'Applied' });
  await page.getByRole('button', { name: 'Apply' }).click();

  await expect(page).toHaveURL(/status=APPLIED/);
  await expect(page.getByRole('link', { name: applied })).toBeVisible();
  await expect(page.getByRole('link', { name: hybrid })).toHaveCount(0);

  await page.getByRole('link', { name: 'Reset' }).click();
  // Reset must also clear the selects, not only the results.
  await expect(page).toHaveURL(/\/vacancies$/);
  await expect(page.getByLabel('Status')).toHaveValue('');
  await page.getByLabel('Work format').selectOption({ label: 'Hybrid' });
  await page.getByRole('button', { name: 'Apply' }).click();

  await expect(page).toHaveURL(/format=HYBRID/);
  await expect(page.getByRole('link', { name: hybrid })).toBeVisible();
  await expect(page.getByRole('link', { name: applied })).toHaveCount(0);
});
