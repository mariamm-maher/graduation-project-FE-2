import { useEffect, useRef, useState } from 'react';
import { Briefcase, TrendingUp } from 'lucide-react';

function ProfessionalDetailsCard({ profileData, isEditing, onInputChange, onArrayChange }) {
  const [platformOpen, setPlatformOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [engagementOpen, setEngagementOpen] = useState(false);
  const platformRef = useRef(null);
  const followersRef = useRef(null);
  const engagementRef = useRef(null);

  const platforms = ['instagram', 'youtube', 'tiktok', 'twitter', 'facebook'];
  const followerOptions = ['0–5K', '5K–10K', '10K–50K', '50K–100K', '100K–500K', '500K+'];
  const engagementOptions = [
    { value: '0-1', label: '0% – 1% (Low)' },
    { value: '1-2', label: '1% – 2% (Below average)' },
    { value: '2-5', label: '2% – 5% (Good)' },
    { value: '5-10', label: '5% – 10% (Very good)' },
    { value: '10+', label: '10%+ (Exceptional)' }
  ];
  const categoriesOptions = ['Beauty', 'Fashion', 'Food', 'Fitness', 'Travel', 'Technology', 'Gaming', 'Lifestyle', 'Education'];
  const contentTypesOptions = ['Post', 'Story', 'Reel', 'Short video', 'Long-form video', 'Live stream'];
  const collaborationTypesOptions = ['Sponsored Post', 'Product Review', 'Brand Ambassador', 'Affiliate Marketing', 'Event Appearance'];

  useEffect(() => {
    function handleOutsideClick(e) {
      if (platformRef.current && !platformRef.current.contains(e.target)) {
        setPlatformOpen(false);
      }
      if (followersRef.current && !followersRef.current.contains(e.target)) {
        setFollowersOpen(false);
      }
      if (engagementRef.current && !engagementRef.current.contains(e.target)) {
        setEngagementOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectPrimaryPlatform = (platform) => {
    if (onInputChange) onInputChange({ target: { name: 'primaryPlatform', value: platform } });
    setPlatformOpen(false);
  };

  const selectFollowersCount = (value) => {
    if (onInputChange) onInputChange({ target: { name: 'followersCount', value } });
    setFollowersOpen(false);
  };

  const selectEngagementRate = (value) => {
    if (onInputChange) onInputChange({ target: { name: 'engagementRate', value } });
    setEngagementOpen(false);
  };

  const getEngagementLabel = (val) => {
    if (!val) return null;
    const found = engagementOptions.find((o) => o.value === val);
    if (found) return found.label;
    // if val looks like a number, show as percentage
    if (!isNaN(Number(val))) return `${val}%`;
    return val;
  };

  const anyDropdownOpen = platformOpen || followersOpen || engagementOpen;

  return (
    <div className={`relative overflow-visible bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 ${anyDropdownOpen ? 'z-50' : 'z-10'}`}>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-[#C1B6FD]" />
        Professional Details
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Primary Platform</label>
          {isEditing ? (
            <div className={`relative ${platformOpen ? 'z-50' : 'z-10'}`} ref={platformRef}>
              <button
                type="button"
                onClick={() => setPlatformOpen((prev) => !prev)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-left focus:outline-none focus:border-[#C1B6FD]/50"
              >
                {profileData.primaryPlatform ? `${profileData.primaryPlatform.charAt(0).toUpperCase()}${profileData.primaryPlatform.slice(1)}` : 'Select platform'}
              </button>

              {platformOpen && (
                <div className="absolute top-full mt-2 w-full z-[100] bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                  {platforms.map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => selectPrimaryPlatform(platform)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                    >
                      {`${platform.charAt(0).toUpperCase()}${platform.slice(1)}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-white capitalize">{profileData.primaryPlatform || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Followers Count</label>
          {isEditing ? (
            <div className={`relative ${followersOpen ? 'z-50' : 'z-10'}`} ref={followersRef}>
              <button
                type="button"
                onClick={() => setFollowersOpen((prev) => !prev)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-left focus:outline-none focus:border-[#C1B6FD]/50"
              >
                {profileData.followersCount || 'Select followers range'}
              </button>

              {followersOpen && (
                <div className="absolute top-full mt-2 w-full z-[100] bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                  {followerOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectFollowersCount(option)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-white">{profileData.followersCount || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Categories</label>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              {categoriesOptions.map((cat) => {
                const selected = profileData.categories?.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      const current = profileData.categories || [];
                      let next;
                      if (current.includes(cat)) {
                        next = current.filter((c) => c !== cat);
                      } else {
                        next = [...current, cat];
                      }
                      if (onArrayChange) onArrayChange('categories', next.join(','));
                    }}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selected
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.categories?.length ? (
                profileData.categories.map((cat, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#745CB4]/20 text-[#C1B6FD] rounded-full text-sm">
                    {cat}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No categories set</span>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Content Types</label>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              {contentTypesOptions.map((ct) => {
                const selected = profileData.contentTypes?.includes(ct);
                return (
                  <button
                    key={ct}
                    type="button"
                    onClick={() => {
                      const current = profileData.contentTypes || [];
                      let next;
                      if (current.includes(ct)) {
                        next = current.filter((c) => c !== ct);
                      } else {
                        next = [...current, ct];
                      }
                      if (onArrayChange) onArrayChange('contentTypes', next.join(','));
                    }}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selected
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    {ct}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.contentTypes?.length ? (
                profileData.contentTypes.map((type, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/5 text-white rounded-full text-sm">
                    {type}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No content types set</span>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Collaboration Types</label>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              {collaborationTypesOptions.map((type) => {
                const selected = profileData.collaborationTypes?.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      const current = profileData.collaborationTypes || [];
                      let next;
                      if (current.includes(type)) {
                        next = current.filter((c) => c !== type);
                      } else {
                        next = [...current, type];
                      }
                      if (onArrayChange) onArrayChange('collaborationTypes', next.join(','));
                    }}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selected
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.collaborationTypes?.length ? (
                profileData.collaborationTypes.map((type, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                    {type}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No collaboration types set</span>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Engagement Rate</label>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className={`relative w-full ${engagementOpen ? 'z-50' : 'z-10'}`} ref={engagementRef}>
                <button
                  type="button"
                  onClick={() => setEngagementOpen((p) => !p)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-left focus:outline-none focus:border-[#C1B6FD]/50"
                >
                  {getEngagementLabel(profileData.engagementRate) || 'Select engagement range'}
                </button>

                {engagementOpen && (
                  <div className="absolute top-full mt-2 w-full z-[100] bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                    {engagementOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => selectEngagementRate(opt.value)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-white">{getEngagementLabel(profileData.engagementRate) || '0%'}</p>
              </div>
            )}
          </div>
        </div>


       
      </div>
    </div>
  );
}

export default ProfessionalDetailsCard;
