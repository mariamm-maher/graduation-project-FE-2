import { Briefcase, Search, Eye, Trash2, DollarSign, Calendar, Target } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../../../../../stores/AdminStore';
import { toast } from 'react-toastify';

// Map backend campaign to display; backend: id, campaignName?, lifecycleStage, user (owner), goalType?, createdAt?
function mapCampaign(c) {
  const owner = c.user ? [c.user.firstName, c.user.lastName].filter(Boolean).join(' ').trim() : '—';
  const status = c.lifecycleStage || c.status || '—';
  const name = c.campaignName || c.name || '—';
  return {
    id: c.id,
    name,
    owner,
    ownerEmail: c.user?.email,
    status: status.toLowerCase(),
    statusRaw: status,
    budget: c.budget ?? '—',
    startDate: c.startDate || (c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '—'),
    endDate: c.endDate ?? '—',
    collaborations: c.collaborations ?? '—',
    reach: c.reach ?? '—',
    raw: c
  };
}

const LIFECYCLE_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'ai_generated', label: 'AI Generated' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' }
];

function getStatusColor(status) {
  const s = (status || '').toLowerCase();
  if (s === 'active') return 'bg-green-500/20 text-green-400';
  if (s === 'completed') return 'bg-blue-500/20 text-blue-400';
  if (s === 'draft' || s === 'pending') return 'bg-yellow-500/20 text-yellow-400';
  if (s === 'ai_generated') return 'bg-purple-500/20 text-purple-400';
  if (s === 'cancelled') return 'bg-red-500/20 text-red-400';
  return 'bg-gray-500/20 text-gray-400';
}

function CampaignsOverview() {
  const { campaigns, isLoading, error, fetchCampaigns, deleteCampaign } = useAdminStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCampaigns = useCallback(() => {
    fetchCampaigns({
      page: 1,
      limit: 100,
      lifecycleStage: statusFilter === 'all' ? undefined : statusFilter
    });
  }, [statusFilter, fetchCampaigns]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const list = (campaigns || []).map(mapCampaign);
  const filtered = list.filter((c) => {
    const matchSearch =
      !search ||
      (c.name && c.name.toLowerCase().includes(search.toLowerCase())) ||
      (c.owner && c.owner.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  const totalCampaigns = list.length;
  const activeCampaigns = list.filter((c) => c.status === 'active').length;
  const completedCampaigns = list.filter((c) => c.status === 'completed').length;
  const draftCampaigns = list.filter((c) => c.status === 'draft' || c.statusRaw === 'draft').length;

  const openDeleteModal = (campaign) => {
    setCampaignToDelete(campaign);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    setDeleting(true);
    const result = await deleteCampaign(campaignToDelete.id);
    setDeleting(false);
    if (result.success) {
      setCampaignToDelete(null);
      setShowDeleteModal(false);
      toast.success('Campaign deleted');
    } else {
      toast.error(result.error || 'Failed to delete campaign');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage and monitor all platform campaigns</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalCampaigns}</p>
          <p className="text-sm text-gray-400">Total Campaigns</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-green-400 font-semibold">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{activeCampaigns}</p>
          <p className="text-sm text-gray-400">Active</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-yellow-400 font-semibold">Draft</span>
          </div>
          <p className="text-2xl font-bold text-white">{draftCampaigns}</p>
          <p className="text-sm text-gray-400">Draft</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs text-blue-400 font-semibold">Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{completedCampaigns}</p>
          <p className="text-sm text-gray-400">Completed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]"
            style={{ colorScheme: 'dark' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
          style={{ colorScheme: 'dark' }}
        >
          {LIFECYCLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ backgroundColor: '#1e1632', color: '#fff' }}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400">Loading campaigns...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No campaigns found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Campaign</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Owner</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Budget</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Duration</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-medium text-white">{campaign.name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-300">{campaign.owner}</p>
                      {campaign.ownerEmail && (
                        <p className="text-xs text-gray-500">{campaign.ownerEmail}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(campaign.status)}`}>
                        {(campaign.status || campaign.statusRaw || '—').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{campaign.budget}</td>
                    <td className="py-4 px-4 text-sm text-gray-300">
                      {campaign.startDate} {campaign.endDate ? `→ ${campaign.endDate}` : ''}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/dashboard/admin/campaigns/${campaign.id}`}>
                          <button className="p-2 hover:bg-[#745CB4]/20 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4 text-gray-400 hover:text-[#C1B6FD]" />
                          </button>
                        </Link>
                        <button
                          onClick={() => openDeleteModal(campaign)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDeleteModal && campaignToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="bg-[#1a1a3e] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-2">Delete campaign</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete <strong className="text-white">{campaignToDelete.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button disabled={deleting} onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                Cancel
              </button>
              <button disabled={deleting} onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-500/80 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignsOverview;
