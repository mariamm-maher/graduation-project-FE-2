import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Save, Send, Calendar, Lock, List, ArrowLeft, Loader2, Info, DollarSign } from 'lucide-react';
import useCollaborationStore from '../../../../../../stores/collaborationStore';
import useCollaborationContractsStore from '../../../../../../stores/CollaborationContractsStore';
import { toast } from 'react-toastify';

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400 mb-2">
        <Lock className="w-3.5 h-3.5 opacity-60" />
        {label}
      </label>
      <div className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-[#C1B6FD] text-sm select-all cursor-default">
        {value || <span className="text-gray-600 italic">—</span>}
      </div>
    </div>
  );
}

function CreateContract() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { ownerCollaborations, isOwnerCollaborationsLoading, getMyOwnerCollaborations } = useCollaborationStore();
  const { createContract, isLoading: contractLoading } = useCollaborationContractsStore();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    deliverables: '',
    notes: ''
  });

  const collaboration = ownerCollaborations?.find(c => (c._id || c.id)?.toString() === id);

  useEffect(() => {
    if (!collaboration && ownerCollaborations.length === 0) {
      getMyOwnerCollaborations();
    }
  }, [collaboration, getMyOwnerCollaborations, ownerCollaborations.length]);

  const agreedPrice =
    collaboration?.request?.counterPrice != null
      ? Number(collaboration.request.counterPrice)
      : collaboration?.request?.proposedBudget != null
      ? Number(collaboration.request.proposedBudget)
      : collaboration?.agreedBudget ?? collaboration?.budget ?? 0;

  const campaignName = collaboration?.campaign?.campaignName || collaboration?.campaignName || '—';
  const influencerName = collaboration?.influencer
    ? `${collaboration.influencer.firstName || ''} ${collaboration.influencer.lastName || ''}`.trim()
    : collaboration?.influencerName || '—';
  const ownerId     = collaboration?.ownerId     ? String(collaboration.ownerId)     : (collaboration?.request?.ownerId ? String(collaboration.request.ownerId) : '—');
  const influencerId = collaboration?.influencerId ? String(collaboration.influencerId) : (collaboration?.request?.influencerId ? String(collaboration.request.influencerId) : '—');
  const campaignId  = collaboration?.campaignId  ? String(collaboration.campaignId)  : '—';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const buildPayload = (status) => ({
    agreedPrice,
    deliverables: formData.deliverables.split('\n').filter(d => d.trim() !== ''),
    startDate: formData.startDate,
    endDate: formData.endDate,
    status,
    notes: formData.notes,
  });

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await createContract(id, buildPayload('draft'));
    setIsLoading(false);
    if (response.success) {
      toast.success('Contract saved as draft successfully!');
      navigate('/dashboard/owner/collaborations');
    } else {
      toast.error(response.error || 'Failed to save contract draft');
    }
  };

  const handleSendToInfluencer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await createContract(id, buildPayload('sent'));
    setIsLoading(false);
    if (response.success) {
      toast.success('Contract sent to Influencer successfully!');
      navigate('/dashboard/owner/collaborations');
    } else {
      toast.error(response.error || 'Failed to send contract');
    }
  };

  if (isOwnerCollaborationsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C1B6FD] animate-spin" />
      </div>
    );
  }

  if (!collaboration) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-gray-400">
        Collaboration not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#C1B6FD]" />
            Make a Contract
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Draft and send a formal contract to <strong className="text-white">{influencerName}</strong>
          </p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 space-y-8">

        {/* ── Read-only: From collaboration request ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#745CB4] uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
            <Lock className="w-4 h-4" /> From Collaboration Request
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReadOnlyField label="Collaboration ID" value={String(collaboration.id)} />
            <ReadOnlyField label="Agreed Price" value={`$${Number(agreedPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
            <ReadOnlyField label="Campaign" value={campaignName} />
            <ReadOnlyField label="Influencer" value={influencerName} />
            <ReadOnlyField label="Owner ID" value={ownerId} />
            <ReadOnlyField label="Influencer ID" value={influencerId} />
            <ReadOnlyField label="Campaign ID" value={campaignId} />
          </div>
        </div>

        <form className="space-y-6">
          {/* ── Dates ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-400" /> Contract Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Deliverables ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
              <List className="w-5 h-5 text-blue-400" /> Scope of Work
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Deliverables & Responsibilities</label>
              <textarea
                name="deliverables"
                value={formData.deliverables}
                onChange={handleChange}
                rows={4}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all resize-none"
                placeholder="List the specific content requirements, platforms, posting schedules, etc."
              />
            </div>
          </div>

          {/* ── Notes ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" /> Additional Terms
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes & Additional Conditions (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all resize-none"
                placeholder="Usage rights, exclusivity clauses, non-disclosure agreements, etc."
              />
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isLoading || contractLoading}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save as Draft
            </button>
            <button
              type="button"
              onClick={handleSendToInfluencer}
              disabled={isLoading || contractLoading}
              className="px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Send Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateContract;
