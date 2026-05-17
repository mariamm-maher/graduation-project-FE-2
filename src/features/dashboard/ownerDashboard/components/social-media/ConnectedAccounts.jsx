// import { useCallback, useEffect, useMemo, useState } from 'react';
// import axios from 'axios';
// import { Instagram, Youtube, Twitter, Facebook, Loader, CheckCircle2 } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { useLocation, useNavigate } from 'react-router-dom';
// import useSocialMediaStore from '../../../../../stores/SocialMediaStore';

// function ConnectedAccounts() {
//   const { accounts, getAccounts, getStats, disconnectAccount, isLoading, error } = useSocialMediaStore();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [showConnectModal, setShowConnectModal] = useState(false);
//   const [selectedPlatform, setSelectedPlatform] = useState('');
//   const [isRedirecting, setIsRedirecting] = useState(false);

//   // Dropdown states
//   const [platformQuery, setPlatformQuery] = useState('');
//   const [isPlatformOpen, setIsPlatformOpen] = useState(false);

//   const platformOptions = useMemo(
//     () => [
//       { value: 'Instagram', label: 'Instagram', icon: Instagram },
//       { value: 'Facebook', label: 'Facebook', icon: Facebook },
//       { value: 'Twitter', label: 'Twitter', icon: Twitter },
//       { value: 'YouTube', label: 'YouTube', icon: Youtube },
//       { value: 'TikTok', label: 'TikTok', icon: Instagram },
//     ],
//     []
//   );

//   const filteredPlatforms = platformOptions.filter((opt) =>
//     opt.label.toLowerCase().includes(platformQuery.trim().toLowerCase())
//   );
//   const selectedPlatformOption = platformOptions.find((p) => p.value === selectedPlatform);
//   const [statsLoading, setStatsLoading] = useState({});
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
//   const BACKEND_ROOT_URL = API_BASE_URL.replace(/\/api\/?$/, '');

//   useEffect(() => {
//     // Remove Facebook's legacy #_=_ fragment from URL
//     if (window.location.hash === '#_=_') {
//       window.history.replaceState(
//         null,
//         document.title,
//         window.location.pathname + window.location.search
//       );
//     }

//     const params = new URLSearchParams(location.search);
//     const success =
//       params.get('connected') === 'true' ||
//       params.get('success') === 'true';
//     const oauthError = params.get('error');
//     const simulated = params.get('simulated') === 'true';

//     if (success) {
//       toast.success(simulated ? 'Channel connected successfully (simulation mode)' : 'Social account connected successfully');
//       getAccounts();
//       navigate(location.pathname, { replace: true });
//       return;
//     }

//     if (oauthError) {
//       toast.error(oauthError === 'meta_failed' ? 'Meta connection failed. Please try again.' : 'Failed to connect social account. Please try again.');
//     }

//     getAccounts();

//     if (oauthError) {
//       navigate(location.pathname, { replace: true });
//     }
//   }, [getAccounts, location.pathname, location.search, navigate]);

//   const handleConnectAccount = useCallback(
//     async (e) => {
//       e.preventDefault();
//       if (!selectedPlatform) {
//         toast.error('Please select a platform to connect');
//         return;
//       }

//       setIsRedirecting(true);
//       setShowConnectModal(false);
//       const normalized = selectedPlatform.toLowerCase();
//       let oauthEndpoint = '';

//       if (['facebook', 'instagram'].includes(normalized)) {
//         oauthEndpoint = 'meta';
//       } else if (normalized === 'tiktok') {
//         oauthEndpoint = 'tiktok';
//       } else if (normalized === 'youtube') {
//         oauthEndpoint = 'youtube';
//       } else {
//         setIsRedirecting(false);
//         toast.error(`${selectedPlatform} OAuth is not configured yet.`);
//         return;
//       }

//       try {
//         if (oauthEndpoint === 'meta' || oauthEndpoint === 'youtube') {
//           const token = localStorage.getItem('accessToken');
//           if (!token) throw new Error('Access token not found. Please login again.');

//           const endpointMap = {
//             meta: `${BACKEND_ROOT_URL}/auth/meta-url`,
//             youtube: `${BACKEND_ROOT_URL}/auth/youtube-url`,
//           };

//           const response = await axios.get(endpointMap[oauthEndpoint], {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const oauthUrl = response?.data?.data?.url;
//           if (!oauthUrl) throw new Error(`${selectedPlatform} OAuth URL not returned`);
//           window.location.href = oauthUrl;
//           return;
//         }

