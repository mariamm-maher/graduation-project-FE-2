import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, DollarSign, MessageSquare, Briefcase, X, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import useCampaignStore from '../../../../../../stores/campaignStore';
import useCollaborationStore from '../../../../../../stores/collaborationStore';

function SendCollabRequest() {
  const { influencerId } = useParams();
  const navigate = useNavigate();

  // Campaign Store
  const { campaigns, fetchCampaigns, isLoading: isLoadingCampaigns } = useCampaignStore();
  // Collaboration Store
  const sendCollaborationRequest = useCollaborationStore((s) => s.sendCollaborationRequestAlt);

  const [formData, setFormData] = useState({
    campaignId: '',
    proposedBudget: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.proposedBudget || parseFloat(formData.proposedBudget) <= 0) {
      newErrors.proposedBudget = 'Please enter a valid budget amount';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        campaignId: formData.campaignId ? Number(formData.campaignId) : null,
        influencerId: Number(influencerId),
        proposedBudget: parseFloat(formData.proposedBudget),
        message: formData.message
      };

      const result = await sendCollaborationRequest(payload);

      if (result.success) {
        console.log('Collaboration Request Sent:', payload);
        toast.success('Collaboration request sent successfully!');
        navigate(-1);
      } else {
        throw new Error(result.error || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error(error.message || 'Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Send Collaboration Request</h1>
            <p className="text-sm text-gray-400 mt-1">Propose a collaboration with this influencer</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 overflow-hidden"
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C1B6FD]/5 via-transparent to-[#745CB4]/5"></div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {/* Campaign Selection (Optional) */}
          <div>
            <label htmlFor="campaignId" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Briefcase className="w-4 h-4 text-[#C1B6FD]" />
              Select Campaign (Optional)
            </label>
            <select
              id="campaignId"
              name="campaignId"
              value={formData.campaignId}
              onChange={handleChange}
              disabled={isLoadingCampaigns}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/50 transition-all disabled:opacity-50"
            >
              <option value="" className="bg-[#1a0933] text-gray-300">No specific campaign</option>
              {(() => {
                const campaignList = campaigns?.campaigns || (Array.isArray(campaigns) ? campaigns : []);
                return campaignList.map(campaign => (
                  <option key={campaign.id} value={campaign.id} className="bg-[#1a0933] text-white">
                    {campaign.campaignName}
                  </option>
                ));
              })()}
            </select>
            <p className="text-xs text-gray-400 mt-2">
              {isLoadingCampaigns ? 'Loading campaigns...' : 'Choose a campaign or leave empty for a general collaboration'}
            </p>
          </div>

          {/* Proposed Budget */}
          <div>
            <label htmlFor="proposedBudget" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <DollarSign className="w-4 h-4 text-[#C1B6FD]" />
              Proposed Budget <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
              <input
                type="number"
                id="proposedBudget"
                name="proposedBudget"
                value={formData.proposedBudget}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="5000.00"
                className={`w-full bg-white/5 border ${errors.proposedBudget ? 'border-red-500' : 'border-white/10'} rounded-xl pl-8 pr-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/50 transition-all`}
              />
            </div>
            {errors.proposedBudget && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 mt-2 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                {errors.proposedBudget}
              </motion.p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <MessageSquare className="w-4 h-4 text-[#C1B6FD]" />
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              placeholder="Introduce yourself and explain why you'd like to collaborate with this influencer..."
              className={`w-full bg-white/5 border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/50 transition-all resize-none`}
            />
            <div className="flex items-center justify-between mt-2">
              {errors.message ? (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  {errors.message}
                </motion.p>
              ) : (
                <p className="text-xs text-gray-400">Minimum 20 characters</p>
              )}
              <p className="text-xs text-gray-400">{formData.message.length} characters</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-xl text-white font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-bold hover:shadow-xl hover:shadow-[#C1B6FD]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Collaboration Request
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-[#745CB4]/10 to-[#C1B6FD]/10 border border-[#C1B6FD]/30 rounded-xl p-5"
      >
        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#C1B6FD]" />
          Tips for a Great Collaboration Request
        </h3>
        <ul className="text-sm text-gray-300 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-[#C1B6FD] mt-0.5">•</span>
            <span>Be specific about what you're looking for in the collaboration</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C1B6FD] mt-0.5">•</span>
            <span>Explain why you think this influencer is a good fit for your brand</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C1B6FD] mt-0.5">•</span>
            <span>Include details about deliverables and timeline if applicable</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C1B6FD] mt-0.5">•</span>
            <span>Be professional and respectful in your communication</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}

export default SendCollabRequest;
