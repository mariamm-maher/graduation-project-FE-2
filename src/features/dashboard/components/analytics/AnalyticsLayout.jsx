import { Routes, Route, Navigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import AnalyticsOverview from './AnalyticsOverview';
import PerformanceMetrics from './PerformanceMetrics';
import AudienceInsights from './AudienceInsights';
import RevenueAnalytics from './RevenueAnalytics';

function AnalyticsLayout() {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AnalyticsOverview />} />
        <Route path="performance" element={<PerformanceMetrics />} />
        <Route path="audience" element={<AudienceInsights />} />
        <Route path="revenue" element={<RevenueAnalytics />} />
      </Routes>
    </div>
  );
}

export default AnalyticsLayout;
