import { useEffect, useRef, useState } from 'react';
import { Circle, Loader2, MessageCircle, Paperclip, Search, SendHorizontal } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useChatStore from '../../../../../stores/ChatStore';
import useAuthStore from '../../../../../stores/authStore';

function fmt(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

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

export default function Messages() {
  const authUser = useAuthStore((s) => s.user);
  const currentUserId = authUser?.userId || authUser?.id;
  const location = useLocation();

  const {
    chatRooms,
    messages,
    isLoading,
    isMessagesLoading,
    typingUsers,
    getChatRooms,
    getMessages,
    markRoomAsRead,
    sendMessage,
    initSocket,
    disconnectSocket,
    joinCollaborationChat,
    joinRoom,
    leaveRoom,
    emitTyping,
    emitStopTyping,
    connected,
  } = useChatStore();

  const roomFromQuery = new URLSearchParams(location.search).get('room');
  const [selectedRoomId, setSelectedRoomId] = useState(roomFromQuery || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    initSocket();
    getChatRooms();
    return () => disconnectSocket();
  }, [initSocket, getChatRooms, disconnectSocket]);

  useEffect(() => {
    if (!selectedRoomId) return;
    getMessages(selectedRoomId);
    markRoomAsRead(selectedRoomId);
    joinRoom(selectedRoomId);

    const room = chatRooms.find((r) => String(r.id) === String(selectedRoomId));
    if (room?.collaborationId) joinCollaborationChat(room.collaborationId);

    return () => leaveRoom(selectedRoomId);
  }, [selectedRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredRooms = (chatRooms || []).filter((r) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (r.name || '').toLowerCase().includes(q) || (r.lastMessage?.content || '').toLowerCase().includes(q);
  });

  const activeRoom = chatRooms.find((r) => String(r.id) === String(selectedRoomId));
  const activeRoomLabel = activeRoom?.name || activeRoom?.participants?.[0]?.name || 'Chat';
  const campaignLabel = activeRoom?.collaborationId ? `Collaboration #${activeRoom.collaborationId}` : '';

  const isTyping = typingUsers.some((u) => String(u.chatRoomId) === String(selectedRoomId));

  const handleSelectRoom = (roomId) => {
    setSelectedRoomId(String(roomId));
    setInputText('');
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !selectedRoomId) return;
    setInputText('');
    emitStopTyping(selectedRoomId);
    await sendMessage(selectedRoomId, { content: text });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (selectedRoomId) {
      emitTyping(selectedRoomId);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => emitStopTyping(selectedRoomId), 2000);
    }
  };

  return (
    <section className="rounded-xl border border-[#745CB4]/25 bg-linear-to-b from-[#241A3A]/70 to-[#1A112C]/70 backdrop-blur-md shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] min-h-[620px]">

        {/* ── Sidebar ── */}
        <aside className="border-b lg:border-b-0 lg:border-r border-[#745CB4]/25 bg-[#1A112C]/55 backdrop-blur-sm p-3.5 flex flex-col">
          <div className="mb-3.5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Conversations</h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Collaboration chats</p>
            </div>
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${connected ? 'text-green-300 border-green-500/30 bg-green-500/10' : 'text-[#9CA3AF] border-[#745CB4]/25 bg-[#1A112C]/40'}`}>
              <Circle className={`w-1.5 h-1.5 ${connected ? 'fill-green-300 text-green-300' : 'fill-[#9CA3AF] text-[#9CA3AF]'}`} />
              {connected ? 'Online' : 'Offline'}
            </span>
          </div>

          <label className="relative block mb-3.5">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats"
              className="w-full rounded-lg border border-[#745CB4]/25 bg-[#241A3A]/55 text-sm text-white placeholder:text-[#9CA3AF] pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#C1B6FD]/45"
            />
          </label>

          <div className="space-y-2.5 overflow-y-auto flex-1">
            {isLoading && (
              <div className="flex items-center justify-center py-8 text-[#9CA3AF] gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Loading chats...</span>
              </div>
            )}
            {!isLoading && filteredRooms.length === 0 && (
              <div className="text-center py-8 text-[#9CA3AF] text-xs">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No conversations yet
              </div>
            )}
            {filteredRooms.map((room) => {
              const isActive = String(room.id) === String(selectedRoomId);
              const preview = room.lastMessage?.content || 'No messages yet';
              const timeLabel = fmtRelative(room.lastMessage?.sentAt || room.updatedAt);
              const displayName = room.participants?.[0]?.name || room.name || 'Chat';

              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleSelectRoom(room.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isActive
                      ? 'border-[#C1B6FD]/40 bg-[#241A3A]/75'
                      : 'border-[#745CB4]/20 bg-[#1A112C]/40 hover:bg-[#241A3A]/55'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-semibold text-white truncate block">{displayName}</span>
                      {room.collaborationId && (
                        <p className="text-[11px] text-[#9CA3AF] truncate mt-0.5">
                          Collaboration #{room.collaborationId}
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] text-[#9CA3AF] shrink-0">{timeLabel}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-[#C1B6FD] truncate">{preview}</p>
                    {room.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[#745CB4]/70 text-white text-[11px] font-semibold">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Chat Window ── */}
        <div className="flex flex-col bg-[#1A112C]/40 backdrop-blur-sm">
          {!selectedRoomId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MessageCircle className="w-12 h-12 text-[#745CB4]/40 mb-4" />
              <p className="text-white font-semibold text-base mb-1">Select a conversation</p>
              <p className="text-[#9CA3AF] text-sm">Choose a collaboration chat from the left to start messaging.</p>
            </div>
          ) : (
            <>
              <header className="p-4 border-b border-[#745CB4]/25 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-base font-semibold text-white truncate">{activeRoomLabel}</h4>
                  {campaignLabel && <p className="text-xs text-[#9CA3AF] truncate">{campaignLabel}</p>}
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-green-500/30 bg-green-500/15 text-green-300 text-xs">
                  <Circle className="w-2.5 h-2.5 fill-green-300 text-green-300" />
                  Live chat
                </span>
              </header>

              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {isMessagesLoading && (
                  <div className="flex items-center justify-center py-8 text-[#9CA3AF] gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs">Loading messages...</span>
                  </div>
                )}
                {!isMessagesLoading && messages.map((message) => {
                  const senderId = message.senderId || message?.sender?.id;
                  const isMine = String(senderId) === String(currentUserId);
                  return (
                    <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 border ${
                          isMine
                            ? 'bg-[#745CB4]/65 border-[#C1B6FD]/30 text-white'
                            : 'bg-[#241A3A]/60 border-[#745CB4]/25 text-[#E5E7EB]'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content || message.text}</p>
                        <p className={`text-[11px] mt-1.5 ${isMine ? 'text-[#E5D9FF]' : 'text-[#9CA3AF]'}`}>
                          {fmt(message.sentAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="px-3.5 py-2.5 rounded-2xl border bg-[#241A3A]/60 border-[#745CB4]/25 text-[#9CA3AF] text-xs italic">
                      Typing…
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <footer className="p-4 border-t border-[#745CB4]/25 bg-[#1A112C]/45">
                <div className="rounded-xl border border-[#745CB4]/25 bg-[#241A3A]/50 flex items-center gap-2 pl-2.5 pr-2 py-2">
                  <button type="button" className="p-2 rounded-lg text-[#C1B6FD] hover:bg-[#745CB4]/20 transition-colors" aria-label="Attach file">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-[#9CA3AF] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#C1B6FD]/35 bg-[#745CB4]/65 text-white text-sm font-medium disabled:opacity-40 transition-opacity"
                  >
                    <SendHorizontal className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </footer>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
