const config = require('../utils/config');
const { waitForVisible, waitForClickable } = require('../utils/waits');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(path = '/') {
    await this.driver.get(`${config.baseUrl}${path}`);
  }

  async findVisible(locator) {
    return waitForVisible(this.driver, locator);
  }

  async findClickable(locator) {
    return waitForClickable(this.driver, locator);
  }

  async type(locator, value) {
    const element = await this.findVisible(locator);
    await element.clear();
    await element.sendKeys(value);
  }

  async getCurrentUrl() {
    return this.driver.getCurrentUrl();
  }
}

module.exports = BasePage;
