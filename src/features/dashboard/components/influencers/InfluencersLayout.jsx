import { Routes, Route, Navigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import InfluencersOverview from './InfluencersOverview';
import ActiveInfluencers from './ActiveInfluencers';
import DiscoverInfluencers from './DiscoverInfluencers';
import InfluencersHistory from './InfluencersHistory';
import InfluencerProfile from './InfluencerProfile';

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
      </Routes>
    </div>
  );
}

export default InfluencersLayout;
