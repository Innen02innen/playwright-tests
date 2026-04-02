import { test, expect } from '../fixtures/userGaragePage.fixture';

test('User can open Garage page using userGaragePage fixture', async ({ userGaragePage }) => {
  await userGaragePage.expectOpened();
  await expect(userGaragePage.addCarButton).toBeVisible();
});