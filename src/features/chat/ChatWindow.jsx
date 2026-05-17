import { useEffect, useRef, useCallback, useState } from 'react';
import { MessageCircle, Circle, ArrowLeft, Loader2, ChevronUp } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

export default function ChatWindow({
  activeRoom,
  messages,
  isMessagesLoading,
  typingUsers,
  currentUserId,
  onSend,
  onTyping,
  onStopTyping,
  onBack,
  hasMoreMessages,
  onLoadOlder,
}) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const shouldScrollBottom = useRef(true);

  const activeRoomId = activeRoom?.id;
  const isTyping = typingUsers.some(
    (u) => String(u.chatRoomId) === String(activeRoomId) && String(u.userId) !== String(currentUserId)
  );
  const typingName = typingUsers.find(
    (u) => String(u.chatRoomId) === String(activeRoomId) && String(u.userId) !== String(currentUserId)
  )?.name;

  // Scroll to bottom when messages change (unless we just loaded older messages)
  useEffect(() => {
    if (shouldScrollBottom.current && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' });
    }
  }, [messages]);

  // Also scroll on typing indicator
  useEffect(() => {
    if (isTyping && shouldScrollBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isTyping]);

  // Reset when room changes
  useEffect(() => {
    shouldScrollBottom.current = true;
  }, [activeRoomId]);

  const handleLoadOlder = useCallback(async () => {
    if (!onLoadOlder || !hasMoreMessages || isLoadingOlder) return;
    const container = containerRef.current;
    if (!container) return;

    const prevScrollHeight = container.scrollHeight;
    shouldScrollBottom.current = false;
    setIsLoadingOlder(true);

    await onLoadOlder();

    setIsLoadingOlder(false);
    // Restore scroll position after older messages are prepended
    requestAnimationFrame(() => {
      if (container) {
        container.scrollTop = container.scrollHeight - prevScrollHeight;
      }
    });
  }, [onLoadOlder, hasMoreMessages, isLoadingOlder]);

  // Detect scroll to top for infinite scroll
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Track if user is near bottom (for auto-scroll on new messages)
    const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    shouldScrollBottom.current = distFromBottom < 80;

    // Load older when scrolled near top
    if (!hasMoreMessages || isLoadingOlder) return;
    if (container.scrollTop < 60) {
      handleLoadOlder();
    }
  }, [hasMoreMessages, isLoadingOlder, handleLoadOlder]);

  if (!activeRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-[#1A112C]/30">
        {/* Mobile back button when no room selected */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="md:hidden absolute top-4 left-4 p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#745CB4]/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#241A3A]/70 border border-[#745CB4]/20 flex items-center justify-center mb-4 sm:mb-5">
          <MessageCircle className="w-7 h-7 sm:w-9 sm:h-9 text-[#745CB4]/50" />
        </div>
        <h3 className="text-white font-semibold text-base sm:text-lg mb-2">No conversation selected</h3>
        <p className="text-[#9CA3AF] text-xs sm:text-sm max-w-xs leading-relaxed">
          Select a collaboration chat from the left panel to start messaging.
        </p>
      </div>
    );
  }

  const displayName = activeRoom.participants?.[0]?.name || activeRoom.name || 'Chat';
  const collaborationLabel = activeRoom.collaborationId
    ? `Collaboration #${activeRoom.collaborationId}`
    : null;
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const grouped = [];
  let lastDateLabel = null;
  for (const msg of messages) {
    const d = new Date(msg.sentAt || msg.createdAt);
    const label = Number.isNaN(d.getTime())
      ? null
      : d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    if (label && label !== lastDateLabel) {
      grouped.push({ type: 'date', label });
      lastDateLabel = label;
    }
    grouped.push({ type: 'message', msg });
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full bg-[#1A112C]/30">
      {/* Header */}
      <header className="px-3 sm:px-5 py-3 sm:py-3.5 border-b border-[#745CB4]/20 bg-[#1A112C]/55 backdrop-blur-sm flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile back button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="md:hidden p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#745CB4]/20 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-[#745CB4] to-[#3D2C6B] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow-sm shrink-0">
          {initials || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{displayName}</h3>
          {collaborationLabel && (
            <p className="text-[10px] sm:text-[11px] text-[#9CA3AF] truncate">{collaborationLabel}</p>
          )}
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-xs font-medium shrink-0">
          <Circle className="w-2 h-2 fill-green-300 text-green-300" />
          Live
        </span>
        <span className="sm:hidden inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-green-400 shrink-0" />
      </header>

      {/* Messages - scrollable area with custom scrollbar */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-4 py-4 sm:py-5 space-y-3 custom-scrollbar"
        style={{ minHeight: 0, scrollbarWidth: 'thin', scrollbarColor: 'rgba(116, 92, 180, 0.5) transparent' }}
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
        {/* Load older messages indicator */}
        {hasMoreMessages && (
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={handleLoadOlder}
              disabled={isLoadingOlder}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border border-[#745CB4]/25 bg-[#241A3A]/50 text-[#C1B6FD] hover:bg-[#241A3A]/80 transition-colors disabled:opacity-50"
            >
              {isLoadingOlder ? (
                <><Loader2 className="w-3 h-3 animate-spin" /> Loading…</>
              ) : (
                <><ChevronUp className="w-3 h-3" /> Load older messages</>
              )}
            </button>
          </div>
        )}
        {isMessagesLoading && (
          <div className="flex flex-col items-center justify-center h-40 text-[#9CA3AF] gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-[#745CB4]/50 border-t-[#C1B6FD] animate-spin" />
            <span className="text-xs">Loading messages…</span>
          </div>
        )}

        {!isMessagesLoading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[#9CA3AF]">
            <MessageCircle className="w-8 h-8 opacity-20 mb-2" />
            <p className="text-xs">No messages yet. Say hello!</p>
          </div>
        )}

        {!isMessagesLoading &&
          grouped.map((item, idx) => {
            if (item.type === 'date') {
              return (
                <div key={`date-${idx}`} className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-[#745CB4]/15" />
                  <span className="text-[10px] text-[#6B7280] font-medium px-2 py-0.5 rounded-full border border-[#745CB4]/15 bg-[#1A112C]/40 whitespace-nowrap">
                    {item.label}
                  </span>
                  <div className="flex-1 h-px bg-[#745CB4]/15" />
                </div>
              );
            }

            const msg = item.msg;
            const senderId = msg.senderId || msg?.sender?.id;
            const isMine = String(senderId) === String(currentUserId);
            return (
              <MessageBubble
                key={msg.id || msg._id || idx}
                message={msg}
                isMine={isMine}
              />
            );
          })}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-[#745CB4] to-[#3D2C6B] flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">
              {(typingName || '?')[0].toUpperCase()}
            </div>
            <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-[#241A3A]/70 border border-[#745CB4]/20">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        activeRoomId={activeRoomId}
        onSend={onSend}
        onTyping={onTyping}
        onStopTyping={onStopTyping}
        disabled={!activeRoom}
      />
    </div>
  );
}
