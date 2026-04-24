const { By } = require('selenium-webdriver');

const byId = (id) => By.id(id);
const byName = (name) => By.name(name);
const byTestId = (testId) => By.css(`[data-testid="${testId}"]`);

module.exports = {
  byId,
  byName,
  byTestId
};
