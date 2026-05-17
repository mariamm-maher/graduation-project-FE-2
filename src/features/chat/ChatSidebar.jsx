import { Search, MessageCircle, Circle, X } from 'lucide-react';
import { useState } from 'react';

function fmtRelative(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function ChatSidebar({ rooms, activeRoomId, isLoading, connected, onSelectRoom }) {
  const [query, setQuery] = useState('');

  const filtered = rooms.filter((r) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (r.name || '').toLowerCase().includes(q) ||
      (r.lastMessage?.content || '').toLowerCase().includes(q) ||
      (r.participants?.[0]?.name || '').toLowerCase().includes(q)
    );
  });

  return (
    <aside className="flex flex-col h-full min-h-0 border-r-0 md:border-r border-[#745CB4]/25 bg-[#1A112C]/55 backdrop-blur-sm">
      {/* Header */}
      <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2.5 sm:pb-3 border-b border-[#745CB4]/20 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Messages</h2>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5">Collaboration chats</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            connected
              ? 'text-green-300 border-green-500/30 bg-green-500/10'
              : 'text-[#9CA3AF] border-[#745CB4]/25 bg-[#1A112C]/40'
          }`}
        >
          <Circle className={`w-1.5 h-1.5 ${connected ? 'fill-green-300 text-green-300' : 'fill-[#9CA3AF] text-[#9CA3AF]'}`} />
          {connected ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Search */}
      <div className="px-2.5 sm:px-3 py-2 sm:py-2.5">
        <label className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-lg border border-[#745CB4]/25 bg-[#241A3A]/55 text-sm text-white placeholder:text-[#9CA3AF] pl-8 pr-8 py-2 focus:outline-none focus:border-[#C1B6FD]/50 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2.5 text-[#9CA3AF] hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </label>
      </div>

      {/* Room list - scrollable with custom scrollbar */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-1.5 sm:px-2 pb-3 space-y-0.5 sm:space-y-1 custom-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(116, 92, 180, 0.5) transparent',
        }}
      >
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(116, 92, 180, 0.5);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(193, 182, 253, 0.6);
          }
        `}</style>
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 text-[#9CA3AF] gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-[#745CB4]/50 border-t-[#C1B6FD] animate-spin" />
            <span className="text-xs">Loading chats…</span>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-[#9CA3AF]">
            <MessageCircle className="w-9 h-9 opacity-25 mb-2" />
            <p className="text-xs font-medium">{query ? 'No results found' : 'No conversations yet'}</p>
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-1.5 text-[10px] text-[#C1B6FD] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {!isLoading &&
          filtered.map((room) => {
            const isActive = String(room.id) === String(activeRoomId);
            const displayName = room.participants?.[0]?.name || room.name || 'Chat';
            const preview = room.lastMessage?.content || 'No messages yet';
            const timeLabel = fmtRelative(room.lastMessage?.sentAt || room.updatedAt);
            const initials = displayName
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0])
              .join('')
              .toUpperCase();

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onSelectRoom(room.id)}
                className={`w-full flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-xl text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-[#3D2C6B]/70 border border-[#C1B6FD]/25'
                    : 'border border-transparent hover:bg-[#241A3A]/55 hover:border-[#745CB4]/20 active:bg-[#241A3A]/70'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-[#745CB4] to-[#3D2C6B] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow-sm">
                    {initials || '?'}
                  </div>
                  {room.unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] px-0.5 sm:px-1 rounded-full bg-[#745CB4] text-white text-[9px] sm:text-[10px] font-bold border border-[#1A112C]">
                      {room.unreadCount > 99 ? '99+' : room.unreadCount}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className={`text-[13px] sm:text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-[#E5E7EB]'}`}>
                      {displayName}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] shrink-0">{timeLabel}</span>
                  </div>
                  <p className={`text-[11px] sm:text-xs truncate mt-0.5 ${room.unreadCount > 0 ? 'text-white font-medium' : 'text-[#9CA3AF]'}`}>
                    {preview}
                  </p>
                </div>
              </button>
            );
          })}
      </div>
    </aside>
  );
}
