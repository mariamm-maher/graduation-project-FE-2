import { LayoutDashboard, Users, Monitor, Handshake, Settings, LogOut, User, Menu, X, Briefcase, FileText, Bell, UserCog, BellRing, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../stores/authStore';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const getProfile = useAuthStore((s) => s.getProfile);
  const logout = useAuthStore((s) => s.logout);

  const displayName = user?.fullName || user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Admin';
  const displayRole = (user?.roles?.[0]?.name || user?.role || user?.roleName || 'Admin').charAt(0).toUpperCase() + (user?.roles?.[0]?.name || user?.role || user?.roleName || 'Admin').slice(1).toLowerCase();
  const initials = displayName.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'A';
  const avatarUrl = user?.profileImage || user?.avatar || user?.profilePicture || null;

  useEffect(() => {
    if (!user) {
      getProfile().catch(() => {});
    }
  }, [user, getProfile]);

  const showLabels = isMobileOpen || isHovered;

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview', path: '/dashboard/admin' },
    { id: 'users', icon: Users, label: 'Users', path: '/dashboard/admin/users' },
    { id: 'sessions', icon: Monitor, label: 'Sessions', path: '/dashboard/admin/sessions' },
    { id: 'campaigns', icon: Briefcase, label: 'Campaigns', path: '/dashboard/admin/campaigns' },
    { id: 'collaborations', icon: Handshake, label: 'Collaborations', path: '/dashboard/admin/collaborations' },
    { id: 'logs', icon: FileText, label: 'Logs', path: '/dashboard/admin/logs' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully', {
        position: 'top-right',
        autoClose: 2000,
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-6 left-4 z-60 md:hidden p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/20 transition-all"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div 
        className={`fixed left-0 top-0 bottom-0 pt-16 md:left-6 md:top-22 md:bottom-auto md:pt-4 flex flex-col gap-2 backdrop-blur-md md:rounded-2xl p-4 border-r md:border border-white/10 transition-all duration-300 ease-in-out z-50 w-64 bg-[#1a1a1a]/95 ${
          isHovered ? '' : 'md:w-20 md:bg-white/5'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Profile Section */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shrink-0 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-white">{initials}</span>
            )}
          </div>
          {showLabels && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white whitespace-nowrap">{displayName}</p>
              <p className="text-xs text-[#C1B6FD] whitespace-nowrap font-medium">{displayRole}</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === 'overview'
              ? location.pathname === item.path || location.pathname === `${item.path}/`
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg shadow-[#745CB4]/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title={!showLabels ? item.label : ''}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {showLabels && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions - Settings Simplified */}
        <div className="pt-4 border-t border-white/10 space-y-1">
        <Link
          to="/dashboard/influencer/settings"
          onClick={() => setIsMobileOpen(false)}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
            location.pathname === '/dashboard/influencer/settings'
              ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg shadow-[#745CB4]/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title={!showLabels ? 'Settings' : ''}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {showLabels && (
            <span className="text-sm font-medium whitespace-nowrap">Settings</span>
          )}
        </Link>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            title={!showLabels ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {showLabels && (
              <span className="text-sm font-medium whitespace-nowrap">Logout</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;