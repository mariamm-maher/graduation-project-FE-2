import { Search, Filter } from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Beauty',
  'Fashion',
  'Food',
  'Fitness',
  'Travel',
  'Technology',
  'Gaming',
  'Lifestyle',
  'Education',
];

function SearchFilters({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  onClearFilters,
}) {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (category) => {
    setFilters((prev) => {
      const current = prev.categories || [];
      const nextCategories = current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category];

      return { ...prev, categories: nextCategories };
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, category, location, or keywords..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]/50 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-5 py-3.5 bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-xl hover:from-white/15 hover:to-white/10 hover:border-[#C1B6FD]/50 hover:shadow-lg hover:shadow-[#C1B6FD]/10 transition-all flex items-center justify-center gap-2 group"
        >
          <Filter className="w-5 h-5 text-gray-300 group-hover:text-[#C1B6FD] transition-colors" />
          <span className="text-sm text-gray-300 group-hover:text-white font-semibold transition-colors">Advanced Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-200">Categories</span>
              <span className="text-xs text-gray-400">Choose one or more</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((category) => {
                const isSelected = (filters.categories || []).includes(category);

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                      isSelected
                        ? 'bg-[#C1B6FD]/20 border-[#C1B6FD]/70 text-white'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input
              type="text"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              placeholder="Location"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
            />

            <select
              value={filters.platform}
              onChange={(e) => updateFilter('platform', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
            >
              <option value="" className="bg-[#161222]">All platforms</option>
              <option value="instagram" className="bg-[#161222]">Instagram</option>
              <option value="tiktok" className="bg-[#161222]">TikTok</option>
              <option value="youtube" className="bg-[#161222]">YouTube</option>
              <option value="facebook" className="bg-[#161222]">Facebook</option>
              <option value="x" className="bg-[#161222]">X / Twitter</option>
            </select>

            <input
              type="number"
              min="0"
              value={filters.minFollowers}
              onChange={(e) => updateFilter('minFollowers', e.target.value)}
              placeholder="Min followers"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
            />

            <input
              type="number"
              min="0"
              step="0.1"
              value={filters.minEngagement}
              onChange={(e) => updateFilter('minEngagement', e.target.value)}
              placeholder="Min engagement %"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-200 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFilters;
