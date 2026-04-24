const { expect } = require('chai');
const { createDriver } = require('../utils/driverFactory');
const AuthPage = require('../pages/AuthPage');

describe('Form Validation and UI Interactions', function () {
  let driver;
  let authPage;

  beforeEach(async function () {
    driver = await createDriver();
    authPage = new AuthPage(driver);
  });

  afterEach(async function () {
    if (driver) await driver.quit();
  });

  it('shows browser validation for invalid email format in login form', async function () {
    await authPage.openLogin();
    await authPage.login('invalid-email-format', 'AnyPassword123!');

    const validationMessage = await authPage.getInputValidationMessage(authPage.emailInput);
    expect(validationMessage).to.be.a('string');
    expect(validationMessage.length).to.be.greaterThan(0);

    const url = await authPage.getCurrentUrl();
    expect(url).to.include('/login');
  });

  it('enforces required fields in signup form', async function () {
    await authPage.openSignup();
    await authPage.submitWithEnterOnPassword();

    const firstNameMessage = await authPage.getInputValidationMessage(authPage.firstNameInput);
    expect(firstNameMessage).to.be.a('string');
    expect(firstNameMessage.length).to.be.greaterThan(0);

    const url = await authPage.getCurrentUrl();
    expect(url).to.include('/signup');
  });

  it('ensures auth inputs are visible, enabled, and interactive', async function () {
    await authPage.openSignup();

    const firstNameInput = await authPage.findVisible(authPage.firstNameInput);
    const lastNameInput = await authPage.findVisible(authPage.lastNameInput);
    const emailInput = await authPage.findVisible(authPage.emailInput);
    const passwordInput = await authPage.findVisible(authPage.passwordInput);

    expect(await firstNameInput.isEnabled()).to.equal(true);
    expect(await lastNameInput.isEnabled()).to.equal(true);
    expect(await emailInput.isEnabled()).to.equal(true);
    expect(await passwordInput.isEnabled()).to.equal(true);

    await firstNameInput.sendKeys('Auto');
    await lastNameInput.sendKeys('Tester');
    await emailInput.sendKeys('auto.tester@example.com');

    const typedEmail = await emailInput.getAttribute('value');
    expect(typedEmail).to.equal('auto.tester@example.com');
  });
});
