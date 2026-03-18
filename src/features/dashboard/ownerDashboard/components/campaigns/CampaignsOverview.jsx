import { Megaphone, Users, DollarSign, TrendingUp, ArrowRight, Target, Play, Clock, Sparkles, CheckCircle, FileEdit, Grid3x3, BarChart3, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import useCampaignStore from '../../../../../stores/campaignStore';

function CampaignsOverview() {
  const fetchCampaignsOverview = useCampaignStore((s) => s.fetchCampaignsOverview);
  const campaignsOverview = useCampaignStore((s) => s.campaignsOverview);

  useEffect(() => {
    fetchCampaignsOverview().catch(() => {});
  }, [fetchCampaignsOverview]);
  const totalCampaigns = campaignsOverview?.totalCampaigns ?? 0;
  const totalSaved =  campaignsOverview?.totalSaved ?? 0;
  const recentCampaigns =campaignsOverview?.recentCampaigns || [];

  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Campaigns Overview</h1>
          <p className="text-sm sm:text-base text-gray-400">
            Manage your marketing campaigns and track performance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/dashboard/owner/influencers">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm font-medium text-white">
              <Users className="w-4 h-4 text-gray-400" />
              Influencers
            </button>
          </Link>
          <Link to="/dashboard/owner/campaigns/create">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#C1B6FD] border border-[#C1B6FD] text-gray-900 rounded-lg hover:bg-[#A89AF0] font-semibold transition-all shadow-lg shadow-[#C1B6FD]/20">
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Nav & Stats (Takes up 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Campaigns</p>
                <p className="text-3xl font-bold text-white">{totalCampaigns}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#C1B6FD]/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#C1B6FD]" />
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Saved Drafts</p>
                <p className="text-3xl font-bold text-white">{totalSaved}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <FileEdit className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <Link to="/dashboard/owner/campaigns/all" className="group bg-white/5 border border-white/10 hover:border-[#C1B6FD]/30 rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-white/10 hover:shadow-lg hover:shadow-[#C1B6FD]/5">
                <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-[#C1B6FD]/20 border border-white/10 group-hover:border-[#C1B6FD]/30 flex items-center justify-center transition-all">
                  <Grid3x3 className="w-5 h-5 text-gray-400 group-hover:text-[#C1B6FD]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-[#C1B6FD] transition-colors">All Campaigns</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Browse your entire portfolio</p>
                </div>
              </Link>

              <Link to="/dashboard/owner/campaigns/active" className="group bg-white/5 border border-white/10 hover:border-green-400/30 rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-white/10 hover:shadow-lg hover:shadow-green-500/5">
                <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-green-500/20 border border-white/10 group-hover:border-green-500/30 flex items-center justify-center transition-all">
                  <Play className="w-5 h-5 text-gray-400 group-hover:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">Active Campaigns</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Currently live and running</p>
                </div>
              </Link>

              <Link to="/dashboard/owner/campaigns/completed" className="group bg-white/5 border border-white/10 hover:border-blue-400/30 rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/5">
                <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-blue-500/20 border border-white/10 group-hover:border-blue-500/30 flex items-center justify-center transition-all">
                  <CheckCircle className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">Completed</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Archived and finished</p>
                </div>
              </Link>

              <Link to="/dashboard/owner/campaigns/analytics" className="group bg-white/5 border border-white/10 hover:border-purple-400/30 rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/5">
                <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-purple-500/20 border border-white/10 group-hover:border-purple-500/30 flex items-center justify-center transition-all">
                  <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">Analytics</h3>
                  <p className="text-xs text-gray-400 mt-0.5">View performance metrics</p>
                </div>
              </Link>

            </div>
          </div>
        </div>

        {/* Right Column: Recent Campaigns (Takes up 1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 h-full min-h-[350px]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="space-y-5">
              {recentCampaigns.length > 0 ? (
                recentCampaigns.slice(0, 5).map((c) => (
                  <div key={c.id} className="group relative pl-4 border-l-2 border-white/10 hover:border-[#C1B6FD] transition-colors pb-1">
                    {/* Timeline dot */}
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-600 group-hover:bg-[#C1B6FD] transition-colors shadow"></div>
                    
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#C1B6FD] transition-colors line-clamp-1">
                      {c.campaignName || 'Untitled Campaign'}
                    </h4>
                    
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                          c.isPublished || c.lifecycleStage === 'active' 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {c.isPublished ? (c.lifecycleStage || 'Active') : (c.lifecycleStage || 'Draft')}
                        </span>
                        <span className="text-[#C1B6FD] text-xs font-semibold">
                           {c.duration ? `${c.duration}` : '—'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-400 overflow-hidden">
                        <span className="flex items-center gap-1.5 truncate max-w-[50%]">
                          <TrendingUp className="w-3 h-3 shrink-0" />
                          <span className="truncate">{c.goals || 'No goal'}</span>
                        </span>
                        <span className="flex items-center gap-1.5 truncate flex-1">
                          <Users className="w-3 h-3 shrink-0" />
                          <span className="truncate">{c.UserDescription || '—'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
                    <Grid3x3 className="w-5 h-5 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400">No campaigns yet</p>
                  <p className="text-xs text-gray-500 mt-1">Create one to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CampaignsOverview;
