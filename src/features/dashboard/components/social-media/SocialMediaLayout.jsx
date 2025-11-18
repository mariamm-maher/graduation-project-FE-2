import { Routes, Route, Navigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import SocialMediaOverview from './SocialMediaOverview';
import ConnectedAccounts from './ConnectedAccounts';


function SocialMediaLayout() {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<SocialMediaOverview />} />
        <Route path="accounts" element={<ConnectedAccounts />} />
       
      </Routes>
    </div>
  );
}

export default SocialMediaLayout;
