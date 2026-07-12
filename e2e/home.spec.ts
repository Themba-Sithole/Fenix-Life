import { test, expect, type Page } from '@playwright/test';
import { loginForE2E, mockFenixApi } from './helpers/mock-api';

async function reachHome(page: Page) {
  await mockFenixApi(page);
  await loginForE2E(page);

  await page.getByRole('button', { name: /New Life/i }).click();
  await page.waitForURL('/character-creation');
  await page.getByLabel('First Name').fill('Alex');
  await page.getByLabel('Last Name').fill('Rivera');
  await page.getByRole('button', { name: 'Start Your Journey' }).click();

  await page.waitForURL('/childhood-play');
  await page.getByTestId('skip-adolescence-play').click();
  await page.waitForURL('/childhood-summary');
  await page.getByTestId('enter-adulthood').click();
  await page.waitForURL('/home');

  const tourSkip = page.getByTestId('home-tour-skip');
  if (await tourSkip.isVisible().catch(() => false)) {
    await tourSkip.click();
  }
}

test.describe('Home screen', () => {
  test.setTimeout(120_000);

  test('renders live identity, capitals, destinations, and advance-day', async ({ page }) => {
    await reachHome(page);

    await expect(page.getByTestId('home-identity-bar')).toBeVisible();
    await expect(page.getByTestId('home-identity-bar')).toContainText(/Alex|Rivera/i);
    await expect(page.getByTestId('home-capital-stats')).toBeVisible();
    await expect(page.getByTestId('capital-stat-human')).toBeVisible();
    await expect(page.getByTestId('home-quick-actions')).toBeVisible();
    await expect(page.getByTestId('home-quick-actions').getByText('Banking')).toBeVisible();
    await expect(page.getByTestId('todays-decision-panel')).toBeVisible();
    await expect(page.getByTestId('advance-day')).toBeVisible();
    await expect(page.getByTestId('theme-toggle')).toBeVisible();
  });

  test('theme toggle flips html dark class', async ({ page }) => {
    await reachHome(page);

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    await page.getByTestId('theme-toggle').click();
    await expect(html).not.toHaveClass(/dark/);
    await page.getByTestId('theme-toggle').click();
    await expect(html).toHaveClass(/dark/);
  });

  for (const viewport of [
    { width: 375, height: 812, label: '375' },
    { width: 768, height: 1024, label: '768' },
    { width: 1280, height: 720, label: '1280' },
  ] as const) {
    test(`layout holds at ${viewport.label}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await reachHome(page);

      await expect(page.getByTestId('home-identity-bar')).toBeVisible();
      await expect(page.getByTestId('home-capital-stats')).toBeVisible();
      await expect(page.getByTestId('home-quick-actions')).toBeVisible();
      await expect(page.getByTestId('todays-decision-panel')).toBeVisible();
      await expect(page.getByTestId('advance-day')).toBeVisible();

      if (viewport.width < 640) {
        await expect(page.getByTestId('capital-stat-human')).toBeVisible();
        await expect(page.getByTestId('capital-stat-business')).toBeHidden();
      } else {
        await expect(page.getByTestId('capital-stat-business')).toBeVisible();
        await expect(page.getByTestId('capital-stat-legacy')).toBeVisible();
      }
    });
  }
});
