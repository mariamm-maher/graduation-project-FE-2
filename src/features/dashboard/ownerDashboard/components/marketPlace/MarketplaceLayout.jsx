import { Routes, Route, Navigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import MarketplaceOverview from './MarketplaceOverview';
import ServiceDetail from './ServiceDetail';
import SendOffer from './SendOffer';

function MarketplaceLayout() {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <Routes>
        <Route index element={<Navigate to="browse" replace />} />
        <Route path="browse" element={<MarketplaceOverview />} />
        <Route path="services/:serviceId" element={<ServiceDetail />} />
        <Route path="services/:serviceId/offer" element={<SendOffer />} />
      </Routes>
    </div>
  );
}

export default MarketplaceLayout;
