import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, MessageSquare, Bookmark, BookmarkCheck,
  Eye, Send, X, Target, Users, DollarSign, Calendar,
  Building2, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useInfluncerStore from '../../../../../stores/influncerStore';
import useSavedCampaignsStore from '../../../../../stores/savedCampaignsStore';

// ─── Contact Owner Modal ────────────────────────────────────────────────────
function ContactModal({ campaign, onClose }) {
  const [message, setMessage] = useState('');
  const { contactOwner, contactOwnerLoading, contactOwnerError, contactOwnerSuccess, resetContactOwner } = useInfluncerStore();
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
    return () => resetContactOwner();
  }, [resetContactOwner]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await contactOwner(campaign.id, message.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1525] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">Contact Owner</h3>
            <p className="text-xs text-gray-400 mt-0.5">{campaign.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Owner info strip */}
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#745CB4]/30 flex items-center justify-center text-[#C1B6FD] font-bold text-sm">
            {(campaign.brand?.name || 'B').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{campaign.brand?.name || 'Brand Owner'}</p>
            {campaign.brand?.industry && (
              <p className="text-xs text-gray-400">{campaign.brand.industry}</p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {contactOwnerSuccess ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400" />
              <p className="text-white font-semibold">Message sent!</p>
              <p className="text-sm text-gray-400">The owner will be notified of your interest.</p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 bg-[#745CB4] text-white rounded-lg font-medium hover:bg-[#8A6ED0] transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Your message <span className="text-red-400">*</span>
                </label>
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I'm interested in collaborating on this campaign. I specialize in..."
                  rows={5}
                  maxLength={600}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] resize-none transition-all"
                />
                <p className="text-right text-xs text-gray-500 mt-1">{message.length}/600</p>
              </div>

              {contactOwnerError && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {contactOwnerError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || contactOwnerLoading}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {contactOwnerLoading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
function CampaignsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [goalFilter, setGoalFilter] = useState('all');
  const [contactTarget, setContactTarget] = useState(null);

  const {
    exploreCampaigns,
    exploreCampaignsLoading,
    exploreCampaignsError,
    fetchExploreCampaigns,
  } = useInfluncerStore();

  const { savedCampaigns, saveCampaign, removeCampaign, isCampaignSaved } = useSavedCampaignsStore();

  const getCampaignId = (c) => String(c?._id ?? c?.id ?? c?.campaignId ?? '');

  useEffect(() => {
    fetchExploreCampaigns({ page: 1, limit: 20 });
  }, [fetchExploreCampaigns]);

  const normalizedCampaigns = useMemo(
    () => (Array.isArray(exploreCampaigns) ? exploreCampaigns : []),
    [exploreCampaigns]
  );

  const goalOptions = useMemo(() => {
    const goals = normalizedCampaigns.map((c) => c.campaignGoal).filter(Boolean);
    return ['all', ...Array.from(new Set(goals))];
  }, [normalizedCampaigns]);

  const filteredCampaigns = useMemo(() => normalizedCampaigns.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q
      || c.name?.toLowerCase().includes(q)
      || c.campaignName?.toLowerCase().includes(q)
      || c.brand?.name?.toLowerCase().includes(q)
      || c.brand?.industry?.toLowerCase().includes(q)
      || c.campaignGoal?.toLowerCase().includes(q);
    const matchGoal = goalFilter === 'all' || c.campaignGoal === goalFilter;
    return matchSearch && matchGoal;
  }), [normalizedCampaigns, searchQuery, goalFilter]);

  const fmt = (v, cur) => v ? `${Number(v).toLocaleString()} ${cur || ''}`.trim() : '—';
  const fmtDate = (v) => v ? new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';

  const handleSave = (campaign) => {
    const id = getCampaignId(campaign);
    if (!id) return;
    isCampaignSaved(id) ? removeCampaign(id) : saveCampaign({ ...campaign, id });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Explore Campaigns</h1>
        <p className="text-sm text-gray-400">Discover and send interest to published campaigns from brands</p>
      </div>

      {/* Search + filters row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, brand, industry, goal..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {goalOptions.map((g) => (
            <button
              key={g}
              onClick={() => setGoalFilter(g)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                goalFilter === g
                  ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              {g === 'all' ? 'All Goals' : g}
            </button>
          ))}
        </div>
      </div>

      {/* Top bar: count + saved link */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing <span className="font-semibold text-white">{filteredCampaigns.length}</span> campaign{filteredCampaigns.length !== 1 ? 's' : ''}
        </p>
        <Link
          to="/dashboard/influencer/campaigns/saved"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all"
        >
          <Bookmark className="w-4 h-4 text-[#C1B6FD]" />
          <span className="text-gray-400 text-xs">Saved</span>
          <span className="font-bold text-[#C1B6FD]">{savedCampaigns.length}</span>
        </Link>
      </div>

      {/* States */}
      {exploreCampaignsError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
          {exploreCampaignsError}
        </div>
      )}
      {exploreCampaignsLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse h-40" />
          ))}
        </div>
      )}
      {!exploreCampaignsLoading && !exploreCampaignsError && filteredCampaigns.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-10 text-center">
          <Target className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-300 font-medium">No campaigns found</p>
          <p className="text-gray-500 text-sm mt-1">Try a different search or goal filter.</p>
        </div>
      )}

      {/* Campaign cards */}
      {!exploreCampaignsLoading && (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => {
            const cid = getCampaignId(campaign);
            const saved = isCampaignSaved(cid);
            return (
              <div
                key={cid}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#745CB4]/40 transition-all group"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* ── Left: info ── */}
                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-[#C1B6FD] transition-colors truncate">
                            {campaign.name}
                          </h3>
                          <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            (campaign.applied || campaign.hasApplied) ? 'bg-[#745CB4]/20 text-[#C1B6FD]' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {(campaign.applied || campaign.hasApplied) ? 'Applied' : 'Open'}
                          </span>
                          {campaign.campaignGoal && (
                            <span className="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-gray-300">
                              {campaign.campaignGoal}
                            </span>
                          )}
                        </div>
                        {/* Brand */}
                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{campaign.brand?.name || 'Unknown brand'}</span>
                          {campaign.brand?.industry && (
                            <span className="text-gray-600">· {campaign.brand.industry}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSave(campaign)}
                        className={`shrink-0 p-2 rounded-lg transition-all ${
                          saved ? 'bg-[#745CB4]/20 text-[#C1B6FD]' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                        title={saved ? 'Remove from saved' : 'Save for later'}
                      >
                        {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Key metrics grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <DollarSign className="w-3.5 h-3.5 text-[#C1B6FD]" />
                          <p className="text-xs text-gray-400">Budget</p>
                        </div>
                        <p className="text-sm font-bold text-[#C1B6FD]">
                          {fmt(campaign.budget?.total, campaign.budget?.currency)}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-purple-300" />
                          <p className="text-xs text-gray-400">Duration</p>
                        </div>
                        <p className="text-sm font-bold text-white">
                          {campaign.durationWeeks ? `${campaign.durationWeeks}w` : '—'}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-purple-300" />
                          <p className="text-xs text-gray-400">Start</p>
                        </div>
                        <p className="text-sm font-bold text-white">{fmtDate(campaign.startDate)}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Users className="w-3.5 h-3.5 text-purple-300" />
                          <p className="text-xs text-gray-400">Audience</p>
                        </div>
                        <p className="text-sm font-bold text-white">
                          {campaign.targetAudience?.ageRange || '—'}
                          {campaign.targetAudience?.gender && campaign.targetAudience.gender !== 'all'
                            ? ` · ${campaign.targetAudience.gender}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Platforms */}
                    {campaign.platforms?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {campaign.platforms.map((p, i) => (
                          <span key={i} className="px-2.5 py-1 bg-[#745CB4]/15 border border-[#745CB4]/30 rounded-lg text-xs text-[#C1B6FD] capitalize">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* KPIs */}
                    {campaign.kpis?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {campaign.kpis.map((k, i) => (
                          <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">
                            <span className="text-gray-500">{k.metric}:</span> {k.targetValue}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Target audience interests */}
                    {campaign.targetAudience?.interests?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {campaign.targetAudience.interests.slice(0, 5).map((interest, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/5 rounded-md text-xs text-gray-400">
                            #{interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── Right: actions ── */}
                  <div className="lg:w-44 flex flex-col gap-2.5 shrink-0">
                    <button
                      onClick={() => setContactTarget(campaign)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Contact Owner
                    </button>

                    <Link
                      to={`/dashboard/influencer/campaigns/${cid}`}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>

                    {/* Dates */}
                    <div className="bg-white/5 rounded-xl p-3 mt-auto text-xs text-gray-400 space-y-1">
                      <p><span className="text-gray-500">End:</span> {fmtDate(campaign.endDate)}</p>
                      {campaign.brand?.website && (
                        <a
                          href={campaign.brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-[#C1B6FD] hover:underline truncate"
                        >
                          {campaign.brand.website.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contact modal */}
      {contactTarget && (
        <ContactModal
          campaign={contactTarget}
          onClose={() => setContactTarget(null)}
        />
      )}
    </div>
  );
}

export default CampaignsOverview;
