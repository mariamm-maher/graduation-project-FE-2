const { Key } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const { byName } = require('../utils/selectors');
const { waitForUrlContains, waitForUrlNotContains } = require('../utils/waits');

class AuthPage extends BasePage {
  get emailInput() {
    return byName('email');
  }

  get passwordInput() {
    return byName('password');
  }

  get firstNameInput() {
    return byName('firstName');
  }

  get lastNameInput() {
    return byName('lastName');
  }

  async openLogin() {
    await this.open('/login');
    await this.findVisible(this.emailInput);
    await this.findVisible(this.passwordInput);
  }

  async openSignup() {
    await this.open('/signup');
    await this.findVisible(this.firstNameInput);
    await this.findVisible(this.lastNameInput);
    await this.findVisible(this.emailInput);
    await this.findVisible(this.passwordInput);
  }

  async submitWithEnterOnPassword() {
    const password = await this.findVisible(this.passwordInput);
    await password.sendKeys(Key.ENTER);
  }

  async login(email, password) {
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.submitWithEnterOnPassword();
  }

  async register({ firstName, lastName, email, password }) {
    await this.type(this.firstNameInput, firstName);
    await this.type(this.lastNameInput, lastName);
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.submitWithEnterOnPassword();
  }

  async waitUntilStayedOnLogin() {
    await waitForUrlContains(this.driver, '/login');
  }

  async waitUntilLeftLogin() {
    await waitForUrlNotContains(this.driver, '/login');
  }

  async getInputValidationMessage(locator) {
    const element = await this.findVisible(locator);
    return this.driver.executeScript('return arguments[0].validationMessage;', element);
  }
}

module.exports = AuthPage;
