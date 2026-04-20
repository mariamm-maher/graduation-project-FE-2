import { Plus, Star, Zap, MapPin, Instagram, Youtube, Users, Heart, Video, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import useOwnerStore from '../../../../../../stores/ownerStore';

function InfluencerCard({ influencer }) {
  const { fetchInfluencerById } = useOwnerStore();

  const influencerId = influencer?.id ?? influencer?.userId;
  const categories = influencer?.categories?.length ? influencer.categories : ['General'];
  console.log('Influencer Card Data:', influencer);
  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'tiktok':
        return <Video className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 hover:border-[#C1B6FD]/50 hover:shadow-2xl hover:shadow-[#C1B6FD]/10 transition-all duration-300 group overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#C1B6FD]/10 via-transparent to-[#745CB4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

   

      <div className="relative z-10 flex flex-col lg:flex-row gap-6">
        {/* Left: Image + Basic Info */}
        <div className="flex items-start gap-4 lg:w-1/3">
          <img
            src={influencer.image}
            alt={influencer.name}
            className="w-20 h-20 rounded-xl object-cover shadow-lg ring-2 ring-white/10 group-hover:ring-[#C1B6FD]/50 group-hover:scale-105 transition-all duration-300 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#C1B6FD] transition-colors">{influencer.name}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map((category, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-white/10 border border-white/15 rounded-md text-xs text-gray-200"
                >
                  {category}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{influencer.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-white">{influencer.rating}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg">
                {getPlatformIcon(influencer.primaryPlatform)}
                <span className="text-xs font-semibold text-white">{influencer.primaryPlatform}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Stats & Details */}
        <div className="flex-1 lg:w-1/3">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#C1B6FD]" />
                <span className="text-xs text-gray-400">Followers</span>
              </div>
              <p className="text-lg font-bold text-white">{formatFollowers(influencer.followersCount)}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-[#C1B6FD]" />
                <span className="text-xs text-gray-400">Engagement</span>
              </div>
              <p className="text-lg font-bold text-[#C1B6FD]">{influencer.engagementRate}%</p>
            </div>
          </div>

          {/* Content Types */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Content Types</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {influencer.contentTypes.map((type, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white/10 border border-white/10 rounded-lg text-xs text-white font-medium">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Collaboration Types & Actions */}
        <div className="lg:w-1/3 flex flex-col">
          {/* Collaboration Types */}
          <div className="flex-1 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Collaboration Types</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {influencer.collaborationTypes.map((type, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-linear-to-r from-[#745CB4]/20 to-[#C1B6FD]/20 border border-[#C1B6FD]/30 rounded-lg text-xs text-white font-medium">
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link 
              to={`/dashboard/owner/influencers/${influencerId}/profile`}
              onClick={() => {
                if (influencerId) {
                  fetchInfluencerById(influencerId);
                }
              }}
              className="flex-1 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-sm text-white font-semibold hover:shadow-lg transition-all text-center"
            >
              View Profile
            </Link>
            <Link 
              to={`/dashboard/owner/influencers/${influencerId}/sendcollbrequest`}
              className="flex-1 px-5 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl text-sm font-bold hover:shadow-xl hover:shadow-[#C1B6FD]/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Collab Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfluencerCard;
