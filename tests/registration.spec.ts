import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { createValidUser, generateUniqueEmail } from '../utils/userFactory';

test.describe('Sign up form - POM', () => {
  let homePage: HomePage;
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registrationPage = new RegistrationPage(page);

    await homePage.openRegistrationForm();
    await registrationPage.expectRegistrationFormIsOpened();
  });

  test('Positive: user can register with valid data and email prefix aqa', async () => {
    const user = createValidUser();

    await registrationPage.fillRegistrationForm(user);
    await registrationPage.expectRegisterButtonEnabled();
    await registrationPage.clickRegister();
    await registrationPage.expectGaragePageOpened();
  });

  test.fixme('Requirement check: Name and Last name should be trimmed and spaces ignored', async () => {
    const email = generateUniqueEmail('aqa');
    const password = 'Test1234';

    await registrationPage.fillRegistrationForm({
      name: '  Inna  ',
      lastName: '  Onosovska  ',
      email,
      password,
      repeatPassword: password,
    });

    await registrationPage.expectRegisterButtonEnabled();
    await registrationPage.clickRegister();
    await registrationPage.expectGaragePageOpened();
  });

  test('Negative: Register button should be disabled when form is empty', async () => {
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Name field shows required error when empty', async () => {
    await registrationPage.blurFromTo(registrationPage.nameInput, registrationPage.lastNameInput);

    await expect(registrationPage.getNameError()).toHaveText('Name required');
    await registrationPage.expectRedBorder(registrationPage.nameInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Name field shows invalid error for non-English letters', async () => {
    await registrationPage.fillName('Інна');
    await registrationPage.lastNameInput.click();

    await expect(registrationPage.getNameError()).toHaveText('Name is invalid');
    await registrationPage.expectRedBorder(registrationPage.nameInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Name field shows length error for 1 character', async () => {
    await registrationPage.fillName('I');
    await registrationPage.lastNameInput.click();

    await expect(registrationPage.getNameError()).toHaveText('Name has to be from 2 to 20 characters long');
    await registrationPage.expectRedBorder(registrationPage.nameInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Name field shows length error for more than 20 characters', async () => {
    await registrationPage.fillName('A'.repeat(21));
    await registrationPage.lastNameInput.click();

    await expect(registrationPage.getNameError()).toHaveText('Name has to be from 2 to 20 characters long');
    await registrationPage.expectRedBorder(registrationPage.nameInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Last name field shows required error when empty', async () => {
    await registrationPage.blurFromTo(registrationPage.lastNameInput, registrationPage.emailInput);

    await expect(registrationPage.getLastNameError()).toHaveText('Last name required');
    await registrationPage.expectRedBorder(registrationPage.lastNameInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Last name field shows invalid error for non-English letters', async () => {
    await registrationPage.fillLastName('Тест');
    await registrationPage.emailInput.click();

    await expect(registrationPage.getLastNameError()).toHaveText('Last name is invalid');
    await registrationPage.expectRedBorder(registrationPage.lastNameInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Last name field shows length error for 1 character', async () => {
    await registrationPage.fillLastName('O');
    await registrationPage.emailInput.click();

    await expect(registrationPage.getLastNameError()).toHaveText('Last name has to be from 2 to 20 characters long');
    await registrationPage.expectRedBorder(registrationPage.lastNameInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Last name field shows length error for more than 20 characters', async () => {
    await registrationPage.fillLastName('B'.repeat(21));
    await registrationPage.emailInput.click();

    await expect(registrationPage.getLastNameError()).toHaveText('Last name has to be from 2 to 20 characters long');
    await registrationPage.expectRedBorder(registrationPage.lastNameInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Email field shows required error when empty', async () => {
    await registrationPage.blurFromTo(registrationPage.emailInput, registrationPage.passwordInput);

    await expect(registrationPage.getEmailError()).toHaveText('Email required');
    await registrationPage.expectRedBorder(registrationPage.emailInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Email field shows error for incorrect format', async () => {
    await registrationPage.fillEmail('aqa-test.com');
    await registrationPage.passwordInput.click();

    await expect(registrationPage.getEmailError()).toHaveText('Email is incorrect');
    await registrationPage.expectRedBorder(registrationPage.emailInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Password field shows required error when empty', async () => {
    await registrationPage.blurFromTo(registrationPage.passwordInput, registrationPage.repeatPasswordInput);

    await expect(registrationPage.getPasswordError()).toHaveText('Password required');
    await registrationPage.expectRedBorder(registrationPage.passwordInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Password field shows validation error for less than 8 characters', async () => {
    await registrationPage.fillPassword('Tes12A');
    await registrationPage.repeatPasswordInput.click();

    await expect(registrationPage.getPasswordError()).toHaveText(
      'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
    );
    await registrationPage.expectRedBorder(registrationPage.passwordInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Password field shows validation error for more than 15 characters', async () => {
    await registrationPage.fillPassword('Test123456789012');
    await registrationPage.repeatPasswordInput.click();

    await expect(registrationPage.getPasswordError()).toHaveText(
      'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
    );
    await registrationPage.expectRedBorder(registrationPage.passwordInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Password field shows validation error for weak password without required character types', async () => {
    await registrationPage.fillPassword('testtest');
    await registrationPage.repeatPasswordInput.click();

    await expect(registrationPage.getPasswordError()).toHaveText(
      'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
    );
    await registrationPage.expectRedBorder(registrationPage.passwordInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Re-enter password field shows required error when empty', async () => {
    await registrationPage.fillPassword('Test1234');
    await registrationPage.repeatPasswordInput.click();
    await registrationPage.nameInput.click();

    await expect(registrationPage.getRepeatPasswordError()).toHaveText('Re-enter password required');
    await registrationPage.expectRedBorder(registrationPage.repeatPasswordInput);
    await registrationPage.expectRegisterButtonDisabled();
  });

  test('Negative: Re-enter password field shows error when passwords do not match', async () => {
    await registrationPage.fillPassword('Test1234');
    await registrationPage.fillRepeatPassword('Test1235');
    await registrationPage.nameInput.click();

    await expect(registrationPage.getRepeatPasswordError()).toHaveText('Passwords do not match');
    await registrationPage.expectRedBorder(registrationPage.repeatPasswordInput);
    await registrationPage.expectRegisterButtonDisabled();
  });
});