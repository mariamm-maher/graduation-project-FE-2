import { Routes, Route, Navigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import CampaignsOverview from './CampaignsOverview';
import ActiveCampaigns from './ActiveCampaigns';
import CreateCampaign from './CreateCampaign';
import CampaignsPerformance from './CampaignsPerformance';
import CreateCampaignAI from './CreateCompagin-AI/CreateCampaign';
import GeneratedCampaign from './GeneratedCampaign';
import SingleCampaign from './SingleCampaign';

function CampaignsLayout() {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<CampaignsOverview />} />
        <Route path="active" element={<ActiveCampaigns />} />
        <Route path="create" element={<CreateCampaign />} />
        <Route path="create-ai" element={<CreateCampaignAI />} />
        <Route path="generated" element={<GeneratedCampaign />} />
        <Route path="performance" element={<CampaignsPerformance />} />
        <Route path=":campaignId" element={<SingleCampaign />} />
      </Routes>
    </div>
  );
}

export default CampaignsLayout;