//         if (oauthEndpoint === 'tiktok') {
//           const token = localStorage.getItem('accessToken');
//           if (!token) {
//             setIsRedirecting(false);
//             toast.error('Session expired. Please login again.');
//             return;
//           }
//           try {
//             const payload = JSON.parse(atob(token.split('.')[1]));
//             const userId = payload.id || payload.userId || payload.sub;
//             if (!userId) throw new Error('Could not read user from token');
//             window.location.href = `${BACKEND_ROOT_URL}/auth/tiktok?userId=${userId}`;
//           } catch {
//             setIsRedirecting(false);
//             toast.error('Failed to start TikTok connection. Please login again.');
//           }
//           return;
//         }
//       } catch (error) {
//         setIsRedirecting(false);
//         setShowConnectModal(true);
//         toast.error(error?.response?.data?.message || error?.message || 'Failed to start OAuth flow');
//       }
//     },
//     [BACKEND_ROOT_URL, selectedPlatform]
//   );

//   const handleDisconnect = async (account) => {
//     const channelId = account?.id ?? account?._id;
//     if (!channelId) {
//       toast.error('Could not identify account to disconnect');
//       return;
//     }
//     const res = await disconnectAccount(channelId);
//     if (res?.success) {
//       toast.success(`${account?.platform || 'Account'} disconnected`);
//     } else {
//       toast.error(res?.error || 'Failed to disconnect');
//     }
//   };

//   const handleViewAnalytics = async (account) => {
//     const id = account?.id || account?._id;
//     const key = id || account?.platform;
//     setStatsLoading((prev) => ({ ...prev, [key]: true }));
//     const res = await getStats(id || account?.platform);
//     setStatsLoading((prev) => ({ ...prev, [key]: false }));

//     if (res?.success && res?.data) {
//       useSocialMediaStore.setState((state) => ({
//         accounts: state.accounts.map((a) =>
//           (a.id || a._id) === id
//             ? {
//               ...a,
//               followers: res.data.followersCount ?? res.data.fan_count ?? a.followers,
//               engagement: res.data.engagement ?? a.engagement,
//             }
//             : a
//         ),
//       }));
//       toast.success(`Analytics updated for ${account?.platform}`);
//     } else {
//       toast.error('Failed to load analytics');
//     }
//   };

//   const platformIcons = {
//     instagram: Instagram,
//     youtube: Youtube,
//     twitter: Twitter,
//     facebook: Facebook,
//     tiktok: Instagram
//   };

//   const formatMetricValue = (value) => {
//     if (value === null || value === undefined || value === '') {
//       return '—';
//     }

//     if (typeof value === 'number') {
//       return value.toLocaleString();
//     }

//     return value;
//   };

//   const emptyState = (
//     <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
//       <p className="text-white font-semibold mb-2">No connected accounts yet</p>
//       <p className="text-gray-400 mb-4">Connect a platform to start tracking performance and engagement.</p>
//       <button
//         onClick={() => setShowConnectModal(true)}
//         className="px-5 py-2.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-medium hover:shadow-lg transition-all"
//       >
//         Connect your first account
//       </button>
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-white mb-2">Connected Accounts</h1>
//           <p className="text-gray-400">Manage your social media platform connections</p>
//         </div>
//         <button
//           onClick={() => setShowConnectModal(true)}
//           className="px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
//         >
//           Connect New Account
//         </button>
//       </div>

//       {/* Redirect Overlay */}
//       {isRedirecting && (
//         <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center">
//           <div className="bg-[#171327] border border-white/15 rounded-xl px-6 py-5 text-center">
//             <Loader className="w-6 h-6 text-[#C1B6FD] animate-spin mx-auto mb-3" />
//             <p className="text-white font-semibold">Redirecting to {selectedPlatform}...</p>
//             <p className="text-xs text-gray-400 mt-1">Please complete OAuth authorization in the next window.</p>
//           </div>
//         </div>
//       )}

