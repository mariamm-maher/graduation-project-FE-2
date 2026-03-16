import { Search, FileText, Calendar, DollarSign, AlertCircle, Eye, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCollaborationContractsStore from '../../../../../../stores/CollaborationContractsStore';

function Contracts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();
  const { contracts = [], getMyOwnerContracts, updateContract, isLoading } = useCollaborationContractsStore();

  useEffect(() => {
    getMyOwnerContracts();
  }, [getMyOwnerContracts]);

  const handleEditContract = (contract) => {
    navigate(`/dashboard/owner/contracts/${contract._id || contract.id}/edit`, { state: { contract } });
  };

  const handleDeleteContract = async (contractId) => {
    if (!window.confirm('Are you sure you want to delete this contract?')) return;
    const res = await updateContract(contractId, { status: 'terminated' });
    if (res?.success) {
      toast.success('Contract terminated successfully');
    } else {
      toast.error(res?.error || 'Failed to terminate contract');
    }
  };

  const filteredContracts = (contracts || []).filter(contract => {
    const matchesSearch = searchQuery === '' ||
      contract.campaignName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.influencerName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      terminated: 'bg-red-500/20 text-red-400 border-red-500/30'
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

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysRemaining = (endDate, status) => {
    if (status !== 'active') return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" />
            Collaboration Contracts
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Manage all collaboration contracts and agreements ({filteredContracts.length})
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Contracts</p>
          <p className="text-2xl font-bold text-white">{contracts.length}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <p className="text-2xl font-bold text-green-400">
            {contracts.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Draft</p>
          <p className="text-2xl font-bold text-gray-400">
            {contracts.filter(c => c.status === 'draft').length}
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Value</p>
          <p className="text-2xl font-bold text-blue-400">
            ${contracts.reduce((sum, c) => sum + (Number(c?.budget) || 0), 0).toLocaleString()}
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
            placeholder="Search contracts..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      {/* Contracts Table */}
      {filteredContracts.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Contracts Found</h3>
          <p className="text-gray-400">No contracts match your search criteria</p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Contract ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Campaign</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Influencer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Budget</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Duration</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((contract, index) => {
                  const daysRemaining = getDaysRemaining(contract.endDate, contract.status);
                  
                  return (
                    <tr
                      key={contract._id || contract.id || index}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        index === filteredContracts.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-sm text-white">#{String(contract._id || contract.id || '').padStart(4, '0')}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-white">{contract.campaignName}</p>
                        {contract.collaborationId && (
                          <p className="text-xs text-gray-400">Collab #{contract.collaborationId}</p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-medium text-white">{contract.influencerName}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-white">{(Number(contract?.budget) || 0).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{getDuration(contract.startDate, contract.endDate)} days</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                        </p>
                        {daysRemaining !== null && (
                          <p className="text-xs text-amber-400 mt-1 font-semibold">
                            {daysRemaining} days left
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(contract.status)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/owner/collaborations/contracts/${contract._id || contract.id}`)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all inline-flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Contract
                          </button>
                          {contract.collaborationId && (
                            <button
                              onClick={() => navigate(`/dashboard/owner/collaborations/${contract.collaborationId}/workspace`)}
                              className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all inline-flex items-center gap-2"
                            >
                              Open Collaboration
                            </button>
                          )}
                          {contract.status === 'draft' && (
                            <>
                              <button
                                onClick={() => handleEditContract(contract)}
                                className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg font-medium transition-all inline-flex items-center gap-2"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteContract(contract._id || contract.id)}
                                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-all inline-flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-white/10">
            {filteredContracts.map((contract, idx) => {
              const daysRemaining = getDaysRemaining(contract.endDate, contract.status);
              
              return (
                <div key={contract._id || contract.id || idx} className="p-5 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-gray-400">#{String(contract._id || contract.id || '').padStart(4, '0')}</span>
                        {getStatusBadge(contract.status)}
                      </div>
                      <h3 className="font-semibold text-white mb-1">{contract.campaignName}</h3>
                      <p className="text-sm text-gray-400">{contract.influencerName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Budget</p>
                      <p className="text-sm font-semibold text-white">${(Number(contract?.budget) || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Duration</p>
                      <p className="text-sm font-semibold text-white">{getDuration(contract.startDate, contract.endDate)} days</p>
                    </div>
                  </div>

                  {daysRemaining !== null && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <p className="text-sm text-amber-400 font-semibold">{daysRemaining} days remaining</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/owner/collaborations/contracts/${contract._id || contract.id}`)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Contract
                    </button>
                    {contract.collaborationId && (
                      <button
                        onClick={() => navigate(`/dashboard/owner/collaborations/${contract.collaborationId}/workspace`)}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Open Collaboration
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Contracts;
