import { Search, CheckCircle, Download, FileText, Calendar, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaigns } from '../campaignsData';

function CompletedCampaigns() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filter only completed campaigns based on lifecycleStage
  const completedCampaigns = campaigns.filter(campaign => 
    campaign.lifecycleStage === 'completed' &&
    (searchQuery === '' || 
     campaign.campaignName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     campaign.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate campaign duration in days
  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate total budget spent and collaborations
  const getTotalBudget = () => {
    return completedCampaigns.reduce((sum, c) => sum + (c.totalBudget || 0), 0);
  };

  const getTotalCollaborations = () => {
    return completedCampaigns.reduce((sum, c) => sum + (c.collaboratorsCount || 0), 0);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            Completed Campaigns
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Historical reference and evaluation ({completedCampaigns.length})
          </p>
        </div>
        <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Export All Reports
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-md border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Completed</p>
          <p className="text-2xl font-bold text-green-400">{completedCampaigns.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-white">${getTotalBudget().toLocaleString()}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Collaborations</p>
          <p className="text-2xl font-bold text-white">{getTotalCollaborations()}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Avg Duration</p>
          <p className="text-2xl font-bold text-white">
            {completedCampaigns.length > 0 
              ? Math.round(completedCampaigns.reduce((sum, c) => sum + getDuration(c.startDate, c.endDate), 0) / completedCampaigns.length)
              : 0} days
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search completed campaigns..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Campaigns Table */}
      {completedCampaigns.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Completed Campaigns</h3>
          <p className="text-gray-400">You don't have any completed campaigns yet.</p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Campaign Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Duration</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Final Budget</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Collaborations</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Completion Date</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedCampaigns.map((campaign, index) => (
                  <tr 
                    key={campaign.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      index === completedCampaigns.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{campaign.campaignName || campaign.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{campaign.goalType?.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{getDuration(campaign.startDate, campaign.endDate)} days</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-white">
                          {campaign.currency || '$'}{typeof campaign.totalBudget === 'number' 
                            ? campaign.totalBudget.toLocaleString() 
                            : campaign.budget}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-center">
                        <p className="text-lg font-bold text-white">{campaign.collaboratorsCount || 0}</p>
                        <p className="text-xs text-gray-400">collaborators</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-green-400">{formatDate(campaign.endDate)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {Math.floor((new Date() - new Date(campaign.endDate)) / (1000 * 60 * 60 * 24))} days ago
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => navigate(`/dashboard/owner/campaigns/${campaign.id}/report`)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all inline-flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-white/10">
            {completedCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-5 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white mb-1">{campaign.campaignName || campaign.name}</h3>
                    <p className="text-xs text-gray-400 capitalize">{campaign.goalType?.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Duration</p>
                    <p className="text-sm font-semibold text-white">{getDuration(campaign.startDate, campaign.endDate)} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Budget</p>
                    <p className="text-sm font-semibold text-white">
                      {campaign.currency || '$'}{typeof campaign.totalBudget === 'number' 
                        ? campaign.totalBudget.toLocaleString() 
                        : campaign.budget}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Collaborations</p>
                    <p className="text-sm font-semibold text-white">{campaign.collaboratorsCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Completed</p>
                    <p className="text-sm font-semibold text-green-400">{formatDate(campaign.endDate)}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/dashboard/owner/campaigns/${campaign.id}/report`)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Report
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CompletedCampaigns;
