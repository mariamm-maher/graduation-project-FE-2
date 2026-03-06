import { Star, Users, Instagram, Youtube, Video, Zap, MapPin, Tag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

function ServiceCard({ service }) {
  const formatNumber = (n = 0) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return String(n);
  };

  const getPlatformIcon = (platform = '') => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'youtube':   return <Youtube   className="w-4 h-4" />;
      case 'tiktok':    return <Video     className="w-4 h-4" />;
      default:          return <Zap       className="w-4 h-4" />;
    }
  };

  const {
    id,
    title = 'Untitled Service',
    description = '',
    price = 0,
    currency = 'USD',
    deliveryDays = null,
    category = '',
    platform = '',
    influencer = {},
  } = service;

  const influencerName = influencer.name || `${influencer.firstName || ''} ${influencer.lastName || ''}`.trim() || 'Unknown';
  const influencerImage = influencer.image || influencer.avatar || null;
  const rating = influencer.rating || 0;
  const reviewCount = influencer.reviewCount || 0;
  const followersCount = influencer.followersCount || 0;
  const location = influencer.location || '';

  return (
    <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-[#C1B6FD]/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-[#C1B6FD]/10 transition-all duration-300 group flex flex-col gap-4 overflow-hidden">
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#C1B6FD]/5 via-transparent to-[#745CB4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top row – influencer */}
      <div className="relative z-10 flex items-center gap-3">
        {influencerImage ? (
          <img
            src={influencerImage}
            alt={influencerName}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-[#C1B6FD]/40 transition-all duration-300 shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#C1B6FD]/30 to-[#745CB4]/30 flex items-center justify-center shrink-0 text-white font-bold text-lg">
            {influencerName.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate group-hover:text-[#C1B6FD] transition-colors">{influencerName}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {location && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="w-3 h-3" /> {location}
              </span>
            )}
            {platform && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded-lg text-xs text-white">
                {getPlatformIcon(platform)} {platform}
              </span>
            )}
          </div>
        </div>
        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-white">{Number(rating).toFixed(1)}</span>
            {reviewCount > 0 && <span className="text-xs text-gray-400">({reviewCount})</span>}
          </div>
        )}
      </div>

      {/* Service info */}
      <div className="relative z-10 flex-1">
        <h3 className="text-white font-bold text-base mb-1.5 line-clamp-2 leading-snug">{title}</h3>
        {description && (
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Tags row */}
      <div className="relative z-10 flex flex-wrap gap-2">
        {category && (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-[#745CB4]/20 border border-[#745CB4]/30 rounded-full text-xs text-[#C1B6FD]">
            <Tag className="w-3 h-3" /> {category}
          </span>
        )}
        {followersCount > 0 && (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
            <Users className="w-3 h-3" /> {formatNumber(followersCount)} followers
          </span>
        )}
        {deliveryDays && (
          <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
            {deliveryDays}d delivery
          </span>
        )}
      </div>

      {/* Footer – price & actions */}
      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10">
        <div>
          <span className="text-xs text-gray-400">Starting at</span>
          <p className="text-lg font-bold text-white">
            {currency} {Number(price).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/owner/marketplace/services/${id}`}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm text-white transition-all duration-200"
          >
            <Eye className="w-4 h-4" /> View
          </Link>
          <Link
            to={`/dashboard/owner/marketplace/services/${id}/offer`}
            className="flex items-center gap-1.5 px-3 py-2 bg-linear-to-r from-[#C1B6FD] to-[#745CB4] hover:from-[#a99ef0] hover:to-[#5e4a9a] rounded-xl text-sm text-white font-semibold transition-all duration-200 shadow-lg shadow-[#745CB4]/20"
          >
            Send Offer
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
