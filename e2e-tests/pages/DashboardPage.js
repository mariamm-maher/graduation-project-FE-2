const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
  async openOwnerDashboard() {
    await this.open('/dashboard/owner');
  }

  async openInfluencerDashboard() {
    await this.open('/dashboard/influencer');
  }

  async openAdminDashboard() {
    await this.open('/dashboard/admin');
  }

  async openFeatureRouteByRole(currentUrl) {
    if (currentUrl.includes('/dashboard/owner')) {
      await this.open('/dashboard/owner/campaigns');
      return '/dashboard/owner/campaigns';
    }

    if (currentUrl.includes('/dashboard/influencer')) {
      await this.open('/dashboard/influencer/campaigns');
      return '/dashboard/influencer/campaigns';
    }

    if (currentUrl.includes('/dashboard/admin')) {
      await this.open('/dashboard/admin/users');
      return '/dashboard/admin/users';
    }

    return null;
  }
}

module.exports = DashboardPage;
