import { 
  StatisticsChart, 
  ActiveCampaignCards, 
  PendingCampaigns, 
  InfluencerActivity
} from './overview';

function MainContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300">
      {/* Left Column - Campaign Performance & Active Campaigns */}
      <div className="lg:col-span-2 space-y-8">
        <StatisticsChart />
        <ActiveCampaignCards />
      </div>

      {/* Right Column - Sidebar Widgets */}
      <div className="space-y-6">
        <PendingCampaigns />
        <InfluencerActivity />
  
      </div>
    </div>
  );
}

export default MainContent;
