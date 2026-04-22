import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, FileText, Rocket, Save, BookOpen, CheckCircle } from 'lucide-react';
import { normalizeKpiMetric, KPI_DISPLAY_LABELS } from './buildCampaignPayload';

export default function GeneratedCampaignSidebar({
  estimations,
  normalizedInput,
  campaignDates,
  campaignDuration,
  formatDate,
  isLoading,
  handleSaveAsDraft,
  handleSave,
  handleSaveAndPublish
}) {
  return (
    <div className="space-y-6">

      {/* Estimated Results */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6 sticky top-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-[#745CB4]/20"><BarChart3 className="w-5 h-5 text-[#C1B6FD]" /></div>
          <h3 className="text-xl font-bold text-white">Estimated Results</h3>
        </div>

        {estimations?.estimatedResults && (
          <>
            {/* Scenario & Confidence */}
            <div className="p-4 bg-gradient-to-br from-[#745CB4]/10 to-[#C1B6FD]/5 rounded-xl border border-[#C1B6FD]/20 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">Scenario</span>
                <span className="text-white font-bold capitalize px-3 py-1 bg-white/10 rounded-full text-xs">
                  {estimations.estimatedResults.scenario}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${estimations.estimatedResults.confidenceLevel}%` }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                    />
                  </div>
                  <span className="text-[#C1B6FD] font-bold text-sm">{estimations.estimatedResults.confidenceLevel}%</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              {estimations.estimatedResults.metrics?.map((metric, i) => {
                const palette = [
                  { grad: 'from-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/20' },
                  { grad: 'from-[#745CB4]/20', text: 'text-[#C1B6FD]', border: 'border-[#745CB4]/20' },
                  { grad: 'from-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/20' },
                ];
                const c = palette[i % palette.length];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                    className={`p-4 bg-gradient-to-br ${c.grad} to-transparent rounded-xl border ${c.border}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className={`w-4 h-4 ${c.text}`} />
                      <span className="text-sm font-semibold text-gray-300">
                        {KPI_DISPLAY_LABELS[normalizeKpiMetric(metric.metric)] ?? metric.metric}
                      </span>
                    </div>
                    <p className={`text-2xl font-bold ${c.text}`}>{metric.estimatedRange.mostLikely.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Range: {metric.estimatedRange.min.toLocaleString()} – {metric.estimatedRange.max.toLocaleString()}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>

      {/* Campaign Details */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-white/10"><FileText className="w-5 h-5 text-gray-300" /></div>
          <h3 className="text-lg font-bold text-white">Campaign Details</h3>
        </div>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Campaign Name', value: normalizedInput.campaign_name || normalizedInput.brand_name },
            { label: 'Brand Name', value: normalizedInput.brand_name },
            { label: 'Goal', value: normalizedInput.campaign_goal?.replace('_', ' '), capitalize: true },
            { label: 'Budget', value: `${normalizedInput.budget_currency} ${Number(normalizedInput.budget_amount).toLocaleString()}` },
            { label: 'Company Size', value: normalizedInput.company_size, capitalize: true },
            { label: 'Start Date', value: formatDate(campaignDates.startDate) },
            { label: 'End Date', value: formatDate(campaignDates.endDate) },
            { label: 'Duration', value: `${campaignDuration} days` },
          ].map((row, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
              <span className="text-gray-400">{row.label}</span>
              <span className={`text-white font-medium text-right ${row.capitalize ? 'capitalize' : ''}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Action Buttons */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSaveAndPublish}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white font-bold shadow-lg shadow-[#745CB4]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Rocket className="w-4 h-4" />
          Save &amp; Publish to Marketplace
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 border border-[#C1B6FD]/40 rounded-xl text-[#C1B6FD] font-semibold hover:bg-[#745CB4]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          Save Campaign
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSaveAsDraft}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BookOpen className="w-4 h-4" />
          Save as Draft
        </motion.button>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 p-4 bg-[#745CB4]/10 border border-[#C1B6FD]/20 rounded-xl text-sm text-gray-400">
        <CheckCircle className="w-5 h-5 text-[#C1B6FD] flex-shrink-0 mt-0.5" />
        <p>Publishing to the marketplace will make your campaign visible to all influencers on the platform.</p>
      </div>
    </div>
  );
}
