import { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BrandHealthScore,
  KPICards,
  PerformanceChart,
  CampaignProgressTable,
  BusinessGoalsTracker,
  TopChannels,
  TopInfluencers,
  AIInsights,
  RecentActivityFeed,
} from './brandDashboard';
import PlatformAnalytics from './brandDashboard/PlatformAnalytics';
import useBrandDashboardStore from '../../../../stores/brandDashboardStore';

function MainContent() {
  const {
    dashboardData,
    aiInsights,
    performanceTrend,
    isLoading,
    isInsightsLoading,
    isTrendLoading,
    error,
    activeChartPeriod,
    activeChartMetric,
    platformData,
    isPlatformLoading,
    activePlatform,
    fetchDashboard,
    fetchAIInsights,
    fetchPlatformAnalytics,
    fetchPerformanceTrend,
    setChartPeriod,
    setChartMetric,
    setActivePlatform,
    clearError,
  } = useBrandDashboardStore();

  const [dismissedError, setDismissedError] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchAIInsights();
    fetchPlatformAnalytics();
  }, [fetchDashboard, fetchAIInsights, fetchPlatformAnalytics]);

  useEffect(() => {
    fetchPerformanceTrend(activeChartPeriod, activeChartMetric);
  }, [activeChartMetric, activeChartPeriod, fetchPerformanceTrend]);

  const handleDismissError = () => {
    setDismissedError(true);
    clearError();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10">
      {/* Header with Create Campaign Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Brand Performance Dashboard</h2>
        <Link
          to="/dashboard/owner/campaigns/create"
          className="flex items-center gap-2 px-4 py-2 bg-[#745CB4] hover:bg-[#5a4894] text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </Link>
      </div>

      {/* Global Error Banner */}
      {error && !dismissedError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={handleDismissError}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Row 1: Brand Health Score + KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <BrandHealthScore
          score={dashboardData?.brandHealth?.score}
          trend={dashboardData?.brandHealth?.trend}
          status={dashboardData?.brandHealth?.status}
          loading={isLoading}
        />
        <div className="lg:col-span-3">
          <KPICards
            kpis={dashboardData?.kpis}
            loading={isLoading}
          />
        </div>
      </div>

      {/* Row 2: Performance Chart */}
      <div className="w-full" style={{ minHeight: '256px' }}>
        <PerformanceChart
          data={performanceTrend || dashboardData?.performanceTrend}
          period={activeChartPeriod}
          metric={activeChartMetric}
          onPeriodChange={setChartPeriod}
          onMetricChange={setChartMetric}
          loading={isLoading || isTrendLoading}
        />
      </div>

      {/* Row 3: Campaign Progress Table + Business Goals Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CampaignProgressTable
            campaigns={dashboardData?.campaigns}
            loading={isLoading}
          />
        </div>
        <BusinessGoalsTracker
          goals={dashboardData?.goals}
          loading={isLoading}
        />
      </div>

      {/* Row 4: Platform Analytics */}
      <div className="col-span-full bg-white/5 border border-white/10
                      rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-white/60 uppercase
                         tracking-wider">
            Platform Analytics
          </h3>
        </div>
        <PlatformAnalytics
          platforms={platformData ?? []}
          activePlatform={activePlatform}
          onPlatformChange={setActivePlatform}
          loading={isPlatformLoading}
        />
      </div>

      {/* Row 5: Top Channels + Top Influencers + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <TopChannels
          channels={dashboardData?.channels}
          loading={isLoading}
        />
        <TopInfluencers
          influencers={dashboardData?.influencers}
          loading={isLoading}
        />
        <AIInsights
          insights={aiInsights?.insights}
          recommendations={aiInsights?.recommendations}
          loading={isLoading}
          isInsightsLoading={isInsightsLoading}
        />
      </div>

      {/* Row 6: Recent Activity Feed */}
      <RecentActivityFeed
        activities={dashboardData?.recentActivity}
        loading={isLoading}
      />
    </div>
  );
}

export default MainContent;
