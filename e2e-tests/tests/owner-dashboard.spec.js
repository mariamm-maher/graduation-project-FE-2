const { expect } = require('chai');
const { createDriver } = require('../utils/driverFactory');
const AuthPage = require('../pages/AuthPage');
const DashboardPage = require('../pages/DashboardPage');
const { waitForUrlContains, waitForUrlNotContains } = require('../utils/waits');

const OWNER_EMAIL = 'owner01@example.com';
const OWNER_PASSWORD = 'password123';

describe('Owner Dashboard Flow', function () {
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

  it('logs in with the provided owner credentials and lands on the owner dashboard', async function () {
    await authPage.openLogin();
    await authPage.login(OWNER_EMAIL, OWNER_PASSWORD);

    await waitForUrlNotContains(driver, '/login');
    const currentUrl = await authPage.getCurrentUrl();

    expect(currentUrl).to.include('/dashboard/owner');
  });

  it('keeps the owner session active while navigating dashboard routes', async function () {
    await authPage.openLogin();
    await authPage.login(OWNER_EMAIL, OWNER_PASSWORD);
    await waitForUrlContains(driver, '/dashboard/owner');

    await dashboardPage.openOwnerDashboard();
    await waitForUrlContains(driver, '/dashboard/owner');
    expect(await authPage.getCurrentUrl()).to.include('/dashboard/owner');

    await dashboardPage.openFeatureRouteByRole(await authPage.getCurrentUrl());
    const routeUrl = await authPage.getCurrentUrl();
    expect(routeUrl).to.satisfy((value) =>
      value.includes('/dashboard/owner') &&
      (value.includes('/campaigns') || value.includes('/collaborations') || value.includes('/social-media') || value.includes('/influencers'))
    );
  });

  it('logs out the owner session by clearing browser state and returning to the login gate', async function () {
    await authPage.openLogin();
    await authPage.login(OWNER_EMAIL, OWNER_PASSWORD);
    await waitForUrlContains(driver, '/dashboard/owner');

    await driver.executeScript('window.localStorage.clear();');
    await driver.executeScript('window.sessionStorage.clear();');
    await dashboardPage.openOwnerDashboard();

    await waitForUrlContains(driver, '/login');
    expect(await authPage.getCurrentUrl()).to.include('/login');
  });
});
