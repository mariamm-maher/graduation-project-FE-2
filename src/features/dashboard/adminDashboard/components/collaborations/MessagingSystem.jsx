import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Search, ChevronRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminService from '../../../../../api/adminApi';
import { mapApiMessage, mapRoomToConversation } from './adminChatUtils';

function MessagingSystem({ collaborationIdFilter = null, compact = false }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [showChatList, setShowChatList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const loadRooms = useCallback(async () => {
    setIsLoadingRooms(true);
    setError(null);
    try {
      const response = await adminService.getChatrooms({
        page: 1,
        limit: 100,
        collaborationId: collaborationIdFilter || undefined,
      });
      const { chatrooms } = adminService.parseChatroomsResponse(response);
      const mapped = chatrooms.map((room, i) => mapRoomToConversation(room, i));
      setConversations(mapped);
      if (mapped.length > 0) {
        setSelectedChat((prev) => {
          if (prev && mapped.some((c) => c.id === prev)) return prev;
          return mapped[0].id;
        });
      } else {
        setSelectedChat(null);
        setMessages([]);
      }
    } catch (err) {
      const msg = err?.message || 'Failed to load conversations';
      setError(msg);
      setConversations([]);
    } finally {
      setIsLoadingRooms(false);
    }
  }, [collaborationIdFilter]);

  const loadMessages = useCallback(async (roomId) => {
    if (!roomId) {
      setMessages([]);
      return;
    }
    setIsLoadingMessages(true);
    try {
      const response = await adminService.getChatroomMessages(roomId, { page: 1, limit: 100 });
      const { messages: raw, chatRoom } = adminService.parseChatMessagesResponse(response);
      setOwnerId(chatRoom?.ownerId ?? null);
      setMessages(raw.map((m) => mapApiMessage(m, chatRoom?.ownerId)));
    } catch (err) {
      toast.error(err?.message || 'Failed to load messages');
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat);
    }
  }, [selectedChat, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingMessages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showAttachMenu && !e.target.closest('.attach-menu')) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAttachMenu]);

  const selectedConversation = conversations.find((c) => c.id === selectedChat);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    toast.info('Admins can view collaboration chats but cannot send messages.');
    setMessage('');
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      !searchQuery ||
      conv.influencer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.campaign.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const heightClass = compact ? 'h-[520px]' : 'h-[calc(100vh-8rem)]';

  return (
    <div className={`${heightClass} flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-hidden rounded-3xl`}>
      {!collaborationIdFilter && (
        <div
          className={`${showChatList ? 'w-full lg:w-80' : 'w-0 lg:w-0'} border-r border-[#1e1e2e] flex flex-col transition-all duration-300 overflow-hidden shrink-0 rounded-3xl bg-[#0f0f1e]`}
        >
          {showChatList && (
            <>
              <div className="p-4 border-b border-[#1e1e2e]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">Messages</h2>
                  <button
                    type="button"
                    onClick={loadRooms}
                    disabled={isLoadingRooms}
                    className="p-2 rounded-lg hover:bg-[#16162a] text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingRooms ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 bg-[#16162a] border border-[#252538] rounded-2xl text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-[#745CB4] transition-colors"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoadingRooms ? (
                  <div className="flex items-center justify-center gap-2 py-12 text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin text-[#C1B6FD]" />
                    <span className="text-sm">Loading chats...</span>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4 py-12">
                    <Search className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm text-center">No collaboration chats found</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setSelectedChat(conv.id);
                        if (window.innerWidth < 1024) setShowChatList(false);
                      }}
                      className={`px-4 py-3 cursor-pointer transition-colors relative ${
                        selectedChat === conv.id ? 'bg-[#16162a]' : 'hover:bg-[#13131f]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-full bg-gradient-to-br ${conv.avatarColor} flex items-center justify-center text-sm font-semibold text-white shrink-0`}
                        >
                          {conv.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-white text-sm truncate">{conv.influencer}</h3>
                            <span className="text-xs text-gray-500 shrink-0 ml-2">{conv.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{conv.campaign}</p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a16] rounded-3xl overflow-hidden">
        {error && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {!selectedConversation && !isLoadingRooms ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            Select a conversation to view messages
          </div>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-[#1e1e2e] flex items-center justify-between bg-[#0f0f1e] shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {!showChatList && !collaborationIdFilter && (
                  <button
                    type="button"
                    onClick={() => setShowChatList(true)}
                    className="w-9 h-9 rounded-2xl hover:bg-[#16162a] flex items-center justify-center transition-colors lg:hidden"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400 rotate-180" />
                  </button>
                )}
                {selectedConversation && (
                  <>
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedConversation.avatarColor} flex items-center justify-center text-sm font-semibold text-white shrink-0`}
                    >
                      {selectedConversation.avatar}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate">{selectedConversation.influencer}</h3>
                      <p className="text-xs text-gray-500 truncate">
                        {selectedConversation.campaign}
                        {selectedConversation.collaborationId && (
                          <>
                            {' · '}
                            <Link
                              to={`/dashboard/admin/collaborations/${selectedConversation.collaborationId}`}
                              className="text-[#C1B6FD] hover:underline"
                            >
                              View collab
                            </Link>
                          </>
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-wide text-gray-500 shrink-0 ml-2">Read-only</span>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar min-h-0">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center gap-2 py-12 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin text-[#C1B6FD]" />
                  <span className="text-sm">Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <p className="text-sm">No messages in this chat yet.</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const showDateLabel = msg.date && (index === 0 || messages[index - 1].date !== msg.date);
                  return (
                    <div key={msg.id}>
                      {showDateLabel && (
                        <div className="flex justify-center my-4">
                          <span className="text-xs text-gray-500 bg-[#13131f] px-3 py-1 rounded-full">{msg.date}</span>
                        </div>
                      )}
                      <div className="flex gap-2.5">
                        {msg.sender === 'influencer' && (
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedConversation?.avatarColor} flex items-center justify-center text-xs font-semibold text-white shrink-0`}
                          >
                            {selectedConversation?.avatar}
                          </div>
                        )}
                        <div className={`flex-1 ${msg.sender === 'brand' ? 'flex justify-end' : ''}`}>
                          <div className={`max-w-[70%] ${msg.sender === 'brand' ? 'ml-auto' : ''}`}>
                            <div
                              className={`px-3.5 py-2 rounded-3xl ${
                                msg.sender === 'brand'
                                  ? 'bg-[#745CB4] text-white rounded-br-xl'
                                  : 'bg-[#16162a] text-gray-200 rounded-tl-xl'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div>
                            <div
                              className={`flex items-center gap-1.5 mt-1 px-1 ${msg.sender === 'brand' ? 'justify-end' : ''}`}
                            >
                              <span className="text-[11px] text-gray-600">{msg.timestamp}</span>
                              {msg.senderName && (
                                <span className="text-[11px] text-gray-600">· {msg.senderName}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-5 py-4 border-t border-[#1e1e2e] bg-[#0f0f1e] shrink-0">
              <p className="text-xs text-gray-500 mb-3 text-center">
                Admin view — messages are read-only
              </p>
              <form onSubmit={handleSendMessage} className="flex items-end gap-2 opacity-60">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="View only — cannot send as admin"
                  disabled
                  className="flex-1 px-4 py-2.5 bg-[#16162a] border border-[#252538] rounded-2xl text-gray-400 placeholder-gray-600 text-sm cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled
                  className="w-9 h-9 rounded-2xl bg-[#16162a] text-gray-600 flex items-center justify-center cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default MessagingSystem;
