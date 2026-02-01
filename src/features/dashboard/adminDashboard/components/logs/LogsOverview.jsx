import { FileText, Search, Filter, Download, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { useState } from 'react';

const mockLogs = [
  { 
    id: 1, 
    timestamp: '2025-01-31 10:45:23',
    level: 'info',
    user: 'Sarah Johnson',
    action: 'User login',
    ip: '192.168.1.45',
    details: 'Successful authentication from Cairo, EG'
  },
  { 
    id: 2, 
    timestamp: '2025-01-31 10:42:15',
    level: 'warning',
    user: 'System',
    action: 'Failed login attempt',
    ip: '203.45.67.89',
    details: 'Multiple failed attempts detected'
  },
  { 
    id: 3, 
    timestamp: '2025-01-31 10:38:52',
    level: 'success',
    user: 'Emma Davis',
    action: 'Campaign created',
    ip: '192.168.1.67',
    details: 'New campaign "Spring Collection 2025" created'
  },
  { 
    id: 4, 
    timestamp: '2025-01-31 10:35:10',
    level: 'error',
    user: 'Mike Chen',
    action: 'Payment failed',
    ip: '192.168.1.102',
    details: 'Payment processing error for collaboration #4567'
  },
  { 
    id: 5, 
    timestamp: '2025-01-31 10:30:45',
    level: 'info',
    user: 'James Radcliffe',
    action: 'Profile updated',
    ip: '192.168.1.23',
    details: 'User updated profile information'
  },
  { 
    id: 6, 
    timestamp: '2025-01-31 10:25:33',
    level: 'success',
    user: 'Alex Martinez',
    action: 'Collaboration completed',
    ip: '192.168.1.88',
    details: 'Collaboration #3421 marked as completed'
  },
  { 
    id: 7, 
    timestamp: '2025-01-31 10:20:18',
    level: 'warning',
    user: 'System',
    action: 'High API usage',
    ip: '192.168.1.1',
    details: 'API rate limit approaching for user "tech_guru_2025"'
  },
  { 
    id: 8, 
    timestamp: '2025-01-31 10:15:07',
    level: 'info',
    user: 'Admin',
    action: 'User role changed',
    ip: '192.168.1.1',
    details: 'User "new_influencer" role changed from pending to influencer'
  },
];

function LogsOverview() {
  const [logs] = useState(mockLogs);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const filtered = logs.filter(log => {
    const matchSearch = !search || 
      log.user.toLowerCase().includes(search.toLowerCase()) || 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const totalLogs = logs.length;
  const errorLogs = logs.filter(l => l.level === 'error').length;
  const warningLogs = logs.filter(l => l.level === 'warning').length;
  const successLogs = logs.filter(l => l.level === 'success').length;

  const getLevelIcon = (level) => {
    switch(level) {
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'error': return 'bg-red-500/20 text-red-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'success': return 'bg-green-500/20 text-green-400';
      case 'info': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleExport = () => {
    // Implement export functionality
    alert('Exporting logs...');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">System Logs</h1>
          <p className="text-sm sm:text-base text-gray-400">Monitor all system activities and events</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#745CB4] hover:bg-[#5d4a8f] text-white rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalLogs}</p>
          <p className="text-sm text-gray-400">Total Logs</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-red-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-xs text-red-400 font-semibold">Errors</span>
          </div>
          <p className="text-2xl font-bold text-white">{errorLogs}</p>
          <p className="text-sm text-gray-400">Error Logs</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-yellow-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-yellow-400 font-semibold">Warnings</span>
          </div>
          <p className="text-2xl font-bold text-white">{warningLogs}</p>
          <p className="text-sm text-gray-400">Warning Logs</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-green-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-green-400 font-semibold">Success</span>
          </div>
          <p className="text-2xl font-bold text-white">{successLogs}</p>
          <p className="text-sm text-gray-400">Success Logs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
        >
          <option value="all" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>All Levels</option>
          <option value="error" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Error</option>
          <option value="warning" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Warning</option>
          <option value="success" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Success</option>
          <option value="info" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Info</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Timestamp</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Level</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">User</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Action</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">IP Address</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-gray-300 text-sm font-mono">{log.timestamp}</td>
                  <td className="py-4 px-4">
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${getLevelColor(log.level)}`}>
                      {getLevelIcon(log.level)}
                      {log.level}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white">{log.user}</td>
                  <td className="py-4 px-4 text-gray-300">{log.action}</td>
                  <td className="py-4 px-4 text-gray-400 font-mono text-sm">{log.ip}</td>
                  <td className="py-4 px-4 text-gray-400 text-sm max-w-xs truncate" title={log.details}>
                    {log.details}
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

export default LogsOverview;
