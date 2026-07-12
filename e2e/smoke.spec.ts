import { test, expect } from '@playwright/test';

test.describe('Fenix Life smoke', () => {
  test('main menu renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('FENIX LIFE')).toBeVisible();
    await expect(page.getByRole('button', { name: /New Life|Continue/i }).first()).toBeVisible();
  });
});
