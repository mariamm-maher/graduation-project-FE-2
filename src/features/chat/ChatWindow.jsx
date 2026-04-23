import { useEffect, useRef } from 'react';
import { MessageCircle, Circle } from 'lucide-react';
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
}) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  const activeRoomId = activeRoom?.id;
  const isTyping = typingUsers.some(
    (u) => String(u.chatRoomId) === String(activeRoomId) && String(u.userId) !== String(currentUserId)
  );
  const typingName = typingUsers.find(
    (u) => String(u.chatRoomId) === String(activeRoomId) && String(u.userId) !== String(currentUserId)
  )?.name;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!activeRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#1A112C]/30">
        <div className="w-20 h-20 rounded-full bg-[#241A3A]/70 border border-[#745CB4]/20 flex items-center justify-center mb-5">
          <MessageCircle className="w-9 h-9 text-[#745CB4]/50" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">No conversation selected</h3>
        <p className="text-[#9CA3AF] text-sm max-w-xs leading-relaxed">
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
    <div className="flex-1 flex flex-col min-h-0 bg-[#1A112C]/30">
      {/* Header */}
      <header className="px-5 py-3.5 border-b border-[#745CB4]/20 bg-[#1A112C]/55 backdrop-blur-sm flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#745CB4] to-[#3D2C6B] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
          {initials || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{displayName}</h3>
          {collaborationLabel && (
            <p className="text-[11px] text-[#9CA3AF] truncate">{collaborationLabel}</p>
          )}
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-xs font-medium shrink-0">
          <Circle className="w-2 h-2 fill-green-300 text-green-300" />
          Live
        </span>
      </header>

      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
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
                  <span className="text-[10px] text-[#6B7280] font-medium px-2 py-0.5 rounded-full border border-[#745CB4]/15 bg-[#1A112C]/40">
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
