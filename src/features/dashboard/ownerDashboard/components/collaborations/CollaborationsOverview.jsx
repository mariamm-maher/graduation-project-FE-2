import { Users, MessageSquare, CheckCircle, Clock, Star, TrendingUp, Calendar, DollarSign, FileText, Inbox, Layout, Archive, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function CollaborationsOverview() {
  const collaborations = [
    {
      id: 1,
      influencer: 'Sarah Johnson',
      campaign: 'Summer Fashion Launch',
      status: 'active',
      progress: 75,
      unreadMessages: 3,
      deliverables: { completed: 3, total: 4 },
      payment: 'pending',
      rating: null,
      avatar: '👩',
      deadline: '2025-12-15',
      platforms: ['Instagram', 'TikTok']
    },
    {
      id: 2,
      influencer: 'Alex Martinez',
      campaign: 'Tech Product Review',
      status: 'active',
      progress: 45,
      unreadMessages: 0,
      deliverables: { completed: 2, total: 5 },
      payment: 'approved',
      rating: null,
      avatar: '👨',
      deadline: '2025-11-30',
      platforms: ['YouTube']
    },
    {
      id: 3,
      influencer: 'Emma Rodriguez',
      campaign: 'Holiday Collection',
      status: 'completed',
      progress: 100,
      unreadMessages: 0,
      deliverables: { completed: 6, total: 6 },
      payment: 'paid',
      rating: 4.8,
      avatar: '👩',
      deadline: '2025-11-20',
      platforms: ['Instagram', 'Pinterest']
    },
    {
      id: 4,
      influencer: 'Mike Chen',
      campaign: 'Fitness Challenge',
      status: 'pending_review',
      progress: 90,
      unreadMessages: 1,
      deliverables: { completed: 5, total: 5 },
      payment: 'processing',
      rating: null,
      avatar: '👨',
      deadline: '2025-11-25',
      platforms: ['TikTok', 'YouTube']
    }
  ];

  
  const activeCollabs = collaborations.filter(c => c.status === 'active').length;
  const completedCollabs = collaborations.filter(c => c.status === 'completed').length;
  const pendingReview = collaborations.filter(c => c.status === 'pending_review').length;
  const totalMessages = collaborations.reduce((sum, c) => sum + c.unreadMessages, 0);
  
  // Calculate completion rate
  const totalDeliverables = collaborations.reduce((sum, c) => sum + c.deliverables.total, 0);
  const completedDeliverables = collaborations.reduce((sum, c) => sum + c.deliverables.completed, 0);
  const completionRate = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0;
  
  // Calculate average rating
  const ratedCollabs = collaborations.filter(c => c.rating !== null);
  const avgRating = ratedCollabs.length > 0 
    ? (ratedCollabs.reduce((sum, c) => sum + c.rating, 0) / ratedCollabs.length).toFixed(1)
    : 'N/A';
  
  // Total budget (mock data)
  const totalBudget = 45000;
  const spentBudget = 28500;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Collaborations</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage influencer partnerships and track deliverables</p>
        </div>
        <Link to="/dashboard/owner/collaborations/messages" className="w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 relative w-full sm:w-auto">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            Messages
            {totalMessages > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold">
                {totalMessages}
              </span>
            )}
          </button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-indigo-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{collaborations.length}</p>
          <p className="text-sm text-gray-400">Total Collaborations</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-md border border-green-500/20 rounded-xl p-5 hover:border-green-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{activeCollabs}</p>
          <p className="text-sm text-gray-400">Active</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-md border border-blue-500/20 rounded-xl p-5 hover:border-blue-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{completedCollabs}</p>
          <p className="text-sm text-gray-400">Completed</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-md border border-amber-500/20 rounded-xl p-5 hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{completionRate}%</p>
          <p className="text-sm text-gray-400">Completion Rate</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-md border border-purple-500/20 rounded-xl p-5 hover:border-purple-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(spentBudget/1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-400">Budget Spent</p>
        </div>

        <div className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 backdrop-blur-md border border-rose-500/20 rounded-xl p-5 hover:border-rose-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-rose-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{avgRating}</p>
          <p className="text-sm text-gray-400">Avg Rating</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/dashboard/owner/collaborations/all"
            className="group bg-white/5 hover:bg-gradient-to-br hover:from-indigo-500/20 hover:to-indigo-600/10 border border-white/10 hover:border-indigo-400/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
          >
            <div className="w-12 h-12 bg-indigo-500/20 group-hover:bg-indigo-500/30 rounded-xl flex items-center justify-center mb-3 transition-all">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">All</h3>
            <p className="text-xs text-gray-400">View all collaborations</p>
            <div className="mt-4 flex items-center">
              <span className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all">
                <ChevronRight className="w-4 h-4 text-white" />
              </span>
            </div>
          </Link>

          <Link
            to="/dashboard/owner/collaborations/active"
            className="group bg-white/5 hover:bg-gradient-to-br hover:from-green-500/20 hover:to-green-600/10 border border-white/10 hover:border-green-400/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
          >
            <div className="w-12 h-12 bg-green-500/20 group-hover:bg-green-500/30 rounded-xl flex items-center justify-center mb-3 transition-all">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Active</h3>
            <p className="text-xs text-gray-400">Currently running</p>
            <div className="mt-4 flex items-center">
              <span className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all">
                <ChevronRight className="w-4 h-4 text-white" />
              </span>
            </div>
          </Link>

          <Link
            to="/dashboard/owner/collaborations/completed"
            className="group bg-white/5 hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-blue-600/10 border border-white/10 hover:border-blue-400/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <div className="w-12 h-12 bg-blue-500/20 group-hover:bg-blue-500/30 rounded-xl flex items-center justify-center mb-3 transition-all">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Completed</h3>
            <p className="text-xs text-gray-400">Finished projects</p>
            <div className="mt-4 flex items-center">
              <span className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all">
                <ChevronRight className="w-4 h-4 text-white" />
              </span>
            </div>
          </Link>

          <Link
            to="/dashboard/owner/collaborations/past"
            className="group bg-white/5 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-purple-600/10 border border-white/10 hover:border-purple-400/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="w-12 h-12 bg-purple-500/20 group-hover:bg-purple-500/30 rounded-xl flex items-center justify-center mb-3 transition-all">
              <Archive className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Past</h3>
            <p className="text-xs text-gray-400">Archived history</p>
            <div className="mt-4 flex items-center">
              <span className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all">
                <ChevronRight className="w-4 h-4 text-white" />
              </span>
            </div>
          </Link>

          <Link
            to="/dashboard/owner/collaborations/contracts"
            className="group bg-white/5 hover:bg-gradient-to-br hover:from-amber-500/20 hover:to-amber-600/10 border border-white/10 hover:border-amber-400/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20"
          >
            <div className="w-12 h-12 bg-amber-500/20 group-hover:bg-amber-500/30 rounded-xl flex items-center justify-center mb-3 transition-all">
              <FileText className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Contracts</h3>
            <p className="text-xs text-gray-400">Legal agreements</p>
            <div className="mt-4 flex items-center">
              <span className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all">
                <ChevronRight className="w-4 h-4 text-white" />
              </span>
            </div>
          </Link>

          <Link
            to="/dashboard/owner/collaborations/requests"
            className="group bg-white/5 hover:bg-gradient-to-br hover:from-rose-500/20 hover:to-rose-600/10 border border-white/10 hover:border-rose-400/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/20"
          >
            <div className="w-12 h-12 bg-rose-500/20 group-hover:bg-rose-500/30 rounded-xl flex items-center justify-center mb-3 transition-all">
              <Inbox className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Requests</h3>
            <p className="text-xs text-gray-400">Pending proposals</p>
            <div className="mt-4 flex items-center">
              <span className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all">
                <ChevronRight className="w-4 h-4 text-white" />
              </span>
            </div>
          </Link>

          <Link
            to="/dashboard/owner/collaborations/analytics"
            className="group bg-white/5 hover:bg-gradient-to-br hover:from-cyan-500/20 hover:to-cyan-600/10 border border-white/10 hover:border-cyan-400/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            <div className="w-12 h-12 bg-cyan-500/20 group-hover:bg-cyan-500/30 rounded-xl flex items-center justify-center mb-3 transition-all">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Analytics</h3>
            <p className="text-xs text-gray-400">Performance insights</p>
            <div className="mt-4 flex items-center">
              <span className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all">
                <ChevronRight className="w-4 h-4 text-white" />
              </span>
            </div>
          </Link>

          <Link
            to="/dashboard/owner/collaborations/chat-rooms"
            className="group bg-white/5 hover:bg-gradient-to-br hover:from-emerald-500/20 hover:to-emerald-600/10 border border-white/10 hover:border-emerald-400/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            <div className="w-12 h-12 bg-emerald-500/20 group-hover:bg-emerald-500/30 rounded-xl flex items-center justify-center mb-3 transition-all">
              <MessageSquare className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Chat Rooms</h3>
            <p className="text-xs text-gray-400">Communication hub</p>
            <div className="mt-4 flex items-center">
              <span className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all">
                <ChevronRight className="w-4 h-4 text-white" />
              </span>
            </div>
          </Link>

          <Link
            to="/dashboard/owner/collaborations/board"
            className="group bg-white/5 hover:bg-gradient-to-br hover:from-violet-500/20 hover:to-violet-600/10 border border-white/10 hover:border-violet-400/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20"
          >
            <div className="w-12 h-12 bg-violet-500/20 group-hover:bg-violet-500/30 rounded-xl flex items-center justify-center mb-3 transition-all">
              <Layout className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Board</h3>
            <p className="text-xs text-gray-400">Task management</p>
            <div className="mt-4 flex items-center">
              <span className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all">
                <ChevronRight className="w-4 h-4 text-white" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CollaborationsOverview;
