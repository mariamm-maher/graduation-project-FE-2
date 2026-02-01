import { X, CheckCircle2, Clock, AlertCircle, Instagram, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

function FiltersPanel({ filters, onFilterChange, onStatusToggle, onPlatformToggle, onClearFilters, onClose }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { 
          label: 'Completed', 
          icon: CheckCircle2, 
          color: 'text-green-400', 
          bg: 'bg-green-500/20',
          border: 'border-green-500/30'
        };
      case 'in-progress':
        return { 
          label: 'In Progress', 
          icon: Clock, 
          color: 'text-blue-400', 
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30'
        };
      case 'pending':
        return { 
          label: 'Pending', 
          icon: AlertCircle, 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/30'
        };
      default:
        return { 
          label: status, 
          icon: Clock, 
          color: 'text-gray-400', 
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/30'
        };
    }
  };

  return (
    <motion.aside
      key="filters"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 h-fit lg:sticky lg:top-6 order-1 lg:order-2"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Filters</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Status Filter */}
        <div>
          <label className="text-sm font-semibold text-white mb-3 block">Status</label>
          <div className="space-y-2">
            {['in-progress', 'pending', 'completed'].map((status) => {
              const config = getStatusConfig(status);
              const StatusIcon = config.icon;
              return (
                <button
                  key={status}
                  onClick={() => onStatusToggle(status)}
                  className={`w-full px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2 ${
                    filters.status.includes(status)
                      ? 'bg-[#745CB4]/30 border-[#C1B6FD] text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-sm capitalize">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform Filter */}
        <div>
          <label className="text-sm font-semibold text-white mb-3 block">Platform</label>
          <div className="space-y-2">
            <button
              onClick={() => onPlatformToggle('instagram')}
              className={`w-full px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2 ${
                filters.platforms.includes('instagram')
                  ? 'bg-[#745CB4]/30 border-[#C1B6FD] text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Instagram className="w-4 h-4" />
              <span className="text-sm">Instagram</span>
            </button>
            <button
              onClick={() => onPlatformToggle('youtube')}
              className={`w-full px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2 ${
                filters.platforms.includes('youtube')
                  ? 'bg-[#745CB4]/30 border-[#C1B6FD] text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Youtube className="w-4 h-4" />
              <span className="text-sm">YouTube</span>
            </button>
          </div>
        </div>

        {/* Progress Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-white">Progress</label>
            <span className="text-xs text-gray-400">{filters.minProgress}% - {filters.maxProgress}%</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.minProgress}
              onChange={(e) => onFilterChange({ minProgress: parseInt(e.target.value) })}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
            />
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.maxProgress}
              onChange={(e) => onFilterChange({ maxProgress: parseInt(e.target.value) })}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
            />
          </div>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
        <button
          onClick={onClearFilters}
          className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-400 font-medium transition-all"
        >
          Clear All
        </button>
      </div>
    </motion.aside>
  );
}

export default FiltersPanel;
