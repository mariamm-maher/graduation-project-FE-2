import { useState, useRef, useEffect } from 'react';
import { Calendar, DollarSign, Target, FileText, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCampaignStore from '../../../../../../stores/campaignStore';

function CreateCampaign() {
  const navigate = useNavigate();
  const { isLoading } = useCampaignStore();

  const [isCampaignGoalOpen, setIsCampaignGoalOpen] = useState(false);
  const [campaignGoalQuery, setCampaignGoalQuery] = useState('');
  const campaignGoalRef = useRef(null);

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [currencyQuery, setCurrencyQuery] = useState('');
  const currencyRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (campaignGoalRef.current && !campaignGoalRef.current.contains(e.target)) {
        setIsCampaignGoalOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const campaignGoalOptions = [
    { value: 'Awareness', label: 'Awareness' },
    { value: 'Leads', label: 'Leads' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Retention', label: 'Retention' },
    { value: 'Re-engagement', label: 'Re-engagement' },
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'EGP', label: 'EGP (E£)' },
    { value: 'SAR', label: 'SAR (SR)' },
    { value: 'AED', label: 'AED (د.إ)' },
  ];

  const filteredCampaignGoals = campaignGoalOptions.filter((g) =>
    g.label.toLowerCase().includes(campaignGoalQuery.trim().toLowerCase())
  );
  const filteredCurrencies = currencyOptions.filter((c) =>
    c.label.toLowerCase().includes(currencyQuery.trim().toLowerCase())
  );

  const [campaignData, setCampaignData] = useState({
    campaignName: '',
    campaignGoal: '',
    budget: '',
    currency: '',
    durationWeeks: '',
    startDate: '',
    endDate: '',
  });

  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const durationWeeks = Number.parseInt(campaignData.durationWeeks, 10);

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const computeEndDateFromStart = (startDateString, weeks) => {
    if (!startDateString || !Number.isFinite(weeks) || weeks < 1) return '';
    const start = new Date(`${startDateString}T00:00:00`);
    if (Number.isNaN(start.getTime())) return '';
    const end = new Date(start);
    end.setDate(end.getDate() + weeks * 7);
    return formatDateForInput(end);
  };

  const hasWeeks = Number.isFinite(durationWeeks) && durationWeeks > 0;
  const hasStartDate = Boolean(campaignData.startDate);
  const autoCalculatedEndDate =
    hasWeeks && hasStartDate ? computeEndDateFromStart(campaignData.startDate, durationWeeks) : '';

  const validateTimeline = () => {
    const hasWeeksVal = campaignData.durationWeeks !== '';
    const hasStart = Boolean(campaignData.startDate);
    if (!hasWeeksVal && !hasStart) return { valid: true, message: '' };
    if (hasWeeksVal && (!Number.isFinite(durationWeeks) || durationWeeks < 1))
      return { valid: false, message: 'Campaign duration must be at least 1 week' };
    if (!hasStart) return { valid: true, message: '' };
    if (!hasWeeksVal) return { valid: false, message: 'Choose number of weeks before setting date range' };
    return { valid: true, message: '' };
  };

  const handleGenerateAI = async () => {
    try {
      setSubmitMessage({ type: '', text: '' });
      if (!campaignData.campaignName || !campaignData.campaignGoal || !campaignData.budget || !campaignData.currency) {
        setSubmitMessage({ type: 'error', text: 'Please fill in all required fields' });
        toast.error('Please fill in all required fields', { position: 'top-right', autoClose: 4000 });
        return;
      }
      const timelineValidation = validateTimeline();
      if (!timelineValidation.valid) {
        setSubmitMessage({ type: 'error', text: timelineValidation.message });
        toast.error(timelineValidation.message, { position: 'top-right', autoClose: 4000 });
        return;
      }
      const preparedCampaignData = {
        ...campaignData,
        durationWeeks: Number.isFinite(durationWeeks) && durationWeeks > 0 ? durationWeeks : null,
        startDate: campaignData.startDate || null,
        endDate: autoCalculatedEndDate || null,
      };
      navigate('/dashboard/owner/campaigns/prepare', { state: { campaignData: preparedCampaignData } });
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An unexpected error occurred' });
      toast.error('An unexpected error occurred', { position: 'top-right', autoClose: 4000 });
      console.error('Error generating campaign:', error);
    }
  };

  return (
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Campaign Goal Card */}
          <div className="bg-[#1e1632]/85 backdrop-blur-md border border-[#C1B6FD]/20 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C1B6FD]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#C1B6FD]" />
              </div>
              <h2 className="text-xl font-bold text-white">Campaign Goal</h2>
            </div>

            <div className="space-y-6">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={campaignData.campaignName}
                  onChange={(e) => setCampaignData({ ...campaignData, campaignName: e.target.value })}
                  placeholder="e.g., Summer Growth Push"
                  className="w-full bg-[#2A2240] border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-400 hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all"
                />
              </div>

              {/* Campaign Goal Dropdown */}
              <div >
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Goal</label>
                <div className="relative" ref={campaignGoalRef}>
                  <Target className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-transform duration-200 ${isCampaignGoalOpen ? 'rotate-180' : ''}`}
                  />
                  <input
                    type="text"
                    value={isCampaignGoalOpen ? campaignGoalQuery : (campaignGoalOptions.find((g) => g.value === campaignData.campaignGoal)?.label || '')}
                    onChange={(e) => {
                      setCampaignGoalQuery(e.target.value);
                      setIsCampaignGoalOpen(true);
                    }}
                    onFocus={() => {
                      setCampaignGoalQuery('');
                      setIsCampaignGoalOpen(true);
                    }}
                    placeholder="Select campaign goal"
                    className="w-full bg-[#2A2240] border border-white/15 rounded-xl pl-12 pr-10 py-3.5 text-white placeholder:text-gray-400 hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all cursor-pointer"
                  />
                  {isCampaignGoalOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#10121f] border border-white/10 rounded-xl max-h-56 overflow-y-auto shadow-2xl z-50">
                      {filteredCampaignGoals.length > 0 ? (
                        filteredCampaignGoals.map((goal) => (
                          <button
                            key={goal.value}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault(); // prevent blur before click
                              setCampaignData({ ...campaignData, campaignGoal: goal.value });
                              setCampaignGoalQuery('');
                              setIsCampaignGoalOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                          >
                            <span className="flex items-center justify-between">
                              {goal.label}
                              {campaignData.campaignGoal === goal.value && (
                                <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                              )}
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-3 text-sm text-gray-400">No options found</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Timeline Card */}
          <div className="bg-[#1e1632]/85 backdrop-blur-md border border-[#C1B6FD]/20 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Budget & Timeline</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Budget + Currency row */}
              <div className="sm:col-span-2 grid grid-cols-3 gap-4">
                {/* Budget */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Budget</label>
                  <div className="relative">
                    <DollarSign className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="number"
                      value={campaignData.budget}
                      onChange={(e) => setCampaignData({ ...campaignData, budget: e.target.value })}
                      placeholder="0.00"
                      className="w-full bg-[#2A2240] border border-white/15 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-400 hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all"
                    />
                  </div>
                </div>

                {/* Currency Dropdown */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                  <div className="relative" ref={currencyRef}>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`}
                    />
                    <input
                      type="text"
                      value={isCurrencyOpen ? currencyQuery : (currencyOptions.find((c) => c.value === campaignData.currency)?.label || '')}
                      onChange={(e) => {
                        setCurrencyQuery(e.target.value);
                        setIsCurrencyOpen(true);
                      }}
                      onFocus={() => {
                        setCurrencyQuery('');
                        setIsCurrencyOpen(true);
                      }}
                      placeholder="Select"
                      className="w-full bg-[#2A2240] border border-white/15 rounded-xl px-3 pr-8 py-3.5 text-white placeholder:text-gray-400 hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all cursor-pointer text-sm"
                    />
                    {isCurrencyOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#10121f] border border-white/10 rounded-xl max-h-56 overflow-y-auto shadow-2xl z-50">
                        {filteredCurrencies.length > 0 ? (
                          filteredCurrencies.map((currency) => (
                            <button
                              key={currency.value}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setCampaignData({ ...campaignData, currency: currency.value });
                                setCurrencyQuery('');
                                setIsCurrencyOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                            >
                              <span className="flex items-center justify-between">
                                {currency.label}
                                {campaignData.currency === currency.value && (
                                  <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                                )}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-sm text-gray-400">No options found</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Duration (Weeks)</label>
                <input
                  type="number"
                  min="1"
                  value={campaignData.durationWeeks}
                  onChange={(e) => {
                    const value = e.target.value;
                    const nextWeeks = Number.parseInt(value, 10);
                    const nextData = { ...campaignData, durationWeeks: value };
                    if (campaignData.startDate && Number.isFinite(nextWeeks) && nextWeeks > 0) {
                      nextData.endDate = computeEndDateFromStart(campaignData.startDate, nextWeeks);
                    } else {
                      nextData.endDate = '';
                    }
                    setCampaignData(nextData);
                  }}
                  placeholder="e.g., 4"
                  className="w-full bg-[#2A2240] border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-400 hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {[1, 2, 4, 8, 12].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        const nextData = { ...campaignData, durationWeeks: String(preset) };
                        if (campaignData.startDate) {
                          nextData.endDate = computeEndDateFromStart(campaignData.startDate, preset);
                        } else {
                          nextData.endDate = '';
                        }
                        setCampaignData(nextData);
                      }}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                        durationWeeks === preset
                          ? 'bg-[#C1B6FD]/20 text-[#C1B6FD] border-[#C1B6FD]/40'
                          : 'bg-[#2A2240] text-gray-300 border-white/10 hover:border-[#C1B6FD]/35'
                      }`}
                    >
                      {preset}w
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date (Optional)</label>
                <input
                  type="date"
                  value={campaignData.startDate}
                  onChange={(e) => {
                    const startDate = e.target.value;
                    const nextData = { ...campaignData, startDate };
                    if (startDate && hasWeeks) {
                      nextData.endDate = computeEndDateFromStart(startDate, durationWeeks);
                    } else {
                      nextData.endDate = '';
                    }
                    setCampaignData(nextData);
                  }}
                  className="w-full bg-[#2A2240] border border-white/15 rounded-xl px-4 py-3.5 text-white hover:border-[#C1B6FD]/45 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/70 transition-all"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date (Auto Calculated)</label>
                <div className="w-full bg-[#2A2240]/70 border border-white/15 rounded-xl px-4 py-3.5 text-white">
                  {autoCalculatedEndDate || (
                    <span className="text-gray-500 text-sm">Set weeks and start date to auto-calculate</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:sticky lg:top-6 space-y-6 h-fit">
          {/* Summary Card */}
          <div className="bg-[#1e1632]/85 backdrop-blur-md border border-[#C1B6FD]/20 rounded-2xl p-6 shadow-xl shadow-black/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C1B6FD]/10 blur-3xl rounded-full" />
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
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-xs text-gray-400">Date Range</p>
                </div>
                <p className="text-sm text-white">
                  {campaignData.startDate && autoCalculatedEndDate
                    ? `${campaignData.startDate} → ${autoCalculatedEndDate}`
                    : 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Message */}
          {submitMessage.text && (
            <div
              className={`p-4 rounded-xl text-sm font-medium ${
                submitMessage.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleGenerateAI}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-bold hover:brightness-110 hover:shadow-xl hover:shadow-purple-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Generating Strategy...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-100 group-hover:scale-110 transition-transform" />
                  Generate Campaign Plan with AI
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCampaign;