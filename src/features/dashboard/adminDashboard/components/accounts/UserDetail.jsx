import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Shield, Calendar, Save, Trash2, User, AlertTriangle, Pencil, X } from 'lucide-react';
import adminService from '../../../../../api/adminApi';
import useAdminStore from '../../../../../stores/AdminStore';
import { toast } from 'react-toastify';

const CONFIRM_ADMIN_WORD = 'admin';
const BACKEND_STATUSES = ['ACTIVE', 'BLOCKED', 'SUSPENDED', 'INCOMPLETE'];

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collaborations, fetchCollaborations, deleteUser } = useAdminStore();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState('ACTIVE');
  const [saving, setSaving] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [confirmWord, setConfirmWord] = useState('');
  const [roleError, setRoleError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const roleName = user?.roles?.[0]?.name ?? '';
  const roleLower = roleName.toLowerCase();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || '—';
  const createdAtStr = user?.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '—';

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await adminService.getUserById(id);
        // Backend may return { data: { user } } or { data: <user> } or { user }
        const raw =
          res.data?.user ??
          res.data?.data ??
          res.user ??
          res.data;
        const u =
          raw && typeof raw === 'object' && (raw.id != null || raw.email) ? raw : null;
        if (!cancelled && u) {
          setUser(u);
          setEditStatus(u.status || 'ACTIVE');
        } else if (!cancelled) {
          setUser(null);
        }
      } catch (e) {
        if (!cancelled) {
          toast.error(e.message || 'Failed to load user');
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    fetchCollaborations();
  }, [fetchCollaborations]);

  const collabList = Array.isArray(collaborations) ? collaborations : (collaborations?.collaborations ?? []);
  const userCollaborations = useMemo(() => {
    if (!user) return [];
    const uid = String(user.id);
    return collabList.filter(
      (c) => String(c.owner?.id) === uid || String(c.influencer?.id) === uid
    );
  }, [user, collabList]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await adminService.updateUserStatus(user.id, editStatus);
      setUser((prev) => (prev ? { ...prev, status: editStatus } : null));
      setIsEditing(false);
      toast.success('Status updated');
    } catch (e) {
      toast.error(e.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditStatus(user?.status || 'ACTIVE');
    setIsEditing(false);
  };

  const openRoleModal = (role) => {
    setNewRole(role);
    setConfirmWord('');
    setRoleError('');
    setShowRoleModal(true);
  };

  const confirmRoleChange = async () => {
    const roleUpper = newRole.toUpperCase();
    if (roleUpper === 'ADMIN') {
      if (confirmWord.trim().toLowerCase() !== CONFIRM_ADMIN_WORD) {
        setRoleError(`Type "${CONFIRM_ADMIN_WORD}" to confirm making this user an admin.`);
        return;
      }
    }
    try {
      await adminService.updateUserRole(user.id, roleUpper);
      setUser((prev) => (prev ? { ...prev, roles: [{ name: roleUpper }] } : null));
      setShowRoleModal(false);
      toast.success('Role updated');
    } catch (e) {
      setRoleError(e.message || 'Failed to update role');
      toast.error(e.message || 'Failed to update role');
    }
  };

  const confirmDelete = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      const result = await deleteUser(user.id);
      setShowDeleteModal(false);
      if (result.success) {
        toast.success('User deleted');
        navigate('/dashboard/admin/users');
      } else {
        toast.error(result.error || 'Failed to delete user');
      }
    } catch (e) {
      toast.error(e.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const statusLabel = (s) => (s === 'ACTIVE' ? 'Active' : s === 'BLOCKED' ? 'Blocked' : s === 'SUSPENDED' ? 'Suspended' : 'Incomplete');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        Loading user...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-gray-400">
        User not found.{' '}
        <Link to="/dashboard/admin/users" className="text-[#C1B6FD] hover:underline">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/dashboard/admin/users" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </Link>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    roleLower === 'admin'
                      ? 'bg-red-500/20 text-red-400'
                      : roleLower === 'owner'
                      ? 'bg-[#745CB4]/20 text-[#C1B6FD]'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {roleLower}
                </span>
                <span className={`text-sm ${user.status === 'ACTIVE' ? 'text-green-400' : 'text-gray-500'}`}>
                  {statusLabel(user.status)}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Joined {createdAtStr}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#745CB4] hover:bg-[#5D459D] text-white rounded-xl text-sm font-medium transition-all"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-sm font-medium transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete account
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-[#745CB4] hover:bg-[#5D459D] disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <div>
              <p className="text-sm text-gray-400 mb-1">Name</p>
              <p className="text-white font-medium">{displayName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <p className={`font-medium ${user.status === 'ACTIVE' ? 'text-green-400' : 'text-gray-500'}`}>
                {statusLabel(user.status)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Role</p>
              <p className="text-white font-medium capitalize">{roleLower}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <div>
              <p className="text-sm text-gray-400 mb-1">Name</p>
              <p className="text-white font-medium">{displayName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Account status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#C1B6FD]"
                style={{ colorScheme: 'dark' }}
              >
                {BACKEND_STATUSES.map((s) => (
                  <option key={s} value={s} style={{ backgroundColor: '#1e1632', color: '#fff' }}>
                    {statusLabel(s)}
                  </option>
                ))}
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
                      roleLower === role ? 'bg-[#745CB4] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click to change role. Making someone admin requires typing &quot;admin&quot; to confirm.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#C1B6FD]" />
          Collaborations ({userCollaborations.length})
        </h2>
        {userCollaborations.length === 0 ? (
          <p className="text-gray-400">No collaborations for this user.</p>
        ) : (
          <div className="space-y-3">
            {userCollaborations.map((c) => {
              const campaignName = c.campaign?.campaignName ?? c.campaignName ?? 'Campaign';
              const ownerName = c.owner ? [c.owner.firstName, c.owner.lastName].filter(Boolean).join(' ') : '—';
              const influencerName = c.influencer ? [c.influencer.firstName, c.influencer.lastName].filter(Boolean).join(' ') : '—';
              const isOwner = c.owner && String(c.owner.id) === String(user.id);
              return (
                <Link
                  key={c.id}
                  to={`/dashboard/admin/collaborations/${c.id}`}
                  className="block p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#745CB4]/50 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-medium text-white">{campaignName}</span>
                      <span className="text-gray-400 text-sm ml-2">
                        {isOwner ? `Owner • with ${influencerName}` : `Influencer • with ${ownerName}`}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        c.status === 'active' ? 'bg-green-500/20 text-green-400' : c.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowRoleModal(false)}>
          <div className="bg-[#1a1a3e] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-[#C1B6FD] mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold text-white">Change role to {newRole}</h3>
            </div>
            {newRole.toLowerCase() === 'admin' ? (
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
              <p className="text-gray-400 text-sm mb-4">
                Change this user&apos;s role to <strong className="text-white">{newRole}</strong>?
              </p>
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

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="bg-[#1a1a3e] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-2">Delete account</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete <strong className="text-white">{displayName}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button disabled={deleting} onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                Cancel
              </button>
              <button disabled={deleting} onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-500/80 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetail;
