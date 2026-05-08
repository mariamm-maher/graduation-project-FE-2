import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, DollarSign, Target, AlertCircle,
  MessageSquare, Send, Bookmark, BookmarkCheck, Building2,
  Users, BarChart2, Globe, X, CheckCircle, Clock
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useInfluncerStore from '../../../../../stores/influncerStore';
import useSavedCampaignsStore from '../../../../../stores/savedCampaignsStore';

// ─── Back Button ─────────────────────────────────────────────────────────────
function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} className="p-2 hover:bg-white/5 rounded-lg transition-all">
      <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
    </button>
  );
}

// ─── Contact Modal ───────────────────────────────────────────────────────────
function ContactModal({ campaign, onClose }) {
  const [message, setMessage] = useState('');
  const { contactOwner, contactOwnerLoading, contactOwnerError, contactOwnerSuccess, resetContactOwner } = useInfluncerStore();
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
    return () => resetContactOwner();
  }, [resetContactOwner]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await contactOwner(campaign.id, message.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1525] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">Contact Owner</h3>
            <p className="text-xs text-gray-400 mt-0.5">{campaign.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#745CB4]/30 flex items-center justify-center text-[#C1B6FD] font-bold text-sm">
            {(campaign.brand?.name || 'B').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{campaign.brand?.name || 'Brand Owner'}</p>
            {campaign.brand?.industry && <p className="text-xs text-gray-400">{campaign.brand.industry}</p>}
          </div>
        </div>
        <div className="p-5 space-y-4">
          {contactOwnerSuccess ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400" />
              <p className="text-white font-semibold">Message sent!</p>
              <p className="text-sm text-gray-400">The owner will be notified of your interest.</p>
              <button onClick={onClose} className="mt-2 px-6 py-2 bg-[#745CB4] text-white rounded-lg font-medium hover:bg-[#8A6ED0] transition-all">
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
                  ref={ref}
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
                <button onClick={onClose} className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-all">
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

// ─── Main ────────────────────────────────────────────────────────────────────
function SingleCampaign() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

  const {
    selectedCampaign, selectedCampaignLoading, selectedCampaignError,
    fetchCampaignById,
  } = useInfluncerStore();

  const { isCampaignSaved, saveCampaign, removeCampaign } = useSavedCampaignsStore();

  useEffect(() => {
    if (campaignId) fetchCampaignById(campaignId);
  }, [campaignId, fetchCampaignById]);

  const campaign = selectedCampaign;
  const saved = campaign ? isCampaignSaved(String(campaign.id)) : false;

  const fmt = (v, cur) => (v != null ? `${Number(v).toLocaleString()} ${cur || ''}`.trim() : '—');
  const fmtDate = (v) => v ? new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';

  const handleSave = () => {
    if (!campaign) return;
    const id = String(campaign.id);
    saved ? removeCampaign(id) : saveCampaign({ ...campaign, id });
  };

  const goBack = () => navigate('/dashboard/influencer/campaigns/overview');

  if (selectedCampaignLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse h-32" />
        ))}
      </div>
    );
  }

  if (selectedCampaignError || !campaign) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3"><BackBtn onClick={goBack} /></div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-white font-semibold mb-1">{selectedCampaignError || 'Campaign not found'}</p>
          <p className="text-gray-400 text-sm mb-5">ID: {campaignId}</p>
          <button
            onClick={() => navigate('/dashboard/influencer/campaigns/overview')}
            className="px-6 py-2.5 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ── Top bar ── */}
      <div className="flex items-start gap-4">
        <BackBtn onClick={goBack} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{campaign.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${campaign.applied ? 'bg-[#745CB4]/20 text-[#C1B6FD]' : 'bg-green-500/20 text-green-400'}`}>
              {campaign.applied ? 'Applied' : 'Open'}
            </span>
            {campaign.campaignGoal && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300">
                {campaign.campaignGoal}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Building2 className="w-4 h-4" />
            <span>{campaign.brand?.name || 'Unknown brand'}</span>
            {campaign.brand?.industry && <span className="text-gray-600">· {campaign.brand.industry}</span>}
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`shrink-0 p-2.5 rounded-xl transition-all ${saved ? 'bg-[#745CB4]/20 text-[#C1B6FD]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Key metrics ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <DollarSign className="w-5 h-5 text-[#C1B6FD]" />, label: 'Budget', value: fmt(campaign.budget?.total, campaign.budget?.currency), sub: campaign.budget?.currency },
          { icon: <Clock className="w-5 h-5 text-purple-300" />, label: 'Duration', value: campaign.durationWeeks ? `${campaign.durationWeeks} weeks` : '—', sub: `${fmtDate(campaign.startDate)} → ${fmtDate(campaign.endDate)}` },
          { icon: <Target className="w-5 h-5 text-purple-300" />, label: 'Goal', value: campaign.campaignGoal || '—', sub: campaign.lifecycleStage || '' },
          { icon: <Users className="w-5 h-5 text-purple-300" />, label: 'Audience', value: campaign.targetAudience?.ageRange || '—', sub: campaign.targetAudience?.gender || '' },
        ].map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#745CB4]/20 border border-[#C1B6FD]/20 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
              <p className="text-sm font-bold text-white truncate">{item.value}</p>
              {item.sub && <p className="text-xs text-gray-500 truncate">{item.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setShowContact(true)}
          className="flex-1 sm:flex-none px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Contact Owner
        </button>
      </div>

      {/* ── Platforms ── */}
      {campaign.platforms?.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-[#C1B6FD]" /> Platforms
          </h2>
          <div className="flex flex-wrap gap-2">
            {campaign.platforms.map((p, i) => (
              <span key={i} className="px-3 py-1.5 bg-[#745CB4]/15 border border-[#745CB4]/30 rounded-xl text-sm text-[#C1B6FD] capitalize">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── KPIs ── */}
      {campaign.kpis?.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-[#C1B6FD]" /> KPIs &amp; Targets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {campaign.kpis.map((k, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{k.metric?.replace(/_/g, ' ')}</p>
                <p className="text-base font-bold text-[#C1B6FD]">{k.targetValue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Target Audience ── */}
      {campaign.targetAudience && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-[#C1B6FD]" /> Target Audience
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Age Range</p>
              <p className="text-sm font-semibold text-white">{campaign.targetAudience.ageRange || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Gender</p>
              <p className="text-sm font-semibold text-white capitalize">{campaign.targetAudience.gender || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Preferred Platforms</p>
              <p className="text-sm font-semibold text-white">
                {campaign.targetAudience.platformsUsed?.join(', ') || '—'}
              </p>
            </div>
          </div>
          {campaign.targetAudience.interests?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {campaign.targetAudience.interests.map((interest, i) => (
                  <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">
                    #{interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Brand / Owner info ── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-[#C1B6FD]" /> Brand &amp; Owner
        </h2>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#745CB4]/20 border border-[#745CB4]/30 flex items-center justify-center text-[#C1B6FD] font-bold text-lg shrink-0">
            {(campaign.brand?.name || 'B').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white">{campaign.brand?.name || '—'}</p>
            {campaign.brand?.industry && <p className="text-sm text-gray-400 mb-2">{campaign.brand.industry}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {campaign.brand?.companySize && (
                <span className="text-gray-400">Size: <span className="text-white">{campaign.brand.companySize}</span></span>
              )}
              {campaign.brand?.website && (
                <a href={campaign.brand.website} target="_blank" rel="noopener noreferrer"
                  className="text-[#C1B6FD] hover:underline truncate">
                  {campaign.brand.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
            {campaign.brand?.targetMarket?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {campaign.brand.targetMarket.map((m, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400">{m}</span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowContact(true)}
            className="shrink-0 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Contact
          </button>
        </div>
      </div>

      {/* ── Contact modal ── */}
      {showContact && (
        <ContactModal campaign={campaign} onClose={() => setShowContact(false)} />
      )}
    </div>
  );
}

export default SingleCampaign;
