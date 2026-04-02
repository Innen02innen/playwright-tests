import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Profile page - mocked profile response', () => {
  test('Should display mocked user profile data on Profile page', async ({ page }) => {
    const mockedProfileResponse = {
      status: 'ok',
      data: {
        userId: 777777,
        photoFilename: 'default-user.png',
        name: 'Inna',
        lastName: 'QA',
      },
    };

    let routeWasCalled = false;

    await page.route('**/api/users/profile*', async (route) => {
      routeWasCalled = true;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockedProfileResponse),
      });
    });

    await page.goto('/panel/profile');

    // Перевіряємо, що запит профілю реально був перехоплений
    await expect.poll(() => routeWasCalled).toBeTruthy();

    // Перевіряємо, що на сторінці відображаються саме підмінені дані
    await expect(page.locator('p.profile_name')).toHaveText('Inna QA');
  });
});