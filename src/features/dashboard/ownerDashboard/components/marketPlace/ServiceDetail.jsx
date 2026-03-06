import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Users, MapPin, Instagram, Youtube, Video, Zap, Tag, Clock, CheckCircle, Loader, AlertCircle, Send } from 'lucide-react';
import useOwnerStore from '../../../../../stores/ownerStore';

const getPlatformIcon = (platform = '') => {
  switch (platform.toLowerCase()) {
    case 'instagram': return <Instagram className="w-4 h-4" />;
    case 'youtube':   return <Youtube   className="w-4 h-4" />;
    case 'tiktok':    return <Video     className="w-4 h-4" />;
    default:          return <Zap       className="w-4 h-4" />;
  }
};

const formatNumber = (n = 0) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
};

function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { serviceDetail, marketplaceLoading, marketplaceError, fetchServiceDetail } = useOwnerStore();

  useEffect(() => {
    if (serviceId) fetchServiceDetail(serviceId);
  }, [serviceId, fetchServiceDetail]);

  if (marketplaceLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-10 h-10 text-[#C1B6FD] animate-spin" />
      </div>
    );
  }

  if (marketplaceError || !serviceDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-300 text-center">{marketplaceError || 'Service not found.'}</p>
        <button onClick={() => navigate(-1)} className="text-[#C1B6FD] hover:underline text-sm">Go back</button>
      </div>
    );
  }

  const {
    id,
    title = 'Untitled Service',
    description = '',
    price = 0,
    currency = 'USD',
    deliveryDays,
    category = '',
    platform = '',
    deliverables = [],
    influencer = {},
  } = serviceDetail;

  const influencerName = influencer.name || `${influencer.firstName || ''} ${influencer.lastName || ''}`.trim() || 'Unknown';
  const influencerImage = influencer.image || influencer.avatar || null;
  const rating = influencer.rating || 0;
  const reviewCount = influencer.reviewCount || 0;
  const followersCount = influencer.followersCount || 0;
  const engagementRate = influencer.engagementRate || 0;
  const location = influencer.location || '';
  const bio = influencer.bio || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
          <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Service Details</h1>
          <p className="text-sm text-gray-400 mt-0.5">Review this service before sending an offer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Service info ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Service card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {category && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-[#745CB4]/20 border border-[#745CB4]/30 rounded-full text-xs text-[#C1B6FD]">
                  <Tag className="w-3 h-3" /> {category}
                </span>
              )}
              {platform && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full text-xs text-white">
                  {getPlatformIcon(platform)} {platform}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white leading-snug">{title}</h2>
            {description && <p className="text-gray-300 leading-relaxed text-sm">{description}</p>}

            {/* Deliverables */}
            {deliverables.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">What's included</h4>
                <ul className="space-y-2">
                  {deliverables.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-[#C1B6FD] mt-0.5 shrink-0" />
                      <span>{typeof d === 'string' ? d : d.label || d.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: influencer profile + CTA ── */}
        <div className="space-y-4">
          {/* Influencer card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              {influencerImage ? (
                <img src={influencerImage} alt={influencerName} className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/10 shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#C1B6FD]/30 to-[#745CB4]/30 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {influencerName.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-white font-bold">{influencerName}</p>
                {location && (
                  <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3" /> {location}
                  </span>
                )}
              </div>
            </div>

            {bio && <p className="text-gray-400 text-sm leading-relaxed">{bio}</p>}

            <div className="grid grid-cols-2 gap-3">
              {rating > 0 && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-bold">{Number(rating).toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-400">{reviewCount} reviews</p>
                </div>
              )}
              {followersCount > 0 && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-4 h-4 text-[#C1B6FD]" />
                    <span className="text-white font-bold">{formatNumber(followersCount)}</span>
                  </div>
                  <p className="text-xs text-gray-400">Followers</p>
                </div>
              )}
              {engagementRate > 0 && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center col-span-2">
                  <span className="text-white font-bold">{Number(engagementRate).toFixed(1)}%</span>
                  <p className="text-xs text-gray-400">Engagement rate</p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing + CTA */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Price</span>
              <span className="text-white font-bold text-xl">{currency} {Number(price).toLocaleString()}</span>
            </div>
            {deliveryDays && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Delivery</span>
                <span className="flex items-center gap-1 text-white text-sm">
                  <Clock className="w-4 h-4 text-[#C1B6FD]" /> {deliveryDays} days
                </span>
              </div>
            )}
            <Link
              to={`/dashboard/owner/marketplace/services/${id}/offer`}
              className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-[#C1B6FD] to-[#745CB4] hover:from-[#a99ef0] hover:to-[#5e4a9a] rounded-xl text-white font-semibold transition-all duration-200 shadow-lg shadow-[#745CB4]/20"
            >
              <Send className="w-4 h-4" /> Send Offer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
