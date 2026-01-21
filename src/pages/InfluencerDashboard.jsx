import { Routes, Route, Navigate } from 'react-router-dom';
import { Header, Sidebar, MainContent } from '../features/dashboard/influncerDashboard/components';
import CampaignsLayout from '../features/dashboard/influncerDashboard/components/campaigns/CampaignsLayout';
import CollaborationsLayout from '../features/dashboard/influncerDashboard/components/collaborations/CollaborationsLayout';
import Profile from '../features/dashboard/influncerDashboard/components/profile/Profile';

function InfluencerDashboard() {
  return (
    <div className="bg-gradient-to-br from-[#000000] via-[#1a0933] to-[#372557] min-h-screen text-white p-3 sm:p-4 md:p-6 overflow-x-hidden">
      <Header />
      <Sidebar />
      <div className="ml-0 md:ml-20 lg:ml-32 transition-all duration-300 max-w-full">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="campaigns/*" element={<CampaignsLayout />} />
          <Route path="collaborations/*" element={<CollaborationsLayout />} />
          <Route path="profile" element={<Profile />} />
          <Route path="social-media/*" element={<div>Social Media Content</div>} />
          <Route path="analytics/*" element={<div>Performance Analytics</div>} />
          <Route path="messages/*" element={<div>Messages</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default InfluencerDashboard;
