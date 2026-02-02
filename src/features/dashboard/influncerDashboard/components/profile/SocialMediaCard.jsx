import { Globe, Instagram, Youtube, CheckCircle } from 'lucide-react';

function SocialMediaCard({ profileData, isEditing, onSocialMediaChange }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-[#C1B6FD]" />
        Social Media Accounts
      </h3>
      <div className="space-y-4">
        {/* Instagram */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-400" />
              <span className="text-white font-semibold">Instagram</span>
              {profileData.socialMediaLinks?.instagram?.verified && (
                <CheckCircle className="w-4 h-4 text-blue-400" />
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={profileData.socialMediaLinks?.instagram?.username || ''}
                onChange={(e) => onSocialMediaChange('instagram', 'username', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="@username"
              />
              <input
                type="text"
                value={profileData.socialMediaLinks?.instagram?.followers || ''}
                onChange={(e) => onSocialMediaChange('instagram', 'followers', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="Followers (e.g., 284K)"
              />
            </div>
          ) : (
            <div>
              <p className="text-[#C1B6FD]">{profileData.socialMediaLinks?.instagram?.username || 'Not connected'}</p>
              {profileData.socialMediaLinks?.instagram?.followers && (
                <p className="text-sm text-gray-400">{profileData.socialMediaLinks.instagram.followers} followers</p>
              )}
            </div>
          )}
        </div>

        {/* YouTube */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-400" />
              <span className="text-white font-semibold">YouTube</span>
              {profileData.socialMediaLinks?.youtube?.verified && (
                <CheckCircle className="w-4 h-4 text-blue-400" />
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={profileData.socialMediaLinks?.youtube?.username || ''}
                onChange={(e) => onSocialMediaChange('youtube', 'username', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="Channel name"
              />
              <input
                type="text"
                value={profileData.socialMediaLinks?.youtube?.subscribers || ''}
                onChange={(e) => onSocialMediaChange('youtube', 'subscribers', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="Subscribers (e.g., 128K)"
              />
            </div>
          ) : (
            <div>
              <p className="text-[#C1B6FD]">{profileData.socialMediaLinks?.youtube?.username || 'Not connected'}</p>
              {profileData.socialMediaLinks?.youtube?.subscribers && (
                <p className="text-sm text-gray-400">{profileData.socialMediaLinks.youtube.subscribers} subscribers</p>
              )}
            </div>
          )}
        </div>

        {/* TikTok */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">TikTok</span>
            </div>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={profileData.socialMediaLinks?.tiktok?.username || ''}
                onChange={(e) => onSocialMediaChange('tiktok', 'username', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="@username"
              />
              <input
                type="text"
                value={profileData.socialMediaLinks?.tiktok?.followers || ''}
                onChange={(e) => onSocialMediaChange('tiktok', 'followers', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="Followers (e.g., 456K)"
              />
            </div>
          ) : (
            <div>
              <p className="text-[#C1B6FD]">{profileData.socialMediaLinks?.tiktok?.username || 'Not connected'}</p>
              {profileData.socialMediaLinks?.tiktok?.followers && (
                <p className="text-sm text-gray-400">{profileData.socialMediaLinks.tiktok.followers} followers</p>
              )}
            </div>
          )}
        </div>

        {/* Twitter */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">Twitter/X</span>
            </div>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={profileData.socialMediaLinks?.twitter?.username || ''}
                onChange={(e) => onSocialMediaChange('twitter', 'username', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="@username"
              />
              <input
                type="text"
                value={profileData.socialMediaLinks?.twitter?.followers || ''}
                onChange={(e) => onSocialMediaChange('twitter', 'followers', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="Followers (e.g., 92K)"
              />
            </div>
          ) : (
            <div>
              <p className="text-[#C1B6FD]">{profileData.socialMediaLinks?.twitter?.username || 'Not connected'}</p>
              {profileData.socialMediaLinks?.twitter?.followers && (
                <p className="text-sm text-gray-400">{profileData.socialMediaLinks.twitter.followers} followers</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SocialMediaCard;
