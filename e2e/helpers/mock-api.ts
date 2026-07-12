import { expect, type Page } from '@playwright/test';

interface MockSave {
  id: string;
  name: string;
  schemaVersion: number;
  worldSeed: string | null;
  lastPlayedAt: string;
  createdAt: string;
}

export async function mockFenixApi(page: Page) {
  const token = 'e2e-test-token';
  const user = {
    id: 'user-e2e',
    email: 'e2e@fenix.test',
    displayName: 'E2E Player',
    createdAt: new Date().toISOString(),
  };

  const saves = new Map<string, MockSave>();
  const blobs = new Map<string, string>();
  let saveCounter = 0;

  await page.route('**/health', async (route) => {
    await route.fulfill({ status: 200, body: 'ok' });
  });

  await page.route('**/auth/register', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user, token }),
    });
  });

  await page.route('**/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user, token }),
    });
  });

  await page.route(/\/saves\/?$/, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ saves: [...saves.values()] }),
      });
      return;
    }

    if (route.request().method() === 'POST') {
      saveCounter += 1;
      const body = route.request().postDataJSON() as { name?: string; worldSeed?: string };
      const id = `save-e2e-${saveCounter}`;
      const now = new Date().toISOString();
      const save: MockSave = {
        id,
        name: body.name ?? 'E2E Life',
        schemaVersion: 11,
        worldSeed: body.worldSeed ?? null,
        lastPlayedAt: now,
        createdAt: now,
      };
      saves.set(id, save);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ save }),
      });
      return;
    }

    await route.continue();
  });

  await page.route(/\/saves\/[^/]+/, async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.endsWith('/blob')) {
      const saveId = url.split('/saves/')[1]?.split('/')[0] ?? '';
      if (method === 'GET') {
        const blob = blobs.get(saveId);
        if (!blob) {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Not found' }),
          });
          return;
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ blob }),
        });
        return;
      }
      if (method === 'PUT') {
        const body = route.request().postDataJSON() as { blob: string };
        blobs.set(saveId, body.blob);
        await route.fulfill({ status: 204, body: '' });
        return;
      }
    }

    if (url.endsWith('/play') && method === 'POST') {
      const saveId = url.split('/saves/')[1]?.split('/')[0] ?? '';
      const save = saves.get(saveId);
      if (!save) {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Not found' }),
        });
        return;
      }
      const touched = { ...save, lastPlayedAt: new Date().toISOString() };
      saves.set(saveId, touched);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ save: touched }),
      });
      return;
    }

    if (method === 'GET') {
      const saveId = url.split('/saves/')[1]?.split('?')[0] ?? '';
      const save = saves.get(saveId);
      if (!save) {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Not found' }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ save }),
      });
      return;
    }

    await route.continue();
  });
}

export async function loginForE2E(page: Page) {
  const token = 'e2e-test-token';
  const user = {
    id: 'user-e2e',
    email: 'e2e@fenix.test',
    displayName: 'E2E Player',
    createdAt: new Date().toISOString(),
  };

  await page.addInitScript(
    ({ token: authToken, user: authUser }) => {
      localStorage.setItem('fenix_auth_token', authToken);
      localStorage.setItem('fenix_user', JSON.stringify(authUser));
    },
    { token, user },
  );

  await page.goto('/');
  await expect(page.getByText('FENIX LIFE')).toBeVisible({
    timeout: 60_000,
  });
}
