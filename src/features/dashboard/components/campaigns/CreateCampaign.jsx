import { Calendar, DollarSign, Target, Users, FileText, Image } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateCampaign() {
  const navigate = useNavigate();
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitMessage({ type: '', text: '' });

      // Validate required fields
      if (!campaignData.name || !campaignData.goalType || !campaignData.budget || 
          !campaignData.currency || !campaignData.budgetFlexibility || 
          !campaignData.startDate || !campaignData.endDate) {
        setSubmitMessage({ type: 'error', text: 'Please fill in all required fields' });
        setIsSubmitting(false);
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

      const response = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: 'Campaign created successfully! Redirecting to preview...' });
        
        // Navigate to the preview page with the campaign data
        setTimeout(() => {
          navigate('/dashboard/campaigns/generated', { 
            state: { 
              campaign: result.data.campaign,
              aiPreview: result.data.aiPreview 
            } 
          });
        }, 1500);
      } else {
        setSubmitMessage({ type: 'error', text: result.message || 'Failed to create campaign' });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Network error. Please try again.' });
      console.error('Error creating campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create New Campaign</h1>
        <p className="text-gray-400 text-sm sm:text-base">Set up your marketing campaign details</p>
      </div>

      {/* Main Grid – Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column – Main Form (takes full width on mobile) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Information */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-5">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                  placeholder="Enter campaign name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">User Description</label>
                <textarea
                  value={campaignData.userDescription}
                  onChange={(e) => setCampaignData({ ...campaignData, userDescription: e.target.value })}
                  placeholder="Describe your campaign objectives..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] resize-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Goal Type
                </label>
                <select
                  value={campaignData.goalType}
                  onChange={(e) => setCampaignData({ ...campaignData, goalType: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select goal type</option>
                  <option value="awareness">Awareness</option>
                  <option value="consideration">Consideration</option>
                  <option value="conversion">Conversion</option>
                  <option value="lead_generation">Lead Generation</option>
                  <option value="retention">Retention</option>
                </select>
              </div>
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-5">Budget & Timeline</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Total Budget
                </label>
                <input
                  type="number"
                  value={campaignData.budget}
                  onChange={(e) => setCampaignData({ ...campaignData, budget: e.target.value })}
                  placeholder="0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
                <select
                  value={campaignData.currency}
                  onChange={(e) => setCampaignData({ ...campaignData, currency: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select currency</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Budget Flexibility</label>
                <select
                  value={campaignData.budgetFlexibility}
                  onChange={(e) => setCampaignData({ ...campaignData, budgetFlexibility: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select flexibility</option>
                  <option value="strict">Strict</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={campaignData.startDate}
                  onChange={(e) => setCampaignData({ ...campaignData, startDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={campaignData.endDate}
                  onChange={(e) => setCampaignData({ ...campaignData, endDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar – Stacks below on mobile */}
        <div className="space-y-6">
          
          {/* Campaign Preview */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 sm:p-6">
            <h3 className="text-lg font-bold text-white mb-5">Campaign Preview</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Name</p>
                <p className="text-sm text-white font-medium truncate">{campaignData.name || 'Untitled Campaign'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Budget</p>
                <p className="text-sm text-[#C1B6FD] font-semibold">
                  {campaignData.budget && campaignData.currency 
                    ? `${campaignData.currency} ${campaignData.budget}` 
                    : campaignData.budget || '0'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Budget Flexibility</p>
                <p className="text-sm text-white capitalize">{campaignData.budgetFlexibility || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Goal Type</p>
                <p className="text-sm text-white capitalize">{campaignData.goalType ? campaignData.goalType.replace('_', ' ') : 'Not selected'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Duration</p>
                <p className="text-sm text-white">
                  {campaignData.startDate && campaignData.endDate 
                    ? `${campaignData.startDate} to ${campaignData.endDate}` 
                    : 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-[#745CB4]/10 border border-[#C1B6FD]/30 rounded-xl p-5 sm:p-6">
            <h3 className="text-lg font-bold text-white mb-4">Campaign Tips</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-[#C1B6FD] mt-0.5">•</span>
                <span>Set clear, measurable goals for your campaign</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C1B6FD] mt-0.5">•</span>
                <span>Choose influencers that align with your brand values</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C1B6FD] mt-0.5">•</span>
                <span>Monitor performance regularly and adjust as needed</span>
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
          <div className="space-y-3">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </button>
            <button className="w-full px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCampaign;