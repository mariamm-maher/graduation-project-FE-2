const BasePage = require('./BasePage');
const { byId } = require('../utils/selectors');

class LandingPage extends BasePage {
  async openHome() {
    await this.open('/');
  }

  async waitForFeaturesSection() {
    return this.findVisible(byId('features'));
  }

  async waitForCampaignPlannerSection() {
    return this.findVisible(byId('campaign-planner'));
  }

  async waitForCollaborationSection() {
    return this.findVisible(byId('collaboration'));
  }

  async openSectionByHash(hashId) {
    await this.open(`/#${hashId}`);
    return this.findVisible(byId(hashId));
  }
}

module.exports = LandingPage;
