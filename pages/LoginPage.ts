import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly signInButton: Locator;
  readonly modalTitle: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.modalTitle = page.locator('.modal-content .modal-title');
    this.emailInput = page.locator('#signinEmail');
    this.passwordInput = page.locator('#signinPassword');
    this.loginButton = page.locator('.modal-content').getByRole('button', { name: 'Login' });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async openLoginForm(): Promise<void> {
    await this.open();
    await this.signInButton.click();
    await expect(this.modalTitle).toHaveText('Log in');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}