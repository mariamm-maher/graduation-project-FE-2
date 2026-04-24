async function clearClientSession(driver) {
  await driver.executeScript('window.localStorage.clear();');
  await driver.executeScript('window.sessionStorage.clear();');

  const cookies = await driver.manage().getCookies();
  if (cookies.length > 0) {
    await driver.manage().deleteAllCookies();
  }
}

module.exports = {
  clearClientSession
};
