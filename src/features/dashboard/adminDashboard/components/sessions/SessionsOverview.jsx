import { Monitor, Smartphone, Tablet, Clock, MapPin, Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../../../../../stores/AdminStore';
import { getSessionLifecycleStatus } from '../adminData';

function getRelativeTime(date) {
  if (!date) return 'Unknown';
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return then.toLocaleDateString();
}

function getDeviceType(userAgent) {
  if (!userAgent) return 'Unknown';
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return 'Mobile';
  if (ua.includes('tablet') || ua.includes('ipad')) return 'Tablet';
  return 'Desktop';
}

function mapSession(s, usersList = []) {
  const user = s.user || {};
  const userId = s.userId ?? user.id;
  const cached = usersList.find((u) => String(u.id) === String(userId));
  const roleName = (user.roles?.[0]?.name ?? cached?.roles?.[0]?.name ?? '').toLowerCase() || 'user';
  const lifecycle = getSessionLifecycleStatus(s);

  return {
    id: s.id,
    userId,
    user: [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email || 'Unknown',
    email: user.email || '—',
    role: roleName,
    startedAt: s.createdAt ? new Date(s.createdAt).toLocaleString() : '—',
    lastActivity: getRelativeTime(s.createdAt),
    device: getDeviceType(s.userAgent),
    location: s.ip || 'Unknown',
    lifecycle,
    raw: s,
  };
}

function SessionStatusBadge({ status }) {
  const config = {
    active: { color: 'bg-green-500/20 text-green-400', label: 'Active' },
    expired: { color: 'bg-gray-500/20 text-gray-400', label: 'Expired' },
    revoked: { color: 'bg-red-500/20 text-red-400', label: 'Revoked' },
  };
  const { color, label } = config[status] || { color: 'bg-gray-500/20 text-gray-400', label: status || 'Unknown' };
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
}

function SessionsOverview() {
  const { sessions, users, isLoading, error, fetchSessions, fetchUsers, sessionsPagination } = useAdminStore();
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);

  const loadData = useCallback(async () => {
    await Promise.all([
      fetchUsers({ page: 1, limit: 200 }),
      fetchSessions({ page: 1, limit: 100, active: activeOnly }),
    ]);
  }, [activeOnly, fetchSessions, fetchUsers]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  const list = useMemo(
    () => (sessions || []).map((s) => mapSession(s, users)),
    [sessions, users]
  );

  const filtered = list.filter(
    (s) =>
      !search ||
      s.user.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = list.filter((s) => s.lifecycle === 'active').length;
  const todayCount = list.filter((s) => {
    if (!s.raw.createdAt) return false;
    return new Date(s.raw.createdAt).toDateString() === new Date().toDateString();
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Sessions</h1>
          <p className="text-sm sm:text-base text-gray-400">
            Live sessions from the platform
            {sessionsPagination?.total != null ? ` · ${sessionsPagination.total} total` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-[#745CB4]/20 hover:border-[#745CB4]/50 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 flex items-center justify-center">
              <Monitor className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{activeCount}</p>
          <p className="text-sm text-gray-400">Active Sessions</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Today</span>
          </div>
          <p className="text-2xl font-bold text-white">{todayCount}</p>
          <p className="text-sm text-gray-400">Sessions Today</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]"
          />
        </div>
        <select
          value={activeOnly ? 'active' : 'all'}
          onChange={(e) => setActiveOnly(e.target.value === 'active')}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
        >
          <option value="all" style={{ backgroundColor: '#1e1632', color: '#fff' }}>All sessions</option>
          <option value="active" style={{ backgroundColor: '#1e1632', color: '#fff' }}>Active only</option>
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        {isLoading && list.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#C1B6FD]" />
            Loading sessions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            {list.length === 0 ? 'No sessions found.' : 'No sessions match your search.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">User</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Role</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Started</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Last Activity</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Device</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">IP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        {s.userId ? (
                          <Link
                            to={`/dashboard/admin/users/${s.userId}`}
                            className="font-medium text-white hover:text-[#C1B6FD] transition-colors"
                          >
                            {s.user}
                          </Link>
                        ) : (
                          <p className="font-medium text-white">{s.user}</p>
                        )}
                        <p className="text-sm text-gray-500">{s.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          s.role === 'admin'
                            ? 'bg-red-500/20 text-red-400'
                            : s.role === 'owner'
                            ? 'bg-[#745CB4]/20 text-[#C1B6FD]'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {s.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <SessionStatusBadge status={s.lifecycle} />
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">{s.startedAt}</td>
                    <td className="py-4 px-4 text-gray-400 text-sm">{s.lastActivity}</td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-2 text-gray-300">
                        {s.device === 'Desktop' ? (
                          <Monitor className="w-4 h-4" />
                        ) : s.device === 'Tablet' ? (
                          <Tablet className="w-4 h-4" />
                        ) : (
                          <Smartphone className="w-4 h-4" />
                        )}
                        {s.device}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-2 text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
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
