const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const toBool = (value, fallback = true) => {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value).toLowerCase() === 'true';
};

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

module.exports = {
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',
  browser: process.env.BROWSER || 'chrome',
  headless: toBool(process.env.HEADLESS, true),
  explicitWaitMs: toInt(process.env.EXPLICIT_WAIT_MS, 15000),
  validLoginEmail: process.env.VALID_LOGIN_EMAIL || '',
  validLoginPassword: process.env.VALID_LOGIN_PASSWORD || ''
};
