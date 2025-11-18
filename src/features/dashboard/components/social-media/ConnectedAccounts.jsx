import { Instagram, Youtube, Twitter, Facebook } from 'lucide-react';

const accounts = [
  {
    id: 1,
    platform: 'Instagram',
    icon: Instagram,
    username: '@adsphere_official',
    followers: '2.4M',
    engagement: '8.2%',
    status: 'connected',
    lastPost: '2 hours ago',
    color: 'from-pink-500 to-purple-500',
  },
  {
    id: 2,
    platform: 'TikTok',
    icon: Instagram,
    username: '@adsphere',
    followers: '1.8M',
    engagement: '12.5%',
    status: 'connected',
    lastPost: '5 hours ago',
    color: 'from-black to-cyan-500',
  },
  {
    id: 3,
    platform: 'YouTube',
    icon: Youtube,
    username: 'AdSphere Agency',
    followers: '890K',
    engagement: '6.8%',
    status: 'connected',
    lastPost: '1 day ago',
    color: 'from-red-500 to-red-600',
  },
  {
    id: 4,
    platform: 'Twitter',
    icon: Twitter,
    username: '@adsphere',
    followers: '1.2M',
    engagement: '5.4%',
    status: 'connected',
    lastPost: '3 hours ago',
    color: 'from-blue-400 to-blue-500',
  },
  {
    id: 5,
    platform: 'Facebook',
    icon: Facebook,
    username: 'AdSphere Marketing',
    followers: '950K',
    engagement: '4.2%',
    status: 'connected',
    lastPost: '6 hours ago',
    color: 'from-blue-600 to-blue-700',
  },
];

function ConnectedAccounts() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Connected Accounts</h1>
          <p className="text-gray-400">Manage your social media platform connections</p>
        </div>
        <button className="px-6 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          Connect New Account
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {accounts.map((account) => {
          const Icon = account.icon;
          return (
            <div
              key={account.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${account.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{account.platform}</h3>
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">
                      Connected
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{account.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Followers</p>
                  <p className="text-base font-bold text-white">{account.followers}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Engagement</p>
                  <p className="text-base font-bold text-[#C1B6FD]">{account.engagement}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Last Post</p>
                  <p className="text-xs font-semibold text-white">{account.lastPost}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all">
                  View Analytics
                </button>
                <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all">
                  Settings
                </button>
                <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm text-red-400 font-medium transition-all">
                  Disconnect
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Health */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Account Health</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium mb-1">API Connection Status</p>
              <p className="text-sm text-gray-400">All accounts are properly connected</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">Healthy</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium mb-1">Post Permissions</p>
              <p className="text-sm text-gray-400">Full access enabled for all platforms</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium mb-1">Analytics Access</p>
              <p className="text-sm text-gray-400">Real-time data sync enabled</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectedAccounts;
