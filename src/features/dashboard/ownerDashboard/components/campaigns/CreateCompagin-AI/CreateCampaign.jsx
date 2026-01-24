import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, DollarSign, Users, TrendingUp, Calendar, Package, Zap, ArrowLeft } from 'lucide-react';

function CreateCampaign() {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Calculate duration in days
  const calculateDuration = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      return diffDays;
    }
    return null;
  };

  const duration = calculateDuration();

  const campaignGoals = [
    { id: 'awareness', label: 'Awareness', icon: Users, color: 'from-purple-400 to-pink-400' },
    { id: 'leads', label: 'Leads', icon: Target, color: 'from-blue-400 to-cyan-400' },
    { id: 'sales', label: 'Sales', icon: DollarSign, color: 'from-green-400 to-emerald-400' },
    { id: 'engagement', label: 'Engagement', icon: TrendingUp, color: 'from-orange-400 to-yellow-400' },
    { id: 'event', label: 'Event', icon: Calendar, color: 'from-indigo-400 to-purple-400' },
    { id: 'product', label: 'Product Launch', icon: Package, color: 'from-pink-400 to-rose-400' },
  ];

  const handleBack = () => {
    navigate('/dashboard/campaigns');
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-6xl mx-auto"
      >
      <div className=" border border-[#745CB4]/30 rounded-3xl shadow-2xl shadow-[#745CB4]/20 overflow-visible">
  

        {/* Content */}
        <div className="relative p-8">
          <div className="space-y-8">
            {/* Campaign Goal Selection */}
            <div>
              <label className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#C1B6FD]" />
                Campaign Goal
                <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {campaignGoals.map((goal, index) => {
                  const Icon = goal.icon;
                  return (
                    <motion.button
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 group overflow-hidden ${
                        selectedGoal === goal.id
                          ? 'border-[#745CB4] bg-linear-to-br from-[#745CB4]/30 to-[#C1B6FD]/30 shadow-lg shadow-[#745CB4]/30'
                          : 'border-white/10 bg-white/5 hover:border-[#745CB4]/50 hover:bg-white/10'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-linear-to-br ${goal.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      <div className="relative flex flex-col items-center text-center">
                        <Icon className={`w-6 h-6 mb-2 ${selectedGoal === goal.id ? 'text-[#C1B6FD]' : 'text-gray-400 group-hover:text-[#C1B6FD]'} transition-colors`} />
                        <div className={`font-semibold text-sm ${selectedGoal === goal.id ? 'text-white' : 'text-gray-300'}`}>{goal.label}</div>
                      </div>
                      {selectedGoal === goal.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#745CB4] flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Budget Section */}
            <div>
              <label className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#C1B6FD]" />
                Campaign Budget
                <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex-1"
                >
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Enter budget amount"
                    className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-5 py-4 text-white text-lg placeholder:text-gray-500 focus:outline-none focus:border-[#745CB4] focus:bg-white/10 transition-all duration-300 hover:border-[#745CB4]/50"
                  />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="w-40"
                >
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:border-[#745CB4] focus:bg-white/10 transition-all duration-300 hover:border-[#745CB4]/50 appearance-none cursor-pointer"
                    style={{
                      colorScheme: 'dark'
                    }}
                  >
                    <option value="USD" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>USD $</option>
                    <option value="EUR" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>EUR €</option>
                    <option value="GBP" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>GBP £</option>
                    <option value="JPY" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>JPY ¥</option>
                    <option value="AUD" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>AUD $</option>
                    <option value="CAD" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>CAD $</option>
                  </select>
                </motion.div>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-1">Set your total campaign budget including all costs</p>
            </div>

            {/* Campaign Duration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <label className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C1B6FD]" />
                Campaign Duration
                <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      // If end date is before new start date, clear it
                      if (endDate && e.target.value > endDate) {
                        setEndDate('');
                      }
                    }}
                    min={today}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:border-[#745CB4] focus:bg-white/10 transition-all duration-300 hover:border-[#745CB4]/50"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || today}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:border-[#745CB4] focus:bg-white/10 transition-all duration-300 hover:border-[#745CB4]/50"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
              {duration !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-[#745CB4]/20 border border-[#745CB4]/30 rounded-xl"
                >
                  <p className="text-sm text-[#C1B6FD] font-medium">
                    Duration: <span className="text-white">{duration} {duration === 1 ? 'day' : 'days'}</span>
                  </p>
                </motion.div>
              )}
              <p className="text-xs text-gray-500 mt-2 ml-1">Select the start and end dates for your campaign</p>
            </motion.div>

            {/* Target Audience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C1B6FD]" />
                Target Audience
              </label>
              <input
                type="text"
                placeholder="e.g., Young professionals, Fitness enthusiasts, Tech-savvy millennials..."
                className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#745CB4] focus:bg-white/10 transition-all duration-300 hover:border-[#745CB4]/50"
              />
            </motion.div>

          

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(116, 92, 180, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard/campaigns/generated', { 
                  state: { 
                    campaignData: {
                      selectedGoal,
                      budget,
                      currency,
                      startDate,
                      endDate,
                      duration
                    }
                  }
                })}
                className="w-full px-6 py-4 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white font-semibold shadow-lg shadow-[#745CB4]/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate Campaign with AI
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
    </>
  );
}

export default CreateCampaign;
