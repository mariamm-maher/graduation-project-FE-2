import { Bell, Plus, Search, Edit, Trash2, Send, Users, Calendar, Eye } from 'lucide-react';
import { useState } from 'react';

const mockAnnouncements = [
  {
    id: 1,
    title: 'Platform Maintenance Scheduled',
    content: 'We will be performing scheduled maintenance on February 5th from 2:00 AM to 6:00 AM UTC. Some services may be temporarily unavailable.',
    type: 'maintenance',
    targetAudience: 'all',
    status: 'published',
    createdAt: '2025-01-28',
    publishedAt: '2025-01-28',
    views: 847
  },
  {
    id: 2,
    title: 'New Features Released',
    content: 'We are excited to announce new AI-powered campaign analytics and enhanced collaboration tools. Check them out in your dashboard!',
    type: 'feature',
    targetAudience: 'all',
    status: 'published',
    createdAt: '2025-01-25',
    publishedAt: '2025-01-25',
    views: 1253
  },
  {
    id: 3,
    title: 'Influencer Program Updates',
    content: 'New verification process and enhanced profile customization options are now available for all influencers.',
    type: 'update',
    targetAudience: 'influencers',
    status: 'published',
    createdAt: '2025-01-22',
    publishedAt: '2025-01-22',
    views: 645
  },
  {
    id: 4,
    title: 'Campaign Owner Success Tips',
    content: 'Learn how to maximize your campaign ROI with our new guide series. First episode covers targeting strategies.',
    type: 'tips',
    targetAudience: 'owners',
    status: 'draft',
    createdAt: '2025-01-30',
    publishedAt: null,
    views: 0
  },
  {
    id: 5,
    title: 'Holiday Special Promotion',
    content: 'Special pricing on featured campaigns throughout February. Contact support for more details.',
    type: 'promotion',
    targetAudience: 'owners',
    status: 'scheduled',
    createdAt: '2025-01-29',
    publishedAt: '2025-02-01',
    views: 0
  },
];

function AnnouncementsOverview() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = announcements.filter(a => {
    const matchSearch = !search || 
      a.title.toLowerCase().includes(search.toLowerCase()) || 
      a.content.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalAnnouncements = announcements.length;
  const publishedAnnouncements = announcements.filter(a => a.status === 'published').length;
  const draftAnnouncements = announcements.filter(a => a.status === 'draft').length;
  const scheduledAnnouncements = announcements.filter(a => a.status === 'scheduled').length;

  const getTypeColor = (type) => {
    switch(type) {
      case 'maintenance': return 'bg-red-500/20 text-red-400';
      case 'feature': return 'bg-green-500/20 text-green-400';
      case 'update': return 'bg-blue-500/20 text-blue-400';
      case 'tips': return 'bg-purple-500/20 text-purple-400';
      case 'promotion': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'scheduled': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getAudienceText = (audience) => {
    switch(audience) {
      case 'all': return 'All Users';
      case 'influencers': return 'Influencers';
      case 'owners': return 'Campaign Owners';
      default: return audience;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Announcements</h1>
          <p className="text-sm sm:text-base text-gray-400">Create and manage platform announcements</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#745CB4] hover:bg-[#5d4a8f] text-white rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

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
      <div className="space-y-4">
        {filtered.map((announcement) => (
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
                    <p className="text-gray-400 text-sm leading-relaxed mb-3">{announcement.content}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(announcement.type)}`}>
                        {announcement.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(announcement.status)}`}>
                        {announcement.status}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Users className="w-3 h-3" />
                        {getAudienceText(announcement.targetAudience)}
                      </span>
                      {announcement.status === 'published' && (
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
                <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors text-sm">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors text-sm">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
              <span>Created: {announcement.createdAt}</span>
              {announcement.publishedAt && <span>Published: {announcement.publishedAt}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnnouncementsOverview;
