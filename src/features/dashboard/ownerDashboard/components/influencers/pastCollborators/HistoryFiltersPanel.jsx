import { X, CheckCircle2, XCircle, Calendar } from 'lucide-react';

function HistoryFiltersPanel({ 
  filters, 
  onFilterChange, 
  onStatusToggle, 
  onClearFilters, 
  onClose 
}) {
  return (
    <aside className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
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
            <button
              onClick={() => onStatusToggle('completed')}
              className={`w-full px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2 ${
                filters.status.includes('completed')
                  ? 'bg-[#745CB4]/30 border-[#C1B6FD] text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Completed</span>
            </button>
            <button
              onClick={() => onStatusToggle('cancelled')}
              className={`w-full px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2 ${
                filters.status.includes('cancelled')
                  ? 'bg-[#745CB4]/30 border-[#C1B6FD] text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span className="text-sm">Cancelled</span>
            </button>
          </div>
        </div>

        {/* Performance Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-white">Performance Rating</label>
            <span className="text-xs text-gray-400">{filters.minPerformance} - {filters.maxPerformance}</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minPerformance}
              onChange={(e) => onFilterChange({ minPerformance: parseFloat(e.target.value) })}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
            />
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.maxPerformance}
              onChange={(e) => onFilterChange({ maxPerformance: parseFloat(e.target.value) })}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
            />
          </div>
        </div>

        {/* ROI Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-white">ROI (%)</label>
            <span className="text-xs text-gray-400">{filters.minROI}% - {filters.maxROI}%</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={filters.minROI}
              onChange={(e) => onFilterChange({ minROI: parseInt(e.target.value) })}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
            />
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={filters.maxROI}
              onChange={(e) => onFilterChange({ maxROI: parseInt(e.target.value) })}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
            />
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="text-sm font-semibold text-white mb-3 block">
            <Calendar className="w-4 h-4 inline mr-2" />
            Completion Year
          </label>
          <select
            value={filters.year}
            onChange={(e) => onFilterChange({ year: e.target.value })}
            className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
          >
            <option value="all" className="bg-gray-800">All Years</option>
            <option value="2026" className="bg-gray-800">2026</option>
            <option value="2025" className="bg-gray-800">2025</option>
            <option value="2024" className="bg-gray-800">2024</option>
          </select>
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
    </aside>
  );
}

export default HistoryFiltersPanel;
