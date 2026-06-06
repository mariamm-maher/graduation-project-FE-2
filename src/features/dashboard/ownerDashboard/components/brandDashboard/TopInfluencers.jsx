import { Link } from 'react-router-dom';
import { Star, Calendar, DollarSign } from 'lucide-react';

function TopInfluencers({ influencers, loading }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 60) return 'bg-[#C1B6FD]/20 text-[#C1B6FD] border-[#C1B6FD]/30';
    if (score >= 40) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4"> Influencers</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-white/10 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4"> Influencers</h3>
      
      <div className="space-y-4">
        {influencers?.length > 0 ? (
          influencers.map((influencer) => (
            <div
              key={influencer.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center overflow-hidden">
                  {influencer.image || influencer.profileImage ? (
                    <img
                      src={influencer.image || influencer.profileImage}
                      alt={influencer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {influencer.name?.charAt(0) || 'I'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{influencer.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{influencer.lastCollaboration || influencer.lastActive || 'Recently'}</span>
                    </div>
                    {influencer.totalSpent && (
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <DollarSign className="w-3 h-3" />
                        <span>${influencer.totalSpent?.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-gray-400 text-xs">{influencer.campaigns || 0} collabs</p>
                  <p className="text-gray-400 text-xs">{influencer.reach?.toLocaleString() || 0} reach</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getScoreColor(influencer.score || influencer.engagementRate)}`}>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{influencer.score || influencer.engagementRate || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">No collaboration history</p>
        )}
      </div>
    </div>
  );
}

export default TopInfluencers;
