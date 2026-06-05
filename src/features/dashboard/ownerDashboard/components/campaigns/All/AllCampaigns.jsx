import { Search, Grid3x3, Target, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useCampaignStore from '../../../../../../stores/campaignStore';

const LIMIT = 10;

function AllCampaigns() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status') || 'all';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [filterGoal, setFilterGoal] = useState('all');
  const [page, setPage] = useState(1);
  
  const { 
    campaigns: allCampaignsRaw, 
    draftCampaigns: draftCampaignsRaw,
    completedCampaigns: completedCampaignsRaw,
    pagination, 
    draftPagination,
    completedPagination,
    isLoading, 
    error, 
    fetchCampaigns 
  } = useCampaignStore();
  
  // Select the correct campaigns array based on filterStatus
  const campaignsRaw = filterStatus === 'draft' 
    ? draftCampaignsRaw 
    : filterStatus === 'completed'
    ? completedCampaignsRaw
    : allCampaignsRaw;
  const campaigns = Array.isArray(campaignsRaw) ? campaignsRaw : [];
  
  // Select correct pagination based on filter
  const activePagination = filterStatus === 'draft' 
    ? draftPagination 
    : filterStatus === 'completed'
    ? completedPagination
    : pagination;
  const totalPages = activePagination?.totalPages || 1;
  const totalItems = activePagination?.total || 0;

  useEffect(() => {
    console.log('AllCampaigns - fetching with:', { page, limit: LIMIT, filterStatus, lifecycleStage: filterStatus !== 'all' ? filterStatus : undefined });
    fetchCampaigns({
      page,
      limit: LIMIT,
      lifecycleStage: filterStatus !== 'all' ? filterStatus : undefined,
    });
  }, [page, filterStatus, fetchCampaigns]);

  // Debug logging
  useEffect(() => {
    console.log('AllCampaigns - campaignsRaw:', campaignsRaw);
    console.log('AllCampaigns - campaigns.length:', campaigns.length);
    console.log('AllCampaigns - filterStatus:', filterStatus);
    console.log('AllCampaigns - totalItems:', totalItems);
  }, [campaignsRaw, campaigns, filterStatus, totalItems]);

  // Reset to page 1 when status filter changes
  const handleStatusChange = (val) => {
    setFilterStatus(val);
    setPage(1);
  };

  const normalizeLifecycleStage = (value) => {
    const stage = String(value || '').toLowerCase();
    return stage === 'ai_generated' ? 'draft' : stage;
  };

  const getStatusBadge = (lifecycleStage) => {
    // Standardize to lowercase to protect against backend payload mismatches
    const stageKey = normalizeLifecycleStage(lifecycleStage);

    const statusStyles = {
      saved: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      draft: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
      active: 'bg-green-500/20 text-green-400 border border-green-500/30',
      in_progress: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      paused: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      completed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30'
    };
    
    return statusStyles[stageKey] || statusStyles.draft;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatLabel = (value) => {
    if (!value) return 'Draft';
    return normalizeLifecycleStage(value)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const handleOpenCampaign = (campaign) => {
    const campaignId = campaign.id || campaign.campaign_id || campaign.draft_id;
    const campaignStatus = normalizeLifecycleStage(campaign.lifecycleStage || campaign.status);

    if (!campaignId) return;

    if (campaignStatus === 'draft') {
      navigate(`/dashboard/owner/campaigns/draft/${campaignId}/edit`);
      return;
    }

    navigate(`/dashboard/owner/campaigns/${campaignId}`);
  };

  // Client-side filter for search, goal, and status as a safety net
  const filteredCampaigns = campaigns.filter(campaign => {
    const campaignStatus = normalizeLifecycleStage(campaign.lifecycleStage || campaign.status);
    const selectedStatus = normalizeLifecycleStage(filterStatus || 'all');
    const matchesSearch = !searchQuery || 
      (campaign.campaignName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || campaignStatus === selectedStatus;
    const matchesGoal = filterGoal === 'all' || 
      (campaign.campaign_goal || '').toLowerCase() === filterGoal.toLowerCase();
    return matchesSearch && matchesStatus && matchesGoal;
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Grid3x3 className="w-8 h-8 text-purple-400" />
            All Campaigns
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            View and manage all your marketing campaigns
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/owner/campaigns/create')}
          className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-bold hover:brightness-110 hover:shadow-xl hover:shadow-purple-500/35 transition-all"
        >
          + Create Campaign
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#1e1632]/60 backdrop-blur-md border border-white/5 rounded-lg py-2.5 px-4 flex items-center justify-between shadow-sm">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total</p>
          <p className="text-lg font-bold text-white">{totalItems}</p>
        </div>
        <div className="bg-[#1e1632]/60 backdrop-blur-md border border-white/5 rounded-lg py-2.5 px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Saved</p>
          </div>
          <p className="text-lg font-bold text-blue-400">
            {campaigns.filter(c => String(c.lifecycleStage).toLowerCase() === 'saved').length}
          </p>
        </div>
        <div className="bg-[#1e1632]/60 backdrop-blur-md border border-white/5 rounded-lg py-2.5 px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Draft</p>
          </div>
          <p className="text-lg font-bold text-gray-400">
            {campaigns.filter(c => normalizeLifecycleStage(c.lifecycleStage || c.status) === 'draft').length}
          </p>
        </div>
        <div className="bg-[#1e1632]/60 backdrop-blur-md border border-white/5 rounded-lg py-2.5 px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Active</p>
          </div>
          <p className="text-lg font-bold text-green-400">
            {campaigns.filter(c => String(c.lifecycleStage).toLowerCase() === 'active').length}
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by name..."
            className="w-full bg-[#2A2240] border border-white/15 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-400 hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all"
          />
        </div>
        <div className="relative w-full sm:w-48 lg:w-56">
          <select
            value={filterStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-4 py-3 bg-[#2A2240] border border-white/15 rounded-xl text-white hover:border-[#C1B6FD]/45 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all cursor-pointer"
            style={{ colorScheme: 'dark' }}
          >
            <option value="all">All Status</option>
            <option value="saved">Saved</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="relative w-full sm:w-48 lg:w-56">
          <select
            value={filterGoal}
            onChange={(e) => setFilterGoal(e.target.value)}
            className="w-full px-4 py-3 bg-[#2A2240] border border-white/15 rounded-xl text-white hover:border-[#C1B6FD]/45 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all cursor-pointer"
            style={{ colorScheme: 'dark' }}
          >
            <option value="all">All Goals</option>
            <option value="awareness">Awareness</option>
            <option value="engagement">Engagement</option>
            <option value="conversion">Conversion</option>
            <option value="traffic">Traffic</option>
            <option value="sales">Sales</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Campaigns Data Table Container */}
      <div className="bg-[#1e1632]/85 backdrop-blur-md border border-[#C1B6FD]/20 shadow-xl shadow-black/20 rounded-2xl overflow-hidden">
        {isLoading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1B6FD] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading campaigns...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Campaigns</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <button 
              onClick={() => fetchCampaigns()}
              className="px-6 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-bold hover:brightness-110 hover:shadow-xl hover:shadow-purple-500/35 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#120D1E]/80 border-b border-white/10">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Campaign Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Goal</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Budget</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCampaigns.map((campaign) => (
                  <tr 
                    key={campaign.id}
                    className="hover:bg-[#C1B6FD]/5 transition-colors group/row cursor-pointer"
                    onClick={() => handleOpenCampaign(campaign)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleOpenCampaign(campaign);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400 font-mono">#{campaign.id}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <h3 className="text-white font-semibold group-hover/row:text-[#C1B6FD] transition-colors">
                          {campaign.campaignName}
                        </h3>
                      </div>
                    </td>

                    {/* Dynamic Safe Status Badge Rendering */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadge(campaign.lifecycleStage)}`}>
                        {formatLabel(campaign.lifecycleStage)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-white text-sm">{campaign.campaign_goal || 'N/A'}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-white font-semibold">
                        {(campaign.budget_currency || 'USD')} {Number(campaign.budget_amount || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{formatDate(campaign.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty Fallback Block */}
        {!isLoading && !error && filteredCampaigns.length === 0 && (
          <div className="text-center py-16">
            <Grid3x3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Campaigns Found</h3>
            <p className="text-gray-400 mb-6">
              {campaigns.length === 0 
                ? 'Get started by creating your first campaign.'
                : 'No campaigns match your current filters. Try adjusting your search or filters.'}
            </p>
            {campaigns.length === 0 && (
              <button 
                onClick={() => navigate('/dashboard/owner/campaigns/create')}
                className="px-6 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-bold hover:brightness-110 hover:shadow-xl hover:shadow-purple-500/35 transition-all"
              >
                + Create Campaign
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination View Block */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-gray-400">
            Page <span className="text-white font-semibold">{page}</span> of{' '}
            <span className="text-white font-semibold">{totalPages}</span>
            <span className="ml-2 text-gray-500">({totalItems} total)</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-300 bg-[#2A2240] border border-white/15 rounded-xl hover:border-[#C1B6FD]/45 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-500 text-sm">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                        item === page
                          ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg shadow-purple-500/20'
                          : 'text-gray-400 bg-[#2A2240] border border-white/15 hover:border-[#C1B6FD]/45 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-300 bg-[#2A2240] border border-white/15 rounded-xl hover:border-[#C1B6FD]/45 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllCampaigns;