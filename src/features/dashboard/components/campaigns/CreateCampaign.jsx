import { Calendar, DollarSign, Target, Users, FileText, Image } from 'lucide-react';
import { useState } from 'react';

function CreateCampaign() {
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    platform: '',
    goals: '',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Create New Campaign</h1>
        <p className="text-gray-400">Set up your marketing campaign details</p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Form - Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                  placeholder="Enter campaign name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={campaignData.description}
                  onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                  placeholder="Describe your campaign objectives..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                />
              </div>
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Budget & Timeline</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Total Budget
                </label>
                <input
                  type="text"
                  value={campaignData.budget}
                  onChange={(e) => setCampaignData({ ...campaignData, budget: e.target.value })}
                  placeholder="$0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Platform</label>
                <select
                  value={campaignData.platform}
                  onChange={(e) => setCampaignData({ ...campaignData, platform: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                >
                  <option value="">Select platform</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter</option>
                  <option value="multi">Multi-Platform</option>
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={campaignData.endDate}
                  onChange={(e) => setCampaignData({ ...campaignData, endDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                />
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Target Audience</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Audience Demographics
                </label>
                <input
                  type="text"
                  value={campaignData.targetAudience}
                  onChange={(e) => setCampaignData({ ...campaignData, targetAudience: e.target.value })}
                  placeholder="e.g., Women 18-35, Fashion enthusiasts"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Campaign Goals</label>
                <input
                  type="text"
                  value={campaignData.goals}
                  onChange={(e) => setCampaignData({ ...campaignData, goals: e.target.value })}
                  placeholder="e.g., Brand awareness, Product launch, Sales"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Campaign Preview */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Campaign Preview</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Name</p>
                <p className="text-sm text-white font-medium">{campaignData.name || 'Untitled Campaign'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Budget</p>
                <p className="text-sm text-[#C1B6FD] font-semibold">{campaignData.budget || '$0'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Duration</p>
                <p className="text-sm text-white">{campaignData.startDate && campaignData.endDate ? `${campaignData.startDate} to ${campaignData.endDate}` : 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Platform</p>
                <p className="text-sm text-white capitalize">{campaignData.platform || 'Not selected'}</p>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-[#745CB4]/10 border border-[#C1B6FD]/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Campaign Tips</h3>
            <ul className="space-y-2 text-sm text-gray-400">
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

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Create Campaign
            </button>
            <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCampaign;
