import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles,
  Calendar, 
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
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useCampaignStore from '../../../../../../stores/campaignStore';

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


  // derive normalized campaign object from store response
  const campaign = currentCampaign?.data?.campaign || currentCampaign?.campaign || currentCampaign;
  const _motionRef = motion;
console.log("campaign", campaign)
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
  // Loading state — campaign not yet fetched
  if (isLoading && !campaign) {
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
                The campaign with ID "{campaignId}" does not exist.
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
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-400" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-400" />;
      default:
        return <Share2 className="w-4 h-4 text-gray-400" />;
    }
  };

  const LIFECYCLE_BADGE = {
    draft:        { bg: 'bg-gray-500/20',    border: 'border-gray-500/30',    text: 'text-gray-400',    icon: <AlertCircle className="w-3 h-3" />,  label: 'Draft' },
    ai_generated: { bg: 'bg-[#745CB4]/20',   border: 'border-[#C1B6FD]/30',   text: 'text-[#C1B6FD]',   icon: <Sparkles className="w-3 h-3" />,     label: 'AI Generated' },
    saved:        { bg: 'bg-blue-500/20',     border: 'border-blue-500/30',     text: 'text-blue-400',    icon: <CheckCircle className="w-3 h-3" />,   label: 'Saved' },
    completed:    { bg: 'bg-green-500/20',    border: 'border-green-500/30',    text: 'text-green-400',   icon: <CheckCircle className="w-3 h-3" />,   label: 'Completed' },
    cancelled:    { bg: 'bg-red-500/20',      border: 'border-red-500/30',      text: 'text-red-400',     icon: <AlertCircle className="w-3 h-3" />,  label: 'Cancelled' },
    in_progress:  { bg: 'bg-yellow-500/20',   border: 'border-yellow-500/30',   text: 'text-yellow-400',  icon: <Clock className="w-3 h-3" />,         label: 'In Progress' },
    pending:      { bg: 'bg-gray-500/20',     border: 'border-gray-500/30',     text: 'text-gray-400',    icon: <AlertCircle className="w-3 h-3" />,  label: 'Pending' },
    scheduled:    { bg: 'bg-blue-500/20',     border: 'border-blue-500/30',     text: 'text-blue-400',    icon: <Clock className="w-3 h-3" />,         label: 'Scheduled' },
  };

  const getStatusBadge = (status) => {
    const cfg = LIFECYCLE_BADGE[status];
    if (!cfg) return null;
    return (
      <span className={`px-3 py-1 ${cfg.bg} border ${cfg.border} rounded-full text-xs font-semibold ${cfg.text} flex items-center gap-1`}>
        {cfg.icon}{cfg.label}
      </span>
    );
  };

  const lifecycleStage = campaign.lifecycleStage ?? 'draft';
  const activeAiVersion = (campaign.aiVersions || []).find((version) => version.isActive) || (campaign.aiVersions || [])[0] || null;
  const strategy = activeAiVersion?.strategy || {};
  const execution = activeAiVersion?.execution || {};
  const estimations = activeAiVersion?.estimations || {};
  const campaignDuration = getDurationDays(campaign.startDate, campaign.endDate);
  const calendarItems = execution?.contentCalendar?.length ? execution.contentCalendar : (campaign.contentCalendar || []);
  const visibleCalendar = showAllCalendar ? calendarItems : calendarItems.slice(0, 7);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-6"
    >
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
            {(lifecycleStage === 'draft' || lifecycleStage === 'ai_generated') && activeAiVersion && (
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 6px 24px rgba(193,182,253,0.35)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  navigate('/dashboard/owner/campaigns/generated', {
                    state: {
                      campaignData: {
                        campaignName: campaign.campaignName,
                        campaign_name: campaign.campaignName,
                        goalType: campaign.campaign_goal,
                        campaign_goal: campaign.campaign_goal,
                        totalBudget: campaign.budget_amount,
                        budget_amount: campaign.budget_amount,
                        currency: campaign.budget_currency,
                        budget_currency: campaign.budget_currency,
                        campaign_duration_weeks: campaign.campaign_duration_weeks,
                        startDate: campaign.startDate,
                        endDate: campaign.endDate,
                        targetAudience: campaign.targetAudience,
                      },
                      aiPreview: {
                        strategy: activeAiVersion.strategy,
                        execution: activeAiVersion.execution,
                        estimations: activeAiVersion.estimations,
                        generatedAt: activeAiVersion.generatedAt,
                      },
                    },
                  })
                }
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white text-xs font-bold shadow-lg shadow-[#745CB4]/30 transition-all"
              >
                <PlayCircle className="w-4 h-4" />
                Continue Campaign
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-linear-to-br from-[#745CB4]/10 via-transparent to-[#C1B6FD]/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Campaign Summary</h2>
                <p className="text-gray-300 leading-relaxed">{strategy?.campaignSummary || 'No AI summary available for this campaign yet.'}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Target className="w-5 h-5 text-[#C1B6FD]" />, bg: 'bg-[#745CB4]/20', label: 'Goal', value: formatLabel(campaign.campaign_goal), color: 'text-white' },
              { icon: <DollarSign className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-500/20', label: 'Budget', value: `${campaign.budget_currency || ''} ${formatNumber(campaign.budget_amount)}`, color: 'text-emerald-400' },
              { icon: <Clock className="w-5 h-5 text-blue-400" />, bg: 'bg-blue-500/20', label: 'Duration', value: `${campaignDuration} days`, color: 'text-blue-400' },
              { icon: <Globe className="w-5 h-5 text-amber-400" />, bg: 'bg-amber-500/20', label: 'Platforms', value: `${strategy?.platformSelection?.length || campaign.targetAudience?.platformsUsed?.length || 0} platforms`, color: 'text-amber-400' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-[#C1B6FD]/30 transition-all"
              >
                <div className={`p-2 rounded-lg ${item.bg} w-fit mb-3`}>{item.icon}</div>
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className={`text-base font-bold capitalize ${item.color}`}>{item.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/10"><Users className="w-5 h-5 text-gray-300" /></div>
              <h3 className="text-xl font-bold text-white">Audience Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Age Range</p>
                <p className="text-sm font-semibold text-white">{campaign.targetAudience?.ageRange || 'Not specified'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Gender</p>
                <p className="text-sm font-semibold text-white">{campaign.targetAudience?.gender || 'Not specified'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Interests</p>
                <p className="text-sm font-semibold text-white">{(campaign.targetAudience?.interests || []).length ? campaign.targetAudience.interests.join(', ') : 'No interests selected'}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(campaign.targetAudience?.platformsUsed || []).map((platform) => (
                <span key={platform} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-gray-300">
                  {getPlatformIcon(String(platform).toLowerCase())}
                  {formatLabel(platform)}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-[#745CB4]/20"><Target className="w-5 h-5 text-[#C1B6FD]" /></div>
              <h3 className="text-xl font-bold text-white">Platform Selection</h3>
            </div>
            <div className="space-y-3">
              {(strategy?.platformSelection || []).map((platform, index) => (
                <motion.div
                  key={`${platform.platform}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.08 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#C1B6FD]/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold text-lg">{formatLabel(platform.platform)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${platform.priority === 'primary' ? 'bg-[#C1B6FD]/20 text-[#C1B6FD]' : 'bg-blue-500/20 text-blue-400'}`}>
                      {formatLabel(platform.priority)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{platform.rationale || 'No rationale provided'}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 shrink-0">Audience Match</span>
                    <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${platform.audienceMatchScore || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                      />
                    </div>
                    <span className="text-[#C1B6FD] font-bold text-sm">{platform.audienceMatchScore ?? 0}%</span>
                  </div>
                </motion.div>
              ))}
              {(!(strategy?.platformSelection || []).length) && <p className="text-sm text-gray-400">No AI platform selection available.</p>}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-emerald-500/20"><PieChart className="w-5 h-5 text-emerald-400" /></div>
              <h3 className="text-xl font-bold text-white">Budget Allocation</h3>
              <span className="ml-auto text-sm text-emerald-400 font-semibold">
                Total: {formatNumber(strategy?.budgetAllocation?.totalAllocated)} {campaign.budget_currency || ''}
              </span>
            </div>
            <div className="space-y-4">
              {(strategy?.budgetAllocation?.breakdown || []).map((item, i) => (
                <div key={`${item.category}-${i}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-200 font-medium capitalize">{formatLabel(item.category)}</span>
                    <span className="text-white font-bold text-sm">
                      {formatNumber(item.amount)} {campaign.budget_currency || ''}
                      <span className="text-emerald-400 ml-1">({item.percentage || 0}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage || 0}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                    />
                  </div>
                  {(item.platforms || []).length > 0 && (
                    <div className="mt-2 ml-4 space-y-1.5">
                      {item.platforms.map((platform, j) => (
                        <div key={`${platform.platform}-${j}`} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                          <span className="text-sm text-gray-300">{formatLabel(platform.platform)}</span>
                          <div className="text-right">
                            <span className="text-white text-sm font-semibold">{formatNumber(platform.amount)} {campaign.budget_currency || ''}</span>
                            <span className="text-emerald-400 text-xs ml-2">({formatNumber(platform.dailyBudget)}/day)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {(!(strategy?.budgetAllocation?.breakdown || []).length) && <p className="text-sm text-gray-400">No budget allocation available.</p>}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-amber-500/20"><Megaphone className="w-5 h-5 text-amber-400" /></div>
              <h3 className="text-xl font-bold text-white">Ad Strategy</h3>
            </div>
            <div className="space-y-3">
              {(execution?.adStrategy?.campaigns || []).map((ad, i) => (
                <div key={`${ad.platform}-${i}`} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-bold">{formatLabel(ad.platform)}</span>
                    <span className="text-xs px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full capitalize">{formatLabel(ad.objective)}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Campaign Type</p>
                      <p className="text-sm text-gray-200">{ad.campaignType || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Duration</p>
                      <p className="text-sm text-gray-200">{ad.duration || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Daily Budget</p>
                      <p className="text-sm text-emerald-400 font-semibold">{formatNumber(ad.dailyBudget)} {campaign.budget_currency || ''}</p>
                    </div>
                  </div>
                </div>
              ))}
              {(!(execution?.adStrategy?.campaigns || []).length) && <p className="text-sm text-gray-400">No ad strategy generated.</p>}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-blue-500/20"><Calendar className="w-5 h-5 text-blue-400" /></div>
              <h3 className="text-xl font-bold text-white">Content Calendar</h3>
              <span className="ml-auto text-xs text-gray-400">{calendarItems.length} entries</span>
            </div>
            <div className="space-y-3">
              {visibleCalendar.map((item, i) => (
                <motion.div
                  key={`${item.id || i}-${item.platform || ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.04 }}
                  className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#C1B6FD]/40 transition-all"
                >
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-linear-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center shadow-md">
                    <div className="text-center">
                      <div className="text-[9px] text-white/70 font-medium leading-none">Day</div>
                      <div className="text-lg font-bold text-white leading-snug">{item.day || i + 1}</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      <span className="font-semibold text-white capitalize">{formatLabel(item.contentType)}</span>
                      <span className="text-xs px-2.5 py-0.5 bg-[#745CB4]/20 text-[#C1B6FD] rounded-full border border-[#C1B6FD]/20">{formatLabel(item.platform)}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-gray-300 mb-1 line-clamp-1">{item.caption || 'No caption provided'}</p>
                    <p className="text-xs text-gray-500">{formatDate(item.date)} · {item.task || 'No task provided'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            {calendarItems.length > 7 && (
              <button
                onClick={() => setShowAllCalendar((value) => !value)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-[#C1B6FD]/30 transition-all text-sm font-medium"
              >
                {showAllCalendar ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> Show All {calendarItems.length} Days
                  </>
                )}
              </button>
            )}
            {!calendarItems.length && <p className="text-sm text-gray-400">No content calendar entries.</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">All AI Versions</h3>
              <span className="text-sm text-[#C1B6FD]">{(campaign.aiVersions || []).length} versions</span>
            </div>
            <div className="space-y-4">
              {(campaign.aiVersions || []).map((version) => (
                <div key={version.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-white">Version {version.versionNumber}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] border ${version.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                      {version.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Generated: {formatDateTime(version.generatedAt)}</p>
                  <p className="text-xs text-gray-500 mt-1">Summary: {version.strategy?.campaignSummary || '—'}</p>
                </div>
              ))}
              {(!(campaign.aiVersions || []).length) && <p className="text-sm text-gray-400">No AI versions available.</p>}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6 sticky top-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-[#745CB4]/20"><BarChart3 className="w-5 h-5 text-[#C1B6FD]" /></div>
              <h3 className="text-xl font-bold text-white">Estimated Results</h3>
            </div>

            {estimations?.estimatedResults ? (
              <>
                <div className="p-4 bg-linear-to-br from-[#745CB4]/10 to-[#C1B6FD]/5 rounded-xl border border-[#C1B6FD]/20 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">Scenario</span>
                    <span className="text-white font-bold capitalize px-3 py-1 bg-white/10 rounded-full text-xs">
                      {formatLabel(estimations.estimatedResults.scenario)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${estimations.estimatedResults.confidenceLevel || 0}%` }}
                          transition={{ duration: 1.2, delay: 0.5 }}
                          className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                        />
                      </div>
                      <span className="text-[#C1B6FD] font-bold text-sm">{estimations.estimatedResults.confidenceLevel ?? 0}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {(estimations.estimatedResults.metrics || []).map((metric, i) => {
                    const palette = [
                      { grad: 'from-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/20' },
                      { grad: 'from-[#745CB4]/20', text: 'text-[#C1B6FD]', border: 'border-[#745CB4]/20' },
                      { grad: 'from-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/20' },
                    ];
                    const color = palette[i % palette.length];
                    return (
                      <motion.div
                        key={`${metric.metric}-${i}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className={`p-4 bg-linear-to-br ${color.grad} to-transparent rounded-xl border ${color.border}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className={`w-4 h-4 ${color.text}`} />
                          <span className="text-sm font-semibold text-gray-300 capitalize">{formatLabel(metric.metric)}</span>
                        </div>
                        <p className={`text-2xl font-bold ${color.text}`}>{formatNumber(metric.estimatedRange?.mostLikely)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Range: {formatNumber(metric.estimatedRange?.min)} – {formatNumber(metric.estimatedRange?.max)}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">No estimation results generated.</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-white/10"><Calendar className="w-5 h-5 text-gray-300" /></div>
              <h3 className="text-lg font-bold text-white">Campaign Details</h3>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Name', value: campaign.campaignName },
                { label: 'Goal', value: formatLabel(campaign.campaign_goal) },
                { label: 'Budget', value: `${campaign.budget_currency || ''} ${formatNumber(campaign.budget_amount)}` },
                { label: 'Duration (weeks)', value: campaign.campaign_duration_weeks ? `${campaign.campaign_duration_weeks} weeks` : '—' },
                { label: 'Start Date', value: formatDate(campaign.startDate) },
                { label: 'End Date', value: formatDate(campaign.endDate) },
                { label: 'Duration', value: `${campaignDuration} days` },
                { label: 'Created', value: formatDate(campaign.createdAt) },
                { label: 'Updated', value: formatDate(campaign.updatedAt) },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 gap-4">
                  <span className="text-gray-400">{row.label}</span>
                  <span className="text-white font-medium text-right">{row.value || '—'}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex items-start gap-3 p-4 bg-[#745CB4]/10 border border-[#C1B6FD]/20 rounded-xl text-sm text-gray-400">
            <CheckCircle className="w-5 h-5 text-[#C1B6FD] shrink-0 mt-0.5" />
            <p>This campaign view now follows the same visual system as the generated preview, and highlights AI ad strategy plus expected outcomes.</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-[#745CB4]/20"><BarChart3 className="w-5 h-5 text-[#C1B6FD]" /></div>
          <h3 className="text-xl font-bold text-white">Campaign KPIs</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(campaign.kpis || []).map((kpi) => (
            <div key={kpi.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-gray-400 mb-1">{formatLabel(kpi.metric)}</p>
              <p className="text-lg font-bold text-white">{formatNumber(kpi.targetValue)}</p>
            </div>
          ))}
          {(!(campaign.kpis || []).length) && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sm text-gray-400">No KPIs defined</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SingleCampaign;

