import { useState } from 'react';
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
import AdminSettingsPage from '../features/dashboard/adminDashboard/components/settings/AdminSettingsPage';

function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-linear-to-br from-[#000000] via-[#1a0933] to-[#372557] min-h-screen text-white overflow-x-hidden">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="relative z-0 p-3 sm:p-4 md:p-6 md:ml-20 lg:ml-32 transition-all duration-300">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          onOpenMenu={() => setIsMobileMenuOpen(true)}
        />
        <div className="max-w-full">
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
          <Route path="settings" element={<AdminSettingsPage />} />
        </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
