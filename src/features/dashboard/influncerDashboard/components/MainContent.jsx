import { useEffect } from 'react';
import {
  StatisticsChart,
  ActiveCampaignCards,
  PendingCampaigns,
  InfluencerActivity,
  ProfileCompletionWidget
} from './overview';
import useInfluncerStore from '../../../../stores/influncerStore';

function MainContent() {
  const {
    overview,
    overviewLoading,
    overviewError,
    fetchInfluencerOverview,
  } = useInfluncerStore();

  useEffect(() => {
    fetchInfluencerOverview();
  }, [fetchInfluencerOverview]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300">
      {/* Left Column - Performance Stats & Active Collaborations */}
      <div className="lg:col-span-2 space-y-8">
        {overviewError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
            {overviewError}
          </div>
        )}
        <StatisticsChart
          kpis={overview?.kpis}
          performanceSeries={overview?.performanceSeries}
          loading={overviewLoading}
        />
        <ActiveCampaignCards
          collaborations={overview?.activeCollaborations}
          kpis={overview?.kpis}
          loading={overviewLoading}
        />
      </div>

      {/* Right Column - Available Campaigns & Recent Activity */}
      <div className="space-y-6">
        <ProfileCompletionWidget
          profileCompletion={overview?.profileCompletion}
          loading={overviewLoading}
        />
        <PendingCampaigns
          campaigns={overview?.availableCampaigns}
          loading={overviewLoading}
        />
        <InfluencerActivity
          feed={overview?.activityFeed}
          loading={overviewLoading}
        />

      </div>
    </div>
  );
}

export default MainContent;
