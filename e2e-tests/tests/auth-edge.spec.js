const { expect } = require('chai');
const { createDriver } = require('../utils/driverFactory');
const AuthPage = require('../pages/AuthPage');
const { waitForUrlContains } = require('../utils/waits');

describe('Authentication Edge Cases', function () {
  let driver;
  let authPage;

  beforeEach(async function () {
    driver = await createDriver();
    authPage = new AuthPage(driver);
  });

  afterEach(async function () {
    if (driver) await driver.quit();
  });

  it('shows required-field validation when login is submitted empty', async function () {
    await authPage.openLogin();
    await authPage.submitWithEnterOnPassword();

    const emailMessage = await authPage.getInputValidationMessage(authPage.emailInput);
    const passwordMessage = await authPage.getInputValidationMessage(authPage.passwordInput);

    expect(emailMessage).to.be.a('string');
    expect(passwordMessage).to.be.a('string');
    expect(emailMessage.length + passwordMessage.length).to.be.greaterThan(0);
  });

  it('rejects invalid signup formats and handles very long input values safely', async function () {
    await authPage.openSignup();

    const longName = 'a'.repeat(180);
    const longEmail = `${'b'.repeat(120)}example.com`;

    await authPage.type(authPage.firstNameInput, longName);
    await authPage.type(authPage.lastNameInput, longName);
    await authPage.type(authPage.emailInput, longEmail);
    await authPage.type(authPage.passwordInput, 'short');
    await authPage.submitWithEnterOnPassword();

    const emailMessage = await authPage.getInputValidationMessage(authPage.emailInput);
    const passwordMessage = await authPage.getInputValidationMessage(authPage.passwordInput);
    const firstNameValue = await (await authPage.findVisible(authPage.firstNameInput)).getAttribute('value');

    expect(emailMessage).to.be.a('string');
    expect(passwordMessage).to.be.a('string');
    expect(firstNameValue).to.equal(longName);
    expect(await authPage.getCurrentUrl()).to.include('/signup');
  });

  it('keeps the login page stable during rapid double submit with invalid credentials', async function () {
    await authPage.openLogin();
    await authPage.type(authPage.emailInput, 'rapid.click@example.com');
    await authPage.type(authPage.passwordInput, 'WrongPassword123!');

    await authPage.submitWithEnterOnPassword();
    await authPage.submitWithEnterOnPassword();

    await waitForUrlContains(driver, '/login');
    const url = await authPage.getCurrentUrl();
    expect(url).to.include('/login');
  });
});
