import { useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion'; 

export default function ChatWindow({ conversation, messages, onSendMessage, onBack, showMobile }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, conversation]);

  if (!conversation) {
    // Empty State
    return (
      <div className={`
        flex-1 flex flex-col items-center justify-center p-8 text-center bg-transparent
        ${showMobile ? 'hidden' : 'flex'}
      `}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-gradient-to-br from-[#745CB4]/20 to-[#C1B6FD]/20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-[#C1B6FD]/10 border border-white/5"
        >
          <MessageCircle className="w-10 h-10 text-[#C1B6FD]" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-3">Your Messages</h3>
        <p className="text-gray-400 max-w-sm leading-relaxed">
          Select a conversation to start collaborating with brands. Discuss campaigns, share drafts, and stay organized.
        </p>
      </div>
    );
  }

  // Active Chat State
  return (
    <div className={`
      flex-1 bg-transparent flex flex-col relative transition-all overflow-hidden
      ${showMobile ? 'flex absolute inset-0 z-50 bg-[#1a0933]' : 'hidden md:flex'}
    `}>
      <ChatHeader 
        conversation={conversation} 
        onBack={onBack}
        onOpenDetails={() => console.log('Open details')}
      />

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20"
        style={{ backgroundImage: 'radial-gradient(circle at center, rgba(116, 92, 180, 0.03) 0%, transparent 70%)' }}
      >
        {/* Date Divider (example) */}
        <div className="flex justify-center mb-6">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={msg.sender === 'me'}
            avatarColor={conversation.avatarColor}
            avatar={conversation.avatar}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
}
