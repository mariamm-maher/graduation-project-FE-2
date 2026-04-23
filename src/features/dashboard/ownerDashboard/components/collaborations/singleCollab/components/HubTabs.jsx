import { BarChart3, ClipboardList, FileSignature, LayoutGrid, MessageCircleMore, SquareCheckBig } from 'lucide-react';

const TAB_ICONS = {
  all: LayoutGrid,
  contracts: FileSignature,
  requests: ClipboardList,
  analytics: BarChart3,
  chats: MessageCircleMore,
  tasks: SquareCheckBig,
};

export default function HubTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex flex-wrap gap-2.5 mb-6" role="tablist" aria-label="Collaboration views">
      {tabs.map((tab) => (
        (() => {
          const Icon = TAB_ICONS[tab.id] || LayoutGrid;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[18px] sm:text-[15px] font-semibold border cursor-pointer transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-white border-[#C1B6FD]/55 bg-linear-to-r from-[#241A3A]/85 to-[#1A112C]/85 backdrop-blur-md shadow-[0_8px_24px_rgba(116,92,180,0.35)]'
                  : 'text-[#C1B6FD] border-[#745CB4]/45 bg-[#1A112C]/40 backdrop-blur-sm hover:bg-[#241A3A]/55 hover:border-[#C1B6FD]/35'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon
                className={`h-4 w-4 sm:h-[17px] sm:w-[17px] transition-transform duration-200 ${
                  activeTab === tab.id ? 'scale-105' : 'opacity-90 group-hover:opacity-100'
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-amber-500 text-white leading-none">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })()
      ))}
    </div>
  );
}

