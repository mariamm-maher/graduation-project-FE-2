import { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  
  // Mock Data
  const conversations = [
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

  // Mock messages for currently selected chat
  const [currentMessages, setCurrentMessages] = useState([
    {
      id: 1,
      sender: 'brand',
      text: 'Hi James, welcome to the campaign! We are excited to work with you.',
      timestamp: '2:30 PM',
      status: 'read'
    },
    {
      id: 2,
      sender: 'me',
      text: 'Thanks! I am really excited about this opportunity too. I have some ideas for the content.',
      timestamp: '2:35 PM',
      status: 'read'
    },
    {
      id: 3,
      sender: 'brand',
      text: 'That sounds great. Would you be able to share a rough concept by Friday?',
      timestamp: '2:40 PM',
      status: 'read'
    },
    {
      id: 4,
      sender: 'me',
      text: 'Absolutely! I will put together a mood board and some script ideas.',
      timestamp: '3:00 PM',
      status: 'read',
      attachment: { name: 'moodboard_v1.pdf', size: '2.4 MB' }
    },
    {
      id: 5,
      sender: 'brand',
      text: 'Great! looking forward to the draft.',
      timestamp: '10:00 AM',
      status: 'read'
    }
  ]);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setCurrentMessages([...currentMessages, newMessage]);
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
