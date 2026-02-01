import { Search, Filter, X } from 'lucide-react';

function HistorySearchBar({ 
  searchQuery, 
  onSearchChange, 
  onToggleFilters, 
  hasActiveFilters, 
  activeFiltersCount,
  onClearFilters 
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search past collaborations..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
        />
      </div>
      
      <div className="flex gap-3">
        <button 
          onClick={onToggleFilters}
          className={`px-4 py-3 border rounded-xl transition-all flex items-center justify-center gap-2 relative ${
            hasActiveFilters 
              ? 'bg-[#745CB4]/20 border-[#C1B6FD] text-white' 
              : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C1B6FD] rounded-full flex items-center justify-center text-xs font-bold text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <X className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 font-medium hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default HistorySearchBar;
