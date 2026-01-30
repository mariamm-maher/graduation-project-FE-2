import { Users, UserCheck, UserPlus, Search, Shield, Mail, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockAccounts as initialAccounts } from '../adminData';

function AccountsOverview() {
  const [accounts, setAccounts] = useState([...initialAccounts]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  const filtered = accounts.filter(acc => {
    const matchSearch = !search || acc.name.toLowerCase().includes(search.toLowerCase()) || acc.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || acc.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalAccounts = accounts.length;
  const owners = accounts.filter(a => a.role === 'owner').length;
  const influencers = accounts.filter(a => a.role === 'influencer').length;

  const openDeleteModal = (acc) => {
    setAccountToDelete(acc);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (accountToDelete) {
      setAccounts(prev => prev.filter(a => a.id !== accountToDelete.id));
      setAccountToDelete(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Accounts</h1>
        <p className="text-sm sm:text-base text-gray-400">View and manage all platform user accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalAccounts}</p>
          <p className="text-sm text-gray-400">Total Accounts</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Owners</span>
          </div>
          <p className="text-2xl font-bold text-white">{owners}</p>
          <p className="text-sm text-gray-400">Campaign Owners</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Influencers</span>
          </div>
          <p className="text-2xl font-bold text-white">{influencers}</p>
          <p className="text-sm text-gray-400">Influencers</p>
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
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]"
          style={{
          colorScheme: 'dark'
          }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
        >
          <option value="all" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>All roles</option>
          <option value="owner" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Owners</option>
          <option value="influencer" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Influencers</option>
          <option value="admin" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">User</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Email</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Role</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Joined</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((acc) => (
                <tr key={acc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-white">{acc.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {acc.email}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      acc.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      acc.role === 'owner' ? 'bg-[#745CB4]/20 text-[#C1B6FD]' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {acc.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={acc.status === 'active' ? 'text-green-400' : 'text-gray-500'}>{acc.status}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-400 text-sm">{acc.createdAt}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/dashboard/admin/accounts/${acc.id}`}>
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-[#745CB4]/20 text-gray-400 hover:text-[#C1B6FD] transition-all" title="Details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <button onClick={() => openDeleteModal(acc)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && accountToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-[#1a1a3e] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-2">Delete account</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete <strong className="text-white">{accountToDelete.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all">
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-500/80 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AccountsOverview;
