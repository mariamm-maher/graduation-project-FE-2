const { until } = require('selenium-webdriver');
const config = require('./config');

async function waitForVisible(driver, locator, timeoutMs = config.explicitWaitMs) {
  const element = await driver.wait(until.elementLocated(locator), timeoutMs);
  await driver.wait(until.elementIsVisible(element), timeoutMs);
  return element;
}

async function waitForClickable(driver, locator, timeoutMs = config.explicitWaitMs) {
  const element = await waitForVisible(driver, locator, timeoutMs);
  await driver.wait(until.elementIsEnabled(element), timeoutMs);
  return element;
}

async function waitForUrlContains(driver, segment, timeoutMs = config.explicitWaitMs) {
  await driver.wait(async () => {
    const current = await driver.getCurrentUrl();
    return current.includes(segment);
  }, timeoutMs);
}

async function waitForUrlNotContains(driver, segment, timeoutMs = config.explicitWaitMs) {
  await driver.wait(async () => {
    const current = await driver.getCurrentUrl();
    return !current.includes(segment);
  }, timeoutMs);
}

module.exports = {
  waitForVisible,
  waitForClickable,
  waitForUrlContains,
  waitForUrlNotContains
};
