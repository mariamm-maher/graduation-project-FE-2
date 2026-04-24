const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const config = require('./config');

async function createDriver() {
  if (config.browser !== 'chrome') {
    throw new Error(`Unsupported browser: ${config.browser}. This suite only supports chrome.`);
  }

  const options = new chrome.Options();
  options.addArguments('--window-size=1440,900');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  if (config.headless) {
    options.addArguments('--headless=new');
  }

  const service = new chrome.ServiceBuilder(chromedriver.path);

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(service)
    .build();
}

module.exports = {
  createDriver
};
