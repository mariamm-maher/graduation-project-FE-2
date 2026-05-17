import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { FaTiktok, FaYoutube } from 'react-icons/fa';
import { formatDisplayHandle } from './connectedAccountsUtils';

const platformIcons = {
  instagram: Instagram,
  youtube: FaYoutube,
  google: FaYoutube,
  twitter: Twitter,
  facebook: Facebook,
  tiktok: FaTiktok,
};

const platformColors = {
  instagram: 'from-pink-500 to-purple-500',
  facebook: 'from-blue-600 to-blue-700',
  twitter: 'from-blue-400 to-blue-500',
  youtube: 'from-red-500 to-red-600',
  tiktok: 'from-black to-cyan-500',
};

function formatFollowers(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return value.toLocaleString();
  return String(value);
}

function formatEngagement(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    if (value > 0 && value <= 1) return `${(value * 100).toFixed(1)}%`;
    if (value > 1 && value <= 100) return `${value.toFixed(1)}%`;
    return value.toLocaleString();
  }
  return String(value);
}

function mainStatusLabel(connectionStatus) {
  if (connectionStatus === 'error') return 'Error';
  if (connectionStatus === 'syncing') return 'Syncing';
  return 'Connected';
}

function statusBadgeClass(connectionStatus) {
  if (connectionStatus === 'error') return 'bg-red-500/20 text-red-300 border-red-500/30';
  if (connectionStatus === 'syncing') return 'bg-amber-500/20 text-amber-200 border-amber-500/30 animate-pulse';
  return 'bg-green-500/20 text-green-400 border-green-500/25';
}

const ConnectedAccountCard = memo(
  function ConnectedAccountCard({ account, metrics, onDisconnect, onViewDetails }) {
    const [avatarFailed, setAvatarFailed] = useState(false);

    const platformKey = (account.platform || '').toLowerCase();
    const resolvedPlatform =
      platformKey === 'google' || platformKey === 'google_youtube' ? 'youtube' : platformKey;
    const Icon = platformIcons[resolvedPlatform] || Instagram;
    const color = platformColors[resolvedPlatform] || platformColors[platformKey] || 'from-gray-500 to-gray-600';

    useEffect(() => {
      setAvatarFailed(false);
    }, [account.profilePicture, account.id]);

    const handleText =
      formatDisplayHandle(
        account.username ||
          account.pageName ||
          account.handle ||
          account.channelTitle ||
          account.accountName
      ) || 'Connected account';

    const badgeVariant =
      account.connectionStatus === 'error'
        ? 'error'
        : account.connectionStatus === 'syncing'
          ? 'syncing'
          : 'connected';

    const pulseDot =
      badgeVariant === 'connected' ? (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      ) : null;

    const followersStr =
      metrics.phase === 'ready'
        ? formatFollowers(metrics.followers)
        : null;
    const engagementStr =
      metrics.phase === 'ready'
        ? formatEngagement(metrics.engagementRate)
        : null;

    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:border-[#C1B6FD]/35 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-[#745CB4]/10"
      >
        <div className="flex items-start gap-4 mb-5">
          <div
            className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-white/10 shadow-inner`}
          >
            {account.profilePicture && !avatarFailed ? (
              <img
                src={account.profilePicture}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <Icon
                className={
                  resolvedPlatform === 'tiktok' || resolvedPlatform === 'youtube'
                    ? 'w-8 h-8 text-white'
                    : 'w-7 h-7 text-white'
                }
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white leading-tight truncate" title={handleText}>
              {handleText}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium tracking-wide capitalize">
              {platformKey === 'google' || platformKey === 'google_youtube'
                ? 'YouTube'
                : account.platform}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold border ${statusBadgeClass(
                  badgeVariant
                )}`}
              >
                {pulseDot}
                {mainStatusLabel(account.connectionStatus)}
              </span>
              {account.isSimulated && (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-200 border border-amber-500/30 rounded-lg text-xs font-semibold">
                  Simulated
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <p className="text-xs text-gray-400 mb-1">Followers</p>
            {metrics.phase === 'loading' ? (
              <div className="h-7 w-20 rounded-md bg-white/10 animate-pulse" />
            ) : metrics.phase === 'error' ? (
              <p className="text-sm text-red-300/90">Unable to load</p>
            ) : metrics.phase === 'ready' && followersStr != null ? (
              <p className="text-base font-bold text-white">{followersStr}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">No analytics available yet</p>
            )}
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <p className="text-xs text-gray-400 mb-1">Engagement rate</p>
            {metrics.phase === 'loading' ? (
              <div className="h-7 w-16 rounded-md bg-white/10 animate-pulse" />
            ) : metrics.phase === 'error' ? (
              <p className="text-sm text-red-300/90">Unable to load</p>
            ) : metrics.phase === 'ready' && engagementStr != null ? (
              <p className="text-base font-bold text-[#C1B6FD]">{engagementStr}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">No analytics available yet</p>
            )}
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <p className="text-xs text-gray-400 mb-1">Account status</p>
            <p className="text-sm font-semibold text-green-400">
              {account.connectionStatus === 'error'
                ? 'Needs attention'
                : account.connectionStatus === 'syncing'
                  ? 'Syncing…'
                  : 'Active'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={onViewDetails}
            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/90 font-medium transition-colors"
          >
            View detailed analytics
          </button>
          <button
            type="button"
            onClick={() => onDisconnect(account)}
            className="w-full sm:w-auto px-4 py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 rounded-lg text-sm text-red-300 font-medium transition-colors"
          >
            Disconnect
          </button>
        </div>
      </motion.article>
    );
  },
  (prev, next) =>
    prev.account.id === next.account.id &&
    prev.account.username === next.account.username &&
    prev.account.handle === next.account.handle &&
    prev.account.channelTitle === next.account.channelTitle &&
    prev.account.pageName === next.account.pageName &&
    prev.account.profilePicture === next.account.profilePicture &&
    prev.account.platform === next.account.platform &&
    prev.account.connectionStatus === next.account.connectionStatus &&
    prev.account.isSimulated === next.account.isSimulated &&
    prev.metrics.phase === next.metrics.phase &&
    prev.metrics.followers === next.metrics.followers &&
    prev.metrics.engagementRate === next.metrics.engagementRate
);

export default ConnectedAccountCard;
