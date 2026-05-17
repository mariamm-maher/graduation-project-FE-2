import { Users, CheckCircle, Clock, Star, Calendar, DollarSign, User, Eye, Search, Trash2, Briefcase, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import useAdminStore from '../../../../../stores/AdminStore';
import { mapCollaboration } from '../adminData';
import { toast } from 'react-toastify';

// Status color helper
function getStatusColor(status) {
  const s = (status || '').toLowerCase();
  if (s === 'active' || s === 'in_progress' || s === 'live') return 'bg-green-500/20 text-green-400';
  if (s === 'completed') return 'bg-blue-500/20 text-blue-400';
  if (s === 'pending_contract_sign' || s === 'pending') return 'bg-yellow-500/20 text-yellow-400';
  if (s === 'cancelled') return 'bg-red-500/20 text-red-400';
  return 'bg-gray-500/20 text-gray-400';
}

function CollaborationsOverview() {
  const { collaborations, isLoading, error, fetchCollaborations, deleteCollaboration } = useAdminStore();
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collabToDelete, setCollabToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    fetchCollaborations();
  }, [fetchCollaborations]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const raw = Array.isArray(collaborations) ? collaborations : [];
    const mapped = raw.map(mapCollaboration).filter(Boolean);
    setList(mapped);
  }, [collaborations]);

  // Filter collaborations
  const filtered = list.filter((c) => {
    const matchSearch = !search ||
      (c.campaign && c.campaign.toLowerCase().includes(search.toLowerCase())) ||
      (c.owner && c.owner.toLowerCase().includes(search.toLowerCase())) ||
      (c.influencer && c.influencer.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  const activeCollabs = list.filter(c => ['active', 'in_progress', 'live'].includes(c.status)).length;
  const completedCollabs = list.filter(c => c.status === 'completed').length;
  const pendingCollabs = list.filter(c => ['pending_contract_sign', 'pending', 'awaiting_acceptance'].includes(c.status)).length;

  const hasPendingRequest = (userId) =>
    list.some(
      (c) =>
        (c.ownerId === userId || c.influencerId === userId) &&
        ['pending', 'pending_contract_sign', 'awaiting_acceptance'].includes(c.status)
    );
  const withRating = list.filter(c => c.rating != null && c.rating > 0);
  const avgRating = withRating.length ? (withRating.reduce((s, c) => s + c.rating, 0) / withRating.length).toFixed(1) : '—';

  const openDeleteModal = (collab) => {
    setCollabToDelete(collab);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!collabToDelete) return;
    setDeleting(true);
    try {
      const result = await deleteCollaboration(collabToDelete.id);
      if (result.success) {
        setCollabToDelete(null);
        setShowDeleteModal(false);
        toast.success('Collaboration deleted');
      } else {
        toast.error(result.error || 'Failed to delete');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Collaborations</h1>
          <p className="text-sm sm:text-base text-gray-400">View and manage all influencer collaborations</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#745CB4]/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Total</span>
          </div>
          <p className="text-xl font-bold text-white">{list.length}</p>
          <p className="text-xs text-gray-400">Collaborations</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-green-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-xs text-green-400 font-semibold">Active</span>
          </div>
          <p className="text-xl font-bold text-white">{activeCollabs}</p>
          <p className="text-xs text-gray-400">Active</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-yellow-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-xs text-yellow-400 font-semibold">Pending</span>
          </div>
          <p className="text-xl font-bold text-white">{pendingCollabs}</p>
          <p className="text-xs text-gray-400">Pending</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs text-blue-400 font-semibold">Done</span>
          </div>
          <p className="text-xl font-bold text-white">{completedCollabs}</p>
          <p className="text-xs text-gray-400">Completed</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Rating</span>
          </div>
          <p className="text-xl font-bold text-white">{avgRating}</p>
          <p className="text-xs text-gray-400">Avg Rating</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by campaign, owner, or influencer..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]"
        />
      </div>

      {/* Collaborations Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400">Loading collaborations...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No collaborations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Campaign</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Owner</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Influencer</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Progress</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Deadline</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((collab) => (
                  <tr key={collab.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center text-white font-bold">
                          {collab.campaign?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="font-medium text-white">{collab.campaign || '—'}</p>
                          {collab.platforms && collab.platforms.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              {collab.platforms.slice(0, 2).map((platform) => (
                                <span key={platform} className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-gray-400">
                                  {platform}
                                </span>
                              ))}
                              {collab.platforms.length > 2 && (
                                <span className="text-[10px] text-gray-500">+{collab.platforms.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#745CB4]/30 flex items-center justify-center text-white text-xs font-medium">
                          {collab.owner?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="text-gray-300 text-sm">{collab.owner || '—'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-medium">
                          {collab.influencer?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="text-gray-300 text-sm">{collab.influencer || '—'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(collab.status)}`}>
                        {(collab.status || '—').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-24">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">{collab.progress || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C1B6FD]"
                            style={{ width: `${collab.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {collab.deadline || '—'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/dashboard/admin/collaborations/${collab.id}`}>
                          <button className="p-2 rounded-lg bg-white/5 hover:bg-[#745CB4]/20 text-gray-400 hover:text-[#C1B6FD] transition-all" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        {/* <button
                          onClick={() => openDeleteModal(collab)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {/* {showDeleteModal && collabToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="bg-[#1a1a3e] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-2">Delete collaboration</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete the collaboration for <strong className="text-white">{collabToDelete.campaign}</strong>? This cannot be undone.
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
      )} */}
    </div>
  );
}

export default CollaborationsOverview;
