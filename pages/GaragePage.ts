import { expect, type Locator, type Page } from '@playwright/test';

export class GaragePage {
  readonly page: Page;
  readonly addCarButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addCarButton = page.getByRole('button', { name: 'Add car' });
    this.pageTitle = page.locator('h1');
  }

  async open(): Promise<void> {
    await this.page.goto('/panel/garage');
  }

  async expectOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/panel\/garage/);
    await expect(this.addCarButton).toBeVisible();
  }
}