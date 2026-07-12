import { test, expect } from '@playwright/test';
import { loginForE2E, mockFenixApi } from './helpers/mock-api';

test.describe('New life onboarding', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await mockFenixApi(page);
    await loginForE2E(page);
  });

  test('character creation through job apply', async ({ page }) => {
    await page.getByRole('button', { name: /New Life/i }).click();
    await page.waitForURL('/character-creation');

    await page.getByLabel('First Name').fill('Alex');
    await page.getByLabel('Last Name').fill('Rivera');
    await page.getByRole('button', { name: 'Start Your Journey' }).click();

    await page.waitForURL('/childhood-play');
    await expect(page.getByText('Ages 13–17')).toBeVisible();

    await page.getByTestId('skip-adolescence-play').click();
    await page.waitForURL('/childhood-summary');
    await expect(page.getByText('Childhood Summary')).toBeVisible();

    await page.getByTestId('enter-adulthood').click();
    await page.waitForURL('/home');
    await expect(page.getByTestId('home-quick-actions')).toBeVisible();

    await page.getByTestId('home-tour-skip').click();

    await page.getByTestId('home-quick-actions').getByText('Career', { exact: true }).click();
    await page.waitForURL('/career');
    await expect(page.getByRole('heading', { name: 'Career' })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('unemployment-panel')).toBeVisible({ timeout: 30_000 });

    const applyButton = page.locator('[data-testid^="apply-job-"]').first();
    await expect(applyButton).toBeVisible({ timeout: 15_000 });
    await applyButton.click();

    await expect(page.getByTestId('application-history')).toBeVisible({ timeout: 15_000 });
  });
});
