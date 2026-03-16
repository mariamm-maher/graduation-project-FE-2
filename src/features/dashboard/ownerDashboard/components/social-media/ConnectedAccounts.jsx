import { useState, useEffect } from 'react';
import { Instagram, Youtube, Twitter, Facebook, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import useSocialMediaStore from '../../../../../stores/SocialMediaStore';

function ConnectedAccounts() {
  const { accounts, getAccounts, getStats, connectAccount, disconnectAccount, isLoading } = useSocialMediaStore();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [statsLoading, setStatsLoading] = useState({});

  useEffect(() => {
    getAccounts();
  }, [getAccounts]);

  const handleConnectAccount = async (e) => {
    e.preventDefault();
    if (!selectedPlatform || !authCode) {
      toast.error('Please select a platform and provide auth code');
      return;
    }

    const res = await connectAccount(selectedPlatform, { authCode });
    if (res?.success) {
      toast.success(`${selectedPlatform} account connected!`);
      setShowConnectModal(false);
      setSelectedPlatform('');
      setAuthCode('');
      await getAccounts();
    } else {
      toast.error(res?.error || 'Failed to connect account');
    }
  };

  const handleDisconnect = async (platform) => {
    const res = await disconnectAccount(platform);
    if (res?.success) {
      toast.success(`${platform} account disconnected`);
      await getAccounts();
    } else {
      toast.error(res?.error || 'Failed to disconnect');
    }
  };

  const handleViewAnalytics = async (platform) => {
    setStatsLoading(prev => ({ ...prev, [platform]: true }));
    const res = await getStats(platform);
    setStatsLoading(prev => ({ ...prev, [platform]: false }));
    if (res?.success) {
      toast.info(`Analytics loaded for ${platform}`);
    } else {
      toast.error('Failed to load analytics');
    }
  };

  const platformIcons = {
    Instagram,
    YouTube: Youtube,
    Twitter,
    Facebook,
    TikTok: Instagram
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Connected Accounts</h1>
          <p className="text-gray-400">Manage your social media platform connections</p>
        </div>
        <button
          onClick={() => setShowConnectModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Connect New Account
        </button>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-xl">
          <div className="bg-gradient-to-br from-[#1a0933] to-[#2d1b4e] border border-white/20 rounded-xl p-6 max-w-md w-full m-4">
            <h2 className="text-xl font-bold text-white mb-4">Connect Social Account</h2>
            <form onSubmit={handleConnectAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                >
                  <option value="">Select a platform</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Authorization Code</label>
                <input
                  type="text"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  placeholder="Enter auth code from platform"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Connecting...' : 'Connect'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accounts Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader className="w-6 h-6 text-[#C1B6FD] animate-spin" />
        </div>
      ) : accounts?.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
          <p className="text-gray-400">No connected accounts yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {accounts.map((account) => {
            const Icon = platformIcons[account.platform] || Instagram;
            const platformColors = {
              Instagram: 'from-pink-500 to-purple-500',
              Facebook: 'from-blue-600 to-blue-700',
              Twitter: 'from-blue-400 to-blue-500',
              YouTube: 'from-red-500 to-red-600',
              TikTok: 'from-black to-cyan-500'
            };
            const color = platformColors[account.platform] || 'from-gray-500 to-gray-600';

            return (
              <div
                key={account._id || account.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{account.platform}</h3>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">
                        Connected
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{account.username || account.accountName || 'Connected'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Followers</p>
                    <p className="text-base font-bold text-white">{account.followers || '—'}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Engagement</p>
                    <p className="text-base font-bold text-[#C1B6FD]">{account.engagement || '—'}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <p className="text-xs font-semibold text-green-400">Active</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewAnalytics(account.platform)}
                    disabled={statsLoading[account.platform]}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {statsLoading[account.platform] ? (
                      <>
                        <Loader className="w-3 h-3 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Analytics'
                    )}
                  </button>
                  <button
                    onClick={() => handleDisconnect(account.platform)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm text-red-400 font-medium transition-all"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Account Health */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Account Health</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium mb-1">Connected Accounts</p>
              <p className="text-sm text-gray-400">{accounts?.length || 0} accounts are properly connected</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium mb-1">API Connection Status</p>
              <p className="text-sm text-gray-400">All accounts are synced and accessible</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectedAccounts;
