import { Monitor, Smartphone, Tablet, Clock, MapPin, Search, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import adminService from '../../../../../api/adminApi';

// Map backend session to display shape
function mapSession(s) {
  const user = s.user || {};
  const roleName = user.roles?.[0]?.name?.toLowerCase() || 'user';

  // Calculate last activity relative time
  const getRelativeTime = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now - then) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return then.toLocaleDateString();
  };

  // Detect device type from user agent
  const getDeviceType = (userAgent) => {
    if (!userAgent) return 'Unknown';
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return 'Mobile';
    if (ua.includes('tablet') || ua.includes('ipad')) return 'Tablet';
    return 'Desktop';
  };

  // Parse location from IP (simplified - shows IP as location if no geo data)
  const getLocation = (ip) => {
    if (!ip) return 'Unknown';
    return ip; // Could be enhanced with geolocation service
  };

  return {
    id: s.id,
    user: [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email || 'Unknown',
    email: user.email || '—',
    role: roleName,
    startedAt: s.createdAt ? new Date(s.createdAt).toLocaleString() : '—',
    lastActivity: getRelativeTime(s.updatedAt || s.createdAt),
    device: getDeviceType(s.userAgent),
    location: getLocation(s.ip),
    raw: s
  };
}

function SessionsOverview() {
  const [search, setSearch] = useState('');
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminService.getSessions({ limit: 100 });
      const sessionData = response.data?.sessions || [];
      setSessions(sessionData.map(mapSession));
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setError(err.message || 'Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    // Refresh every 60 seconds
    const interval = setInterval(fetchSessions, 60000);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  const filtered = sessions.filter(s =>
    !search ||
    s.user.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeSessions = sessions.length;
  const todaySessions = sessions.filter(s => {
    if (!s.raw.createdAt) return false;
    const date = new Date(s.raw.createdAt);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Sessions</h1>
        <p className="text-sm sm:text-base text-gray-400">View all active and recent user sessions on the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 flex items-center justify-center">
              <Monitor className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{activeSessions}</p>
          <p className="text-sm text-gray-400">Active Sessions</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Today</span>
          </div>
          <p className="text-2xl font-bold text-white">{todaySessions}</p>
          <p className="text-sm text-gray-400">Sessions Today</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#C1B6FD]" />
            Loading sessions...
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">User</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Role</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Started</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Last Activity</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Device</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-white">{s.user}</p>
                      <p className="text-sm text-gray-500">{s.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      s.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      s.role === 'owner' ? 'bg-[#745CB4]/20 text-[#C1B6FD]' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300 text-sm">{s.startedAt}</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">{s.lastActivity}</td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-2 text-gray-300">
                      {s.device === 'Desktop' ? <Monitor className="w-4 h-4" /> :
                       s.device === 'Tablet' ? <Tablet className="w-4 h-4" /> :
                       <Smartphone className="w-4 h-4" />}
                      {s.device}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {s.location}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

export default SessionsOverview;
