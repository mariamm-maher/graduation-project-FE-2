import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X, Loader, ShoppingBag, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceCard from './ServiceCard';
import useServiceListingsStore from '../../../../../stores/ServiceListingsStore';

const CATEGORIES = ['All', 'Fashion', 'Tech', 'Beauty', 'Gaming', 'Food', 'Travel', 'Fitness', 'Lifestyle', 'Business'];
const PLATFORMS  = ['All', 'Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn'];
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'followers', label: 'Most Followed' },
];

const LIMIT = 12;

function MarketplaceOverview() {
  const { listings, pagination, isLoading, browseListings, searchListings, getCategories, categories, error } = useServiceListingsStore();
  const { totalPages = 0, totalItems = 0 } = pagination || {};

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [platform, setPlatform] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const buildParams = useCallback(() => ({
    page,
    limit: LIMIT,
    ...(search && { search }),
    ...(category !== 'All' && { category }),
    ...(platform !== 'All' && { platform }),
    ...(minPrice !== '' && { minPrice: Number(minPrice) }),
    ...(maxPrice !== '' && { maxPrice: Number(maxPrice) }),
    ...(sort && { sort }),
  }), [page, search, category, platform, minPrice, maxPrice, sort]);

  useEffect(() => {
    getCategories();
    browseListings(buildParams());
  }, [browseListings, buildParams, getCategories]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    if (search.trim()) {
      searchListings(search, { ...buildParams(), page: 1 });
    } else {
      browseListings({ ...buildParams(), page: 1 });
    }
  };

  const clearFilters = () => {
    setSearch(''); setCategory('All'); setPlatform('All');
    setMinPrice(''); setMaxPrice(''); setSort(''); setPage(1);
  };

  const hasActiveFilter = search || category !== 'All' || platform !== 'All' || minPrice || maxPrice || sort;

  const startIdx = (page - 1) * LIMIT + 1;
  const endIdx   = Math.min(page * LIMIT, totalItems);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Influencer Marketplace</h1>
          <p className="text-gray-400 text-sm">Browse services offered by influencers and send them offers</p>
        </div>
        {totalItems > 0 && (
          <span className="text-sm text-gray-400 self-center">
            Showing <span className="text-white font-medium">{startIdx}–{endIdx}</span> of{' '}
            <span className="text-white font-medium">{totalItems}</span> services
          </span>
        )}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search services, influencers, niches…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]/50 focus:border-[#C1B6FD]/50 transition-all"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-linear-to-r from-[#C1B6FD] to-[#745CB4] hover:from-[#a99ef0] hover:to-[#5e4a9a] rounded-xl text-sm text-white font-semibold transition-all shadow-lg shadow-[#745CB4]/20">
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-1.5 px-4 py-2.5 border rounded-xl text-sm transition-all ${showFilters ? 'bg-[#745CB4]/20 border-[#C1B6FD]/40 text-[#C1B6FD]' : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:border-white/20'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters {hasActiveFilter && <span className="w-2 h-2 rounded-full bg-[#C1B6FD] inline-block" />}
        </button>
      </form>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">
              {/* Category pills */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {((categories && Array.isArray(categories) ? categories : []) || CATEGORIES).map(c => {
                    const catName = typeof c === 'string' ? c : c.name || c;
                    return (
                      <button
                        key={catName}
                        type="button"
                        onClick={() => { setCategory(catName); setPage(1); }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${category === catName ? 'bg-gradient-to-r from-[#C1B6FD] to-[#745CB4] text-white' : 'bg-white/5 border border-white/10 text-gray-300 hover:border-white/20 hover:text-white'}`}
                      >
                        {catName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Platform pills */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Platform</p>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => { setPlatform(p); setPage(1); }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${platform === p ? 'bg-linear-to-r from-[#C1B6FD] to-[#745CB4] text-white' : 'bg-white/5 border border-white/10 text-gray-300 hover:border-white/20 hover:text-white'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range + sort */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Min Price</p>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={e => { setMinPrice(e.target.value); setPage(1); }}
                    placeholder="0"
                    min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]/50 transition-all"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Max Price</p>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
                    placeholder="Any"
                    min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]/50 transition-all"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sort By</p>
                  <select
                    value={sort}
                    onChange={e => { setSort(e.target.value); setPage(1); }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]/50 transition-all cursor-pointer"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value} className="bg-[#1a0933]">{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#C1B6FD] transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader className="w-10 h-10 text-[#C1B6FD] animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <ShoppingBag className="w-12 h-12 text-gray-600" />
          <p className="text-gray-400 text-center">{error}</p>
          <button
            onClick={() => browseListings(buildParams())}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <ShoppingBag className="w-14 h-14 text-gray-600" />
          <p className="text-white font-semibold text-lg">No services found</p>
          <p className="text-gray-400 text-sm text-center">Try adjusting your search or filters</p>
          {hasActiveFilter && (
            <button onClick={clearFilters} className="text-[#C1B6FD] hover:underline text-sm">Clear filters</button>
          )}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {listings.map(service => (
            <motion.div
              key={service.id}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('…');
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === '…' ? (
                  <span key={`ellipsis-${idx}`} className="text-gray-500 px-1">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${page === item ? 'bg-linear-to-r from-[#C1B6FD] to-[#745CB4] text-white' : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20'}`}
                  >
                    {item}
                  </button>
                )
              )}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default MarketplaceOverview;
