import { test, expect } from '@playwright/test';

test.describe('Fenix Life auth UI', () => {
  test('auth screen renders sign in and register tabs', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Fenix Life Account' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Register' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
  });
});
