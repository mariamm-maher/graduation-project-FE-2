import { motion } from 'framer-motion';
import { Briefcase, Sparkles, ArrowRight, X } from 'lucide-react';

function CreateOwnerProfile({ onClose, onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-gradient-to-br from-[#1a1a3e] to-[#0f0f2e] border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with gradient */}
        <div className="relative p-8 pb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10"></div>
          <div className="relative">
        
            <h2 className="text-2xl font-bold text-center text-white mb-2">
              Become a Campaign Owner
            </h2>
            <p className="text-gray-400 text-center text-sm">
              To create and manage campaigns, you need an Owner profile
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-2 h-2 bg-[#C1B6FD] rounded-full mt-2"></div>
              <div>
                <h3 className="text-white font-medium mb-1">Dual Role Benefits</h3>
                <p className="text-gray-400 text-sm">
                  Keep your influencer profile and add owner capabilities. Switch between roles seamlessly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-2 h-2 bg-[#C1B6FD] rounded-full mt-2"></div>
              <div>
                <h3 className="text-white font-medium mb-1">Create Campaigns</h3>
                <p className="text-gray-400 text-sm">
                  Launch your own campaigns, manage budgets, and collaborate with other influencers.
                </p>
              </div>
            </div>
          
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 font-medium flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              AI Campaign Generator
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 font-medium"
            >
              Analytics Dashboard
            </motion.div>
      
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContinue}
              className="flex-1 relative px-6 py-3 text-sm font-medium text-white rounded-lg overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <span className="relative flex items-center justify-center gap-2">
                Continue to Setup
                <ArrowRight className="w-4 h-4" />
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 px-6 py-3 text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200"
            >
              Maybe Later
            </motion.button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            You can always add this later from your profile settings
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CreateOwnerProfile;
