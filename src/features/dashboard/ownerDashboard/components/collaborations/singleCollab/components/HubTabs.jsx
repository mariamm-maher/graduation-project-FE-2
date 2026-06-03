import { BarChart3, ClipboardList, FileSignature, LayoutGrid, MessageCircleMore, Search, SquareCheckBig, X } from 'lucide-react';

const TAB_ICONS = {
  all: LayoutGrid,
  contracts: FileSignature,
  requests: ClipboardList,
  analytics: BarChart3,
  chats: MessageCircleMore,
  tasks: SquareCheckBig,
};

export default function HubTabs({ tabs, activeTab, onTabChange, searchQuery, setSearchQuery }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 mb-6" role="tablist" aria-label="Collaboration views">
      <div className="flex flex-wrap items-center gap-4">
        {tabs.map((tab, index) => (
          (() => {
            const Icon = TAB_ICONS[tab.id] || LayoutGrid;
            const isLast = index === tabs.length - 1;

            return (
              <div key={tab.id} className="flex items-center">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`group inline-flex items-center gap-2 px-3 py-3 text-base font-medium cursor-pointer transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-[#C1B6FD] shadow-[0_2px_8px_rgba(193,182,253,0.4)]'
                      : 'text-[#9CA3AF] hover:text-white'
                  }`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-[11px] font-bold bg-amber-500 text-white leading-none">
                      {tab.badge}
                    </span>
                  )}
                </button>
                {!isLast && <span className="text-[#745CB4]/30 mx-2 text-lg">|</span>}
              </div>
            );
          })()
        ))}
      </div>

      {/* Search Bar in Navigation */}
      <div className="relative w-full sm:w-64 md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full pl-10 pr-10 py-3 text-sm border border-[#745CB4]/15 rounded-lg bg-[#1A112C]/50 text-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C1B6FD]/30 transition-colors"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

