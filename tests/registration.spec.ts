import { test, expect, type Locator, type Page } from '@playwright/test';

function generateUniqueEmail(prefix: string = 'aqa'): string {
  return `${prefix}-${Date.now()}@test.com`;
}

class RegistrationPage {
  readonly page: Page;

  readonly signUpHeaderButton: Locator;
  readonly modalTitle: Locator;
  readonly registerButton: Locator;

  readonly nameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signUpHeaderButton = page.getByRole('button', { name: 'Sign up' });
    this.modalTitle = page.locator('.modal-content .modal-title');
    this.registerButton = page.locator('.modal-content').getByRole('button', { name: 'Register' });

    this.nameInput = page.locator('#signupName');
    this.lastNameInput = page.locator('#signupLastName');
    this.emailInput = page.locator('#signupEmail');
    this.passwordInput = page.locator('#signupPassword');
    this.repeatPasswordInput = page.locator('#signupRepeatPassword');
  }

  async openRegistrationForm(): Promise<void> {
    await this.page.goto('/');
    await this.signUpHeaderButton.click();
    await expect(this.modalTitle).toHaveText('Registration');
  }

  async fillRegistrationForm(data: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.repeatPasswordInput.fill(data.repeatPassword);
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

  async triggerBlur(from: Locator, to: Locator): Promise<void> {
    await from.click();
    await to.click();
  }

  async expectRedBorder(input: Locator): Promise<void> {
    await expect(input).toHaveCSS('border-color', /rgb\((200|220),\s*(35|53),\s*(51|69)\)/);
  }
}

