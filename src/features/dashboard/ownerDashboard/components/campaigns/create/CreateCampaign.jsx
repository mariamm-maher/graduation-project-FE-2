import { Calendar, DollarSign, Target, FileText, Sparkles, Layout, Info } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCampaignStore from '../../../../../../stores/campaignStore';

function CreateCampaign() {
  const navigate = useNavigate();
  const { generateCampaignAI, createCampaign, isLoading } = useCampaignStore();
  const [campaignData, setCampaignData] = useState({
    name: '',
    userDescription: '',
    goalType: '',
    budget: '',
    currency: '',
    budgetFlexibility: '',
    startDate: '',
    endDate: '',
  });

  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Calculate duration in days
  const calculateDuration = () => {
    if (campaignData.startDate && campaignData.endDate) {
      const start = new Date(campaignData.startDate);
      const end = new Date(campaignData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      return diffDays;
    }
    return null;
  };

  const duration = calculateDuration();

  const handleGenerateAI = async () => {
    try {
      setSubmitMessage({ type: '', text: '' });

      // Validate required fields
      if (!campaignData.name || !campaignData.goalType || !campaignData.budget ||
          !campaignData.currency || !campaignData.budgetFlexibility ||
          !campaignData.startDate || !campaignData.endDate) {
        setSubmitMessage({ type: 'error', text: 'Please fill in all required fields' });
        toast.error('Please fill in all required fields', {
          position: 'top-right',
          autoClose: 4000,
        });
        return;
      }

      // Format data for API
      const apiData = {
        campaignName: campaignData.name,
        userDescription: campaignData.userDescription,
        goalType: campaignData.goalType,
        totalBudget: parseFloat(campaignData.budget),
        currency: campaignData.currency,
        budgetFlexibility: campaignData.budgetFlexibility,
        startDate: new Date(campaignData.startDate).toISOString(),
        endDate: new Date(campaignData.endDate).toISOString(),
      };

      const result = await generateCampaignAI(apiData);

      if (result.success) {
        toast.success('AI campaign generated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        navigate('/dashboard/owner/campaigns/generated', {
          state: {
            campaignData: apiData,
            aiPreview: result.aiPreview,
          },
        });
      } else {
        setSubmitMessage({ type: 'error', text: result.error || 'Failed to generate campaign' });
        toast.error(result.error || 'Failed to generate campaign', {
          position: 'top-right',
          autoClose: 4000,
        });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An unexpected error occurred' });
      toast.error('An unexpected error occurred', {
        position: 'top-right',
        autoClose: 4000,
      });
      console.error('Error generating campaign:', error);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      setSubmitMessage({ type: '', text: '' });
      if (!campaignData.name || !campaignData.goalType || !campaignData.budget ||
          !campaignData.currency || !campaignData.budgetFlexibility ||
          !campaignData.startDate || !campaignData.endDate) {
        toast.error('Please fill in all required fields', { position: 'top-right', autoClose: 4000 });
        return;
      }
      const apiData = {
        campaignName: campaignData.name,
        userDescription: campaignData.userDescription,
        goalType: campaignData.goalType,
        totalBudget: parseFloat(campaignData.budget),
        currency: campaignData.currency,
        budgetFlexibility: campaignData.budgetFlexibility,
        startDate: new Date(campaignData.startDate).toISOString(),
        endDate: new Date(campaignData.endDate).toISOString(),
        lifecycleStage: 'draft',
      };
      const result = await createCampaign(apiData);
      if (result.success) {
        toast.success('Campaign saved as draft!', { position: 'top-right', autoClose: 3000 });
        navigate('/dashboard/owner/campaigns/all');
      } else {
        toast.error(result.error || 'Failed to save draft', { position: 'top-right', autoClose: 4000 });
      }
    } catch {
      toast.error('An unexpected error occurred', { position: 'top-right', autoClose: 4000 });
    }
  };

  return (
        <>
      <style>{`
        select option {
          background-color: #1e1632 !important;
          color: #ffffff !important;
        }
        select:focus option:checked {
          background-color: #745CB4 !important;
          color: #ffffff !important;
        }
      `}</style>
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-[#1e1632]/55 backdrop-blur-md px-5 py-5 sm:px-6 sm:py-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">Create New Campaign</h1>
            <p className="text-gray-300/90 text-sm sm:text-base">Set up your marketing campaign details</p>
          </div>
          
        </div>
      </div>

      {/* Main Grid – Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column – Main Form (takes full width on mobile) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Information */}
          <div className="bg-[#1e1632]/85 backdrop-blur-md border border-[#C1B6FD]/20 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C1B6FD]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#C1B6FD]" />
              </div>
              <h2 className="text-xl font-bold text-white">Basic Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                  placeholder="e.g., Summer Launch 2024"
                  className="w-full bg-[#2A2240] border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-400 hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">User Description</label>
                <textarea
                  value={campaignData.userDescription}
                  onChange={(e) => setCampaignData({ ...campaignData, userDescription: e.target.value })}
                  placeholder="Describe your campaign objectives, target audience, and key deliverables..."
                  rows={4}
                  className="w-full bg-[#2A2240] border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-400 hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 resize-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Goal Type</label>
                <div className="relative">
                  <Target className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <select
                    value={campaignData.goalType}
                    onChange={(e) => setCampaignData({ ...campaignData, goalType: e.target.value })}
                    className="w-full bg-[#2A2240] border border-white/15 rounded-xl pl-12 pr-4 py-3.5 text-white hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all appearance-none cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" disabled>Select primary objective</option>
                    <option value="awareness">Brand Awareness</option>
                    <option value="consideration">Consideration</option>
                    <option value="conversion">Conversion & Sales</option>
                    <option value="lead_generation">Lead Generation</option>
                    <option value="retention">Customer Retention</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="bg-[#1e1632]/85 backdrop-blur-md border border-[#C1B6FD]/20 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Budget & Timeline</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Budget Input Group */}
              <div className="sm:col-span-2 grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Budget</label>
                  <div className="relative">
                    <DollarSign className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={campaignData.budget}
                      onChange={(e) => setCampaignData({ ...campaignData, budget: e.target.value })}
                      placeholder="0.00"
                      className="w-full bg-[#2A2240] border border-white/15 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-400 hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                  <select
                    value={campaignData.currency}
                    onChange={(e) => setCampaignData({ ...campaignData, currency: e.target.value })}
                    className="w-full bg-[#2A2240] border border-white/15 rounded-xl px-4 py-3.5 text-white hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Budget Flexibility</label>
                <select
                  value={campaignData.budgetFlexibility}
                  onChange={(e) => setCampaignData({ ...campaignData, budgetFlexibility: e.target.value })}
                  className="w-full bg-[#2A2240] border border-white/15 rounded-xl px-4 py-3.5 text-white hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select flexibility</option>
                  <option value="strict">Strict (Firm limit)</option>
                  <option value="flexible">Flexible (Can increase)</option>
                </select>
              </div>

              <div className="hidden sm:block"></div> {/* Spacer */}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={campaignData.startDate}
                  onChange={(e) => {
                    const newStartDate = e.target.value;
                    setCampaignData({ 
                      ...campaignData, 
                      startDate: newStartDate,
                      endDate: campaignData.endDate && newStartDate > campaignData.endDate ? '' : campaignData.endDate
                    });
                  }}
                  min={today}
                  className="w-full bg-[#2A2240] border border-white/15 rounded-xl px-4 py-3.5 text-white hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={campaignData.endDate}
                  onChange={(e) => setCampaignData({ ...campaignData, endDate: e.target.value })}
                  min={campaignData.startDate || today}
                  className="w-full bg-[#2A2240] border border-white/15 rounded-xl px-4 py-3.5 text-white hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              {duration !== null && (
                <div className="sm:col-span-2 p-4 bg-linear-to-r from-[#C1B6FD]/12 to-[#745CB4]/12 border border-[#C1B6FD]/25 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C1B6FD]/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#C1B6FD]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#C1B6FD] font-medium">
                      Campaign Duration: <span className="text-white font-bold">{duration} {duration === 1 ? 'day' : 'days'}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar – Stacks below on mobile, sticky on desktop */}
        <div className="lg:sticky lg:top-6 space-y-6 h-fit">
          
          {/* Campaign Overview Summary Card */}
          <div className="bg-[#1e1632]/85 backdrop-blur-md border border-[#C1B6FD]/20 rounded-2xl p-6 shadow-xl shadow-black/20 relative overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C1B6FD]/10 blur-3xl rounded-full"></div>

            <h3 className="text-lg font-bold text-white mb-6 relative z-10">Campaign Summary</h3>
            <div className="space-y-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-xs text-gray-400">Name</p>
                </div>
                <p className="text-sm text-white font-medium truncate">{campaignData.name || 'Untitled Campaign'}</p>
              </div>
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-xs text-gray-400">Budget</p>
                </div>
                <p className="text-sm text-[#C1B6FD] font-semibold">
                  {campaignData.budget && campaignData.currency 
                    ? `${campaignData.currency} ${campaignData.budget}` 
                    : campaignData.budget || '0'}
                </p>
              </div>
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-xs text-gray-400">Goal Type</p>
                </div>
                <p className="text-sm text-white capitalize">{campaignData.goalType ? campaignData.goalType.replace('_', ' ') : 'Not selected'}</p>
              </div>
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-xs text-gray-400">Timeline</p>
                </div>
                <p className="text-sm text-white">
                  {campaignData.startDate && campaignData.endDate 
                    ? `${new Date(campaignData.startDate).toLocaleDateString()} - ${new Date(campaignData.endDate).toLocaleDateString()}` 
                    : 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-linear-to-br from-[#C1B6FD]/10 to-[#745CB4]/10 border border-[#C1B6FD]/15 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center gap-2 mb-5">
              <Info className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Campaign Tips</h3>
            </div>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-4 p-3 rounded-lg bg-[#120D1E]/60 hover:bg-[#120D1E]/90 transition-colors border border-transparent hover:border-[#C1B6FD]/25 group">
                <div className="w-8 h-8 rounded-lg bg-[#C1B6FD]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C1B6FD]/20 transition-colors">
                  <Target className="w-4 h-4 text-[#C1B6FD]" />
                </div>
                <span className="leading-snug mt-1.5"><strong className="text-white font-medium">Be precise with goals.</strong> Clear, measurable goals help our AI generate a laser-focused strategy.</span>
              </li>
              <li className="flex items-start gap-4 p-3 rounded-lg bg-[#120D1E]/60 hover:bg-[#120D1E]/90 transition-colors border border-transparent hover:border-[#C1B6FD]/25 group">
                <div className="w-8 h-8 rounded-lg bg-[#C1B6FD]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C1B6FD]/20 transition-colors">
                  <Layout className="w-4 h-4 text-[#C1B6FD]" />
                </div>
                <span className="leading-snug mt-1.5"><strong className="text-white font-medium">Provide ample context.</strong> The User Description is crucial for generating accurate deliverables and messaging angles.</span>
              </li>
              <li className="flex items-start gap-4 p-3 rounded-lg bg-[#120D1E]/60 hover:bg-[#120D1E]/90 transition-colors border border-transparent hover:border-[#C1B6FD]/25 group">
                <div className="w-8 h-8 rounded-lg bg-[#C1B6FD]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C1B6FD]/20 transition-colors">
                  <DollarSign className="w-4 h-4 text-[#C1B6FD]" />
                </div>
                <span className="leading-snug mt-1.5"><strong className="text-white font-medium">Consider budget flexibility.</strong> Allowing flexibility often yields better ROI projections from the AI.</span>
              </li>
            </ul>
          </div>

          {/* Submit Message */}
          {submitMessage.text && (
            <div className={`p-4 rounded-xl text-sm font-medium ${
              submitMessage.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {submitMessage.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleGenerateAI}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-bold hover:brightness-110 hover:shadow-xl hover:shadow-purple-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> Generating Strategy...</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-100 group-hover:scale-110 transition-transform" />
                  Generate Strategy with AI
                </>
              )}
            </button>
            <button
              onClick={handleSaveAsDraft}
              disabled={isLoading}
              className="w-full px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
        </>
  );
}

export default CreateCampaign;