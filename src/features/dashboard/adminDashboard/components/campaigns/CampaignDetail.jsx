import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, User, Calendar, Save, DollarSign, Target, Clock, Users, Mail, Phone, Hash } from 'lucide-react';
import adminService from '../../../../../api/adminApi';
import useAdminStore from '../../../../../stores/AdminStore';
import { toast } from 'react-toastify';

const LIFECYCLE_OPTIONS = ['draft', 'ai_generated', 'active', 'completed', 'cancelled'];

const GOAL_OPTIONS = ['Awareness', 'Leads', 'Sales', 'Retention', 'Re-engagement'];

function formatCurrency(amount, currency = 'USD') {
  if (!amount || amount === 0) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function getStatusColor(status) {
  const s = (status || '').toLowerCase();
  if (s === 'active' || s === 'live') return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (s === 'completed') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  if (s === 'draft' || s === 'ai_generated') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  if (s === 'cancelled') return 'bg-red-500/20 text-red-400 border-red-500/30';
  return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

function CampaignDetail() {
  const { id } = useParams();
  const { updateCampaignStatus } = useAdminStore();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusSelect, setStatusSelect] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await adminService.getCampaignById(id);
        const raw = res.data?.campaign ?? res.campaign ?? res.data?.data ?? res.data;
        const c = raw && typeof raw === 'object' && (raw.id != null || raw.campaignName) ? raw : null;
        if (!cancelled && c) {
          setCampaign(c);
          setStatusSelect(c.lifecycleStage || c.status || 'draft');
        } else if (!cancelled) {
          setCampaign(null);
        }
      } catch (e) {
        if (!cancelled) {
          toast.error(e.message || 'Failed to load campaign');
          setCampaign(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleSaveStatus = async () => {
    if (!campaign) return;
    setSaving(true);
    try {
      await updateCampaignStatus(campaign.id, statusSelect);
      setCampaign((prev) => (prev ? { ...prev, lifecycleStage: statusSelect } : null));
      toast.success('Status updated');
    } catch (e) {
      toast.error(e.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const owner = campaign?.user;
  const ownerName = owner
    ? [owner.firstName, owner.lastName].filter(Boolean).join(' ').trim()
    : '—';
  const ownerAvatar = owner?.firstName?.[0] || owner?.email?.[0] || '?';
  const name = campaign?.campaignName || campaign?.name || '—';
  const status = campaign?.lifecycleStage || campaign?.status || '—';
  const budget = formatCurrency(campaign?.budget_amount || campaign?.budget, campaign?.budget_currency);
  const goalType = campaign?.campaign_goal || campaign?.goalType || '—';
  const duration = campaign?.campaign_duration_weeks
    ? `${campaign.campaign_duration_weeks} weeks`
    : (campaign?.startDate && campaign?.endDate)
      ? `${Math.ceil((new Date(campaign.endDate) - new Date(campaign.startDate)) / (1000 * 60 * 60 * 24))} days`
      : '—';
  const createdAt = campaign?.createdAt
    ? new Date(campaign.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';
  const collaborations = campaign?.Collaborations?.length || campaign?.collaborationsCount || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        Loading campaign...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12 text-gray-400">
        Campaign not found.{' '}
        <Link to="/dashboard/admin/campaigns" className="text-[#C1B6FD] hover:underline">
          Back to Campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/dashboard/admin/campaigns" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Campaigns
      </Link>

      {/* Header Card */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-white truncate">{name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                  {(status || '—').replace('_', ' ')}
                </span>
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <Hash className="w-3 h-3" /> ID: {campaign?.id}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/5 rounded-lg px-4 py-2 border border-white/10">
              <p className="text-xs text-gray-400">Budget</p>
              <p className="text-lg font-bold text-white">{budget}</p>
            </div>
            <div className="bg-white/5 rounded-lg px-4 py-2 border border-white/10">
              <p className="text-xs text-gray-400">Collaborations</p>
              <p className="text-lg font-bold text-white">{collaborations}</p>
            </div>
            <div className="bg-white/5 rounded-lg px-4 py-2 border border-white/10">
              <p className="text-xs text-gray-400">Duration</p>
              <p className="text-lg font-bold text-white">{duration}</p>
            </div>
          </div>
        </div>

        {/* Owner Info Card */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" /> Campaign Owner
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#745CB4]/30 flex items-center justify-center text-white text-lg font-medium">
              {ownerAvatar.toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">{ownerName}</p>
              {owner?.email && (
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {owner.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Campaign Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-white/10">
          {/* Status Management */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" /> Status Management
            </p>
            <div className="flex flex-col gap-2">
              <select
                value={statusSelect}
                onChange={(e) => setStatusSelect(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#C1B6FD] text-sm"
                style={{ colorScheme: 'dark' }}
              >
                {LIFECYCLE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} style={{ backgroundColor: '#1e1632', color: '#fff' }}>
                    {opt.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSaveStatus}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#745CB4] hover:bg-[#5D459D] disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Campaign Goal */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" /> Campaign Goal
            </p>
            <p className="text-white font-medium capitalize">{goalType.replace('_', ' ')}</p>
            <p className="text-xs text-gray-500 mt-1">
              {goalType === 'Awareness' && 'Focus on brand visibility and reach'}
              {goalType === 'Leads' && 'Generate potential customer leads'}
              {goalType === 'Sales' && 'Drive direct product/service sales'}
              {goalType === 'Retention' && 'Maintain existing customer relationships'}
              {goalType === 'Re-engagement' && 'Re-engage inactive customers'}
            </p>
          </div>

          {/* Budget */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Budget
            </p>
            <p className="text-xl font-bold text-white">{budget}</p>
            <p className="text-xs text-gray-500 mt-1">{campaign?.budget_currency || 'USD'}</p>
          </div>

          {/* Duration */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Duration
            </p>
            <p className="text-white font-medium">{duration}</p>
            {campaign?.startDate && (
              <p className="text-xs text-gray-500 mt-1">
                From {new Date(campaign.startDate).toLocaleDateString()}
                {campaign?.endDate && ` to ${new Date(campaign.endDate).toLocaleDateString()}`}
              </p>
            )}
          </div>

          {/* Collaborations */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" /> Active Collaborations
            </p>
            <p className="text-xl font-bold text-white">{collaborations}</p>
            <p className="text-xs text-gray-500 mt-1">Influencer partnerships</p>
          </div>

          {/* Created Date */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Created
            </p>
            <p className="text-white font-medium">{createdAt}</p>
            <p className="text-xs text-gray-500 mt-1">
              {campaign?.createdAt && `${Math.ceil((Date.now() - new Date(campaign.createdAt)) / (1000 * 60 * 60 * 24))} days ago`}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        {(campaign?.campaign_description || campaign?.description) && (
          <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-2">Description</p>
            <p className="text-white text-sm leading-relaxed">{campaign.campaign_description || campaign.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignDetail;
