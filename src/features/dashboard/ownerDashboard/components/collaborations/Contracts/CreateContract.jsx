import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Save, Send, Calendar, DollarSign, List, ArrowLeft, Loader2, Info } from 'lucide-react';
import useCollaborationStore from '../../../../../../stores/collaborationStore';
import useCollaborationContractsStore from '../../../../../../stores/CollaborationContractsStore';
import { toast } from 'react-toastify';

function CreateContract() {
  const { id } = useParams(); // Collaboration ID
  const navigate = useNavigate();
  
  // Replace with real getter from store
  const { ownerCollaborations, isOwnerCollaborationsLoading, getMyOwnerCollaborations } = useCollaborationStore();
  const { createContract, isLoading: contractLoading } = useCollaborationContractsStore();

  const [isLoading, setIsLoading] = useState(false);
  
  // Setup standard state for the form
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    deliverables: '',
    agreedPrice: '',
    notes: ''
  });

  // Find the exact collaboration
  const collaboration = ownerCollaborations?.find(c => (c._id || c.id)?.toString() === id);

  useEffect(() => {
    // Refresh colabs if we don't have this one
    if (!collaboration && ownerCollaborations.length === 0) {
      getMyOwnerCollaborations();
    }
  }, [collaboration, getMyOwnerCollaborations, ownerCollaborations.length]);

  // Pre-fill some data if collaboration exists
  useEffect(() => {
    if (collaboration) {
      setFormData(prev => ({
        ...prev,
        title: `Contract: ${collaboration?.campaign?.campaignName || collaboration?.campaignName || 'Campaign'}`,
        startDate: (collaboration?.startDate || collaboration?.campaign?.startDate || new Date().toISOString()).split('T')[0],
        endDate: (collaboration?.endDate || collaboration?.campaign?.endDate || new Date().toISOString()).split('T')[0],
        agreedPrice: collaboration?.agreedBudget || collaboration?.budget || collaboration?.proposedBudget || collaboration?.campaign?.totalBudget || 0
      }));
    }
  }, [collaboration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const constructPayload = (status) => {
    return {
      collaborationId: parseInt(id),
      agreedPrice: parseFloat(formData.agreedPrice) || 0,
      deliverables: formData.deliverables.split('\n').filter(d => d.trim() !== ''), // Convert lines to JSON array format
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: status, // 'draft' or 'sent'
      notes: formData.notes
    };
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const payload = constructPayload('draft');
    console.log('Draft payload:', payload);
    
    // API call to save as draft
    const response = await createContract(id, payload);
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
    
    const payload = constructPayload('sent');
    console.log('Send to influencer payload:', payload);

    // API call to finalize and turn to sent
    const response = await createContract(id, payload);
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

  const influencerName = collaboration?.influencer?.firstName 
    ? `${collaboration.influencer.firstName} ${collaboration.influencer.lastName || ''}`
    : collaboration?.influencer?.user?.firstName
    ? `${collaboration.influencer.user.firstName} ${collaboration.influencer.user.lastName || ''}`
    : collaboration?.influencerName || 'the Influencer';

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

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8">
        <form className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-400" /> General Details
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contract Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
                placeholder="e.g. Master Collaboration Agreement"
                required
              />
            </div>

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
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date (Estimated)</label>
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

          {/* Scope and Deliverables */}
          <div className="space-y-4 pt-4">
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
                required
              />
            </div>
          </div>

          {/* Financials */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" /> Compensation & Terms
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Agreed Price ($)</label>
              <input
                type="number"
                name="agreedPrice"
                value={formData.agreedPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
                placeholder="e.g. 5000"
                required
              />
            </div>

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

          {/* Actions */}
          <div className="border-t border-white/10 pt-6 mt-6 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save as Draft
            </button>
            <button
              type="button"
              onClick={handleSendToInfluencer}
              disabled={isLoading}
              className="px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
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
