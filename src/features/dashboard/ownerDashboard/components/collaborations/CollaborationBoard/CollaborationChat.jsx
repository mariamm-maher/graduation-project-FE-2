import { MessageSquare, Send, Paperclip, Image, Smile, Phone, Video, MoreVertical } from 'lucide-react';
import { useState } from 'react';

function CollaborationChat({ collaboration }) {
  const [message, setMessage] = useState('');
  
  const messages = [
    {
      id: 1,
      sender: 'owner',
      senderName: 'You',
      text: 'Hi Sarah! The product samples are ready to ship. Can you confirm your address?',
      time: '10:30 AM',
      read: true
    },
    {
      id: 2,
      sender: 'influencer',
      senderName: 'Sarah Johnson',
      text: 'Perfect! Yes, shipping address is the same. Looking forward to creating content!',
      time: '10:45 AM',
      read: true
    },
    {
      id: 3,
      sender: 'influencer',
      senderName: 'Sarah Johnson',
      text: 'Quick question - do you prefer Instagram Reels or static posts for the launch?',
      time: '11:02 AM',
      read: true
    },
    {
      id: 4,
      sender: 'owner',
      senderName: 'You',
      text: 'Let\'s do a mix! 2 Reels and 3 static posts would be great. I\'ll share the brand guidelines shortly.',
      time: '11:15 AM',
      read: true
    },
    {
      id: 5,
      sender: 'owner',
      senderName: 'You',
      text: 'Also attached the creative brief with mood board 📎',
      time: '11:16 AM',
      read: false,
      attachment: true
    }
  ];

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
            {collaboration?.influencerName?.charAt(0) || 'I'}
          </div>
          <div>
            <h3 className="font-semibold text-white">{collaboration?.influencerName || 'Influencer'}</h3>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
            <Phone className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
            <Video className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'owner' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] ${msg.sender === 'owner' ? 'order-2' : 'order-1'}`}>
              {msg.sender !== 'owner' && (
                <p className="text-xs text-gray-400 mb-1 ml-2">{msg.senderName}</p>
              )}
              <div className={`rounded-2xl px-4 py-2 ${
                msg.sender === 'owner' 
                  ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-br-md' 
                  : 'bg-white/10 text-white rounded-bl-md'
              }`}>
                <p className="text-sm">{msg.text}</p>
                {msg.attachment && (
                  <div className="mt-2 p-2 bg-black/20 rounded-lg flex items-center gap-2 text-xs">
                    <Paperclip className="w-3 h-3" />
                    <span>creative-brief.pdf</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-2">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
            <Paperclip className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
            <Image className="w-4 h-4 text-gray-400" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
            <Smile className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            onClick={handleSend}
            className="px-4 h-9 rounded-lg bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollaborationChat;
