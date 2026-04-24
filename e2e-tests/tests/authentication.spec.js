const { expect } = require('chai');
const { createDriver } = require('../utils/driverFactory');
const AuthPage = require('../pages/AuthPage');
const DashboardPage = require('../pages/DashboardPage');
const { clearClientSession } = require('../utils/session');
const { waitForUrlContains, waitForUrlNotContains } = require('../utils/waits');

const OWNER_EMAIL = 'owner01@example.com';
const OWNER_PASSWORD = 'password123';

describe('Authentication Testing', function () {
  let driver;
  let authPage;
  let dashboardPage;

  beforeEach(async function () {
    driver = await createDriver();
    authPage = new AuthPage(driver);
    dashboardPage = new DashboardPage(driver);
  });

  afterEach(async function () {
    if (driver) await driver.quit();
  });

  it('rejects invalid login credentials and stays on login', async function () {
    await authPage.openLogin();
    await authPage.login('invalid.user@example.com', 'WrongPassword123!');

    await authPage.waitUntilStayedOnLogin();
    const url = await authPage.getCurrentUrl();
    expect(url).to.include('/login');

    const emailInput = await authPage.findVisible(authPage.emailInput);
    const passwordInput = await authPage.findVisible(authPage.passwordInput);
    expect(await emailInput.isDisplayed()).to.equal(true);
    expect(await passwordInput.isDisplayed()).to.equal(true);
  });

  it('logs in with valid credentials and supports external session logout check', async function () {
    await authPage.openLogin();
    await authPage.login(OWNER_EMAIL, OWNER_PASSWORD);
    await waitForUrlNotContains(driver, '/login');

    const postLoginUrl = await authPage.getCurrentUrl();
    expect(postLoginUrl).to.include('/dashboard/owner');

    await clearClientSession(driver);
    await dashboardPage.openOwnerDashboard();
    await waitForUrlContains(driver, '/login');

    const afterLogoutUrl = await authPage.getCurrentUrl();
    expect(afterLogoutUrl).to.include('/login');
  });
});
