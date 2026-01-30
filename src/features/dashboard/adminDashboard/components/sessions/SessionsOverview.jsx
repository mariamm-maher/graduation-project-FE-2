import { Monitor, Smartphone, Clock, MapPin, Search } from 'lucide-react';
import { useState } from 'react';

const mockSessions = [
  { id: 1, user: 'James Radcliffe', email: 'james@adsphere.com', role: 'owner', startedAt: '2025-01-30 09:15', lastActivity: '2 min ago', device: 'Desktop', location: 'Cairo, EG' },
  { id: 2, user: 'Sarah Johnson', email: 'sarah@example.com', role: 'influencer', startedAt: '2025-01-30 08:42', lastActivity: '15 min ago', device: 'Mobile', location: 'Alexandria, EG' },
  { id: 3, user: 'Alex Martinez', email: 'alex@example.com', role: 'influencer', startedAt: '2025-01-30 10:00', lastActivity: '1 min ago', device: 'Desktop', location: 'Giza, EG' },
  { id: 4, user: 'Emma Davis', email: 'emma@example.com', role: 'owner', startedAt: '2025-01-30 07:30', lastActivity: '45 min ago', device: 'Mobile', location: 'Cairo, EG' },
  { id: 5, user: 'Mike Chen', email: 'mike@example.com', role: 'influencer', startedAt: '2025-01-29 22:00', lastActivity: '2 hours ago', device: 'Desktop', location: 'Unknown' },
];

function SessionsOverview() {
  const [search, setSearch] = useState('');

  const filtered = mockSessions.filter(s =>
    !search || s.user.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeSessions = mockSessions.length;

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
          <p className="text-2xl font-bold text-white">{mockSessions.filter(s => s.startedAt.startsWith('2025-01-30')).length}</p>
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

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
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
                      s.role === 'owner' ? 'bg-[#745CB4]/20 text-[#C1B6FD]' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300 text-sm">{s.startedAt}</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">{s.lastActivity}</td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-2 text-gray-300">
                      {s.device === 'Desktop' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
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
      </div>
    </div>
  );
}

export default SessionsOverview;
