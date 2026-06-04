import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  PieChart,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Megaphone,
  ChevronDown,
  ChevronUp,
  Share2,
  Instagram,
  Youtube,
  Facebook,
  PlayCircle,
  MessageSquare,
  Flame,
  Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useCampaignStore from '../../../../../../stores/campaignStore';
import ContentCalendarMonthView from '../create/ContentCalendarMonthView';

function SingleCampaign() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [showAllCalendar, setShowAllCalendar] = useState(false);
  
  const fetchCampaignById = useCampaignStore((s) => s.fetchCampaignById);
  const currentCampaign = useCampaignStore((s) => s.currentCampaign);
  const isLoading = useCampaignStore((s) => s.isLoading);

  useEffect(() => {
    if (campaignId) fetchCampaignById(campaignId).catch(() => {});
  }, [campaignId, fetchCampaignById]);

  // Derive normalized campaign object from store response
  const campaign = currentCampaign?.data?.campaign || currentCampaign?.campaign || currentCampaign?.data || currentCampaign;

  useEffect(() => {
    console.log('SingleCampaign route campaignId:', campaignId);
    console.log('SingleCampaign currentCampaign from store:', currentCampaign);
    console.log('SingleCampaign derived campaign:', campaign);
  }, [campaignId, currentCampaign, campaign]);

  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (value) => {
    const number = Number(value);
    if (Number.isNaN(number)) return '0';
    return number.toLocaleString();
  };

  const formatLabel = (value) => {
    if (!value) return 'N/A';
    return String(value)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getDurationDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return Number.isNaN(days) ? 0 : Math.max(days, 0);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1B6FD]" />
        <p className="text-gray-400 text-sm">Loading campaign...</p>
      </div>
    );
  }

  // Campaign not found fallback
  if (!campaign) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4"
        >
          <Link
            to="/dashboard/owner/campaigns"
            className="p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Campaign Not Found</h3>
              <p className="text-sm text-gray-400 mb-4">
                The campaign with ID "{campaignId}" does not exist or hasn't loaded yet.
              </p>
              <Link
                to="/dashboard/owner/campaigns"
                className="inline-block px-6 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Back to Campaigns
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const getPlatformIcon = (platform) => {
    switch (String(platform).toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-400" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-400" />;
      case 'tiktok':
        return (
          <svg className="w-4 h-4 text-cyan-400 fill-current" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.05 1.62 4.2 1.21 1.37 2.91 2.22 4.74 2.4v3.83c-1.63-.08-3.23-.62-4.57-1.57-.46-.33-.87-.72-1.23-1.14v6.18c.01 4.31-2.82 8.3-7.04 9.17-4.22.95-8.62-1.52-9.75-5.64-1.22-4.32 1.08-9.01 5.27-10.23 1.1-.33 2.27-.39 3.39-.18v3.9c-1.12-.39-2.38-.17-3.3.56-.99.76-1.48 2.08-1.24 3.3.32 1.72 1.83 2.95 3.58 2.87 1.9-.03 3.42-1.63 3.39-3.53V.02z"/>
          </svg>
        );
      default:
        return <Share2 className="w-4 h-4 text-gray-400" />;
    }
  };

  const LIFECYCLE_BADGE = {
    draft:         { bg: 'bg-gray-500/20',    border: 'border-gray-500/30',    text: 'text-gray-400',    icon: <AlertCircle className="w-3 h-3" />,  label: 'Draft' },
    ai_generated: { bg: 'bg-[#745CB4]/20',   border: 'border-[#C1B6FD]/30',   text: 'text-[#C1B6FD]',   icon: <Sparkles className="w-3 h-3" />,     label: 'AI Generated' },
    saved:        { bg: 'bg-blue-500/20',     border: 'border-blue-500/30',     text: 'text-blue-400',    icon: <CheckCircle className="w-3 h-3" />,  label: 'Saved' },
    completed:    { bg: 'bg-green-500/20',    border: 'border-green-500/30',    text: 'text-green-400',   icon: <CheckCircle className="w-3 h-3" />,  label: 'Completed' },
    cancelled:    { bg: 'bg-red-500/20',      border: 'border-red-500/30',      text: 'text-red-400',     icon: <AlertCircle className="w-3 h-3" />,  label: 'Cancelled' },
    in_progress:  { bg: 'bg-yellow-500/20',   border: 'border-yellow-500/30',   text: 'text-yellow-400',  icon: <Clock className="w-3 h-3" />,         label: 'In Progress' },
    pending:      { bg: 'bg-gray-500/20',     border: 'border-gray-500/30',     text: 'text-gray-400',    icon: <AlertCircle className="w-3 h-3" />,  label: 'Pending' },
    scheduled:    { bg: 'bg-blue-500/20',     border: 'border-blue-500/30',     text: 'text-blue-400',    icon: <Clock className="w-3 h-3" />,         label: 'Scheduled' },
  };

  const getStatusBadge = (status) => {
    const cfg = LIFECYCLE_BADGE[status || 'saved'];
    return (
      <span className={`px-3 py-1 ${cfg.bg} border ${cfg.border} rounded-full text-xs font-semibold ${cfg.text} flex items-center gap-1`}>
        {cfg.icon}{cfg.label}
      </span>
    );
  };

  const lifecycleStage = campaign.lifecycleStage ?? 'draft';
  const activeAiVersion = (campaign.aiVersions || []).find((v) => v.isActive) || (campaign.aiVersions || [])[0] || null;
  
  // Destructure Strategy details securely based on your specific backend format
  const strategy = activeAiVersion?.strategy || {};
  const tacticalPlan = strategy?.tactical_plan || {};
  const estimations = activeAiVersion?.estimations || strategy?.estimations || {};
  
  const campaignDuration = getDurationDays(campaign.startDate, campaign.endDate);
  
  // Safe mapping of Content Calendar location
  const calendarItems = campaign.contentCalendar?.length 
    ? campaign.contentCalendar 
    : (tacticalPlan?.contentCalendar || strategy?.contentCalendar || []);
    
  const visibleCalendar = showAllCalendar ? calendarItems : calendarItems.slice(0, 7);
  const brandTone = campaign.brandTone || campaign.aiSnapshot?.brandTone || activeAiVersion?.brandTone || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-6"
    >
      {/* Header Banner */}
      <div className="bg-linear-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl shadow-2xl shadow-purple-500/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1, x: -4 }} whileTap={{ scale: 0.9 }}>
              <Link
                to="/dashboard/owner/campaigns"
                className="text-gray-400 hover:text-[#C1B6FD] transition-all p-2.5 hover:bg-[#745CB4]/10 rounded-xl border border-transparent hover:border-[#C1B6FD]/30 block"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-6 h-6 text-[#C1B6FD]" />
                <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-white via-[#C1B6FD] to-white bg-clip-text text-transparent">
                  {campaign.campaignName}
                </h1>
              </div>
              <p className="text-sm text-gray-400">{campaign.campaign_goal ? `Goal: ${campaign.campaign_goal}` : 'No description provided'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(() => {
              const cfg = LIFECYCLE_BADGE[lifecycleStage];
              return cfg ? (
                <span className={`px-3 py-1.5 ${cfg.bg} border ${cfg.border} rounded-full text-xs font-semibold ${cfg.text} flex items-center gap-1`}>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.text.replace('text-', 'bg-')}`}></div>
                  {cfg.label}
                </span>
              ) : (
                <span className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-gray-300 capitalize">{lifecycleStage}</span>
              );
            })()}
            {activeAiVersion && (
              <span className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-400">
                AI v{activeAiVersion.versionNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Core Message & Tactical Insights Section */}
          {strategy?.core_message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-linear-to-br from-[#745CB4]/10 via-transparent to-[#C1B6FD]/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6 shadow-lg space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">AI Core Message Blueprint</h2>
                  <p className="text-gray-200 text-sm leading-relaxed italic">"{strategy.core_message}"</p>
                </div>
              </div>
              
              {/* Campaign Hooks if present */}
              {strategy.campaign_hooks?.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-purple-300 tracking-wider flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" /> High-Converting Hooks
                  </h4>
                  <ul className="grid grid-cols-1 gap-2 text-sm text-gray-300 pl-2">
                    {strategy.campaign_hooks.map((hook, index) => (
                      <li key={index} className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                        • {hook}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* Core Parameters Quick-Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Target className="w-5 h-5 text-[#C1B6FD]" />, bg: 'bg-[#745CB4]/20', label: 'Goal', value: formatLabel(campaign.campaign_goal), color: 'text-white' },
              { icon: <DollarSign className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-500/20', label: 'Budget', value: `${campaign.budget_currency || 'USD'} ${formatNumber(campaign.budget_amount)}`, color: 'text-emerald-400' },
              { icon: <Clock className="w-5 h-5 text-blue-400" />, bg: 'bg-blue-500/20', label: 'Duration', value: `${campaignDuration || campaign.campaign_duration_weeks * 7} days`, color: 'text-blue-400' },
              { icon: <Globe className="w-5 h-5 text-amber-400" />, bg: 'bg-amber-500/20', label: 'Channels', value: `${campaign.targetAudience?.platformsUsed?.length || 0} Connected`, color: 'text-amber-400' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-[#C1B6FD]/30 transition-all"
              >
                <div className={`p-2 rounded-lg ${item.bg} w-fit mb-3`}>{item.icon}</div>
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className={`text-sm sm:text-base font-bold capitalize ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Target Audience Profile */}
          <motion.div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/10"><Users className="w-5 h-5 text-gray-300" /></div>
              <h3 className="text-xl font-bold text-white">Target Audience Demographics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Age Bracket</p>
                <p className="text-sm font-semibold text-white">{campaign.targetAudience?.ageRange || 'Not specified'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Target Gender</p>
                <p className="text-sm font-semibold text-white">{formatLabel(campaign.targetAudience?.gender) || 'All'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Niche Interests</p>
                <p className="text-sm font-semibold text-white">
                  {(campaign.targetAudience?.interests || []).length ? campaign.targetAudience.interests.join(', ') : 'Broad Reach'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(campaign.targetAudience?.platformsUsed || []).map((platform) => (
                <span key={platform} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                  {getPlatformIcon(platform)}
                  {formatLabel(platform)}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Brand Voice Meter */}
          {brandTone && (
            <motion.div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#745CB4]/20"><Megaphone className="w-5 h-5 text-[#C1B6FD]" /></div>
                <h3 className="text-xl font-bold text-white">Brand Voice Metrics</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-gray-400">Formality</p>
                  <p className="text-white font-semibold">{brandTone.tone_formality ?? 3} / 5</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-gray-400">Playfulness</p>
                  <p className="text-white font-semibold">{brandTone.tone_playfulness ?? 3} / 5</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-gray-400">Boldness</p>
                  <p className="text-white font-semibold">{brandTone.tone_boldness ?? 3} / 5</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Dynamic Content Calendar Entries */}
          <ContentCalendarMonthView
            calendarItems={calendarItems}
            calendarMeta={{}}
            formatDate={formatDate}
            showAllCalendar={showAllCalendar}
            setShowAllCalendar={setShowAllCalendar}
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Targeted Campaign KPIs Tracker */}
          <motion.div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-[#745CB4]/20"><BarChart3 className="w-5 h-5 text-[#C1B6FD]" /></div>
              <h3 className="text-xl font-bold text-white">Target KPIs</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {(campaign.kpis || []).map((kpi) => (
                <div key={kpi.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-wider">{formatLabel(kpi.metric)}</p>
                    <p className="text-xl font-extrabold text-white">{formatNumber(kpi.targetValue)}</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-[#C1B6FD] opacity-60" />
                </div>
              ))}
              {(!(campaign.kpis || []).length) && (
                <p className="text-sm text-gray-400 italic">No exact numeric KPI parameters defined.</p>
              )}
            </div>
          </motion.div>

          {/* Structural Metadata Panel */}
          <motion.div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-white/10"><Calendar className="w-5 h-5 text-gray-300" /></div>
              <h3 className="text-lg font-bold text-white">Metadata Matrix</h3>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Campaign ID', value: `#${campaign.id}` },
                { label: 'System Stage', value: formatLabel(campaign.lifecycleStage) },
                { label: 'Start Sync', value: formatDate(campaign.startDate) },
                { label: 'End Horizon', value: formatDate(campaign.endDate) },
                { label: 'Duration Output', value: `${campaignDuration || campaign.campaign_duration_weeks * 7} calendar days` },
                { label: 'Created Node', value: formatDate(campaign.createdAt) },
                { label: 'Latest Check', value: formatDate(campaign.updatedAt) },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 gap-4">
                  <span className="text-gray-400 text-xs">{row.label}</span>
                  <span className="text-white font-medium text-xs text-right">{row.value || '—'}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default SingleCampaign;