import { Routes, Route, Navigate } from 'react-router-dom';
import { Header, Sidebar, MainContent, CollaborationsLayout } from '../features/dashboard/components';
import CampaignsLayout from '../features/dashboard/components/campaigns/CampaignsLayout';
import AnalyticsLayout from '../features/dashboard/components/analytics/AnalyticsLayout';
import InfluencersLayout from '../features/dashboard/components/influencers/InfluencersLayout';
import SocialMediaLayout from '../features/dashboard/components/social-media/SocialMediaLayout';
//2d1654
function Dashboard() {
  return (
    <div className="bg-gradient-to-br from-[#000000] via-[#1a0933] to-[#372557] min-h-screen text-white p-3 sm:p-4 md:p-6 overflow-x-hidden">
      <Header />
      <Sidebar />
      <div className="ml-0 md:ml-20 lg:ml-32 transition-all duration-300 max-w-full">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/campaigns/*" element={<CampaignsLayout />} />
          <Route path="/analytics/*" element={<AnalyticsLayout />} />
          <Route path="/influencers/*" element={<InfluencersLayout />} />
          <Route path="/collaborations/*" element={<CollaborationsLayout />} />
          <Route path="/social-media/*" element={<SocialMediaLayout />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;