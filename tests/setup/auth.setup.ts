import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { GaragePage } from '../../pages/GaragePage';
import { TEST_USER } from '../../test-data/users';

const authFile = 'playwright/.auth/user.json';

setup('Login and save storage state', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const garagePage = new GaragePage(page);

  await loginPage.openLoginForm();
  await loginPage.login(TEST_USER.email, TEST_USER.password);

  await garagePage.expectOpened();

  await page.context().storageState({ path: authFile });
});