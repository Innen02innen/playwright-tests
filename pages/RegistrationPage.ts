import { expect, type Locator, type Page } from '@playwright/test';

export class RegistrationPage {
  readonly page: Page;

  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly registerButton: Locator;

  readonly nameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.modal = page.locator('.modal-content');
    this.modalTitle = page.locator('.modal-content .modal-title');
    this.registerButton = page.locator('.modal-content').getByRole('button', { name: 'Register' });

    this.nameInput = page.locator('#signupName');
    this.lastNameInput = page.locator('#signupLastName');
    this.emailInput = page.locator('#signupEmail');
    this.passwordInput = page.locator('#signupPassword');
    this.repeatPasswordInput = page.locator('#signupRepeatPassword');
  }

  async expectRegistrationFormIsOpened(): Promise<void> {
    await expect(this.modal).toBeVisible();
    await expect(this.modalTitle).toHaveText('Registration');
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async fillRepeatPassword(repeatPassword: string): Promise<void> {
    await this.repeatPasswordInput.fill(repeatPassword);
  }

  async fillRegistrationForm(data: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;
  }): Promise<void> {
    await this.fillName(data.name);
    await this.fillLastName(data.lastName);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillRepeatPassword(data.repeatPassword);
  }

  async clickRegister(): Promise<void> {
    await this.registerButton.click();
  }

  async expectRegisterButtonEnabled(): Promise<void> {
    await expect(this.registerButton).toBeEnabled();
  }

  async expectRegisterButtonDisabled(): Promise<void> {
    await expect(this.registerButton).toBeDisabled();
  }

  async blurFromTo(from: Locator, to: Locator): Promise<void> {
    await from.click();
    await to.click();
  }

  getNameError(): Locator {
    return this.nameInput.locator('xpath=following-sibling::div/p');
  }

  getLastNameError(): Locator {
    return this.lastNameInput.locator('xpath=following-sibling::div/p');
  }

  getEmailError(): Locator {
    return this.emailInput.locator('xpath=following-sibling::div/p');
  }

  getPasswordError(): Locator {
    return this.passwordInput.locator('xpath=following-sibling::div/p');
  }

  getRepeatPasswordError(): Locator {
    return this.repeatPasswordInput.locator('xpath=following-sibling::div/p');
  }

  async expectRedBorder(input: Locator): Promise<void> {
    await expect(input).toHaveCSS('border-color', /rgb\((200|220),\s*(35|53),\s*(51|69)\)/);
  }

  async expectGaragePageOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/panel\/garage/);
    await expect(this.page.getByRole('button', { name: 'Add car' })).toBeVisible();
  }
}