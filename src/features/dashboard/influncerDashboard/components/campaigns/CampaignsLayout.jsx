import { Routes, Route, Navigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import CampaignsOverview from './CampaignsOverview';
import SavedCampaigns from './SavedCampaigns';

import SingleCampaign from './SingleCampaign';

function CampaignsLayout() {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<CampaignsOverview />} />
        <Route path="saved" element={<SavedCampaigns />} />
    
        <Route path=":campaignId" element={<SingleCampaign />} />
      </Routes>
    </div>
  );
}

export default CampaignsLayout;
