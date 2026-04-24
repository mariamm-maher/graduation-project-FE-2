const EXPIRY_OFFSET_SECONDS = 60;
const config = require('./config');

function buildPersistedAuthState({ user = null, token = 'expired.token.value', isAuthenticated = true } = {}) {
  return JSON.stringify({
    state: {
      user,
      token,
      isAuthenticated
    },
    version: 0
  });
}

function buildExpiredAuthPayload() {
  const expiredAt = Math.floor(Date.now() / 1000) - EXPIRY_OFFSET_SECONDS;
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ exp: expiredAt })).toString('base64url');
  return `${header}.${payload}.signature`;
}

async function seedExpiredSession(driver, user = { userId: 42, email: 'expired.session@example.com' }) {
  await driver.get(`${config.baseUrl}/`);
  const token = buildExpiredAuthPayload();
  const persistedState = buildPersistedAuthState({
    user,
    token,
    isAuthenticated: true
  });

  await driver.executeScript(
    'window.localStorage.setItem(arguments[0], arguments[1]);',
    'auth-storage',
    persistedState
  );
}

async function clearPersistedSession(driver) {
  await driver.get(`${config.baseUrl}/`);
  await driver.executeScript('window.localStorage.removeItem(arguments[0]);', 'auth-storage');
  await driver.executeScript('window.localStorage.clear();');
  await driver.executeScript('window.sessionStorage.clear();');
}

module.exports = {
  clearPersistedSession,
  seedExpiredSession,
  buildPersistedAuthState,
  buildExpiredAuthPayload
};
