import { Search, Filter, Eye, Calendar, DollarSign, User, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCollaborationStore from '../../../../../../stores/collaborationStore';

function AllCollaborations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const {
    ownerCollaborations,
    isOwnerCollaborationsLoading,
    getMyOwnerCollaborations
  } = useCollaborationStore();

  useEffect(() => {
    getMyOwnerCollaborations();
  }, [getMyOwnerCollaborations]);

  // Use the fetched collaborations instead of mock data
  const collaborations = ownerCollaborations || [];
console.log('Fetched collaborations:', collaborations);
  // Filter collaborations
  const filteredCollaborations = collaborations.filter(collab => {
    const campaignName = collab?.campaign?.campaignName || collab?.campaignName || '';
    const influencerFirstName = collab?.influencer?.firstName || collab?.influencer?.user?.firstName || collab?.influencerId?.user?.firstName || '';
    const influencerLastName = collab?.influencer?.lastName || collab?.influencer?.user?.lastName || collab?.influencerId?.user?.lastName || '';
    const influencerName = collab?.influencerName || `${influencerFirstName} ${influencerLastName}`.trim();
    
    const matchesSearch = searchQuery === '' || 
      campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || collab.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getCollabData = (collab) => {
    const id = collab._id || collab.id;
    const campaignName = collab?.campaign?.campaignName || collab?.campaignName || 'Unknown Campaign';
    const campaignId = collab?.campaign?._id || collab?.campaign?.id || collab?.campaignId || 'Unknown ID';
    
    const influencerFirstName = collab?.influencer?.firstName || collab?.influencer?.user?.firstName || collab?.influencerId?.user?.firstName || '';
    const influencerLastName = collab?.influencer?.lastName || collab?.influencer?.user?.lastName || collab?.influencerId?.user?.lastName || '';
    const influencerName = collab?.influencerName || `${influencerFirstName} ${influencerLastName}`.trim() || 'Unknown Influencer';
    const influencerUserId = collab?.influencer?._id || collab?.influencer?.id || collab?.influencerId || 'N/A';
    
    const budget = collab?.agreedBudget || collab?.budget || collab?.proposedBudget || collab?.campaign?.totalBudget || 0;
    const status = collab?.status || 'pending';
    const startDate = collab?.startDate || collab?.campaign?.startDate || collab?.createdAt || new Date().toISOString();
    const endDate = collab?.endDate || collab?.campaign?.endDate || collab?.updatedAt || new Date().toISOString();
    
    return { id, campaignName, campaignId, influencerName, influencerUserId, budget, status, startDate, endDate };
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">All Collaborations</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Manage all collaboration relationships ({filteredCollaborations.length})
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-white">{collaborations.length}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <p className="text-2xl font-bold text-green-400">
            {collaborations.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-2xl font-bold text-blue-400">
            {collaborations.filter(c => c.status === 'completed').length}
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-400">
            {collaborations.filter(c => c.status === 'pending').length}
          </p>
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
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isOwnerCollaborationsLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#C1B6FD] animate-spin" />
        </div>
      ) : (
      <>
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
              {filteredCollaborations.map((collabRaw, index) => {
                const collab = getCollabData(collabRaw);
                return (
                <tr 
                  key={collab.id}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    index === filteredCollaborations.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <p className="font-semibold text-white">{collab.campaignName}</p>
                    <p className="text-xs text-gray-400">Campaign #{collab.campaignId ? String(collab.campaignId).slice(-4) : '...'}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-linear-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{collab.influencerName}</p>
                        <p className="text-xs text-gray-400">ID: {collab.influencerUserId ? String(collab.influencerUserId).slice(-4) : '...'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-white">{(collab.budget || 0).toLocaleString()}</span>
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
                    {collab.status === 'pending_contract_sign' || collab.status === 'Pending_contract_sign' ? (
                      <button
                        onClick={() => navigate(`/dashboard/owner/collaborations/${collab.id}/contract`)}
                        className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 text-white rounded-lg font-medium transition-all inline-flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Make a Contract
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/dashboard/owner/collaborations/${collab.id}/workspace`)}
                        className="px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] hover:shadow-lg hover:shadow-purple-500/30 text-white rounded-lg font-medium transition-all inline-flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-white/10">
          {filteredCollaborations.map((collabRaw) => {
            const collab = getCollabData(collabRaw);
            return (
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
                  <p className="text-sm font-semibold text-white">${(collab.budget || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Duration</p>
                  <p className="text-sm font-semibold text-white">
                    {Math.ceil((new Date(collab.endDate) - new Date(collab.startDate)) / (1000 * 60 * 60 * 24)) || 0} days
                  </p>
                </div>
              </div>

              {collab.status === 'pending_contract_sign' || collab.status === 'Pending_contract_sign' ? (
                <button
                  onClick={() => navigate(`/dashboard/owner/collaborations/${collab.id}/contract`)}
                  className="w-full px-4 py-2.5 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Make a Contract
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/dashboard/owner/collaborations/${collab.id}/workspace`)}
                  className="w-full px-4 py-2.5 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Workspace
                </button>
              )}
            </div>
          )})}
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
      </>
      )}
    </div>
  );
}

export default AllCollaborations;
