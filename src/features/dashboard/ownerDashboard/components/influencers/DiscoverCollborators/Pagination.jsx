import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ currentPage, setCurrentPage, totalPages, totalItems, startIndex, endIndex }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      <p className="text-sm text-gray-400">
        Showing <span className="text-white font-semibold">{startIndex + 1}-{Math.min(endIndex, totalItems)}</span> of <span className="text-white font-semibold">{totalItems}</span> influencers
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#C1B6FD]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center group"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
              currentPage === idx + 1
                ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg shadow-[#C1B6FD]/30'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-[#C1B6FD]/50'
            }`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#C1B6FD]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center group"
        >
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
