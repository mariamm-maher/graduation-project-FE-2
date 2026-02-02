import {
  StatisticsChart,
  ActiveCampaignCards,
  PendingCampaigns,
  InfluencerActivity,
  ProfileCompletionWidget
} from './overview';

function MainContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300">
      {/* Left Column - Performance Stats & Active Collaborations */}
      <div className="lg:col-span-2 space-y-8">
        <StatisticsChart />
        <ActiveCampaignCards />
      </div>

      {/* Right Column - Available Campaigns & Recent Activity */}
      <div className="space-y-6">
        <ProfileCompletionWidget />
        <PendingCampaigns />
        <InfluencerActivity />

      </div>
    </div>
  );
}

export default MainContent;
