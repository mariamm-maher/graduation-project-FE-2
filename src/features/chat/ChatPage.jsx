import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useChatStore from '../../stores/ChatStore';
import useAuthStore from '../../stores/authStore';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

export default function ChatPage() {
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
  } = useChatStore();

  const prevRoomRef = useRef(null);

  // Socket init + initial rooms fetch
  useEffect(() => {
    initSocket();
    getChatRooms();
    return () => disconnectSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deep-link support: ?room=<id> in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomParam = params.get('room');
    if (roomParam && roomParam !== activeRoomId) {
      handleSelectRoom(roomParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

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
      setActiveRoom(String(roomId));
    },
    [setActiveRoom]
  );

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

  return (
    <div className="flex h-[calc(100vh-120px)] rounded-2xl border border-[#745CB4]/20 overflow-hidden bg-linear-to-b from-[#1A112C]/80 to-[#0D0818]/80 backdrop-blur-md shadow-xl">
      {/* LEFT: Sidebar */}
      <div className="w-full max-w-[320px] flex flex-col shrink-0">
        <ChatSidebar
          rooms={chatRooms}
          activeRoomId={activeRoomId}
          isLoading={isLoading}
          connected={connected}
          onSelectRoom={handleSelectRoom}
        />
      </div>

      {/* RIGHT: Chat window */}
      <ChatWindow
        activeRoom={activeRoom}
        messages={messages}
        isMessagesLoading={isMessagesLoading}
        typingUsers={typingUsers}
        currentUserId={currentUserId}
        onSend={handleSend}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
      />
    </div>
  );
}
