import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit2, PlusCircle, RefreshCw, X } from 'lucide-react';

export default function GeneratedCampaignInputPanel({
  isEditing,
  handleEditToggle,
  handleNewCampaign,
  handleRegenerate,
  isRegenerating,
  normalizedInput,
  campaignDuration,
  editData,
  setEditData
}) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <FileText className="w-5 h-5 text-[#C1B6FD]" />
          <h2 className="text-base font-bold text-white">Your Input</h2>
          {!isEditing && (
            <span className="text-xs px-2 py-0.5 bg-[#745CB4]/20 text-[#C1B6FD] rounded-full border border-[#C1B6FD]/20">
              AI used this to generate your strategy
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleEditToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:border-[#C1B6FD]/40 hover:text-[#C1B6FD] transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit &amp; Regenerate
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleNewCampaign}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" /> New Campaign
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isRegenerating ? (
                  <><span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" /> Regenerating...</>
                ) : (
                  <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleEditToggle}
                className="p-1.5 text-gray-400 hover:text-white bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Read-only summary */}
      {!isEditing && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Campaign Name', value: normalizedInput.campaign_name || 'Not set' },
            { label: 'Goal', value: normalizedInput.campaign_goal?.replace('_', ' '), caps: true },
            { label: 'Budget', value: `${normalizedInput.budget_currency} ${Number(normalizedInput.budget_amount).toLocaleString()}` },
            { label: 'Company Size', value: normalizedInput.company_size || 'Not set', caps: true },
            { label: 'Duration', value: `${normalizedInput.campaign_duration_weeks || Math.ceil(campaignDuration / 7)} week(s)` },
            { label: 'Website', value: normalizedInput.website || 'Not set' },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
              <p className={`text-sm text-white font-semibold truncate ${item.caps ? 'capitalize' : ''}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Editable fields */}
      {isEditing && editData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Campaign Name</label>
            <input
              type="text"
              value={editData.campaign_name || ''}
              onChange={e => setEditData({ ...editData, campaign_name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Brand Name</label>
            <input
              type="text"
              value={editData.brand_name}
              onChange={e => setEditData({ ...editData, brand_name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Goal Type</label>
            <select
              value={editData.campaign_goal}
              onChange={e => setEditData({ ...editData, campaign_goal: e.target.value })}
              className="w-full bg-[#1e1632] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
            >
              <option value="Awareness">Awareness</option>
              <option value="Leads">Leads</option>
              <option value="Sales">Sales</option>
              <option value="Retention">Retention</option>
              <option value="Re-engagement">Re-engagement</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Budget Amount</label>
            <input
              type="number"
              value={editData.budget_amount}
              onChange={e => setEditData({ ...editData, budget_amount: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Budget Currency</label>
            <select
              value={editData.budget_currency}
              onChange={e => setEditData({ ...editData, budget_currency: e.target.value })}
              className="w-full bg-[#1e1632] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Company Size</label>
            <input
              type="text"
              value={editData.company_size || ''}
              onChange={e => setEditData({ ...editData, company_size: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Duration (Weeks)</label>
            <input
              type="number"
              min="1"
              value={editData.campaign_duration_weeks || 1}
              onChange={e => setEditData({ ...editData, campaign_duration_weeks: parseInt(e.target.value || '1', 10) || 1 })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Product / Service</label>
            <input
              type="text"
              value={editData.product_or_service || ''}
              onChange={e => setEditData({ ...editData, product_or_service: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs text-gray-400 mb-1">Unique Selling Point</label>
            <textarea
              value={editData.unique_selling_point || ''}
              onChange={e => setEditData({ ...editData, unique_selling_point: e.target.value })}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] resize-none transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}
