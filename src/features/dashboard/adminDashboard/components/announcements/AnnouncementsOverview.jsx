import { Bell, Plus, Search, Edit, Trash2, Send, Users, Calendar, Eye, Loader2, X, EyeOff } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import useAdminStore from '../../../../../stores/AdminStore';

const EMPTY_FORM = { title: '', content: '', type: 'update', targetAudience: 'all', status: 'draft' };

function AnnouncementsOverview() {
  const {
    announcements,
    announcementsLoading,
    announcementsError,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    publishAnnouncement,
    unpublishAnnouncement,
  } = useAdminStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const load = useCallback(() => fetchAnnouncements(), [fetchAnnouncements]);

  useEffect(() => { load(); }, [load]);

  const list = Array.isArray(announcements) ? announcements : [];

  const filtered = list.filter(a => {
    const title = (a.title || '').toLowerCase();
    const content = (a.content || a.body || '').toLowerCase();
    const matchSearch = !search || title.includes(search.toLowerCase()) || content.includes(search.toLowerCase());
    const rawStatus = (a.status || '').toLowerCase();
    const matchStatus = statusFilter === 'all' || rawStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalAnnouncements = list.length;
  const publishedAnnouncements = list.filter(a => (a.status || '').toLowerCase() === 'published').length;
  const draftAnnouncements = list.filter(a => (a.status || '').toLowerCase() === 'draft').length;
  const scheduledAnnouncements = list.filter(a => (a.status || '').toLowerCase() === 'scheduled').length;

  const getTypeColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t === 'maintenance') return 'bg-red-500/20 text-red-400';
    if (t === 'feature') return 'bg-green-500/20 text-green-400';
    if (t === 'update') return 'bg-blue-500/20 text-blue-400';
    if (t === 'tips') return 'bg-purple-500/20 text-purple-400';
    if (t === 'promotion') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'published') return 'bg-green-500/20 text-green-400';
    if (s === 'scheduled') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  const getAudienceText = (audience) => {
    if (audience === 'all') return 'All Users';
    if (audience === 'influencers') return 'Influencers';
    if (audience === 'owners') return 'Campaign Owners';
    return audience || '—';
  };

  const formatDate = (d) => {
    if (!d) return null;
    try { return new Date(d).toLocaleDateString(); } catch { return d; }
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (a) => {
    setEditTarget(a);
    setForm({
      title: a.title || '',
      content: a.content || a.body || '',
      type: a.type || 'update',
      targetAudience: a.targetAudience || a.audience || 'all',
      status: (a.status || 'draft').toLowerCase(),
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditTarget(null); setForm(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    setSubmitting(true);
    try {
      let result;
      if (editTarget) {
        result = await updateAnnouncement(editTarget.id, form);
        if (result.success) { toast.success('Announcement updated'); closeModal(); }
        else toast.error(result.error || 'Failed to update announcement');
      } else {
        result = await createAnnouncement(form);
        if (result.success) { toast.success('Announcement created'); closeModal(); }
        else toast.error(result.error || 'Failed to create announcement');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteAnnouncement(deleteTarget.id);
    setDeleting(false);
    if (result.success) { toast.success('Announcement deleted'); setDeleteTarget(null); }
    else toast.error(result.error || 'Failed to delete');
  };

  const handleTogglePublish = async (a) => {
    setTogglingId(a.id);
    const isPublished = (a.status || '').toLowerCase() === 'published';
    const result = isPublished ? await unpublishAnnouncement(a.id) : await publishAnnouncement(a.id);
    setTogglingId(null);
    if (result.success) toast.success(isPublished ? 'Unpublished' : 'Published');
    else toast.error(result.error || 'Failed to update status');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Announcements</h1>
          <p className="text-sm sm:text-base text-gray-400">Create and manage platform announcements</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#745CB4] hover:bg-[#5d4a8f] text-white rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {announcementsError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {announcementsError}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalAnnouncements}</p>
          <p className="text-sm text-gray-400">Total Announcements</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-green-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Send className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-green-400 font-semibold">Published</span>
          </div>
          <p className="text-2xl font-bold text-white">{publishedAnnouncements}</p>
          <p className="text-sm text-gray-400">Published</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-gray-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center">
              <Edit className="w-6 h-6 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400 font-semibold">Drafts</span>
          </div>
          <p className="text-2xl font-bold text-white">{draftAnnouncements}</p>
          <p className="text-sm text-gray-400">Draft</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-yellow-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-yellow-400 font-semibold">Scheduled</span>
          </div>
          <p className="text-2xl font-bold text-white">{scheduledAnnouncements}</p>
          <p className="text-sm text-gray-400">Scheduled</p>
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
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
        >
          <option value="all" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>All Status</option>
          <option value="published" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Published</option>
          <option value="draft" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Draft</option>
          <option value="scheduled" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Scheduled</option>
        </select>
      </div>

      {/* Announcements List */}
      {announcementsLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#C1B6FD] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          {list.length === 0 ? 'No announcements yet. Create your first one!' : 'No announcements match your search.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((announcement) => {
            const isPublished = (announcement.status || '').toLowerCase() === 'published';
            const toggling = togglingId === announcement.id;
            return (
              <div
                key={announcement.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-[#745CB4]/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#745CB4]/20 flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5 text-[#C1B6FD]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{announcement.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-3">{announcement.content || announcement.body}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          {announcement.type && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(announcement.type)}`}>
                              {announcement.type}
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(announcement.status)}`}>
                            {announcement.status || 'draft'}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Users className="w-3 h-3" />
                            {getAudienceText(announcement.targetAudience || announcement.audience)}
                          </span>
                          {isPublished && announcement.views != null && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Eye className="w-3 h-3" />
                              {announcement.views} views
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleTogglePublish(announcement)}
                      disabled={toggling}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                        isPublished
                          ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                      }`}
                    >
                      {toggling ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isPublished ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => openEdit(announcement)}
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(announcement)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(announcement.createdAt) || '—'}</span>
                  {announcement.publishedAt && <span>Published: {formatDate(announcement.publishedAt)}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-[#1a1a3e] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">{editTarget ? 'Edit Announcement' : 'New Announcement'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Announcement title"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content <span className="text-red-400">*</span></label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Announcement content..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                  >
                    {['update', 'feature', 'maintenance', 'promotion', 'tips'].map(t => (
                      <option key={t} value={t} style={{ backgroundColor: '#1e1632', color: '#fff' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Audience</label>
                  <select
                    value={form.targetAudience}
                    onChange={(e) => setForm(f => ({ ...f, targetAudience: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                  >
                    <option value="all" style={{ backgroundColor: '#1e1632', color: '#fff' }}>All Users</option>
                    <option value="influencers" style={{ backgroundColor: '#1e1632', color: '#fff' }}>Influencers</option>
                    <option value="owners" style={{ backgroundColor: '#1e1632', color: '#fff' }}>Owners</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} disabled={submitting} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-[#745CB4] hover:bg-[#5d4a8f] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editTarget ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="bg-[#1a1a3e] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-2">Delete Announcement</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete <strong className="text-white">"{deleteTarget.title}"</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button disabled={deleting} onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                Cancel
              </button>
              <button disabled={deleting} onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-500/80 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnnouncementsOverview;
