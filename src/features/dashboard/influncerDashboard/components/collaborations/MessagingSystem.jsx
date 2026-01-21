import { useState, useRef, useEffect } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Image, File, Smile, Play, ChevronRight, Mic, Plus } from 'lucide-react';

function MessagingSystem() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState('');
  const [showChatList, setShowChatList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const conversations = [
    {
      id: 1,
      influencer: 'Sarah Johnson',
      avatar: 'SJ',
      avatarColor: 'from-violet-500 to-purple-600',
      lastMessage: 'The content is ready for review',
      timestamp: '2m ago',
      unread: 2,
      online: true,
      campaign: 'Summer Collection',
      isTyping: false,
      isPinned: true
    },
    {
      id: 2,
      influencer: 'Alex Martinez',
      avatar: 'AM',
      avatarColor: 'from-blue-500 to-cyan-600',
      lastMessage: 'Can we schedule a call tomorrow?',
      timestamp: '15m ago',
      unread: 0,
      online: false,
      campaign: 'Tech Review Campaign',
      isTyping: false,
      isPinned: false
    },
    {
      id: 3,
      influencer: 'Emma Rodriguez',
      avatar: 'ER',
      avatarColor: 'from-pink-500 to-rose-600',
      lastMessage: 'Perfect, I\'ll get started on that',
      timestamp: '1h ago',
      unread: 0,
      online: true,
      campaign: 'Holiday Special',
      isTyping: false,
      isPinned: false
    },
    {
      id: 4,
      influencer: 'Mike Chen',
      avatar: 'MC',
      avatarColor: 'from-emerald-500 to-teal-600',
      lastMessage: 'Uploaded final deliverables',
      timestamp: '3h ago',
      unread: 0,
      online: false,
      campaign: 'Fitness Series',
      isTyping: false,
      isPinned: false
    },
    {
      id: 5,
      influencer: 'Jessica Taylor',
      avatar: 'JT',
      avatarColor: 'from-amber-500 to-orange-600',
      lastMessage: 'Thanks for the quick response!',
      timestamp: '5h ago',
      unread: 0,
      online: false,
      campaign: 'Beauty Launch',
      isTyping: false,
      isPinned: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'influencer',
      text: 'Hi! Just wanted to confirm the posting schedule for this week.',
      timestamp: '10:42 AM',
      type: 'text',
      date: 'Today'
    },
    {
      id: 2,
      sender: 'brand',
      text: 'Hey Sarah! Yes, we have posts scheduled for Wed, Fri, and Sunday.',
      timestamp: '10:45 AM',
      type: 'text'
    },
    {
      id: 3,
      sender: 'brand',
      text: 'I\'ll send over the final graphics by end of day.',
      timestamp: '10:45 AM',
      type: 'text'
    },
    {
      id: 4,
      sender: 'influencer',
      text: 'Great! Also, I wanted to check on the product samples - have they shipped yet?',
      timestamp: '10:48 AM',
      type: 'text'
    },
    {
      id: 5,
      sender: 'brand',
      text: 'summer_collection_preview.jpg',
      timestamp: '10:52 AM',
      type: 'image',
      imageUrl: null
    },
    {
      id: 6,
      sender: 'brand',
      text: 'They shipped yesterday! You should receive them by Thursday. Here\'s a preview of what\'s coming.',
      timestamp: '10:52 AM',
      type: 'text'
    },
    {
      id: 7,
      sender: 'influencer',
      text: 'Perfect timing! That gives me the weekend to create the content.',
      timestamp: '10:55 AM',
      type: 'text'
    },
    {
      id: 8,
      sender: 'influencer',
      text: 'voice_note.mp3',
      timestamp: '11:02 AM',
      type: 'audio',
      duration: '0:23',
      isPlaying: false
    },
    {
      id: 9,
      sender: 'brand',
      text: 'Sounds good! Let me know if you need anything else.',
      timestamp: '11:05 AM',
      type: 'text'
    },
    {
      id: 10,
      sender: 'influencer',
      text: 'The content is ready for review',
      timestamp: '2:15 PM',
      type: 'text',
      date: 'Just now'
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showAttachMenu && !e.target.closest('.attach-menu')) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAttachMenu]);

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.influencer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.campaign.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-hidden rounded-3xl">
      {/* Conversations List */}
      <div className={`${showChatList ? 'w-full lg:w-80' : 'w-0 lg:w-0'} border-r border-[#1e1e2e] flex flex-col transition-all duration-300 overflow-hidden shrink-0 rounded-3xl`}>
        {showChatList && (
          <>
        {/* Header */}
        <div className="p-4 border-b border-[#1e1e2e]">
          <h2 className="text-lg font-semibold text-white mb-3">Messages</h2>
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

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
              <Search className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm text-center">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={`px-4 py-3 cursor-pointer transition-colors relative ${
                selectedChat === conv.id ? 'bg-[#16162a]' : 'hover:bg-[#13131f]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className={`w-11 h-11 rounded-full bg-linear-to-br ${conv.avatarColor} flex items-center justify-center text-sm font-semibold text-white`}>
                    {conv.avatar}
                  </div>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0f0f1e] rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white text-sm">{conv.influencer}</h3>
                    <span className="text-xs text-gray-500">{conv.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-400 truncate flex-1">
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1.5 bg-[#745CB4] rounded-full flex items-center justify-center text-[10px] font-semibold text-white">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
          </>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a16] rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1e1e2e] flex items-center justify-between bg-[#0f0f1e] shrink-0">
          <div className="flex items-center gap-3">
            {!showChatList && (
              <button 
                onClick={() => setShowChatList(true)} 
                className="w-9 h-9 rounded-2xl hover:bg-[#16162a] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            )}
            <div className="relative">
              <div className={`w-10 h-10 rounded-full bg-linear-to-br ${selectedConversation?.avatarColor} flex items-center justify-center text-sm font-semibold text-white`}>
                {selectedConversation?.avatar}
              </div>
              {selectedConversation?.online && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0f0f1e] rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">{selectedConversation?.influencer}</h3>
              <p className="text-xs text-gray-500">
                {selectedConversation?.online ? 'Active now' : 'Offline'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="w-9 h-9 rounded-2xl hover:bg-[#16162a] flex items-center justify-center transition-colors">
              <Phone className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-9 h-9 rounded-2xl hover:bg-[#16162a] flex items-center justify-center transition-colors">
              <Video className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-9 h-9 rounded-2xl hover:bg-[#16162a] flex items-center justify-center transition-colors">
              <Search className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-9 h-9 rounded-2xl hover:bg-[#16162a] flex items-center justify-center transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar min-h-0">
          {messages.map((msg, index) => {
            const showDateLabel = msg.date && (index === 0 || messages[index - 1].date !== msg.date);
            return (
              <div key={msg.id}>
                {showDateLabel && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs text-gray-500 bg-[#13131f] px-3 py-1 rounded-full">
                      {msg.date}
                    </span>
                  </div>
                )}
                <div className="flex gap-2.5 group">
                  {msg.sender === 'influencer' && (
                    <div className={`w-8 h-8 rounded-full bg-linear-to-br ${selectedConversation?.avatarColor} flex items-center justify-center text-xs font-semibold text-white shrink-0`}>
                      {selectedConversation?.avatar}
                    </div>
                  )}
                  
                  <div className={`flex-1 ${msg.sender === 'brand' ? 'flex justify-end' : ''}`}>
                    <div className={`max-w-[70%] ${msg.sender === 'brand' ? 'ml-auto' : ''}`}>
                      {msg.type === 'text' ? (
                        <div>
                          <div
                            className={`px-3.5 py-2 rounded-3xl ${
                              msg.sender === 'brand'
                                ? 'bg-[#745CB4] text-white rounded-br-xl'
                                : 'bg-[#16162a] text-gray-200 rounded-tl-xl'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                          </div>
                          <div className={`flex items-center gap-1.5 mt-1 px-1 ${msg.sender === 'brand' ? 'justify-end' : ''}`}>
                            <span className="text-[11px] text-gray-600">{msg.timestamp}</span>
                          </div>
                        </div>
                      ) : msg.type === 'image' ? (
                        <div>
                          <div className="bg-[#16162a] rounded-3xl rounded-tl-xl overflow-hidden border border-[#252538]">
                            <div className="w-full sm:w-72 h-44 bg-linear-to-br from-[#1a1a2e] to-[#13131f] flex items-center justify-center">
                              <Image className="w-10 h-10 text-gray-600" />
                            </div>
                            <div className="px-3 py-2 border-t border-[#252538]">
                              <p className="text-xs text-gray-400">{msg.text}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 px-1">
                            <span className="text-[11px] text-gray-600">{msg.timestamp}</span>
                          </div>
                        </div>
                      ) : msg.type === 'audio' ? (
                        <div>
                          <div className="bg-[#16162a] rounded-3xl rounded-tl-xl px-3 py-2.5 border border-[#252538] min-w-[200px] sm:min-w-60">
                            <div className="flex items-center gap-2.5">
                              <button className="w-8 h-8 rounded-full bg-[#745CB4] hover:bg-[#8a6dc9] flex items-center justify-center transition-colors shrink-0">
                                <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                              </button>
                              <div className="flex-1 h-6 flex items-center gap-0.5">
                                {[...Array(25)].map((_, i) => (
                                  <div 
                                    key={i} 
                                    className="flex-1 bg-[#745CB4] rounded-full"
                                    style={{ height: `${20 + Math.random() * 80}%` }}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-400 font-medium">{msg.duration}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 px-1">
                            <span className="text-[11px] text-gray-600">{msg.timestamp}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-5 py-4 border-t border-[#1e1e2e] bg-[#0f0f1e] shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <div className="relative attach-menu">
              <button 
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="w-9 h-9 rounded-2xl hover:bg-[#16162a] flex items-center justify-center transition-colors shrink-0"
              >
                <Plus className={`w-5 h-5 text-gray-400 transition-transform ${showAttachMenu ? 'rotate-45' : ''}`} />
              </button>
              {showAttachMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-[#16162a] border border-[#252538] rounded-2xl shadow-xl overflow-hidden">
                  <button type="button" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#1a1a2e] transition-colors w-full text-left">
                    <Image className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Image</span>
                  </button>
                  <button type="button" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#1a1a2e] transition-colors w-full text-left">
                    <File className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">File</span>
                  </button>
                  <button type="button" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#1a1a2e] transition-colors w-full text-left">
                    <Mic className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-gray-300">Voice</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 bg-[#16162a] rounded-2xl border border-[#252538] focus-within:border-[#745CB4] transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-4 py-2.5 bg-transparent text-gray-200 placeholder-gray-500 text-sm focus:outline-none"
              />
            </div>

            <button 
              type="button"
              className="w-9 h-9 rounded-2xl hover:bg-[#16162a] flex items-center justify-center transition-colors shrink-0"
            >
              <Smile className="w-5 h-5 text-gray-400" />
            </button>

            <button
              type="submit"
              disabled={!message.trim()}
              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                message.trim() 
                  ? 'bg-[#745CB4] hover:bg-[#8a6dc9] text-white' 
                  : 'bg-[#16162a] text-gray-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>



      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e1e2e;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2a2a3e;
        }
      `}</style>
    </div>
  );
}

export default MessagingSystem;