//       {/* Connect Modal */}
//       {showConnectModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-xl">
//           <div className="bg-gradient-to-br from-[#1a0933] to-[#2d1b4e] border border-white/20 rounded-xl p-6 max-w-md w-full m-4">
//             <h2 className="text-xl font-bold text-white mb-4">Connect Social Account</h2>
//             <form onSubmit={handleConnectAccount} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-white mb-2">Platform</label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={isPlatformOpen ? platformQuery : selectedPlatformOption?.label || ''}
//                     onChange={(e) => {
//                       setPlatformQuery(e.target.value);
//                       setIsPlatformOpen(true);
//                       if (selectedPlatformOption && e.target.value !== selectedPlatformOption.label) {
//                         setSelectedPlatform('');
//                       }
//                     }}
//                     onFocus={() => {
//                       setIsPlatformOpen(true);
//                       setPlatformQuery('');
//                     }}
//                     onBlur={() =>
//                       setTimeout(() => {
//                         setIsPlatformOpen(false);
//                         setPlatformQuery('');
//                       }, 120)
//                     }
//                     placeholder="Search platforms"
//                     className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
//                   />
//                   {isPlatformOpen && (
//                     <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
//                       {filteredPlatforms.map((option) => (
//                         <button
//                           key={option.value}
//                           type="button"
//                           onClick={() => {
//                             setSelectedPlatform(option.value);
//                             setPlatformQuery(option.label);
//                             setIsPlatformOpen(false);
//                           }}
//                           className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
//                         >
//                           <span className="flex items-center justify-between">
//                             <span className="flex items-center gap-2">
//                               <option.icon className="w-4 h-4 text-gray-300" />
//                               {option.label}
//                             </span>
//                             {selectedPlatform === option.value && (
//                               <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
//                             )}
//                           </span>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   disabled={isLoading || isRedirecting || !selectedPlatform}
//                   className="flex-1 px-4 py-2 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-medium disabled:opacity-50"
//                 >
//                   {isRedirecting ? `Redirecting to ${selectedPlatform}...` : 'Connect'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowConnectModal(false)}
//                   className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="text-red-500 text-sm mb-4">
//           Failed to load accounts: {error}
//         </div>
//       )}

//       {/* Accounts Grid */}
//       {isLoading ? (
//         <div className="flex items-center justify-center p-8">
//           <Loader className="w-6 h-6 text-[#C1B6FD] animate-spin" />
//         </div>
//       ) : accounts?.length === 0 ? (
//         emptyState
//       ) : (
//         <div className="grid grid-cols-2 gap-6">
//           {accounts.map((account) => {
//             const platformKey = (account.platform || '').toLowerCase();
//             const pd = account.platformData || {};
//             const Icon = platformIcons[platformKey] || Instagram;
//             const platformColors = {
//               instagram: 'from-pink-500 to-purple-500',
//               facebook: 'from-blue-600 to-blue-700',
//               twitter: 'from-blue-400 to-blue-500',
//               youtube: 'from-red-500 to-red-600',
//               tiktok: 'from-black to-cyan-500'
//             };
//             const color = platformColors[platformKey] || 'from-gray-500 to-gray-600';

