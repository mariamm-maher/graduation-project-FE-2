import { FileText, Search, Filter, Download, AlertCircle, CheckCircle, XCircle, Info, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAdminStore from '../../../../../stores/AdminStore';

function LogsOverview() {
  const { logs, logsPagination, isLoading, error, fetchLogs } = useAdminStore();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  useEffect(() => {
    fetchLogs(currentPage, limit);
  }, [fetchLogs, currentPage, limit]);

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Helper function to determine log level based on action
  const getLogLevel = (action) => {
    const errorActions = ['DELETE', 'FAILED', 'ERROR'];
    const warningActions = ['UPDATE', 'CHANGE_ROLE'];
    const successActions = ['CREATE', 'SIGNUP'];
    
    if (errorActions.some(a => action.includes(a))) return 'error';
    if (warningActions.some(a => action.includes(a))) return 'warning';
    if (successActions.some(a => action.includes(a))) return 'success';
    return 'info';
  };

  // Helper function to get action display text
  const getActionText = (action) => {
    return action.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to get details text
  const getDetailsText = (log) => {
    const email = log.meta?.email || '';
    const method = log.meta?.method ? ` via ${log.meta.method}` : '';
    const roleName = log.meta?.roleName || '';
    const roles = log.meta?.roles ? ` (${log.meta.roles.join(', ')})` : '';
    
    switch (log.action) {
      case 'LOGIN':
        return `${email} logged in${method}${roles}`;
      case 'LOGOUT':
        return `${email} logged out`;
      case 'CHANGE_ROLE':
        return `Role changed to ${roleName}`;
      case 'CREATE_USER':
      case 'SIGNUP':
        return `New user registered: ${email}`;
      default:
        return `${log.entity} action: ${log.action}`;
    }
  };

  // Transform API logs to display format
  const transformedLogs = (logs || []).map((log) => ({
    id: log.id,
    timestamp: formatTimestamp(log.createdAt),
    level: getLogLevel(log.action),
    user: log.meta?.email || log.actor || 'System',
    action: getActionText(log.action),
    ip: log.meta?.ip || 'N/A',
    details: getDetailsText(log),
    entity: log.entity,
    roles: log.meta?.roles || []
  }));

  // Filter logs
  const filtered = transformedLogs.filter(log => {
    const matchSearch = !search || 
      log.user.toLowerCase().includes(search.toLowerCase()) || 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchSearch && matchLevel;
  });

  // Calculate stats
  const totalLogs = logsPagination.totalLogs || transformedLogs.length;
  const errorLogs = transformedLogs.filter(l => l.level === 'error').length;
  const warningLogs = transformedLogs.filter(l => l.level === 'warning').length;
  const successLogs = transformedLogs.filter(l => l.level === 'success').length;

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
    const dataStr = JSON.stringify(filtered, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= logsPagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Show loading state
  if (isLoading && transformedLogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#C1B6FD] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading logs...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && transformedLogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-400 mb-2">Failed to load logs</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <button 
            onClick={() => fetchLogs(currentPage, limit)}
            className="mt-4 px-4 py-2 bg-[#745CB4] hover:bg-[#5d4a91] text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

        {/* Pagination */}
        {logsPagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <div className="text-sm text-gray-400">
              Page {logsPagination.currentPage} of {logsPagination.totalPages} • Total: {logsPagination.totalLogs} logs
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1 text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, logsPagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (logsPagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= logsPagination.totalPages - 2) {
                    pageNum = logsPagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#745CB4] text-white'
                          : 'bg-white/5 hover:bg-white/10 text-gray-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === logsPagination.totalPages}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1 text-white"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogsOverview;
