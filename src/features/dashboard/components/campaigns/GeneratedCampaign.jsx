import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, Target, DollarSign, Calendar, Users, TrendingUp, Clock, PieChart, BarChart3, CheckCircle } from 'lucide-react';

function GeneratedCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sample data - in production, this would come from API or route state
  const campaignData = location.state?.campaignData || {
    campaignName: "FreshStart Coffee — Awareness Launch",
    summary: "A 2-week brand awareness campaign for FreshStart Coffee to introduce the new cafe location and drive foot traffic and social followers. Mix of organic posts + targeted ads + a small micro-influencer giveaway.",
    goal: "Increase Brand Awareness (local, Cairo-area)",
    budget: 1000,
    currency: "USD",
    timeline: "2 weeks (14 days)",
    targetAudience: {
      age: "18–35",
      location: "Cairo, Egypt",
      interests: "Coffee, Lifestyle, Local Food Scene"
    },
    budgetAllocation: [
      { category: "Ads", amount: 500, percentage: 50, color: "from-purple-400 to-pink-400" },
      { category: "Content creation", amount: 300, percentage: 30, color: "from-blue-400 to-cyan-400" },
      { category: "Influencer promotions", amount: 150, percentage: 15, color: "from-green-400 to-emerald-400" },
      { category: "Contingency", amount: 50, percentage: 5, color: "from-orange-400 to-yellow-400" }
    ],
    platformAdSplit: [
      { platform: "TikTok Ads", amount: 300 },
      { platform: "Instagram Ads", amount: 200 }
    ],
    contentCalendar: [
      { day: 1, title: "Launch", description: "Instagram post — photo of store front + CTA to visit", platform: "Instagram" },
      { day: 2, title: "Signature Drink", description: "TikTok — 15–30s clip showing barista making signature drink", platform: "TikTok" },
      { day: 4, title: "Announcement", description: "Facebook post — announcement + short video", platform: "Facebook" },
      { day: 6, title: "Interactive Story", description: "Instagram Story — poll (\"Which flavor should be featured?\")", platform: "Instagram" },
      { day: 8, title: "Customer Reaction", description: "TikTok Reel — customer reaction (UGC style)", platform: "TikTok" },
      { day: 10, title: "Giveaway", description: "Giveaway post (IG + FB) — win a week of free coffee (collab with 1 micro-influencer)", platform: "Instagram + Facebook" },
      { day: 12, title: "Behind-the-scenes", description: "Behind-the-scenes Instagram carousel — roasting / menu", platform: "Instagram" },
      { day: 14, title: "Campaign Close", description: "Recap video + CTA to follow & visit", platform: "All Platforms" }
    ],
    kpis: [
      { metric: "Reach", target: "15,000 – 40,000 people", icon: Users },
      { metric: "New followers", target: "+800", icon: TrendingUp },
      { metric: "Engagement rate", target: "2–5%", icon: Target }
    ]
  };

  const handleBack = () => {
    navigate('/dashboard/campaigns/create-ai');
  };

  const handleSaveCampaign = () => {
    // Handle save logic
    console.log('Saving campaign...');
  };

  const handleStartCampaign = () => {
    // Handle start campaign logic
    console.log('Starting campaign...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="bg-black border border-[#745CB4]/30 rounded-2xl shadow-xl shadow-[#745CB4]/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
        
            <div>
              <h1 className="text-2xl font-bold text-white">AI-Generated Campaign Plan</h1>
              <p className="text-sm text-gray-400 mt-1">Review and customize your campaign</p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveCampaign}
              className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white font-medium hover:bg-white/10 transition-all"
            >
              Save Draft
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(116, 92, 180, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartCampaign}
              className="px-5 py-2.5 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-white font-semibold shadow-lg shadow-[#745CB4]/30 transition-all flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Start Campaign
            </motion.button>
          </div>
        </div>
      </div>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Name & Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black border border-[#745CB4]/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-linear-to-r from-[#745CB4] to-[#C1B6FD] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{campaignData.campaignName}</h2>
                <p className="text-gray-400 mt-2 leading-relaxed">{campaignData.summary}</p>
              </div>
            </div>
          </motion.div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black border border-[#745CB4]/30 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-[#C1B6FD]" />
                <h3 className="font-semibold text-white">Goal</h3>
              </div>
              <p className="text-gray-300">{campaignData.goal}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-black border border-[#745CB4]/30 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-[#C1B6FD]" />
                <h3 className="font-semibold text-white">Budget</h3>
              </div>
              <p className="text-gray-300 text-2xl font-bold">{campaignData.budget} {campaignData.currency}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black border border-[#745CB4]/30 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-[#C1B6FD]" />
                <h3 className="font-semibold text-white">Timeline</h3>
              </div>
              <p className="text-gray-300">{campaignData.timeline}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-black border border-[#745CB4]/30 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-[#C1B6FD]" />
                <h3 className="font-semibold text-white">Target Audience</h3>
              </div>
              <p className="text-gray-300">Age: {campaignData.targetAudience?.age || 'N/A'}</p>
              <p className="text-gray-400 text-sm">{campaignData.targetAudience?.location || ''}</p>
            </motion.div>
          </div>

          {/* Budget Allocation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black border border-[#745CB4]/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-5 h-5 text-[#C1B6FD]" />
              <h3 className="text-lg font-bold text-white">Budget Allocation</h3>
            </div>
            <div className="space-y-4">
              {campaignData.budgetAllocation?.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 font-medium">{item.category}</span>
                    <span className="text-white font-semibold">{item.amount} {campaignData.currency} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full bg-linear-to-r ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              )) || <p className="text-gray-400 text-sm">No budget allocation data available</p>}
            </div>

            {/* Platform Ad Split */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Platform Ad Split</h4>
              <div className="space-y-2">
                {campaignData.platformAdSplit?.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{platform.platform}</span>
                    <span className="text-white font-medium">{platform.amount} {campaignData.currency}</span>
                  </div>
                )) || <p className="text-gray-400 text-xs">No platform data available</p>}
              </div>
            </div>
          </motion.div>

          {/* Content Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black border border-[#745CB4]/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-[#C1B6FD]" />
              <h3 className="text-lg font-bold text-white">Content Calendar</h3>
            </div>
            <div className="space-y-3">
              {campaignData.contentCalendar?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#745CB4]/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-linear-to-r from-[#745CB4]/20 to-[#C1B6FD]/20 border border-[#745CB4]/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Day</div>
                      <div className="text-lg font-bold text-white">{item.day}</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <span className="text-xs px-2 py-1 bg-[#745CB4]/20 text-[#C1B6FD] rounded-full">{item.platform}</span>
                    </div>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              )) || <p className="text-gray-400 text-sm">No content calendar available</p>}
            </div>
          </motion.div>
        </div>

        {/* Sidebar - KPIs */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black border border-[#745CB4]/30 rounded-2xl p-6 sticky top-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-[#C1B6FD]" />
              <h3 className="text-lg font-bold text-white">Key Performance Indicators</h3>
            </div>
            <div className="space-y-4">
              {campaignData.kpis?.map((kpi, index) => {
                const Icon = kpi.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-linear-to-r from-[#745CB4]/20 to-[#C1B6FD]/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#C1B6FD]" />
                      </div>
                      <span className="text-sm font-medium text-gray-400">{kpi.metric}</span>
                    </div>
                    <p className="text-xl font-bold text-white ml-11">{kpi.target}</p>
                  </motion.div>
                );
              }) || <p className="text-gray-400 text-sm">No KPI data available</p>}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-white font-semibold shadow-lg shadow-[#745CB4]/30 transition-all"
              >
                Export as PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-medium hover:bg-white/10 transition-all"
              >
                Share with Team
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default GeneratedCampaign;
