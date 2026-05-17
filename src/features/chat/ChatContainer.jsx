import { useEffect, useRef, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useChatStore from '../../stores/ChatStore';
import useAuthStore from '../../stores/authStore';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

/**
 * ChatContainer - Reusable chat component that can be embedded in any dashboard
 * 
 * Props:
 * - className: Optional additional classes for the container
 * - height: Optional custom height (defaults to responsive heights)
 * - onRoomSelect: Optional callback when a room is selected
 * - initialRoomId: Optional room ID to select on mount
 * - showMobileBackButton: Whether to show back button on mobile (default: true)
 */
export default function ChatContainer({
  className = '',
  height = null,
  onRoomSelect = null,
  initialRoomId = null,
  showMobileBackButton = true,
}) {
  const location = useLocation();
  const authUser = useAuthStore((s) => s.user);
  const currentUserId = authUser?.userId || authUser?.id;

  const {
    chatRooms,
    messages,
    activeRoomId,
    isLoading,
    isMessagesLoading,
    typingUsers,
    connected,
    initSocket,
    disconnectSocket,
    getChatRooms,
    getMessages,
    sendMessage,
    joinRoom,
    joinCollaborationChat,
    leaveRoom,
    markRoomAsRead,
    emitMarkMessagesRead,
    emitTyping,
    emitStopTyping,
    setActiveRoom,
    loadOlderMessages,
    hasMoreMessages,
  } = useChatStore();

  const prevRoomRef = useRef(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Socket init + initial rooms fetch
  useEffect(() => {
    initSocket();
    getChatRooms();
    return () => disconnectSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle initialRoomId prop
  useEffect(() => {
    if (initialRoomId && initialRoomId !== activeRoomId) {
      handleSelectRoom(initialRoomId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRoomId]);

  // Deep-link support: ?room=<id> in URL (only if no initialRoomId prop)
  useEffect(() => {
    if (initialRoomId) return;
    const params = new URLSearchParams(location.search);
    const roomParam = params.get('room');
    if (roomParam && roomParam !== activeRoomId) {
      handleSelectRoom(roomParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, initialRoomId]);

  // Whenever activeRoomId changes: leave old room, join new, fetch messages, mark read
  useEffect(() => {
    const prev = prevRoomRef.current;

    if (prev && prev !== activeRoomId) {
      leaveRoom(prev);
    }

    if (activeRoomId) {
      joinRoom(activeRoomId);
      getMessages(activeRoomId);
      markRoomAsRead(activeRoomId);
      emitMarkMessagesRead(activeRoomId, 'all');

      const room = useChatStore.getState().chatRooms.find(
        (r) => String(r.id) === String(activeRoomId)
      );
      if (room?.collaborationId) {
        joinCollaborationChat(room.collaborationId);
      }
    }

    prevRoomRef.current = activeRoomId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoomId]);

  const handleSelectRoom = useCallback(
    (roomId) => {
      const id = String(roomId);
      setActiveRoom(id);
      setMobileShowChat(true);
      onRoomSelect?.(id);
    },
    [setActiveRoom, onRoomSelect]
  );

  const handleBack = useCallback(() => {
    setMobileShowChat(false);
  }, []);

  const handleSend = useCallback(
    (content) => {
      if (!activeRoomId || !content.trim()) return;
      sendMessage(activeRoomId, { content });
    },
    [activeRoomId, sendMessage]
  );

  const handleTyping = useCallback(
    (roomId) => {
      emitTyping(roomId);
    },
    [emitTyping]
  );

  const handleStopTyping = useCallback(
    (roomId) => {
      emitStopTyping(roomId);
    },
    [emitStopTyping]
  );

  const activeRoom = chatRooms.find((r) => String(r.id) === String(activeRoomId)) || null;

  const heightClasses = height || 'h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] lg:h-[calc(100vh-120px)]';

  return (
    <div className={`flex ${heightClasses} rounded-none sm:rounded-2xl border-0 sm:border border-[#745CB4]/20 overflow-hidden bg-linear-to-b from-[#1A112C]/80 to-[#0D0818]/80 backdrop-blur-md shadow-xl ${className}`}>
      {/* LEFT: Sidebar - hidden on mobile when chat is open */}
      <div className={`${mobileShowChat ? 'hidden' : 'flex'} md:flex w-full md:w-[320px] lg:w-[340px] flex-col shrink-0 min-h-0 h-full`}>
        <ChatSidebar
          rooms={chatRooms}
          activeRoomId={activeRoomId}
          isLoading={isLoading}
          connected={connected}
          onSelectRoom={handleSelectRoom}
        />
      </div>

      {/* RIGHT: Chat window - hidden on mobile when sidebar is shown */}
      <div className={`${mobileShowChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-h-0 min-w-0`}>
        <ChatWindow
          activeRoom={activeRoom}
          messages={messages}
          isMessagesLoading={isMessagesLoading}
          typingUsers={typingUsers}
          currentUserId={currentUserId}
          onSend={handleSend}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
          onBack={showMobileBackButton ? handleBack : null}
          hasMoreMessages={hasMoreMessages}
          onLoadOlder={() => loadOlderMessages(activeRoomId)}
        />
      </div>
    </div>
  );
}
