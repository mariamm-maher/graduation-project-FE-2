import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, DollarSign, Clock, Globe, PieChart, Megaphone, Calendar, ChevronUp, ChevronDown } from 'lucide-react';

export default function GeneratedCampaignStrategy({
  normalizedInput,
  strategy,
  execution,
  campaignDuration,
  formatDate
}) {
  const [showAllCalendar, setShowAllCalendar] = useState(false);
  const calendarItems = execution?.contentCalendar || [];
  const visibleCalendar = showAllCalendar ? calendarItems : calendarItems.slice(0, 7);

  return (
    <div className="lg:col-span-2 space-y-6">

      {/* Campaign Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#745CB4]/10 via-transparent to-[#C1B6FD]/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{normalizedInput.campaign_name || 'Generated Campaign'}</h2>
            <p className="text-gray-300 leading-relaxed">{strategy?.campaignSummary}</p>
          </div>
        </div>
      </motion.div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Target className="w-5 h-5 text-[#C1B6FD]" />, bg: 'bg-[#745CB4]/20', label: 'Goal', value: normalizedInput.campaign_goal?.replace('_', ' '), color: 'text-white' },
          { icon: <DollarSign className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-500/20', label: 'Budget', value: `${normalizedInput.budget_currency} ${Number(normalizedInput.budget_amount).toLocaleString()}`, color: 'text-emerald-400' },
          { icon: <Clock className="w-5 h-5 text-blue-400" />, bg: 'bg-blue-500/20', label: 'Duration', value: `${campaignDuration} days`, color: 'text-blue-400' },
          { icon: <Globe className="w-5 h-5 text-amber-400" />, bg: 'bg-amber-500/20', label: 'Platforms', value: `${strategy?.platformSelection?.length || 0} platforms`, color: 'text-amber-400' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-[#C1B6FD]/30 transition-all"
          >
            <div className={`p-2 rounded-lg ${item.bg} w-fit mb-3`}>{item.icon}</div>
            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
            <p className={`text-base font-bold capitalize ${item.color}`}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Platform Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-[#745CB4]/20"><Target className="w-5 h-5 text-[#C1B6FD]" /></div>
          <h3 className="text-xl font-bold text-white">Platform Selection</h3>
        </div>
        <div className="space-y-3">
          {strategy?.platformSelection?.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#C1B6FD]/40 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold text-lg">{p.platform}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.priority === 'primary' ? 'bg-[#C1B6FD]/20 text-[#C1B6FD]' : 'bg-blue-500/20 text-blue-400'}`}>
                  {p.priority}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{p.rationale}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 flex-shrink-0">Audience Match</span>
                <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${p.audienceMatchScore}%` }} transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                  />
                </div>
                <span className="text-[#C1B6FD] font-bold text-sm">{p.audienceMatchScore}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Budget Allocation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-emerald-500/20"><PieChart className="w-5 h-5 text-emerald-400" /></div>
          <h3 className="text-xl font-bold text-white">Budget Allocation</h3>
          <span className="ml-auto text-sm text-emerald-400 font-semibold">
            Total: {strategy?.budgetAllocation?.totalAllocated?.toLocaleString()} {normalizedInput.budget_currency}
          </span>
        </div>
        <div className="space-y-4">
          {strategy?.budgetAllocation?.breakdown?.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-gray-200 font-medium capitalize">{item.category.replace('_', ' ')}</span>
                <span className="text-white font-bold text-sm">
                  {item.amount.toLocaleString()} {normalizedInput.budget_currency}
                  <span className="text-emerald-400 ml-1">({item.percentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${item.percentage}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                />
              </div>
              {/* Platform sub-breakdown for paid_ads */}
              {item.platforms && (
                <div className="mt-2 ml-4 space-y-1.5">
                  {item.platforms.map((pl, j) => (
                    <div key={j} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                      <span className="text-sm text-gray-300">{pl.platform}</span>
                      <div className="text-right">
                        <span className="text-white text-sm font-semibold">{pl.amount.toLocaleString()} {normalizedInput.budget_currency}</span>
                        <span className="text-emerald-400 text-xs ml-2">({pl.dailyBudget?.toFixed(2)}/day)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Ad Strategy */}
      {execution?.adStrategy?.campaigns?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-amber-500/20"><Megaphone className="w-5 h-5 text-amber-400" /></div>
            <h3 className="text-xl font-bold text-white">Ad Strategy</h3>
          </div>
          <div className="space-y-3">
            {execution.adStrategy.campaigns.map((ad, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-bold">{ad.platform}</span>
                  <span className="text-xs px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full capitalize">{ad.objective}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Campaign Type</p>
                    <p className="text-sm text-gray-200">{ad.campaignType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Duration</p>
                    <p className="text-sm text-gray-200">{ad.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Daily Budget</p>
                    <p className="text-sm text-emerald-400 font-semibold">{ad.dailyBudget?.toFixed(2)} {normalizedInput.budget_currency}</p>
                  </div>
                  {ad.targeting && (
                    <div className="col-span-2 sm:col-span-3 mt-1">
                      <p className="text-xs text-gray-500 mb-0.5">Targeting</p>
                      <p className="text-sm text-gray-300">{ad.targeting}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Content Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-blue-500/20"><Calendar className="w-5 h-5 text-blue-400" /></div>
          <h3 className="text-xl font-bold text-white">Content Calendar</h3>
          <span className="ml-auto text-xs text-gray-400">{calendarItems.length} entries</span>
        </div>
        <div className="space-y-3">
          {visibleCalendar.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.04 }}
              className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#C1B6FD]/40 transition-all"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center shadow-md">
                <div className="text-center">
                  <div className="text-[9px] text-white/70 font-medium leading-none">Day</div>
                  <div className="text-lg font-bold text-white leading-snug">{item.day}</div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1.5">
                  <span className="font-semibold text-white capitalize">{item.contentType}</span>
                  <span className="text-xs px-2.5 py-0.5 bg-[#745CB4]/20 text-[#C1B6FD] rounded-full border border-[#C1B6FD]/20">{item.platform}</span>
                  <span className="text-xs px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20 capitalize">{item.status}</span>
                </div>
                <p className="text-sm text-gray-300 mb-1 line-clamp-1">{item.caption}</p>
                <p className="text-xs text-gray-500">{formatDate(item.date)} · {item.task}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {calendarItems.length > 7 && (
          <button
            onClick={() => setShowAllCalendar(v => !v)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-[#C1B6FD]/30 transition-all text-sm font-medium"
          >
            {showAllCalendar
              ? <><ChevronUp className="w-4 h-4" /> Show Less</>
              : <><ChevronDown className="w-4 h-4" /> Show All {calendarItems.length} Days</>}
          </button>
        )}
      </motion.div>
    </div>
  );
}
