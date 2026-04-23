import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  ArrowLeft,
  Loader,
  CheckCircle,
  Mail,
  MapPin,
  Calendar,
  Share2,
  Target,
  Star,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Video,
  Send,
  User as UserIcon,
  Award,
  Link as LinkIcon,
  Users,
  Heart,
  Tags,
  List,
  Briefcase,
  Globe,
  Percent,
  Info,
  AtSign
} from 'lucide-react';

import useOwnerStore from '../../../../../../stores/ownerStore';

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-white/5 last:border-0 gap-1 sm:gap-4">
    <span className="text-sm text-gray-400 capitalize inline-flex items-center gap-2">
      {Icon ? <Icon className="w-4 h-4 text-[#745CB4]" /> : null}
      {label}
    </span>
    <span className="text-sm font-medium text-gray-200 sm:text-right wrap-break-word">{value}</span>
  </div>
);

function InfluencerProfile() {
  const { influencerId } = useParams();
  const routeInfluencerId = influencerId ? decodeURIComponent(String(influencerId)) : null;
  const navigate = useNavigate();
  const {
    currentInfluencer: rawInfluencer,
    influencerLoading,
    influencerError,
    fetchInfluencerById
  } = useOwnerStore();

  useEffect(() => {
    if (routeInfluencerId) fetchInfluencerById(routeInfluencerId);
  }, [fetchInfluencerById, routeInfluencerId]);

  const toPlatformIcon = (platformName) => {
    const p = (platformName || '').toLowerCase();
    if (p.includes('instagram')) return Instagram;
    if (p.includes('youtube')) return Youtube;
    if (p.includes('tiktok')) return Video;
    if (p.includes('facebook')) return Facebook;
    if (p.includes('twitter') || p === 'x') return Twitter;
    return Share2;
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    return String(value);
  };

  const renderList = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return 'N/A';
    return arr.join(', ');
  };

  if (influencerLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader className="w-10 h-10 text-[#745CB4] animate-spin" />
      </div>
    );
  }

  if (influencerError) {
    return (
      <div className="max-w-2xl mx-auto mt-12 mb-12">
        <div className="bg-[#1A1A24] border border-white/10 rounded-2xl p-10 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Notice</h3>
          <p className="text-sm text-gray-400 mb-8">{influencerError}</p>
          <button
            onClick={() => navigate('/dashboard/owner/influencers/discover')}
            className="px-6 py-2.5 bg-[#745CB4] hover:bg-[#5e3fae] text-white rounded-xl font-medium transition-colors"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  if (!rawInfluencer) {
    return (
      <div className="max-w-2xl mx-auto mt-12 mb-12">
        <div className="bg-[#1A1A24] border border-white/10 rounded-2xl p-10 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Influencer Not Found</h3>
          <p className="text-sm text-gray-400 mb-8">The influencer profile you are looking for does not exist.</p>
          <button
            onClick={() => navigate('/dashboard/owner/influencers/discover')}
            className="px-6 py-2.5 bg-[#745CB4] hover:bg-[#5e3fae] text-white rounded-xl font-medium transition-colors"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  const user = rawInfluencer?.user ?? {};
  const profile = rawInfluencer?.profile ?? {};
  const insights = rawInfluencer?.insights ?? {};
  const related = rawInfluencer?.related ?? {};

  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown';
  const platformIcon = toPlatformIcon(profile?.primaryPlatform);
  const receivedReviews = Array.isArray(related?.receivedReviews) ? related.receivedReviews : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-gray-300 tracking-wide uppercase">Profile Overview</span>
        </div>
        <button
          onClick={() => navigate(`/dashboard/owner/influencers/${user?.id || routeInfluencerId}/sendcollbrequest`)}
          className="px-5 py-2.5 bg-[#745CB4] hover:bg-[#5e3fae] text-white rounded-xl font-medium transition-colors shadow-lg shadow-[#745CB4]/20 flex items-center gap-2 text-sm"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send Request</span>
        </button>
      </div>


      {/* Hero Section */}
      <div className="rounded-xl p-6 sm:p-10 bg-(--color-background-primary) flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#745CB4]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="relative shrink-0 z-10">
          {profile?.image ? (
            <img
              src={profile.image}
              alt={fullName}
              className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#242430] shadow-xl"
            />
          ) : (
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-linear-to-tr from-[#745CB4] to-[#5e3fae] flex items-center justify-center font-bold text-white text-4xl border-4 border-[#242430] shadow-xl">
              {fullName.substring(0, 2).toUpperCase()}
            </div>
          )}
          {user?.status === 'ACTIVE' && (
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center border-[3px] border-[#1A1A24] shadow-sm" title="Active">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 w-full z-10">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">{fullName}</h1>
            {profile?.primaryPlatform && platformIcon && (() => {
              const Icon = platformIcon;
              return (
                <div className="p-2 bg-white/5 rounded-xl" title={profile.primaryPlatform}>
                  <Icon className="w-5 h-5 text-gray-300" />
                </div>
              );
            })()}
          </div>

          <p className="text-gray-400 text-sm md:text-base max-w-2xl mb-6 leading-relaxed">
            {profile?.bio ? profile.bio : <span className="italic text-gray-500">No biography provided.</span>}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl">
              <MapPin className="w-4 h-4 text-[#C1B6FD]" />
              <span>{formatValue(profile?.location)}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl">
              <Calendar className="w-4 h-4 text-[#C1B6FD]" />
              <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl">
              <Mail className="w-4 h-4 text-[#C1B6FD]" />
              <span>{formatValue(user?.email)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-(--color-background-secondary) rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-[#745CB4]" />
            <p className="text-[11px] font-medium uppercase tracking-widest text-(--color-text-tertiary)">Total Collaborations</p>
          </div>
          <h2 className="text-3xl font-bold text-(--color-text-primary)">{formatValue(insights?.totalCollaborations)}</h2>
        </div>

        <div className="bg-(--color-background-secondary) rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <UserIcon className="w-4 h-4 text-[#745CB4]" />
            <p className="text-[11px] font-medium uppercase tracking-widest text-(--color-text-tertiary)">Total Followers</p>
          </div>
          <h2 className="text-3xl font-bold text-(--color-text-primary)">{formatValue(profile?.followersCount)}</h2>
        </div>

        <div className="bg-(--color-background-secondary) rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[#745CB4]" />
            <p className="text-[11px] font-medium uppercase tracking-widest text-(--color-text-tertiary)">Engagement Rate</p>
          </div>
          <h2 className="text-3xl font-bold text-(--color-text-primary)">{formatValue(profile?.engagementRate)}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-12 flex flex-col gap-6">
          
          {/* Professional Profile */}
          <div className="rounded-xl p-6 sm:p-8 bg-(--color-background-primary)">
            <div className="flex items-center gap-3 mb-4">
              <UserIcon className="w-5 h-5 text-[#745CB4]" />
              <h2 className="flex-1 text-[11px] font-medium uppercase tracking-widest text-(--color-text-tertiary) pb-3 border-b border-(--color-border-tertiary) mb-4">Professional Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex flex-col">
                <DetailItem icon={Info} label="Bio" value={formatValue(profile?.bio)} />
                <DetailItem icon={MapPin} label="Location" value={formatValue(profile?.location)} />
                <DetailItem icon={Tags} label="Categories" value={renderList(profile?.categories)} />
                <DetailItem icon={List} label="Content Types" value={renderList(profile?.contentTypes)} />
              </div>
              <div className="flex flex-col">
                <DetailItem icon={Briefcase} label="Collaboration Types" value={renderList(profile?.collaborationTypes)} />
                <DetailItem icon={AtSign} label="Primary Platform" value={formatValue(profile?.primaryPlatform)} />
                <DetailItem icon={Users} label="Audience Age Range" value={formatValue(profile?.audienceAgeRange)} />
                <DetailItem icon={Globe} label="Audience Location" value={formatValue(profile?.audienceLocation)} />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                <LinkIcon className="w-4 h-4 text-gray-500" />
                Social Media Links
              </div>
              {profile?.socialMediaLinks && Object.keys(profile.socialMediaLinks).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(profile.socialMediaLinks).map(([key, value]) => (
                    <a 
                      key={key} 
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-gray-200 transition-colors flex items-center gap-2"
                    >
                      <span className="capitalize">{key}</span>
                      <Share2 className="w-3 h-3 text-gray-500" />
                    </a>
                  ))}
                </div>
              ) : (
                <span className="text-sm font-medium text-gray-500">N/A</span>
              )}
            </div>
          </div>

          {/* Audience Analytics */}
          <div className="rounded-xl p-6 sm:p-8 bg-(--color-background-primary)">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-[#745CB4]" />
              <h2 className="flex-1 text-[11px] font-medium uppercase tracking-widest text-(--color-text-tertiary) pb-3 border-b border-(--color-border-tertiary) mb-4">Audience Metrics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex flex-col">
                <DetailItem icon={Users} label="Followers Count" value={formatValue(profile?.followersCount)} />
                <DetailItem icon={Heart} label="Engagement Rate" value={formatValue(profile?.engagementRate)} />
                <DetailItem icon={Tags} label="Interests" value={renderList(profile?.interests)} />
              </div>
              <div className="flex flex-col">
                <DetailItem icon={Users} label="Audience Age" value={formatValue(profile?.audienceAgeRange)} />
                <DetailItem icon={UserIcon} label="Audience Gender" value={formatValue(profile?.audienceGender)} />
                <DetailItem icon={Globe} label="Audience Location" value={formatValue(profile?.audienceLocation)} />
              </div>
            </div>
     
          </div>
          
        </div>

        {/* Right Column intentionally removed to let raw profile data use full width */}
      </div>

      {/* Bottom Row: Reviews Log */}
      <div className="rounded-xl p-6 sm:p-8 bg-(--color-background-primary)">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h2 className="flex-1 text-[11px] font-medium uppercase tracking-widest text-(--color-text-tertiary) pb-3 border-b border-(--color-border-tertiary) mb-4">Reviews Log</h2>
        </div>
        {receivedReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-60">
            <Star className="w-10 h-10 mb-4 text-gray-600" />
            <p className="text-sm font-semibold text-gray-400">No reviews found</p>
            <p className="text-xs text-gray-500 mt-1 font-mono"></p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {receivedReviews.map((review, index) => (
              <div key={review?.id || index} className="text-xs text-gray-300 bg-[#242430] rounded-xl p-4 font-mono break-all whitespace-pre-wrap">
                {JSON.stringify(review, null, 2)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InfluencerProfile;