test.describe('Sign up form', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.openRegistrationForm();
  });

  test('Positive: user can register with valid data and email prefix aqa', async ({ page }) => {
    const uniqueEmail = generateUniqueEmail('aqa');
    const validPassword = 'Test1234';

    await registrationPage.fillRegistrationForm({
      name: 'Inna',
      lastName: 'Onosovska',
      email: uniqueEmail,
      password: validPassword,
      repeatPassword: validPassword,
    });

    await expect(registrationPage.registerButton).toBeEnabled();
    await registrationPage.registerButton.click();

    await expect(page).toHaveURL(/panel\/garage/);
    await expect(page.getByRole('button', { name: 'Add car' })).toBeVisible();
  });

  test.fixme('Requirement check: Name and Last name should be trimmed and spaces ignored', async ({ page }) => {
    const uniqueEmail = generateUniqueEmail('aqa');
    const validPassword = 'Test1234';

    await registrationPage.fillRegistrationForm({
      name: '  Inna  ',
      lastName: '  Onosovska  ',
      email: uniqueEmail,
      password: validPassword,
      repeatPassword: validPassword,
    });

    await expect(registrationPage.registerButton).toBeEnabled();
    await registrationPage.registerButton.click();

    await expect(page).toHaveURL(/panel\/garage/);
    await expect(page.getByRole('button', { name: 'Add car' })).toBeVisible();
  });

  test('Negative: Register button should be disabled when form is empty', async () => {
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Name field shows required error when empty', async () => {
    await registrationPage.triggerBlur(registrationPage.nameInput, registrationPage.lastNameInput);

    await expect(registrationPage.getNameError()).toHaveText('Name required');
    await registrationPage.expectRedBorder(registrationPage.nameInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Name field shows invalid error for non-English letters', async () => {
    await registrationPage.nameInput.fill('Інна');
    await registrationPage.lastNameInput.click();

    await expect(registrationPage.getNameError()).toHaveText('Name is invalid');
    await registrationPage.expectRedBorder(registrationPage.nameInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Name field shows length error for 1 character', async () => {
    await registrationPage.nameInput.fill('I');
    await registrationPage.lastNameInput.click();

    await expect(registrationPage.getNameError()).toHaveText('Name has to be from 2 to 20 characters long');
    await registrationPage.expectRedBorder(registrationPage.nameInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Name field shows length error for more than 20 characters', async () => {
    await registrationPage.nameInput.fill('A'.repeat(21));
    await registrationPage.lastNameInput.click();

    await expect(registrationPage.getNameError()).toHaveText('Name has to be from 2 to 20 characters long');
    await registrationPage.expectRedBorder(registrationPage.nameInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Last name field shows required error when empty', async () => {
    await registrationPage.triggerBlur(registrationPage.lastNameInput, registrationPage.emailInput);

    await expect(registrationPage.getLastNameError()).toHaveText('Last name required');
    await registrationPage.expectRedBorder(registrationPage.lastNameInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Last name field shows invalid error for non-English letters', async () => {
    await registrationPage.lastNameInput.fill('Тест');
    await registrationPage.emailInput.click();

    await expect(registrationPage.getLastNameError()).toHaveText('Last name is invalid');
    await registrationPage.expectRedBorder(registrationPage.lastNameInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Last name field shows length error for 1 character', async () => {
    await registrationPage.lastNameInput.fill('O');
    await registrationPage.emailInput.click();

    await expect(registrationPage.getLastNameError()).toHaveText('Last name has to be from 2 to 20 characters long');
    await registrationPage.expectRedBorder(registrationPage.lastNameInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Last name field shows length error for more than 20 characters', async () => {
    await registrationPage.lastNameInput.fill('B'.repeat(21));
    await registrationPage.emailInput.click();

    await expect(registrationPage.getLastNameError()).toHaveText('Last name has to be from 2 to 20 characters long');
    await registrationPage.expectRedBorder(registrationPage.lastNameInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Email field shows required error when empty', async () => {
    await registrationPage.triggerBlur(registrationPage.emailInput, registrationPage.passwordInput);

    await expect(registrationPage.getEmailError()).toHaveText('Email required');
    await registrationPage.expectRedBorder(registrationPage.emailInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Email field shows error for incorrect format', async () => {
    await registrationPage.emailInput.fill('aqa-test.com');
    await registrationPage.passwordInput.click();

    await expect(registrationPage.getEmailError()).toHaveText('Email is incorrect');
    await registrationPage.expectRedBorder(registrationPage.emailInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Password field shows required error when empty', async () => {
    await registrationPage.triggerBlur(registrationPage.passwordInput, registrationPage.repeatPasswordInput);

    await expect(registrationPage.getPasswordError()).toHaveText('Password required');
    await registrationPage.expectRedBorder(registrationPage.passwordInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Password field shows validation error for less than 8 characters', async () => {
    await registrationPage.passwordInput.fill('Tes12A');
    await registrationPage.repeatPasswordInput.click();

    await expect(registrationPage.getPasswordError()).toHaveText(
      'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
    );
    await registrationPage.expectRedBorder(registrationPage.passwordInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Password field shows validation error for more than 15 characters', async () => {
    await registrationPage.passwordInput.fill('Test123456789012');
    await registrationPage.repeatPasswordInput.click();

    await expect(registrationPage.getPasswordError()).toHaveText(
      'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
    );
    await registrationPage.expectRedBorder(registrationPage.passwordInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Password field shows validation error for weak password without required character types', async () => {
    await registrationPage.passwordInput.fill('testtest');
    await registrationPage.repeatPasswordInput.click();

    await expect(registrationPage.getPasswordError()).toHaveText(
      'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
    );
    await registrationPage.expectRedBorder(registrationPage.passwordInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Re-enter password field shows required error when empty', async () => {
    await registrationPage.passwordInput.fill('Test1234');
    await registrationPage.repeatPasswordInput.click();
    await registrationPage.nameInput.click();

    await expect(registrationPage.getRepeatPasswordError()).toHaveText('Re-enter password required');
    await registrationPage.expectRedBorder(registrationPage.repeatPasswordInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Re-enter password field shows error when passwords do not match', async () => {
    await registrationPage.passwordInput.fill('Test1234');
    await registrationPage.repeatPasswordInput.fill('Test1235');
    await registrationPage.nameInput.click();

    await expect(registrationPage.getRepeatPasswordError()).toHaveText('Passwords do not match');
    await registrationPage.expectRedBorder(registrationPage.repeatPasswordInput);
    await expect(registrationPage.registerButton).toBeDisabled();
  });
});