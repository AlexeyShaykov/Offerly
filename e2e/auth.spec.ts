import { expect, test } from '@playwright/test';

test.describe('without a session', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('protected pages redirect to the login page', async ({ page }) => {
    await page.goto('/vacancies');

    await expect(page).toHaveURL(/\/login\?callbackUrl=/);
    await expect(page.getByRole('button', { name: 'Sign in with GitHub' })).toBeVisible();
  });

  test('the landing page has a sign-in link that leads to the login page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('button', { name: 'Sign in with GitHub' })).toBeVisible();
  });

  test('the REST endpoint answers 401 JSON instead of redirecting', async ({ request }) => {
    const response = await request.post('/api/vacancies', { data: {} });

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
    });
  });
});

test.describe('with a session', () => {
  test('the landing sign-in link takes a signed-in user straight to the app', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/vacancies$/);
  });

  test('the test provider signs the user in', async ({ page }) => {
    await page.goto('/vacancies');

    await expect(page).toHaveURL(/\/vacancies$/);
    await expect(page.getByRole('heading', { name: 'Vacancies' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
  });
});
