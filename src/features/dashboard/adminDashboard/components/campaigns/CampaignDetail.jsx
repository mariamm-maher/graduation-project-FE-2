import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, User, Calendar, Save } from 'lucide-react';
import adminService from '../../../../../api/adminApi';
import useAdminStore from '../../../../../stores/AdminStore';
import { toast } from 'react-toastify';

const LIFECYCLE_OPTIONS = ['draft', 'ai_generated', 'active', 'completed'];

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

  const ownerName = campaign?.user
    ? [campaign.user.firstName, campaign.user.lastName].filter(Boolean).join(' ').trim()
    : '—';
  const name = campaign?.campaignName || campaign?.name || '—';
  const status = campaign?.lifecycleStage || campaign?.status || '—';

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

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{name}</h1>
              <p className="text-gray-400 flex items-center gap-2 mt-1">
                <User className="w-4 h-4" /> Owner: {ownerName}
                {campaign.user?.email && (
                  <span className="text-gray-500 text-sm">({campaign.user.email})</span>
                )}
              </p>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Status: {status}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10">
          <div>
            <p className="text-sm text-gray-400 mb-1">Campaign name</p>
            <p className="text-white font-medium">{name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Owner</p>
            <p className="text-white font-medium">{ownerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Lifecycle / Status</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <select
                value={statusSelect}
                onChange={(e) => setStatusSelect(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#C1B6FD]"
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
                className="flex items-center gap-2 px-4 py-2.5 bg-[#745CB4] hover:bg-[#5D459D] disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Update status'}
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Goal type</p>
            <p className="text-white font-medium capitalize">{(campaign.goalType || '—').replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Created</p>
            <p className="text-white font-medium">
              {campaign.createdAt ? new Date(campaign.createdAt).toISOString().split('T')[0] : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetail;
