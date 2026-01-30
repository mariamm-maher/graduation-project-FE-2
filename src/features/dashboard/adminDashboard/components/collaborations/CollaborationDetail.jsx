import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Users, Calendar, CheckCircle, DollarSign, MessageSquare, Star, FileText } from 'lucide-react';
import { mockCollaborations } from '../adminData';

function CollaborationDetail() {
  const { id } = useParams();
  const collab = mockCollaborations.find(c => c.id === Number(id));

  if (!collab) {
    return (
      <div className="text-center py-12 text-gray-400">
        Collaboration not found. <Link to="/dashboard/admin/collaborations" className="text-[#C1B6FD] hover:underline">Back to Collaborations</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/dashboard/admin/collaborations" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Collaborations
      </Link>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">{collab.campaign}</h1>
        <p className="text-gray-400 text-sm mb-6">{collab.notes}</p>

        {/* Who with who - Owner & Influencer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-white/10">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Owner (Brand)
            </h3>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="font-semibold text-white">{collab.owner}</p>
              <p className="text-sm text-gray-400">{collab.ownerEmail}</p>
              <Link to={`/dashboard/admin/accounts/${collab.ownerId}`} className="text-xs text-[#C1B6FD] hover:underline mt-2 inline-block">View account</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Influencer
            </h3>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="font-semibold text-white">{collab.influencer}</p>
              <p className="text-sm text-gray-400">{collab.influencerEmail}</p>
              <Link to={`/dashboard/admin/accounts/${collab.influencerId}`} className="text-xs text-[#C1B6FD] hover:underline mt-2 inline-block">View account</Link>
            </div>
          </div>
        </div>

        {/* Status & progress */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">Status</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              collab.status === 'active' ? 'bg-green-500/20 text-green-400' :
              collab.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {collab.status.replace('_', ' ')}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Progress</p>
            <p className="font-semibold text-white">{collab.progress}%</p>
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD]" style={{ width: `${collab.progress}%` }} />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Deliverables</p>
            <p className="font-semibold text-white flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {collab.deliverables.completed} / {collab.deliverables.total}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Payment</p>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
              collab.payment === 'paid' ? 'bg-green-500/20 text-green-400' :
              collab.payment === 'approved' ? 'bg-blue-500/20 text-blue-400' :
              collab.payment === 'processing' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              <DollarSign className="w-3 h-3" /> {collab.payment}
            </span>
          </div>
        </div>

        {/* Dates & platforms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <Calendar className="w-5 h-5 text-[#C1B6FD]" />
            <div>
              <p className="text-xs text-gray-400">Started</p>
              <p className="font-medium text-white">{collab.startedAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <Calendar className="w-5 h-5 text-[#C1B6FD]" />
            <div>
              <p className="text-xs text-gray-400">Deadline</p>
              <p className="font-medium text-white">{collab.deadline}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-2">Platforms</p>
          <div className="flex flex-wrap gap-2">
            {collab.platforms.map((p) => (
              <span key={p} className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-gray-300 border border-white/10">{p}</span>
            ))}
          </div>
        </div>

        {collab.rating && (
          <div className="flex items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-white">Rating: {collab.rating}</span>
            <span className="text-gray-400 text-sm">/ 5</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
          <Link to={`/dashboard/admin/collaborations/${collab.id}/messages`} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl text-sm font-medium transition-all">
            <MessageSquare className="w-4 h-4" /> Messages
            {collab.unreadMessages > 0 && (
              <span className="px-1.5 py-0.5 bg-red-500 rounded text-xs font-bold text-white">{collab.unreadMessages}</span>
            )}
          </Link>
          <Link to={`/dashboard/admin/collaborations/${collab.id}/workspace`} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all">
            <FileText className="w-4 h-4" /> Workspace
          </Link>
          {collab.status === 'pending_review' && (
            <Link to={`/dashboard/admin/collaborations/${collab.id}/review`} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#745CB4] hover:bg-[#5D459D] text-white rounded-xl text-sm font-medium transition-all">
              <Star className="w-4 h-4" /> Review & Rate
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollaborationDetail;
