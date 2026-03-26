import { test, expect, type Page, type Locator } from '@playwright/test';

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

  test('Negative: Name field shows required error when empty', async () => {
    await registrationPage.nameInput.click();
    await registrationPage.lastNameInput.click();

    await expect(registrationPage.getNameError()).toHaveText('Name required');
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Name field shows invalid error for non-English letters', async () => {
    await registrationPage.nameInput.fill('Інна');
    await registrationPage.lastNameInput.click();

    await expect(registrationPage.getNameError()).toHaveText('Name is invalid');
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Name field shows length error for 1 character', async () => {
    await registrationPage.nameInput.fill('I');
    await registrationPage.lastNameInput.click();

    await expect(registrationPage.getNameError()).toHaveText('Name has to be from 2 to 20 characters long');
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Last name field shows required error when empty', async () => {
    await registrationPage.lastNameInput.click();
    await registrationPage.emailInput.click();

    await expect(registrationPage.getLastNameError()).toHaveText('Last name required');
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Last name field shows invalid error for non-English letters', async () => {
    await registrationPage.lastNameInput.fill('Тест');
    await registrationPage.emailInput.click();

    await expect(registrationPage.getLastNameError()).toHaveText('Last name is invalid');
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Email field shows required error when empty', async () => {
    await registrationPage.emailInput.click();
    await registrationPage.passwordInput.click();

    await expect(registrationPage.getEmailError()).toHaveText('Email required');
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Email field shows error for incorrect format', async () => {
    await registrationPage.emailInput.fill('aqa-test.com');
    await registrationPage.passwordInput.click();

    await expect(registrationPage.getEmailError()).toHaveText('Email is incorrect');
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Password field shows required error when empty', async () => {
    await registrationPage.passwordInput.click();
    await registrationPage.repeatPasswordInput.click();

    await expect(registrationPage.getPasswordError()).toHaveText('Password required');
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Password field shows validation error for weak password', async () => {
    await registrationPage.passwordInput.fill('testtest');
    await registrationPage.repeatPasswordInput.click();

    await expect(registrationPage.getPasswordError()).toHaveText(
      'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
    );
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Re-enter password field shows required error when empty', async () => {
    await registrationPage.passwordInput.fill('Test1234');
    await registrationPage.repeatPasswordInput.click();
    await registrationPage.nameInput.click();

    await expect(registrationPage.getRepeatPasswordError()).toHaveText('Re-enter password required');
    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Negative: Re-enter password field shows error when passwords do not match', async () => {
    await registrationPage.passwordInput.fill('Test1234');
    await registrationPage.repeatPasswordInput.fill('Test1235');
    await registrationPage.nameInput.click();

    await expect(registrationPage.getRepeatPasswordError()).toHaveText('Passwords do not match');
    await expect(registrationPage.registerButton).toBeDisabled();
  });
});