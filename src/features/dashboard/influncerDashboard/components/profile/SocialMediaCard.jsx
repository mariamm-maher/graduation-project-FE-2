import { Globe, Instagram, Youtube, CheckCircle, Copy } from 'lucide-react';
import { useState } from 'react';

function SocialMediaCard({ profileData, isEditing, onSocialMediaChange }) {
  const [copied, setCopied] = useState(null);

  const getPlatformData = (platform) => {
    const data = profileData.socialMediaLinks?.[platform];
    if (typeof data === 'string') {
      return { link: data, verified: false };
    }
    return {
      link: data?.link || '',
      verified: Boolean(data?.verified)
    };
  };

  const formatDisplayUrl = (url, maxLen = 50) => {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace('www.', '');
      const path = parsed.pathname === '/' ? '' : parsed.pathname;
      const display = host + path + (parsed.search || '') + (parsed.hash || '');
      if (display.length <= maxLen) return display;
      return display.slice(0, maxLen - 1) + '…';
    } catch (e) {
      // fallback: truncate raw string
      return url.length <= maxLen ? url : url.slice(0, maxLen - 1) + '…';
    }
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text || '');
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch (err) {
      // ignore
    }
  };
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
              {getPlatformData('instagram').verified && (
                <CheckCircle className="w-4 h-4 text-blue-400" />
              )}
            </div>
          </div>
          {isEditing ? (
            <div>
              <input
                type="url"
                value={getPlatformData('instagram').link}
                onChange={(e) => onSocialMediaChange('instagram', 'link', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="https://instagram.com/yourprofile"
              />
            </div>
          ) : (
            <div>
              {getPlatformData('instagram').link ? (
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={getPlatformData('instagram').link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C1B6FD] underline truncate"
                    title={getPlatformData('instagram').link}
                    style={{ maxWidth: '100%' }}
                  >
                    {formatDisplayUrl(getPlatformData('instagram').link)}
                  </a>
                  <button
                    onClick={() => copyToClipboard(getPlatformData('instagram').link, 'instagram')}
                    className="text-white/60 hover:text-white ml-2"
                    aria-label="Copy Instagram URL"
                    title="Copy full URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copied === 'instagram' && <span className="text-sm text-green-400 ml-2">Copied</span>}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Not connected</p>
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
              {getPlatformData('youtube').verified && (
                <CheckCircle className="w-4 h-4 text-blue-400" />
              )}
            </div>
          </div>
          {isEditing ? (
            <div>
              <input
                type="url"
                value={getPlatformData('youtube').link}
                onChange={(e) => onSocialMediaChange('youtube', 'link', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="https://youtube.com/channel/yourchannel"
              />
            </div>
          ) : (
            <div>
              {getPlatformData('youtube').link ? (
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={getPlatformData('youtube').link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C1B6FD] underline truncate"
                    title={getPlatformData('youtube').link}
                    style={{ maxWidth: '100%' }}
                  >
                    {formatDisplayUrl(getPlatformData('youtube').link)}
                  </a>
                  <button
                    onClick={() => copyToClipboard(getPlatformData('youtube').link, 'youtube')}
                    className="text-white/60 hover:text-white ml-2"
                    aria-label="Copy YouTube URL"
                    title="Copy full URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copied === 'youtube' && <span className="text-sm text-green-400 ml-2">Copied</span>}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Not connected</p>
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
            <div>
              <input
                type="url"
                value={getPlatformData('tiktok').link}
                onChange={(e) => onSocialMediaChange('tiktok', 'link', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="https://tiktok.com/@yourprofile"
              />
            </div>
          ) : (
            <div>
              {getPlatformData('tiktok').link ? (
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={getPlatformData('tiktok').link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C1B6FD] underline truncate"
                    title={getPlatformData('tiktok').link}
                    style={{ maxWidth: '100%' }}
                  >
                    {formatDisplayUrl(getPlatformData('tiktok').link)}
                  </a>
                  <button
                    onClick={() => copyToClipboard(getPlatformData('tiktok').link, 'tiktok')}
                    className="text-white/60 hover:text-white ml-2"
                    aria-label="Copy TikTok URL"
                    title="Copy full URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copied === 'tiktok' && <span className="text-sm text-green-400 ml-2">Copied</span>}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Not connected</p>
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
            <div>
              <input
                type="url"
                value={getPlatformData('twitter').link}
                onChange={(e) => onSocialMediaChange('twitter', 'link', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="https://twitter.com/yourhandle"
              />
            </div>
          ) : (
            <div>
              {getPlatformData('twitter').link ? (
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={getPlatformData('twitter').link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C1B6FD] underline truncate"
                    title={getPlatformData('twitter').link}
                    style={{ maxWidth: '100%' }}
                  >
                    {formatDisplayUrl(getPlatformData('twitter').link)}
                  </a>
                  <button
                    onClick={() => copyToClipboard(getPlatformData('twitter').link, 'twitter')}
                    className="text-white/60 hover:text-white ml-2"
                    aria-label="Copy Twitter URL"
                    title="Copy full URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copied === 'twitter' && <span className="text-sm text-green-400 ml-2">Copied</span>}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Not connected</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SocialMediaCard;
