import { test, expect } from '@playwright/test';

test.describe('Fenix Life smoke', () => {
  test('main menu renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('FENIX LIFE')).toBeVisible();
    await expect(page.getByRole('button', { name: /New Life|Continue/i }).first()).toBeVisible();
  });

  test('home without an active save leaves the home route', async ({ page }) => {
    await page.goto('/home');
    await expect(page).not.toHaveURL(/\/home\/?$/, { timeout: 15_000 });
  });
});
