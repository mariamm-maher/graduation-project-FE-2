import { Search, MessageCircle, Users, User, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatRooms() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock data - ChatRoom entity from ERD
  const chatRooms = [
    {
      id: 1,
      collaborationId: 1,
      campaignName: 'Summer Fashion Launch',
      type: 'one_to_one',
      name: null,
      participants: [
        { userId: 1, userName: 'You (Owner)', role: 'owner' },
        { userId: 2, userName: 'Sarah Johnson', role: 'influencer' }
      ],
      lastMessage: 'The content draft looks great! Ready to proceed.',
      lastMessageTime: '2026-02-01T14:30:00',
      unreadCount: 0,
      createdAt: '2026-01-15T09:00:00'
    },
    {
      id: 2,
      collaborationId: 5,
      campaignName: 'Tech Product Launch Q1',
      type: 'one_to_one',
      name: null,
      participants: [
        { userId: 1, userName: 'You (Owner)', role: 'owner' },
        { userId: 6, userName: 'Alex Rivera', role: 'influencer' }
      ],
      lastMessage: 'When should I post the product review video?',
      lastMessageTime: '2026-02-01T11:15:00',
      unreadCount: 2,
      createdAt: '2026-01-20T10:30:00'
    },
    {
      id: 3,
      collaborationId: null,
      campaignName: null,
      type: 'group',
      name: 'Campaign Coordinators',
      participants: [
        { userId: 1, userName: 'You (Owner)', role: 'owner' },
        { userId: 2, userName: 'Sarah Johnson', role: 'influencer' },
        { userId: 6, userName: 'Alex Rivera', role: 'influencer' },
        { userId: 3, userName: 'Mike Chen', role: 'influencer' }
      ],
      lastMessage: 'Team meeting scheduled for tomorrow at 2 PM',
      lastMessageTime: '2026-01-31T16:45:00',
      unreadCount: 5,
      createdAt: '2026-01-10T08:00:00'
    }
  ];

  const filteredChatRooms = chatRooms.filter(room =>
    searchQuery === '' ||
    room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.campaignName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.participants.some(p => p.userName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-purple-400" />
            Chat Rooms
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Communication channels for collaborations ({filteredChatRooms.length})
          </p>
        </div>
        <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Rooms</p>
          <p className="text-2xl font-bold text-white">{chatRooms.length}</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Unread Messages</p>
          <p className="text-2xl font-bold text-purple-400">
            {chatRooms.reduce((sum, room) => sum + room.unreadCount, 0)}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Active Today</p>
          <p className="text-2xl font-bold text-white">
            {chatRooms.filter(room => {
              const lastMsg = new Date(room.lastMessageTime);
              const today = new Date();
              return lastMsg.toDateString() === today.toDateString();
            }).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chat rooms..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
        />
      </div>

      {/* Chat Rooms List */}
      {filteredChatRooms.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Chat Rooms</h3>
          <p className="text-gray-400 mb-6">Start a conversation with your collaborators</p>
          <button className="px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
            Create New Chat
          </button>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10">
          {filteredChatRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => navigate(`/dashboard/owner/collaborations/messages?room=${room.id}`)}
              className="p-5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Avatar/Icon */}
                <div className="relative flex-shrink-0">
                  {room.type === 'one_to_one' ? (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {room.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{room.unreadCount}</span>
                    </div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white truncate">
                        {room.type === 'group' ? room.name : 
                          room.participants.find(p => p.role !== 'owner')?.userName || 'Chat'}
                      </h3>
                      {room.campaignName && (
                        <p className="text-sm text-purple-400">{room.campaignName}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {getTimeAgo(room.lastMessageTime)}
                    </span>
                  </div>

                  {/* Participants (for group chats) */}
                  {room.type === 'group' && (
                    <div className="flex items-center gap-1 mb-2">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {room.participants.length} members
                      </span>
                    </div>
                  )}

                  {/* Last Message */}
                  <p className={`text-sm truncate ${room.unreadCount > 0 ? 'text-white font-semibold' : 'text-gray-400'}`}>
                    {room.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatRooms;
