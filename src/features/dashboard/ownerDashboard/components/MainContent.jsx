import { useEffect } from 'react';
import { 
  StatisticsChart, 
  ActiveCampaignCards, 
  PendingCampaigns, 
  InfluencerActivity
} from './overview';
import useOwnerStore from '../../../../stores/ownerStore';

function MainContent() {
  const {
    ownerOverview,
    overviewLoading,
    overviewError,
    fetchOverview,
  } = useOwnerStore();

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  console.log('Owner Overview Data:', ownerOverview);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300">
      {/* Left Column - Campaign Performance & Active Campaigns */}
      <div className="lg:col-span-2 space-y-8">
        {overviewError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
            {overviewError}
          </div>
        )}
        <StatisticsChart
          kpis={ownerOverview?.kpis}
          performanceSeries={ownerOverview?.performanceSeries}
          communicationsFeed={ownerOverview?.communicationsFeed}
          activeCampaigns={ownerOverview?.activeCampaigns}
          loading={overviewLoading}
        />
        <ActiveCampaignCards
          campaigns={ownerOverview?.activeCampaigns}
          kpis={ownerOverview?.kpis}
          loading={overviewLoading}
        />
      </div>

      {/* Right Column - Sidebar Widgets */}
      <div className="space-y-6">
        <PendingCampaigns
          campaigns={ownerOverview?.pendingCampaigns}
          loading={overviewLoading}
        />
        <InfluencerActivity
          feed={ownerOverview?.communicationsFeed}
          loading={overviewLoading}
        />
  
      </div>
    </div>
  );
}

export default MainContent;
