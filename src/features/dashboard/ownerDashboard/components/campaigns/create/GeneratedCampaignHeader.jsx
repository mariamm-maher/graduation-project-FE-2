import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, BookOpen, Save, Rocket } from 'lucide-react';

export default function GeneratedCampaignHeader({
  generatedAt,
  formatDate,
  isLoading,
  handleSaveAsDraft,
  handleSave,
  handleSaveAndPublish,
  navigate
}) {
  return (
    <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl shadow-2xl shadow-purple-500/10 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/dashboard/owner/campaigns/create')}
            className="text-gray-400 hover:text-[#C1B6FD] transition-all p-2.5 hover:bg-[#745CB4]/10 rounded-xl border border-transparent hover:border-[#C1B6FD]/30"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-6 h-6 text-[#C1B6FD]" />
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-[#C1B6FD] to-white bg-clip-text text-transparent">
                AI-Generated Campaign
              </h1>
            </div>
            <p className="text-sm text-gray-400">
              Generated {generatedAt ? formatDate(generatedAt) : 'just now'} · Review your strategy below
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveAsDraft}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 hover:border-[#C1B6FD]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BookOpen className="w-4 h-4" />
            Save as Draft
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-[#C1B6FD]/40 rounded-xl text-[#C1B6FD] font-semibold hover:bg-[#745CB4]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(193,182,253,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveAndPublish}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white font-bold shadow-lg shadow-[#745CB4]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Publishing...</>
            ) : (
              <><Rocket className="w-4 h-4" /> Save &amp; Publish</>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
