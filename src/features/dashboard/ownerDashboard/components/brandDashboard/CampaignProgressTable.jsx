import { Link } from 'react-router-dom';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';

function CampaignProgressTable({ campaigns, loading }) {
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      saved: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[status?.toLowerCase()] || colors.draft;
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 40) return 'bg-[#C1B6FD]';
    return 'bg-yellow-500';
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Campaign Progress</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-white/10 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Campaign Progress</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider py-4 px-3">
                Campaign
              </th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider py-4 px-3">
                Status
              </th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider py-4 px-3">
                Budget
              </th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider py-4 px-3">
                Spent
              </th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider py-4 px-3">
                Progress
              </th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider py-4 px-3">
                Dates
              </th>
            </tr>
          </thead>
          <tbody>
            {campaigns?.length > 0 ? (
              campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-3">
                    <Link
                      to={`/dashboard/owner/campaigns/${campaign.id}`}
                      className="text-white font-medium hover:text-[#C1B6FD] transition-colors"
                    >
                      {campaign.name || campaign.campaignName}
                    </Link>
                  </td>
                  <td className="py-4 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(campaign.status || campaign.lifecycleStage)}`}>
                      {campaign.status || campaign.lifecycleStage}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-gray-300 text-sm">
                    ${campaign.budget?.toLocaleString() || campaign.budget_amount?.toLocaleString() || '0'}
                  </td>
                  <td className="py-4 px-3 text-gray-300 text-sm">
                    ${campaign.spent?.toLocaleString() || '0'}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(campaign.progress)} transition-all duration-500`}
                          style={{ width: `${campaign.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-10">{campaign.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-gray-400 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(campaign.startDate)}</span>
                      <span className="text-gray-600">→</span>
                      <span>{formatDate(campaign.endDate)}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400">
                  No campaigns found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CampaignProgressTable;
