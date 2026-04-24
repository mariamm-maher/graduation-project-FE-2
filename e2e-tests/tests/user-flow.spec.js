const { expect } = require('chai');
const { createDriver } = require('../utils/driverFactory');
const AuthPage = require('../pages/AuthPage');
const DashboardPage = require('../pages/DashboardPage');
const LandingPage = require('../pages/LandingPage');
const { clearClientSession } = require('../utils/session');
const { waitForUrlContains, waitForUrlNotContains } = require('../utils/waits');

const OWNER_EMAIL = 'owner01@example.com';
const OWNER_PASSWORD = 'password123';

describe('Full User Flow', function () {
  let driver;
  let authPage;
  let dashboardPage;
  let landingPage;

  beforeEach(async function () {
    driver = await createDriver();
    authPage = new AuthPage(driver);
    dashboardPage = new DashboardPage(driver);
    landingPage = new LandingPage(driver);
  });

  afterEach(async function () {
    if (driver) await driver.quit();
  });

  it('simulates end-to-end journey: login -> feature route -> logout session check', async function () {
    await authPage.openLogin();
    await authPage.login(OWNER_EMAIL, OWNER_PASSWORD);
    await waitForUrlNotContains(driver, '/login');

    const initialPostLoginUrl = await authPage.getCurrentUrl();

    expect(initialPostLoginUrl).to.include('/dashboard/owner');

    const target = await dashboardPage.openFeatureRouteByRole(initialPostLoginUrl);
    if (target) {
      await waitForUrlContains(driver, target);
      const featureUrl = await authPage.getCurrentUrl();
      expect(featureUrl).to.include(target);
    } else {
      await landingPage.openHome();
      await landingPage.openSectionByHash('features');
      const featureUrl = await authPage.getCurrentUrl();
      expect(featureUrl).to.include('#features');
    }

    await clearClientSession(driver);
    await dashboardPage.openOwnerDashboard();
    await waitForUrlContains(driver, '/login');

    const finalUrl = await authPage.getCurrentUrl();
    expect(finalUrl).to.include('/login');
  });
});
