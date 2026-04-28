import { Routes, Route, Navigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import SocialMediaOverview from './SocialMediaOverview';
import ConnectedAccounts from './ConnectedAccounts';
import CreatePost from './CreatePost';


function SocialMediaLayout() {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<SocialMediaOverview />} />
        <Route path="accounts" element={<ConnectedAccounts />} />
        <Route path="channels" element={<ConnectedAccounts />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="schedule" element={<CreatePost />} />
        <Route path="content" element={<CreatePost />} />
      </Routes>
    </div>
  );
}

export default SocialMediaLayout;
