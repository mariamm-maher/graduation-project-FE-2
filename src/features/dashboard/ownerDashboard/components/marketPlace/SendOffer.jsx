import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, MessageSquare, Briefcase, Calendar, Loader, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import useOwnerStore from '../../../../../stores/ownerStore';
import useCampaignStore from '../../../../../stores/campaignStore';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]/50 focus:border-[#C1B6FD]/50 transition-all';
const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5';
const errorClass = 'mt-1.5 text-xs text-red-400';

function SendOffer() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const { serviceDetail, fetchServiceDetail, sendOffer, marketplaceLoading } = useOwnerStore();
  const { campaigns, fetchCampaigns } = useCampaignStore();

  const [form, setForm] = useState({
    campaignId: '',
    offerBudget: '',
    message: '',
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (serviceId) fetchServiceDetail(serviceId);
    fetchCampaigns({ limit: 100 });
  }, [serviceId, fetchServiceDetail, fetchCampaigns]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.offerBudget || parseFloat(form.offerBudget) <= 0)
      errs.offerBudget = 'Please enter a valid budget amount';
    if (!form.message.trim())
      errs.message = 'Please write a message to the influencer';
    else if (form.message.trim().length < 20)
      errs.message = 'Message must be at least 20 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        serviceId: Number(serviceId),
        campaignId: form.campaignId ? Number(form.campaignId) : undefined,
        offerBudget: parseFloat(form.offerBudget),
        message: form.message.trim(),
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };

      const result = await sendOffer(payload);
      if (result.success) {
        toast.success('Offer sent successfully!');
        navigate('/dashboard/owner/marketplace');
      } else {
        toast.error(result.error || 'Failed to send offer');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const service = serviceDetail?.id === Number(serviceId) ? serviceDetail : null;
  const serviceName = service?.title || 'this service';
  const influencerName = service?.influencer
    ? service.influencer.name || `${service.influencer.firstName || ''} ${service.influencer.lastName || ''}`.trim()
    : 'the influencer';

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
          <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Send an Offer</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Propose a deal with <span className="text-[#C1B6FD] font-medium">{influencerName}</span> for{' '}
            <span className="text-[#C1B6FD] font-medium">{serviceName}</span>
          </p>
        </div>
      </div>

      {/* Service summary banner */}
      {service && (
        <div
          className="bg-linear-to-r from-[#745CB4]/10 to-[#C1B6FD]/10 border border-[#C1B6FD]/20 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap"
        >
          <div>
            <p className="text-white font-semibold text-sm">{service.title}</p>
            <p className="text-gray-400 text-xs mt-0.5">Listed price: {service.currency || 'USD'} {Number(service.price || 0).toLocaleString()}</p>
          </div>
          {service.deliveryDays && (
            <span className="text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              {service.deliveryDays}d delivery
            </span>
          )}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5"
      >
        {/* Campaign (optional) */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#C1B6FD]" /> Link to Campaign <span className="text-gray-500 font-normal">(optional)</span></span>
          </label>
          <select
            name="campaignId"
            value={form.campaignId}
            onChange={handleChange}
            className={inputClass + ' cursor-pointer'}
          >
            <option value="">— No campaign —</option>
            {Array.isArray(campaigns) && campaigns.map(c => (
              <option key={c.id} value={c.id} className="bg-[#1a0933]">{c.campaignName || c.name}</option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-[#C1B6FD]" /> Your Offer Budget *</span>
          </label>
          <input
            type="number"
            name="offerBudget"
            value={form.offerBudget}
            onChange={handleChange}
            placeholder="e.g. 500"
            min="0"
            step="0.01"
            className={inputClass + (errors.offerBudget ? ' border-red-400/60 focus:ring-red-400/40' : '')}
          />
          {errors.offerBudget && <p className={errorClass}>{errors.offerBudget}</p>}
        </div>

        {/* Date range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#C1B6FD]" /> Start Date <span className="text-gray-500 font-normal">(optional)</span></span>
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={inputClass + ' scheme-dark'}
            />
          </div>
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#C1B6FD]" /> End Date <span className="text-gray-500 font-normal">(optional)</span></span>
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className={inputClass + ' scheme-dark'}
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#C1B6FD]" /> Message to Influencer *</span>
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Introduce yourself, describe what you're looking for, and explain why this collaboration would be great for both..."
            rows={5}
            className={inputClass + ' resize-none' + (errors.message ? ' border-red-400/60 focus:ring-red-400/40' : '')}
          />
          <div className="flex justify-between items-start mt-1.5">
            {errors.message ? <p className={errorClass}>{errors.message}</p> : <span />}
            <span className={`text-xs ${form.message.length < 20 ? 'text-gray-500' : 'text-[#C1B6FD]'}`}>
              {form.message.length} / 20 min
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || marketplaceLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-[#C1B6FD] to-[#745CB4] hover:from-[#a99ef0] hover:to-[#5e4a9a] disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-sm text-white font-semibold transition-all shadow-lg shadow-[#745CB4]/20"
          >
            {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? 'Sending…' : 'Send Offer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SendOffer;