//             return (
//               <div
//                 key={account._id || account.id}
//                 className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
//               >
//                 <div className="flex items-start gap-4 mb-4">
//                   <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 overflow-hidden`}>
//                     {account.profilePicture ? (
//                       <img
//                         src={account.profilePicture}
//                         alt={account.accountName}
//                         className="w-full h-full object-cover rounded-xl"
//                       />
//                     ) : (
//                       <Icon className="w-7 h-7 text-white" />
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <h3 className="text-lg font-bold text-white">{account.platform}</h3>
//                       <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">
//                         Connected
//                       </span>
//                       {account.isSimulated && (
//                         <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-semibold">
//                           Simulated
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-sm text-gray-400">{account.username || account.accountName || account.name || 'Connected'}</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-3 mb-4">
//                   <div className="bg-white/5 rounded-lg p-3">
//                     <p className="text-xs text-gray-400 mb-1">
//                       {account.platform?.toLowerCase() === 'youtube' ? 'Subscribers' : 'Followers'}
//                     </p>
//                     <p className="text-base font-bold text-white">
//                       {formatMetricValue(
//                         account.platform?.toLowerCase() === 'youtube'
//                           ? account.subscriberCount ?? pd.subscriberCount
//                           : account.followers ??
//                               account.followersCount ??
//                               pd.followerCount ??
//                               pd.followers
//                       )}
//                     </p>
//                   </div>
//                   <div className="bg-white/5 rounded-lg p-3">
//                     <p className="text-xs text-gray-400 mb-1">Engagement</p>
//                     <p className="text-base font-bold text-[#C1B6FD]">
//                       {formatMetricValue(account.engagement ?? pd.engagement)}
//                     </p>
//                   </div>
//                   <div className="bg-white/5 rounded-lg p-3">
//                     <p className="text-xs text-gray-400 mb-1">Status</p>
//                     <p className="text-xs font-semibold text-green-400">Active</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => handleViewAnalytics(account)}
//                     disabled={statsLoading[account.id || account._id || account.platform]}
//                     className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {statsLoading[account.id || account._id || account.platform] ? (
//                       <>
//                         <Loader className="w-3 h-3 animate-spin" />
//                         Loading...
//                       </>
//                     ) : (
//                       'Analytics'
//                     )}
//                   </button>
//                   <button
//                     onClick={() => handleDisconnect(account)}
//                     className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm text-red-400 font-medium transition-all"
//                   >
//                     Disconnect
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Account Health */}
//       <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
//         <h2 className="text-xl font-bold text-white mb-4">Account Health</h2>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-white font-medium mb-1">Connected Accounts</p>
//               <p className="text-sm text-gray-400">{accounts?.length || 0} accounts are properly connected</p>
//             </div>
//             <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">Active</span>
//           </div>
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-white font-medium mb-1">API Connection Status</p>
//               <p className="text-sm text-gray-400">All accounts are synced and accessible</p>
//             </div>
//             <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">Healthy</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ConnectedAccounts;
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Instagram, Twitter, Facebook, Loader, CheckCircle2, Info } from 'lucide-react';
import { FaTiktok, FaYoutube } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import useSocialMediaStore from '../../../../../stores/SocialMediaStore';
import socialMediaService from '../../../../../api/SocialMediaApi';
import ConnectedAccountCard from './ConnectedAccountCard';
import { normalizeAnalyticsPayload } from './connectedAccountsUtils';

function AccountsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-6 animate-pulse"
        >
          <div className="flex gap-4 mb-5">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-full max-w-[220px] rounded-md bg-white/10" />
              <div className="h-3 w-full max-w-[100px] rounded-md bg-white/10" />
              <div className="h-5 w-28 rounded-md bg-white/10 mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="h-16 rounded-lg bg-white/10" />
            <div className="h-16 rounded-lg bg-white/10" />
            <div className="h-16 rounded-lg bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ConnectedAccounts() {
  const { accounts, getAccounts, disconnectAccount, isLoading, connectTikTokSimulated, error } =
    useSocialMediaStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [tiktokDisplayName, setTiktokDisplayName] = useState('');
  const [tiktokUsername, setTiktokUsername] = useState('');

  // Dropdown states
  const [platformQuery, setPlatformQuery] = useState('');
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);

  const platformOptions = useMemo(
    () => [
      { value: 'Instagram', label: 'Instagram', icon: Instagram },
      { value: 'Facebook', label: 'Facebook', icon: Facebook },
      { value: 'Twitter', label: 'Twitter', icon: Twitter },
      { value: 'YouTube', label: 'YouTube', icon: FaYoutube },
      { value: 'TikTok', label: 'TikTok', icon: FaTiktok },
    ],
    []
  );

  const filteredPlatforms = platformOptions.filter((opt) =>
    opt.label.toLowerCase().includes(platformQuery.trim().toLowerCase())
  );
  const selectedPlatformOption = platformOptions.find((p) => p.value === selectedPlatform);
  const [analyticsById, setAnalyticsById] = useState({});
  const [analyticsLoading, setAnalyticsLoading] = useState({});
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const BACKEND_ROOT_URL = API_BASE_URL.replace(/\/api\/?$/, '');

  const accountIdsKey = useMemo(
    () => (accounts || []).map((a) => String(a.id ?? a._id)).sort().join(','),
    [accounts]
  );

  const fetchAnalyticsForAccounts = useCallback(async (list) => {
    if (!list?.length) return;
    const ids = list.map((a) => String(a.id ?? a._id));
    setAnalyticsLoading((prev) => {
      const next = { ...prev };
      ids.forEach((id) => {
        next[id] = true;
      });
      return next;
    });
    await Promise.all(
      list.map(async (acc) => {
        const id = String(acc.id ?? acc._id);
        try {
          const data = await socialMediaService.getStats(id);
          const normalized = normalizeAnalyticsPayload(data);
          setAnalyticsById((prev) => ({ ...prev, [id]: normalized }));
        } catch {
          setAnalyticsById((prev) => ({
            ...prev,
            [id]: { error: true, hasData: false },
          }));
        } finally {
          setAnalyticsLoading((prev) => ({ ...prev, [id]: false }));
        }
      })
    );
  }, []);

  useEffect(() => {
    if (!accountIdsKey) return undefined;
    const list = useSocialMediaStore.getState().accounts;
    fetchAnalyticsForAccounts(list);
    return undefined;
  }, [accountIdsKey, fetchAnalyticsForAccounts]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success') === 'true' || params.get('connected') === 'true';
    const error = params.get('error');
    const simulated = params.get('simulated') === 'true';

    if (success) {
      toast.success(simulated ? 'Channel connected successfully (simulation mode)' : 'Social account connected successfully');
    } else if (error) {
      toast.error(error === 'meta_failed' ? 'Meta connection failed. Please try again.' : 'Failed to connect social account. Please try again.');
    }

    if (success) {
      const timer = setTimeout(() => {
        getAccounts();
      }, 500);

      if (success || error) {
        navigate(location.pathname, { replace: true });
      }

      return () => clearTimeout(timer);
    }

    getAccounts();

    if (success || error) {
      navigate(location.pathname, { replace: true });
    }
  }, [getAccounts, location.pathname, location.search, navigate]);

  const handleConnectAccount = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedPlatform) {
        toast.error('Please select a platform to connect');
        return;
      }

      const normalized = selectedPlatform.toLowerCase();

      if (normalized === 'tiktok') {
        const res = await connectTikTokSimulated(tiktokUsername.trim(), tiktokDisplayName.trim());
        if (res?.success) {
          toast.success('Simulated TikTok account connected');
          setTiktokDisplayName('');
          setTiktokUsername('');
          setShowConnectModal(false);
        } else {
          toast.error(res?.error || 'Failed to create simulated TikTok account');
        }
        return;
      }

      let oauthEndpoint = '';

      if (['facebook', 'instagram'].includes(normalized)) {
        oauthEndpoint = 'meta';
      } else if (normalized === 'youtube') {
        oauthEndpoint = 'youtube';
      } else {
        toast.error(`${selectedPlatform} OAuth is not configured yet.`);
        return;
      }

      setIsRedirecting(true);
      setShowConnectModal(false);

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Access token not found. Please login again.');
        }

        if (oauthEndpoint === 'meta' || oauthEndpoint === 'youtube') {
          const endpoint = oauthEndpoint === 'meta' ? 'meta-url' : 'youtube-url';
          const response = await axios.get(`${BACKEND_ROOT_URL}/auth/${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const oauthUrl = response?.data?.data?.url;
          if (!oauthUrl) {
            throw new Error(`${selectedPlatform} OAuth URL not returned`);
          }
          window.open(oauthUrl, '_self');
          return;
        }

        window.location.href = `${BACKEND_ROOT_URL}/auth/${oauthEndpoint}`;
      } catch (error) {
        setIsRedirecting(false);
        setShowConnectModal(true);
        toast.error(error?.response?.data?.message || error?.message || 'Failed to start OAuth flow');
      }
    },
    [BACKEND_ROOT_URL, selectedPlatform, connectTikTokSimulated, tiktokUsername, tiktokDisplayName]
  );

  const buildMetrics = useCallback(
    (account) => {
      const id = String(account.id ?? account._id);
      const loading = analyticsLoading[id] !== false;
      const norm = analyticsById[id];
      if (loading && norm === undefined) {
        return { phase: 'loading' };
      }
      if (norm?.error) {
        return { phase: 'error' };
      }
      const followers = norm?.followers ?? account.followers ?? null;
      const engagementRate = norm?.engagementRate ?? account.engagementRate ?? null;
      const hasData =
        Boolean(norm?.hasData) || followers != null || engagementRate != null;
      if (hasData) {
        return { phase: 'ready', followers, engagementRate };
      }
      return { phase: 'ready_empty' };
    },
    [analyticsById, analyticsLoading]
  );

  const handleViewDetails = useCallback(() => {
    toast.info('Detailed analytics view is coming soon.');
  }, []);

  const handleDisconnect = async (account) => {
    const accountIdentifier = account?.id || account?._id || account?.platform;
    const idStr =
      account?.id != null ? String(account.id) : account?._id != null ? String(account._id) : null;
    const res = await disconnectAccount(accountIdentifier);
    if (res?.success) {
      toast.success(`${account?.platform || 'Account'} disconnected`);
      if (idStr) {
        setAnalyticsById((prev) => {
          const next = { ...prev };
          delete next[idStr];
          return next;
        });
        setAnalyticsLoading((prev) => {
          const next = { ...prev };
          delete next[idStr];
          return next;
        });
      }
      await getAccounts();
    } else {
      toast.error(res?.error || 'Failed to disconnect');
    }
  };

  const emptyState = (
    <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
      <p className="text-white font-semibold mb-2">No connected accounts yet</p>
      <p className="text-gray-400 mb-4">Connect a platform to start tracking performance and engagement.</p>
      <button
        onClick={() => {
          setTiktokDisplayName('');
          setTiktokUsername('');
          setShowConnectModal(true);
        }}
        className="px-5 py-2.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-medium hover:shadow-lg transition-all"
      >
        Connect your first account
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Connected Accounts</h1>
          <p className="text-gray-400">Manage your social media platform connections</p>
        </div>
        <button
          onClick={() => {
            setTiktokDisplayName('');
            setTiktokUsername('');
            setShowConnectModal(true);
          }}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Connect New Account
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Failed to load accounts: {error}
        </div>
      )}

      {/* Redirect Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#171327] border border-white/15 rounded-xl px-6 py-5 text-center">
            <Loader className="w-6 h-6 text-[#C1B6FD] animate-spin mx-auto mb-3" />
            <p className="text-white font-semibold">Redirecting to {selectedPlatform}...</p>
            <p className="text-xs text-gray-400 mt-1">Please complete OAuth authorization in the next window.</p>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-xl">
          <div className="bg-gradient-to-br from-[#1a0933] to-[#2d1b4e] border border-white/20 rounded-xl p-6 max-w-md w-full m-4">
            <h2 className="text-xl font-bold text-white mb-4">Connect Social Account</h2>
            <form onSubmit={handleConnectAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Platform</label>
                <div className="relative">
                  <input
                    type="text"
                    value={isPlatformOpen ? platformQuery : selectedPlatformOption?.label || ''}
                    onChange={(e) => {
                      setPlatformQuery(e.target.value);
                      setIsPlatformOpen(true);
                      if (selectedPlatformOption && e.target.value !== selectedPlatformOption.label) {
                        setSelectedPlatform('');
                      }
                    }}
                    onFocus={() => {
                      setIsPlatformOpen(true);
                      setPlatformQuery('');
                    }}
                    onBlur={() =>
                      setTimeout(() => {
                        setIsPlatformOpen(false);
                        setPlatformQuery('');
                      }, 120)
                    }
                    placeholder="Search platforms"
                    className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                  />
                  {isPlatformOpen && (
                    <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                      {filteredPlatforms.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSelectedPlatform(option.value);
                            setPlatformQuery(option.label);
                            setIsPlatformOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                        >
                          <span className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <option.icon className="w-4 h-4 text-gray-300" />
                              {option.label}
                            </span>
                            {selectedPlatform === option.value && (
                              <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedPlatform === 'TikTok' && (
                <div className="space-y-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                  <div className="flex gap-2 text-sm text-amber-100/90">
                    <Info className="w-5 h-5 shrink-0 text-amber-400" aria-hidden />
                    <p>
                      TikTok runs in simulation mode for this demo. A realistic simulated account will be
                      created.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={tiktokDisplayName}
                      onChange={(ev) => setTiktokDisplayName(ev.target.value)}
                      placeholder="e.g. My Brand TikTok"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Username</label>
                    <input
                      type="text"
                      value={tiktokUsername}
                      onChange={(ev) => setTiktokUsername(ev.target.value)}
                      placeholder="e.g. @mybrand"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading || isRedirecting || !selectedPlatform}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {isRedirecting ? `Redirecting to ${selectedPlatform}...` : 'Connect'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConnectModal(false);
                    setTiktokDisplayName('');
                    setTiktokUsername('');
                  }}
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
      {isLoading && (!accounts || accounts.length === 0) ? (
        <AccountsGridSkeleton />
      ) : accounts?.length === 0 ? (
        emptyState
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {accounts.map((account) => (
            <ConnectedAccountCard
              key={String(account.id ?? account._id)}
              account={account}
              metrics={buildMetrics(account)}
              onDisconnect={handleDisconnect}
              onViewDetails={handleViewDetails}
            />
          ))}
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