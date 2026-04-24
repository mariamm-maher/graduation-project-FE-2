const { expect } = require('chai');
const { createDriver } = require('../utils/driverFactory');
const AuthPage = require('../pages/AuthPage');
const DashboardPage = require('../pages/DashboardPage');
const { waitForUrlContains, waitForUrlNotContains } = require('../utils/waits');

const INFLUENCER_EMAIL = 'influencer01@example.com';
const INFLUENCER_PASSWORD = 'password123';

describe('Influencer Dashboard Flow', function () {
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

  it('logs in with the provided influencer credentials and lands on the influencer dashboard', async function () {
    await authPage.openLogin();
    await authPage.login(INFLUENCER_EMAIL, INFLUENCER_PASSWORD);

    await waitForUrlNotContains(driver, '/login');
    const currentUrl = await authPage.getCurrentUrl();

    expect(currentUrl).to.include('/dashboard/influencer');
  });

  it('keeps the influencer session active while navigating dashboard routes', async function () {
    await authPage.openLogin();
    await authPage.login(INFLUENCER_EMAIL, INFLUENCER_PASSWORD);
    await waitForUrlContains(driver, '/dashboard/influencer');

    await dashboardPage.openInfluencerDashboard();
    await waitForUrlContains(driver, '/dashboard/influencer');
    expect(await authPage.getCurrentUrl()).to.include('/dashboard/influencer');

    await dashboardPage.openFeatureRouteByRole(await authPage.getCurrentUrl());
    const routeUrl = await authPage.getCurrentUrl();
    expect(routeUrl).to.satisfy((value) =>
      value.includes('/dashboard/influencer') &&
      (value.includes('/campaigns') || value.includes('/collaborations') || value.includes('/messages') || value.includes('/analytics'))
    );
  });

  it('logs out the influencer session by clearing browser state and returning to the login gate', async function () {
    await authPage.openLogin();
    await authPage.login(INFLUENCER_EMAIL, INFLUENCER_PASSWORD);
    await waitForUrlContains(driver, '/dashboard/influencer');

    await driver.executeScript('window.localStorage.clear();');
    await driver.executeScript('window.sessionStorage.clear();');
    await dashboardPage.openInfluencerDashboard();

    await waitForUrlContains(driver, '/login');
    expect(await authPage.getCurrentUrl()).to.include('/login');
  });
});
