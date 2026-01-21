import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    dashboard: 'Dashboard',
    campaigns: 'Campaigns',
    'social-media': 'Social Media',
    analytics: 'Analytics',
    influencers: 'Influencers',
    overview: 'Overview',
    active: 'Active',
    discover: 'Discover',
    history: 'History',
    create: 'Create',
    performance: 'Performance',
    settings: 'Settings',
    audience: 'Audience',
    revenue: 'Revenue',
    accounts: 'Accounts',
    schedule: 'Schedule',
    content: 'Content',
  };

  return (
    <div className="flex items-center gap-2 text-sm mb-6">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-gray-400 hover:text-white transition-all"
      >
        <Home className="w-4 h-4" />
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = breadcrumbNameMap[value] || value;

        return (
          <div key={to} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-600" />
            {isLast ? (
              <span className="text-white font-medium">{displayName}</span>
            ) : (
              <Link
                to={to}
                className="text-gray-400 hover:text-white transition-all"
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Breadcrumb;
