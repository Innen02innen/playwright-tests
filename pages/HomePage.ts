import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signUpButton = page.getByRole('button', { name: 'Sign up' }).first();
  }

  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page).toHaveURL('/');
  }

  async clickSignUp(): Promise<void> {
    await expect(this.signUpButton).toBeVisible();
    await this.signUpButton.click();
  }

  async openRegistrationForm(): Promise<void> {
    await this.open();
    await this.clickSignUp();
  }
}