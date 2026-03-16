import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import useChatStore from '../../../../../../stores/ChatStore';
import useAuthStore from '../../../../../../stores/authStore';

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const location = useLocation();
  const authUser = useAuthStore((state) => state.user);
  const {
    chatRooms,
    getChatRooms,
    getMessages,
    sendMessage,
    markRoomAsRead,
    messages,
    isLoading: _isLoading,
    isMessagesLoading: _isMessagesLoading,
    initSocket,
    disconnectSocket,
    joinCollaborationChat,
    leaveRoom
  } = useChatStore();

  const currentUserId = authUser?.userId || authUser?.id;

  // Fetch chat rooms + init socket on mount
  useEffect(() => {
    initSocket();
    getChatRooms();
    return () => disconnectSocket();
  }, [getChatRooms, initSocket, disconnectSocket]);

  const roomFromQuery = new URLSearchParams(location.search).get('room');
  const effectiveSelectedChat = selectedChat || roomFromQuery;

  // Fetch messages when chat is selected
  useEffect(() => {
    if (effectiveSelectedChat) {
      getMessages(effectiveSelectedChat);
      markRoomAsRead(effectiveSelectedChat);

      const selectedRoom = (chatRooms || []).find((room) => String(room.id || room._id) === String(effectiveSelectedChat));
      if (selectedRoom?.collaborationId) {
        joinCollaborationChat(selectedRoom.collaborationId);
      }

      return () => {
        leaveRoom(effectiveSelectedChat);
      };
    }
  }, [effectiveSelectedChat, getMessages, markRoomAsRead, chatRooms, joinCollaborationChat, leaveRoom]);

  const formatTimestamp = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Use fetched chat rooms, fallback to mock data
  const conversations = chatRooms?.length > 0 ? chatRooms : [
    {
      id: 1,
      name: 'Nike Sportswear',
      avatar: 'NS',
      avatarColor: 'from-orange-500 to-red-600',
      lastMessage: 'Great! looking forward to the draft.',
      timestamp: '2m ago',
      unread: 1,
      online: true,
      campaign: 'Summer Collection 2024',
      active: true
    },
    {
      id: 2,
      name: 'TechGear Pro',
      avatar: 'TP',
      avatarColor: 'from-blue-500 to-cyan-600',
      lastMessage: 'Can you please sign the contract?',
      timestamp: '1h ago',
      unread: 0,
      online: false,
      campaign: 'Q1 Product Launch',
      active: true
    },
    {
      id: 3,
      name: 'Beauty & Co',
      avatar: 'BC',
      avatarColor: 'from-pink-500 to-rose-600',
      lastMessage: 'Payment has been processed.',
      timestamp: '1d ago',
      unread: 0,
      online: false,
      campaign: 'Skincare Routine',
      active: false
    }
  ];

  const normalizedConversations = conversations.map((room) => {
    const roomId = room.id || room._id;
    const otherParticipant = Array.isArray(room.participants)
      ? room.participants.find((p) => String(p.id || p.userId) !== String(currentUserId))
      : null;

    const displayName = room.name || otherParticipant?.name || otherParticipant?.userName || 'Chat';
    const initials = displayName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return {
      ...room,
      id: roomId,
      name: displayName,
      avatar: initials || 'CH',
      avatarColor: 'from-[#745CB4] to-[#C1B6FD]',
      lastMessage: room.lastMessage?.content || room.lastMessage || 'No messages yet',
      timestamp: formatTimestamp(room.lastMessage?.sentAt || room.updatedAt),
      unread: Number(room.unreadCount || 0),
      campaign: room?.collaborationId ? `Collaboration #${room.collaborationId}` : 'General chat',
      active: true,
      online: false
    };
  });

  // Use fetched messages with fallback to empty array
  const currentMessages = (messages || []).map((msg) => {
    const senderId = msg.senderId || msg?.sender?.id;
    const isMe = String(senderId) === String(currentUserId);
    return {
      id: msg.id || msg._id,
      text: msg.content || msg.text || '',
      timestamp: formatTimestamp(msg.sentAt || msg.createdAt),
      status: msg.status || 'sent',
      sender: isMe ? 'me' : 'other'
    };
  });

  const handleSendMessage = async (text) => {
    if (!selectedChat) {
      toast.error('Please select a chat first');
      return;
    }
    const res = await sendMessage(effectiveSelectedChat, { content: text });
    if (!res?.success) {
      toast.error(res?.error || 'Failed to send message');
    }
  };

  const activeConversation = normalizedConversations.find((c) => String(c.id) === String(effectiveSelectedChat));

  return (
    <div className="h-[calc(100vh-6rem)] w-full max-w-[1600px] mx-auto bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex">
      <ChatSidebar 
        conversations={normalizedConversations}
        selectedChat={effectiveSelectedChat}
        onSelectChat={setSelectedChat}
        showMobile={!effectiveSelectedChat}
      />
      
      <ChatWindow 
        conversation={activeConversation}
        messages={currentMessages}
        onSendMessage={handleSendMessage}
        onBack={() => setSelectedChat(null)}
        showMobile={!!effectiveSelectedChat}
      />
    </div>
  );
}
