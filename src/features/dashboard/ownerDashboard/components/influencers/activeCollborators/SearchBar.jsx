import { Search } from 'lucide-react';

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="flex items-stretch sm:items-center gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search campaigns or influencers..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
        />
      </div>
    </div>
  );
}

export default SearchBar;
