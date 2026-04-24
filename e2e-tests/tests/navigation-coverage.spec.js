const { expect } = require('chai');
const { createDriver } = require('../utils/driverFactory');
const LandingPage = require('../pages/LandingPage');
const AuthPage = require('../pages/AuthPage');
const config = require('../utils/config');
const { waitForUrlContains } = require('../utils/waits');

describe('Navigation Coverage', function () {
  let driver;
  let landingPage;
  let authPage;

  beforeEach(async function () {
    driver = await createDriver();
    landingPage = new LandingPage(driver);
    authPage = new AuthPage(driver);
  });

  afterEach(async function () {
    if (driver) await driver.quit();
  });

  it('loads the main landing sections without runtime navigation errors', async function () {
    await landingPage.openHome();

    await landingPage.waitForFeaturesSection();
    await landingPage.waitForCampaignPlannerSection();
    await landingPage.waitForCollaborationSection();

    const url = await landingPage.getCurrentUrl();
    expect(url).to.include('/');
  });

  it('opens auth routes and keeps the app on the expected path', async function () {
    await authPage.openLogin();
    await waitForUrlContains(driver, '/login');

    await authPage.openSignup();
    await waitForUrlContains(driver, '/signup');
  });

  it('redirects unknown routes to the 404 page', async function () {
    await driver.get(`${config.baseUrl}/this-route-should-not-exist`);
    await waitForUrlContains(driver, '/404');

    const url = await authPage.getCurrentUrl();
    expect(url).to.include('/404');
  });
});
