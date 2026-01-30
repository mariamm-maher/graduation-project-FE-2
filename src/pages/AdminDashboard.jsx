import { Routes, Route } from 'react-router-dom';
import { Header, Sidebar, MainContent } from '../features/dashboard/adminDashboard/components';
import CollaborationsLayout from '../features/dashboard/adminDashboard/components/collaborations/CollaborationsLayout';
import AccountsOverview from '../features/dashboard/adminDashboard/components/accounts/AccountsOverview';
import UserDetail from '../features/dashboard/adminDashboard/components/accounts/UserDetail';
import SessionsOverview from '../features/dashboard/adminDashboard/components/sessions/SessionsOverview';

function AdminDashboard() {
  return (
    <div className="bg-gradient-to-br from-[#000000] via-[#1a0933] to-[#372557] min-h-screen text-white p-3 sm:p-4 md:p-6 overflow-x-hidden">
      <Header />
      <Sidebar />
      <div className="ml-0 md:ml-20 lg:ml-32 transition-all duration-300 max-w-full">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="accounts" element={<AccountsOverview />} />
          <Route path="accounts/:id" element={<UserDetail />} />
          <Route path="sessions" element={<SessionsOverview />} />
          <Route path="collaborations/*" element={<CollaborationsLayout />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
