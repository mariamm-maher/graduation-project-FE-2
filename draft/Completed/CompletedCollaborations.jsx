import { Search, CheckCircle, Download, Award, Calendar, DollarSign, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CompletedCollaborations() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock data - Filter: Collaboration.status = 'completed'
  const completedCollaborations = [
    {
      id: 2,
      campaignId: 2,
      campaignName: 'Holiday Collection 2024',
      influencerId: 3,
      influencerName: 'Mike Chen',
      contractId: 2,
      status: 'completed',
      budget: 8000,
      startDate: '2025-11-01',
      endDate: '2025-12-31',
      completedAt: '2025-12-31',
      // Performance metrics
      totalTasks: 20,
      completedTasks: 20,
      postedContent: 15,
      totalReach: 450000,
      engagementRate: 5.8,
      createdAt: '2025-10-25'
    },
    {
      id: 6,
      campaignId: 5,
      campaignName: 'Back to School 2024',
      influencerId: 7,
      influencerName: 'Jennifer Lee',
      contractId: 6,
      status: 'completed',
      budget: 6500,
      startDate: '2025-08-01',
      endDate: '2025-09-15',
      completedAt: '2025-09-15',
      totalTasks: 18,
      completedTasks: 18,
      postedContent: 12,
      totalReach: 320000,
      engagementRate: 6.2,
      createdAt: '2025-07-20'
    }
  ];

  const filteredCollaborations = completedCollaborations.filter(collab =>
    searchQuery === '' ||
    collab.campaignName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collab.influencerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            Completed Collaborations
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Historical reference and performance evaluation ({filteredCollaborations.length})
          </p>
        </div>
        <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Export Reports
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-md border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Completed</p>
          <p className="text-2xl font-bold text-green-400">{completedCollaborations.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-white">
            ${completedCollaborations.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Content Delivered</p>
          <p className="text-2xl font-bold text-white">
            {completedCollaborations.reduce((sum, c) => sum + c.postedContent, 0)}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Avg Engagement</p>
          <p className="text-2xl font-bold text-green-400">
            {(completedCollaborations.reduce((sum, c) => sum + c.engagementRate, 0) / completedCollaborations.length).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search completed collaborations..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
        />
      </div>

      {/* Table View */}
      {filteredCollaborations.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Completed Collaborations</h3>
          <p className="text-gray-400">You don't have any completed collaborations yet</p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Campaign</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Influencer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Duration</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Budget</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Performance</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Completed</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCollaborations.map((collab, index) => (
                  <tr
                    key={collab.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      index === filteredCollaborations.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{collab.campaignName}</p>
                          <p className="text-xs text-gray-400">Campaign #{collab.campaignId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{collab.influencerName}</p>
                          <p className="text-xs text-gray-400">{collab.postedContent} posts</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-sm text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{getDuration(collab.startDate, collab.endDate)} days</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(collab.startDate)} - {formatDate(collab.endDate)}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-white">{collab.budget.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <p className="text-white font-semibold">{(collab.totalReach / 1000).toFixed(0)}K reach</p>
                        <p className="text-green-400">{collab.engagementRate}% engagement</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-green-400">{formatDate(collab.completedAt)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {Math.floor((new Date() - new Date(collab.completedAt)) / (1000 * 60 * 60 * 24))} days ago
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => navigate(`/dashboard/owner/collaborations/${collab.id}/review`)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all inline-flex items-center gap-2"
                      >
                        <Award className="w-4 h-4" />
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
            {filteredCollaborations.map((collab) => (
              <div key={collab.id} className="p-5 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{collab.campaignName}</h3>
                    <p className="text-sm text-gray-400">{collab.influencerName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Duration</p>
                    <p className="text-sm font-semibold text-white">{getDuration(collab.startDate, collab.endDate)} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Budget</p>
                    <p className="text-sm font-semibold text-white">${collab.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Reach</p>
                    <p className="text-sm font-semibold text-white">{(collab.totalReach / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Engagement</p>
                    <p className="text-sm font-semibold text-green-400">{collab.engagementRate}%</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/dashboard/owner/collaborations/${collab.id}/review`)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
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

export default CompletedCollaborations;
