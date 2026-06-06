import { FaInstagram, FaTiktok, FaYoutube, FaFacebook } from 'react-icons/fa';
import { TrendingUp, TrendingDown } from 'lucide-react';

function TopChannels({ channels, loading }) {
  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: FaInstagram,
      tiktok: FaTiktok,
      youtube: FaYoutube,
      facebook: FaFacebook,
    };
    const Icon = icons[platform?.toLowerCase()] || FaInstagram;
    return <Icon className="w-5 h-5" />;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: 'text-pink-400',
      tiktok: 'text-cyan-400',
      youtube: 'text-red-400',
      facebook: 'text-blue-400',
    };
    return colors[platform?.toLowerCase()] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Channels</h3>
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
      <h3 className="text-lg font-semibold text-white mb-4">Top Channels</h3>
      
      <div className="space-y-4">
        {channels?.length > 0 ? (
          channels.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center ${getPlatformColor(channel.platform)}`}>
                  {getPlatformIcon(channel.platform)}
                </div>
                <div>
                  <p className="text-white font-medium">{channel.accountName || channel.platform}</p>
                  <p className="text-gray-400 text-xs capitalize">{channel.platform}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">{channel.reach?.toLocaleString() || 0} reach</p>
                <p className="text-gray-400 text-xs">{channel.engagementRate?.toFixed(1) || 0}% eng.</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">No channel data</p>
        )}
      </div>
    </div>
  );
}

export default TopChannels;
