import { Search, Filter, Eye, Calendar, DollarSign, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PastCollaborations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  // Mock data - in production, fetch from API matching ERD structure
  const collaborations = [
    {
      id: 1,
      campaignId: 1,
      campaignName: 'Summer Fashion Launch',
      ownerId: 1,
      ownerName: 'Fashion Brand Co.',
      influencerId: 2,
      influencerName: 'Sarah Johnson',
      contractId: 1,
      status: 'active',
      budget: 5000,
      startDate: '2026-01-15',
      endDate: '2026-03-15',
      createdAt: '2026-01-10',
      updatedAt: '2026-01-28'
    },
    {
      id: 2,
      campaignId: 2,
      campaignName: 'Holiday Collection 2024',
      ownerId: 1,
      ownerName: 'Fashion Brand Co.',
      influencerId: 3,
      influencerName: 'Mike Chen',
      contractId: 2,
      status: 'completed',
      budget: 8000,
      startDate: '2025-11-01',
      endDate: '2025-12-31',
      createdAt: '2025-10-25',
      updatedAt: '2026-01-05'
    },
    {
      id: 3,
      campaignId: 1,
      campaignName: 'Summer Fashion Launch',
      ownerId: 1,
      ownerName: 'Fashion Brand Co.',
      influencerId: 4,
      influencerName: 'Emma Davis',
      contractId: 3,
      status: 'pending',
      budget: 4500,
      startDate: '2026-02-01',
      endDate: '2026-04-01',
      createdAt: '2026-01-25',
      updatedAt: '2026-01-25'
    },
    {
      id: 4,
      campaignId: 3,
      campaignName: 'Spring Wellness Campaign',
      ownerId: 1,
      ownerName: 'Wellness Inc.',
      influencerId: 5,
      influencerName: 'Lisa Anderson',
      contractId: null,
      status: 'cancelled',
      budget: 3000,
      startDate: '2026-03-01',
      endDate: '2026-05-01',
      createdAt: '2026-02-10',
      updatedAt: '2026-02-15'
    }
  ];

  // Past collaborations: ended in the past OR explicitly completed
  const isPast = (collab) => {
    try {
      return new Date(collab.endDate) < new Date() || collab.status === 'completed';
    } catch (e) {
      return collab.status === 'completed';
    }
  };

  const pastCollaborations = collaborations.filter(isPast);

  // Filter past collaborations by search / status
  const filteredCollaborations = pastCollaborations.filter(collab => {
    const matchesSearch = searchQuery === '' || 
      collab.campaignName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.influencerName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || collab.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Past Collaborations</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            View archived and completed collaborations ({filteredCollaborations.length})
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Past</p>
          <p className="text-2xl font-bold text-white">{pastCollaborations.length}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-2xl font-bold text-blue-400">
            {pastCollaborations.filter(c => c.status === 'completed').length}
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-amber-400">
            {pastCollaborations.filter(c => c.status === 'cancelled').length}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Archived</p>
          <p className="text-2xl font-bold text-white">{pastCollaborations.filter(c => c.status !== 'active').length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by campaign or influencer..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-transparent transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Campaign</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Influencer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Budget</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Duration</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Status</th>
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
                    <p className="font-semibold text-white">{collab.campaignName}</p>
                    <p className="text-xs text-gray-400">Campaign #{collab.campaignId}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{collab.influencerName}</p>
                        <p className="text-xs text-gray-400">ID: {collab.influencerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-white">{collab.budget.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(collab.startDate)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">to {formatDate(collab.endDate)}</p>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(collab.status)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => navigate(`/dashboard/owner/collaborations/${collab.id}/workspace`)}
                      className="px-4 py-2 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] hover:shadow-lg hover:shadow-purple-500/30 text-white rounded-lg font-medium transition-all inline-flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
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
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{collab.campaignName}</h3>
                  <p className="text-sm text-gray-400">{collab.influencerName}</p>
                </div>
                {getStatusBadge(collab.status)}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Budget</p>
                  <p className="text-sm font-semibold text-white">${collab.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Duration</p>
                  <p className="text-sm font-semibold text-white">
                    {Math.ceil((new Date(collab.endDate) - new Date(collab.startDate)) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/dashboard/owner/collaborations/${collab.id}/workspace`)}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Workspace
              </button>
            </div>
          ))}
        </div>
      </div>

      {filteredCollaborations.length === 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Collaborations Found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

export default PastCollaborations;
