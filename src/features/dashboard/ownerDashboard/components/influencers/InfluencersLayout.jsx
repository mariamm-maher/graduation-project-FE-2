import { Routes, Route, Navigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import InfluencersOverview from './InfluencersOverview';
import ActiveInfluencers from './activeCollborators/ActiveInfluencers';
import DiscoverInfluencers from './DiscoverCollborators/DiscoverInfluencers';
import InfluencersHistory from './pastCollborators/InfluencersHistory';
import InfluencerProfile from './DiscoverCollborators/InfluencerProfile';
import SendCollabRequest from './DiscoverCollborators/SendCollabRequest';

function InfluencersLayout() {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<InfluencersOverview />} />
        <Route path="active" element={<ActiveInfluencers />} />
        <Route path="discover" element={<DiscoverInfluencers />} />
        <Route path="history" element={<InfluencersHistory />} />
        <Route path=":influencerId/profile" element={<InfluencerProfile />} />
        <Route path=":influencerId/sendcollbrequest" element={<SendCollabRequest />} />
      </Routes>
    </div>
  );
}

export default InfluencersLayout;
