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
          <Route path="collaborations/*" element={<CollaborationsLayout />} />
          <Route path="logs" element={<LogsOverview />} />
          <Route path="announcements" element={<AnnouncementsOverview />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
