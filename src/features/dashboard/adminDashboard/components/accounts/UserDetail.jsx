import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Shield, Calendar, Save, Trash2, User, AlertTriangle, Pencil, X } from 'lucide-react';
import { mockAccounts, mockCollaborations } from '../adminData';

const CONFIRM_ADMIN_WORD = 'admin';

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', status: 'active' });
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [confirmWord, setConfirmWord] = useState('');
  const [roleError, setRoleError] = useState('');
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const u = mockAccounts.find(a => a.id === Number(id));
    if (u) {
      setUser({ ...u });
      setEditForm({ name: u.name, email: u.email, status: u.status });
    }
  }, [id]);

  const userCollaborations = user ? mockCollaborations.filter(
    c => c.ownerId === user.id || c.influencerId === user.id
  ) : [];

  const handleSave = () => {
    if (!user) return;
    setUser(prev => ({ ...prev, ...editForm }));
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancelEdit = () => {
    setEditForm({ name: user.name, email: user.email, status: user.status });
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    navigate('/dashboard/admin/accounts');
    setShowDeleteModal(false);
  };

  const openRoleModal = (role) => {
    setNewRole(role);
    setConfirmWord('');
    setRoleError('');
    setShowRoleModal(true);
  };

  const confirmRoleChange = () => {
    if (newRole !== 'admin') {
      setUser(prev => ({ ...prev, role: newRole }));
      setShowRoleModal(false);
      return;
    }
    if (confirmWord.trim().toLowerCase() !== CONFIRM_ADMIN_WORD) {
      setRoleError(`Type "${CONFIRM_ADMIN_WORD}" to confirm making this user an admin.`);
      return;
    }
    setUser(prev => ({ ...prev, role: 'admin' }));
    setShowRoleModal(false);
  };

  const statusLabel = (s) => s === 'active' ? 'Active' : 'Deactivated';

  if (!user) {
    return (
      <div className="text-center py-12 text-gray-400">
        User not found. <Link to="/dashboard/admin/accounts" className="text-[#C1B6FD] hover:underline">Back to Accounts</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/dashboard/admin/accounts" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Accounts
      </Link>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                  user.role === 'owner' ? 'bg-[#745CB4]/20 text-[#C1B6FD]' : 'bg-green-500/20 text-green-400'
                }`}>
                  {user.role}
                </span>
                <span className={`text-sm ${user.status === 'active' ? 'text-green-400' : 'text-gray-500'}`}>
                  {statusLabel(user.status)}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Joined {user.createdAt}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-[#745CB4] hover:bg-[#5D459D] text-white rounded-xl text-sm font-medium transition-all">
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button onClick={handleDeleteClick} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-sm font-medium transition-all">
                  <Trash2 className="w-4 h-4" /> Delete account
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#745CB4] hover:bg-[#5D459D] text-white rounded-xl text-sm font-medium transition-all">
                  <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save changes'}
                </button>
                <button onClick={handleCancelEdit} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content: read-only or edit form */}
        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <div>
              <p className="text-sm text-gray-400 mb-1">Name</p>
              <p className="text-white font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <p className={`font-medium ${user.status === 'active' ? 'text-green-400' : 'text-gray-500'}`}>
                {statusLabel(user.status)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Role</p>
              <p className="text-white font-medium capitalize">{user.role}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Account status</label>
              <select
                value={editForm.status === 'inactive' ? 'inactive' : editForm.status}
                onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#C1B6FD]"
              style={{
              colorScheme: 'dark'
              }}
              >
                <option value="active" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Active</option>
                <option value="inactive" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Deactivated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Role</label>
              <div className="flex flex-wrap gap-2">
                {['owner', 'influencer', 'admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => openRoleModal(role)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      user.role === role
                        ? 'bg-[#745CB4] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Click to change role. Making someone admin requires typing &quot;admin&quot; to confirm.</p>
            </div>
          </div>
        )}
      </div>

      {/* User's collaborations */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#C1B6FD]" />
          Collaborations ({userCollaborations.length})
        </h2>
        {userCollaborations.length === 0 ? (
          <p className="text-gray-400">No collaborations for this user.</p>
        ) : (
          <div className="space-y-3">
            {userCollaborations.map((c) => (
              <Link
                key={c.id}
                to={`/dashboard/admin/collaborations/${c.id}`}
                className="block p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#745CB4]/50 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-medium text-white">{c.campaign}</span>
                    <span className="text-gray-400 text-sm ml-2">
                      {c.ownerId === user.id ? `Owner • with ${c.influencer}` : `Influencer • with ${c.owner}`}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    c.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    c.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Progress {c.progress}% • {c.deliverables.completed}/{c.deliverables.total} deliverables</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Role change modal - admin confirm */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowRoleModal(false)}>
          <div className="bg-[#1a1a3e] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-[#C1B6FD] mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold text-white">Change role to {newRole}</h3>
            </div>
            {newRole === 'admin' ? (
              <>
                <p className="text-gray-400 text-sm mb-4">
                  Making this user an admin gives them full platform access. Type <strong className="text-white">&quot;admin&quot;</strong> below to confirm.
                </p>
                <input
                  type="text"
                  value={confirmWord}
                  onChange={(e) => { setConfirmWord(e.target.value); setRoleError(''); }}
                  placeholder='Type "admin" to confirm'
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]"
                  autoFocus
                />
                {roleError && <p className="text-red-400 text-sm mt-2">{roleError}</p>}
              </>
            ) : (
              <p className="text-gray-400 text-sm mb-4">Change this user&apos;s role to <strong className="text-white">{newRole}</strong>?</p>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowRoleModal(false)} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all">
                Cancel
              </button>
              <button onClick={confirmRoleChange} className="flex-1 px-4 py-2.5 bg-[#745CB4] hover:bg-[#5D459D] text-white rounded-xl text-sm font-medium transition-all">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-[#1a1a3e] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-2">Delete account</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete <strong className="text-white">{user.name}</strong>? This cannot be undone.
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

export default UserDetail;
