import { Search, Calendar, FileEdit, Trash2, Edit, Target, DollarSign, Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCampaignStore from '../../../../../../stores/campaignStore';

const LIMIT = 10;

function DraftCampaigns() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { campaigns: campaignsRaw, pagination, isLoading, error, fetchCampaigns, deleteCampaign } = useCampaignStore();
  const campaigns = Array.isArray(campaignsRaw) ? campaignsRaw : [];
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || 0;

  useEffect(() => {
    fetchCampaigns({ page, limit: LIMIT, lifecycleStage: 'draft' });
  }, [page, fetchCampaigns]);

  // Client-side search filter only
  const draftCampaigns = campaigns.filter(campaign =>
    searchQuery === '' ||
    campaign.campaignName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (draft) => {
    if (!window.confirm(`Delete "${draft.campaignName || 'Untitled Campaign'}"?`)) return;
    const result = await deleteCampaign(draft.id);
    if (result.success) {
      fetchCampaigns({ page, limit: LIMIT, lifecycleStage: 'draft' });
    }
  };

  // Calculate completion hint based on filled fields
  const getCompletionHint = (campaign) => {
    const fields = [
      campaign.campaignName || campaign.name,
      campaign.goalType,
      campaign.totalBudget || campaign.budget,
      campaign.startDate,
      campaign.endDate,
      campaign.targetAudience
    ];
    const filledFields = fields.filter(f => f && f !== '').length;
    const totalFields = fields.length;
    const percentage = Math.round((filledFields / totalFields) * 100);
    
    if (percentage < 30) return { text: 'Just started', color: 'text-gray-400' };
    if (percentage < 60) return { text: 'In progress', color: 'text-amber-400' };
    return { text: 'Almost ready', color: 'text-green-400' };
  };

  // Format relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <FileEdit className="w-8 h-8 text-amber-400" />
            Draft Campaigns
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Unfinished campaigns — not yet operational ({totalItems})
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/owner/campaigns/create')}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
        >
          + New Campaign
        </button>
      </div>

      {/* Stats Overview - Simplified */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-md border border-amber-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Drafts</p>
          <p className="text-2xl font-bold text-amber-400">{totalItems}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Almost Ready</p>
          <p className="text-2xl font-bold text-green-400">
            {draftCampaigns.filter(d => {
              const hint = getCompletionHint(d);
              return hint.text === 'Almost ready';
            }).length}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Recently Updated</p>
          <p className="text-2xl font-bold text-white">
            {draftCampaigns.filter(d => getRelativeTime(d.createdAt || d.updatedAt) === 'Today').length}
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
            placeholder="Search drafts..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Drafts List - Lightweight */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading draft campaigns...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Drafts</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={() => fetchCampaigns({ page, limit: LIMIT, lifecycleStage: 'draft' })}
            className="px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !error && draftCampaigns.length === 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileEdit className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Draft Campaigns</h3>
          <p className="text-gray-400 mb-6">Start creating a new campaign and save it as a draft</p>
          <button 
            onClick={() => navigate('/dashboard/owner/campaigns/create')}
            className="px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            Create New Campaign
          </button>
        </div>
      )}

      {!isLoading && !error && draftCampaigns.length > 0 && (
        <div className="space-y-4">
          {draftCampaigns.map((draft) => {
            const completionHint = getCompletionHint(draft);
            const lastUpdated = getRelativeTime(draft.updatedAt || draft.createdAt);
            
            return (
              <div
                key={draft.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Section - Campaign Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 
                        onClick={() => navigate(`/dashboard/owner/campaigns/create?draft=${draft.id}`)}
                        className="text-lg font-bold text-white cursor-pointer hover:text-amber-400 transition-colors truncate"
                      >
                        {draft.campaignName || draft.name || 'Untitled Campaign'}
                      </h3>
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold whitespace-nowrap">
                        Draft
                      </span>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      {/* Goal Type */}
                      {draft.goalType && (
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Target className="w-4 h-4 flex-shrink-0" />
                          <span className="capitalize">{draft.goalType.replace('_', ' ')}</span>
                        </div>
                      )}
                      
                      {/* Budget */}
                      {(draft.totalBudget || draft.budget) && (
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <DollarSign className="w-4 h-4 flex-shrink-0" />
                          <span>
                            {draft.currency || '$'}{typeof draft.totalBudget === 'number' 
                              ? draft.totalBudget.toLocaleString() 
                              : draft.budget}
                          </span>
                        </div>
                      )}
                      
                      {/* Last Updated */}
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{lastUpdated}</span>
                      </div>

                      {/* Completion Hint */}
                      <div className={`flex items-center gap-1.5 ${completionHint.color} font-medium`}>
                        <span>•</span>
                        <span>{completionHint.text}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigate(`/dashboard/owner/campaigns/create?draft=${draft.id}`)}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      <Edit className="w-4 h-4" />
                      Continue
                    </button>
                    <button 
                      className="w-10 h-10 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-all flex items-center justify-center"
                      onClick={() => handleDelete(draft)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
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
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                    <span key={`e-${i}`} className="px-2 text-gray-500 text-sm">…</span>
                  ) : (
                    <button key={item} onClick={() => setPage(item)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${item === page ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md' : 'text-gray-400 bg-white/5 border border-white/10 hover:border-amber-500/40 hover:text-white'}`}>
                      {item}
                    </button>
                  )
                )}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DraftCampaigns;
