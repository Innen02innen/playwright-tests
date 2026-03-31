import { test as base, expect, type BrowserContext, type Page } from '@playwright/test';
import { GaragePage } from '../pages/GaragePage';

type MyFixtures = {
  userGaragePage: GaragePage;
};

export const test = base.extend<MyFixtures>({
  userGaragePage: async ({ browser, baseURL }, use) => {
    const context: BrowserContext = await browser.newContext({
      storageState: 'playwright/.auth/user.json',
      baseURL,
    });

    const page: Page = await context.newPage();
    const garagePage = new GaragePage(page);

    await garagePage.open();
    await garagePage.expectOpened();

    await use(garagePage);

    await context.close();
  },
});

export { expect };