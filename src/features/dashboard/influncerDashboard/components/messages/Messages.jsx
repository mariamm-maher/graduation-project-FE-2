import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import useChatStore from '../../../../../stores/ChatStore';

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const { chatRooms, getChatRooms, getMessages, sendMessage, updateMessage, deleteMessage, markRoomAsRead, messages, isLoading, isMessagesLoading } = useChatStore();

  // Fetch chat rooms on mount
  useEffect(() => {
    getChatRooms();
  }, [getChatRooms]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      getMessages(selectedChat.id || selectedChat._id);
      markRoomAsRead(selectedChat.id || selectedChat._id);
    }
  }, [selectedChat, getMessages, markRoomAsRead]);

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

  // Use fetched messages with fallback to empty array
  const currentMessages = messages && messages.length > 0 ? messages : [];

  const handleSendMessage = async (text) => {
    if (!selectedChat) {
      toast.error('Please select a chat first');
      return;
    }
    const res = await sendMessage(selectedChat.id || selectedChat._id, { text });
    if (res?.success) {
      toast.success('Message sent');
    } else {
      toast.error(res?.error || 'Failed to send message');
    }
  };

  const activeConversation = conversations.find(c => c.id === selectedChat);

  return (
    <div className="h-[calc(100vh-6rem)] w-full max-w-[1600px] mx-auto bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex">
      <ChatSidebar 
        conversations={conversations}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        showMobile={!selectedChat}
      />
      
      <ChatWindow 
        conversation={activeConversation}
        messages={currentMessages}
        onSendMessage={handleSendMessage}
        onBack={() => setSelectedChat(null)}
        showMobile={!!selectedChat}
      />
    </div>
  );
}
