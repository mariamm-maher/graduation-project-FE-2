import { Routes, Route } from 'react-router-dom';
import {
  Header,
  Sidebar,
  MainContent,
  OverviewDashboard,
  AccountsOverview,
  SessionsOverview,
  CampaignsOverview,
  CollaborationsLayout,
  LogsOverview,
  AnnouncementsOverview
} from '../features/dashboard/adminDashboard/components';
import UserDetail from '../features/dashboard/adminDashboard/components/accounts/UserDetail';
import CampaignDetail from '../features/dashboard/adminDashboard/components/campaigns/CampaignDetail';
import { SettingsPanel } from '../features/settings';

function AdminDashboard() {
  return (
    <div className="bg-gradient-to-br from-[#000000] via-[#1a0933] to-[#372557] min-h-screen text-white p-3 sm:p-4 md:p-6 overflow-x-hidden">
      <Header />
      <Sidebar />
      <div className="ml-0 md:ml-20 lg:ml-32 transition-all duration-300 max-w-full">
        <Routes>
          <Route path="/" element={<OverviewDashboard />} />
          <Route path="users" element={<AccountsOverview />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="sessions" element={<SessionsOverview />} />
          <Route path="campaigns" element={<CampaignsOverview />} />
          <Route path="campaigns/:id" element={<CampaignDetail />} />
          <Route path="collaborations/*" element={<CollaborationsLayout />} />
          <Route path="logs" element={<LogsOverview />} />
          <Route path="announcements" element={<AnnouncementsOverview />} />
          <Route path="settings" element={
            <div className="p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-sm sm:text-base text-gray-400 mb-6">Manage your account settings, privacy, and preferences</p>
              <SettingsPanel />
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
