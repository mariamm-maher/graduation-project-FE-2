import { Calendar, DollarSign, Target, FileText, Sparkles, Layout, Info } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCampaignStore from '../../../../../../stores/campaignStore';

function CreateCampaign() {
  const navigate = useNavigate();
  const { createCampaign, isLoading } = useCampaignStore();
  const [campaignData, setCampaignData] = useState({
    campaignName: '',
    campaignGoal: '',
    budget: '',
    currency: '',
    durationWeeks: '',
  });



  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const durationWeeks = Number.parseInt(campaignData.durationWeeks, 10);

  const buildCampaignDates = (weeks) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + Math.max(1, weeks) * 7 - 1);
    end.setHours(23, 59, 59, 999);

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  };

  const handleGenerateAI = async () => {
    try {
      setSubmitMessage({ type: '', text: '' });

      // Validate required fields
      if (!campaignData.campaignName || !campaignData.campaignGoal || !campaignData.budget || !campaignData.currency || !campaignData.durationWeeks) {
        setSubmitMessage({ type: 'error', text: 'Please fill in all required fields' });
        toast.error('Please fill in all required fields', {
          position: 'top-right',
          autoClose: 4000,
        });
        return;
      }

      if (!Number.isFinite(durationWeeks) || durationWeeks < 1) {
        setSubmitMessage({ type: 'error', text: 'Campaign duration must be at least 1 week' });
        toast.error('Campaign duration must be at least 1 week', {
          position: 'top-right',
          autoClose: 4000,
        });
        return;
      }

      navigate('/dashboard/owner/campaigns/prepare', {
        state: {
          campaignData,
        },
      });
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
      if (!campaignData.campaignName || !campaignData.campaignGoal || !campaignData.budget || !campaignData.currency || !campaignData.durationWeeks) {
        toast.error('Please fill in all required fields', { position: 'top-right', autoClose: 4000 });
        return;
      }

      if (!Number.isFinite(durationWeeks) || durationWeeks < 1) {
        toast.error('Campaign duration must be at least 1 week', { position: 'top-right', autoClose: 4000 });
        return;
      }

      const { startDate, endDate } = buildCampaignDates(durationWeeks);

      const apiData = {
        campaignName: campaignData.campaignName,
        userDescription: `Campaign name: ${campaignData.campaignName} | Campaign goal: ${campaignData.campaignGoal}`,
        goalType: campaignData.campaignGoal,
        totalBudget: parseFloat(campaignData.budget),
        currency: campaignData.currency,
        budgetFlexibility: 'strict',
        startDate,
        endDate,
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
            <p className="text-gray-300/90 text-sm sm:text-base">Set campaign goal, budget, currency, and duration</p>
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
              <h2 className="text-xl font-bold text-white">Campaign Goal</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={campaignData.campaignName}
                    onChange={(e) => setCampaignData({ ...campaignData, campaignName: e.target.value })}
                    placeholder="e.g., Summer Growth Push"
                    className="w-full bg-[#2A2240] border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-400 hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Goal</label>
                <div className="relative">
                  <Target className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <select
                    value={campaignData.campaignGoal}
                    onChange={(e) => setCampaignData({ ...campaignData, campaignGoal: e.target.value })}
                    className="w-full bg-[#2A2240] border border-white/15 rounded-xl pl-12 pr-4 py-3.5 text-white hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#1A1A24] text-gray-300">Select campaign goal</option>
                    <option value="Awareness" className="bg-[#1A1A24] text-gray-100">Awareness</option>
                    <option value="Leads" className="bg-[#1A1A24] text-gray-100">Leads</option>
                    <option value="Sales" className="bg-[#1A1A24] text-gray-100">Sales</option>
                    <option value="Retention" className="bg-[#1A1A24] text-gray-100">Retention</option>
                    <option value="Re-engagement" className="bg-[#1A1A24] text-gray-100">Re-engagement</option>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Duration (Weeks)</label>
                <input
                  type="number"
                  min="1"
                  value={campaignData.durationWeeks}
                  onChange={(e) => setCampaignData({ ...campaignData, durationWeeks: e.target.value })}
                  placeholder="e.g., 4"
                  className="w-full bg-[#2A2240] border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-400 hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all"
                />
              </div>

              {Number.isFinite(durationWeeks) && durationWeeks > 0 && (
                <div className="sm:col-span-2 p-4 bg-linear-to-r from-[#C1B6FD]/12 to-[#745CB4]/12 border border-[#C1B6FD]/25 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C1B6FD]/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#C1B6FD]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#C1B6FD] font-medium">
                      Campaign Duration: <span className="text-white font-bold">{durationWeeks} {durationWeeks === 1 ? 'week' : 'weeks'}</span>
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
                  <p className="text-xs text-gray-400">Campaign Name</p>
                </div>
                <p className="text-sm text-white font-medium truncate">{campaignData.campaignName || 'Not set'}</p>
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
                  <p className="text-xs text-gray-400">Campaign Goal</p>
                </div>
                <p className="text-sm text-white">{campaignData.campaignGoal || 'Not selected'}</p>
              </div>
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-xs text-gray-400">Duration</p>
                </div>
                <p className="text-sm text-white">
                  {Number.isFinite(durationWeeks) && durationWeeks > 0
                    ? `${durationWeeks} ${durationWeeks === 1 ? 'week' : 'weeks'}`
                    : 'Not set'}
                </p>
              </div>
            </div>
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
                  Generate Compagin Plan with AI
                </>
              )}
            </button>
         
          </div>
        </div>
      </div>
    </div>
        </>
  );
}

export default CreateCampaign;