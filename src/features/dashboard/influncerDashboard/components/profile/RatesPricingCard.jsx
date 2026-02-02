import { DollarSign } from 'lucide-react';

function RatesPricingCard({ profileData, isEditing, onRateChange }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-[#C1B6FD]" />
        Rates & Pricing
      </h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-white mb-2">Instagram</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs text-gray-400">Post</p>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.rates?.instagram?.post || ''}
                  onChange={(e) => onRateChange('instagram', 'post', e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                  placeholder="$0"
                />
              ) : (
                <p className="text-white font-semibold">{profileData.rates?.instagram?.post || '$0'}</p>
              )}
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs text-gray-400">Story</p>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.rates?.instagram?.story || ''}
                  onChange={(e) => onRateChange('instagram', 'story', e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                  placeholder="$0"
                />
              ) : (
                <p className="text-white font-semibold">{profileData.rates?.instagram?.story || '$0'}</p>
              )}
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs text-gray-400">Reel</p>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.rates?.instagram?.reel || ''}
                  onChange={(e) => onRateChange('instagram', 'reel', e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                  placeholder="$0"
                />
              ) : (
                <p className="text-white font-semibold">{profileData.rates?.instagram?.reel || '$0'}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-2">YouTube</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs text-gray-400">Video</p>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.rates?.youtube?.video || ''}
                  onChange={(e) => onRateChange('youtube', 'video', e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                  placeholder="$0"
                />
              ) : (
                <p className="text-white font-semibold">{profileData.rates?.youtube?.video || '$0'}</p>
              )}
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs text-gray-400">Short</p>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.rates?.youtube?.short || ''}
                  onChange={(e) => onRateChange('youtube', 'short', e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                  placeholder="$0"
                />
              ) : (
                <p className="text-white font-semibold">{profileData.rates?.youtube?.short || '$0'}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-2">TikTok</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs text-gray-400">Video</p>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.rates?.tiktok?.video || ''}
                  onChange={(e) => onRateChange('tiktok', 'video', e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                  placeholder="$0"
                />
              ) : (
                <p className="text-white font-semibold">{profileData.rates?.tiktok?.video || '$0'}</p>
              )}
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs text-gray-400">Series</p>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.rates?.tiktok?.series || ''}
                  onChange={(e) => onRateChange('tiktok', 'series', e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                  placeholder="$0"
                />
              ) : (
                <p className="text-white font-semibold">{profileData.rates?.tiktok?.series || '$0'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RatesPricingCard;
