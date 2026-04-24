const { expect } = require('chai');
const { createDriver } = require('../utils/driverFactory');
const LandingPage = require('../pages/LandingPage');
const AuthPage = require('../pages/AuthPage');
const { waitForUrlContains } = require('../utils/waits');

describe('Navigation Testing', function () {
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

  it('loads landing page and key sections by id', async function () {
    await landingPage.openHome();

    await landingPage.waitForFeaturesSection();
    await landingPage.waitForCampaignPlannerSection();
    await landingPage.waitForCollaborationSection();

    const url = await landingPage.getCurrentUrl();
    expect(url).to.include('/');
  });

  it('opens login and signup routes without errors', async function () {
    await authPage.openLogin();
    await waitForUrlContains(driver, '/login');

    await authPage.openSignup();
    await waitForUrlContains(driver, '/signup');
  });

  it('validates landing hash navigation targets', async function () {
    await landingPage.openSectionByHash('features');
    let url = await landingPage.getCurrentUrl();
    expect(url).to.include('#features');

    await landingPage.openSectionByHash('campaign-planner');
    url = await landingPage.getCurrentUrl();
    expect(url).to.include('#campaign-planner');
  });
});
