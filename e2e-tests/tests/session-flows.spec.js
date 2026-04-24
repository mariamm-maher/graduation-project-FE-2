const { expect } = require('chai');
const { createDriver } = require('../utils/driverFactory');
const AuthPage = require('../pages/AuthPage');
const DashboardPage = require('../pages/DashboardPage');
const config = require('../utils/config');
const { clearPersistedSession, seedExpiredSession } = require('../utils/authSession');
const { waitForUrlContains, waitForUrlNotContains } = require('../utils/waits');

describe('Session and Protected Route Flows', function () {
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

  it('redirects unauthenticated visitors away from protected dashboards', async function () {
    await clearPersistedSession(driver);

    await dashboardPage.openOwnerDashboard();
    await waitForUrlContains(driver, '/login');
    expect(await authPage.getCurrentUrl()).to.include('/login');

    await dashboardPage.openInfluencerDashboard();
    await waitForUrlContains(driver, '/login');
    expect(await authPage.getCurrentUrl()).to.include('/login');

    await dashboardPage.openAdminDashboard();
    await waitForUrlContains(driver, '/login');
    expect(await authPage.getCurrentUrl()).to.include('/login');
  });

  it('treats an expired persisted session as invalid and redirects to login', async function () {
    await seedExpiredSession(driver);

    await driver.get(`${config.baseUrl}/`);
    await dashboardPage.openOwnerDashboard();

    await waitForUrlContains(driver, '/login');
    const url = await authPage.getCurrentUrl();
    expect(url).to.include('/login');
  });

  it('registers a new account and continues through a refresh without losing session state', async function () {
    const unique = `qa.${Date.now()}@example.com`;
    const credentials = {
      firstName: 'E2E',
      lastName: 'Tester',
      email: unique,
      password: 'StrongPass123!'
    };

    await clearPersistedSession(driver);
    await authPage.openSignup();
    await authPage.register(credentials);

    await waitForUrlContains(driver, '/role-selection');
    const postRegisterUrl = await authPage.getCurrentUrl();
    expect(postRegisterUrl).to.include('/role-selection');

    await driver.navigate().refresh();
    await waitForUrlContains(driver, '/role-selection');
    expect(await authPage.getCurrentUrl()).to.include('/role-selection');

    await authPage.openLogin();
    await authPage.login(credentials.email, credentials.password);
    await waitForUrlNotContains(driver, '/login');

    const postLoginUrl = await authPage.getCurrentUrl();
    expect(postLoginUrl).to.not.include('/login');

    await driver.navigate().refresh();
    await waitForUrlNotContains(driver, '/login');
    expect(await authPage.getCurrentUrl()).to.not.include('/login');

    await clearPersistedSession(driver);
    await dashboardPage.openAdminDashboard();
    await waitForUrlContains(driver, '/login');
    expect(await authPage.getCurrentUrl()).to.include('/login');
  });
});
