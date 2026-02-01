import { Search, Filter } from 'lucide-react';

function SearchFilters({ searchQuery, setSearchQuery, showFilters, setShowFilters }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, niche, location, or keywords..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/50 transition-all"
        />
      </div>
      <button 
        onClick={() => setShowFilters(!showFilters)}
        className="px-5 py-3.5 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl hover:from-white/15 hover:to-white/10 hover:border-[#C1B6FD]/50 hover:shadow-lg hover:shadow-[#C1B6FD]/10 transition-all flex items-center justify-center gap-2 group"
      >
        <Filter className="w-5 h-5 text-gray-300 group-hover:text-[#C1B6FD] transition-colors" />
        <span className="text-sm text-gray-300 group-hover:text-white font-semibold transition-colors">Advanced Filters</span>
      </button>
    </div>
  );
}

export default SearchFilters;
