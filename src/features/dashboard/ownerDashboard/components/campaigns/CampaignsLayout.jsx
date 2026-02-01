import { Routes, Route, Navigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import CampaignsOverview from './CampaignsOverview';
import AllCampaigns from './All/AllCampaigns';
import ActiveCampaigns from './Active/ActiveCampaigns';
import CreateCampaign from './create/CreateCampaign';
import GeneratedCampaign from './create/GeneratedCampaign';
import CompletedCampaigns from './completed/CompletedCampaigns';
import DraftCampaigns from './draft/DraftCampaigns';
import CampaignAnalytics from './analytics/CampaignAnalytics';
import SingleCampaign from './Single/SingleCampaign';

function CampaignsLayout() {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<CampaignsOverview />} />
        <Route path="all" element={<AllCampaigns />} />
        <Route path="active" element={<ActiveCampaigns />} />
        <Route path="create" element={<CreateCampaign />} />
        <Route path="completed" element={<CompletedCampaigns />} />
        <Route path="draft" element={<DraftCampaigns />} />
        <Route path="analytics" element={<CampaignAnalytics />} />
        <Route path="generated" element={<GeneratedCampaign />} />
        <Route path=":campaignId" element={<SingleCampaign />} />
      </Routes>
    </div>
  );
}

export default CampaignsLayout;
