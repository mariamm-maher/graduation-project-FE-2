import { LayoutDashboard, Megaphone, Share2, MessageCircle, Settings, LogOut, User, Users, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../stores/authStore';

function Sidebar({ isMobileOpen = false, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const showLabels = isMobileOpen || isHovered;

  useEffect(() => {
    if (!isMobileOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileOpen]);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/owner' },
    { id: 'campaigns', icon: Megaphone, label: 'Campaigns', path: '/dashboard/owner/campaigns' },
    { id: 'collaborations', icon: Users, label: 'Collaborations', path: '/dashboard/owner/collaborations' },
    { id: 'social', icon: Share2, label: 'Social Media', path: '/dashboard/owner/social-media' },
    { id: 'influencers', icon: MessageCircle, label: 'Influencers', path: '/dashboard/owner/influencers' },
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

  const closeMobile = () => onMobileClose?.();

  const sidebarPanel = (
    <>
      <button
        type="button"
        onClick={closeMobile}
        className="md:hidden absolute top-6 left-4 z-10 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/20 transition-all"
        aria-label="Close menu"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        {showLabels && (
          <div className="flex-1 overflow-hidden">
            <Link
              to="/dashboard/owner/profile"
              onClick={closeMobile}
              className="block truncate hover:underline hover:underline-offset-2 hover:decoration-[#C1B6FD]"
            >
              <p className="text-sm font-semibold text-white whitespace-nowrap">
                {user ? ((`${user.firstName || ''} ${user.lastName || ''}`).trim() || user.email) : 'Guest'}
              </p>
              <p className="text-xs text-gray-400 whitespace-nowrap">{user?.email || ''}</p>
            </Link>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 py-2 overflow-hidden ">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'dashboard'
            ? location.pathname === item.path || location.pathname === `${item.path}/`
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={closeMobile}
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

      <div className="pt-4 border-t border-white/10 space-y-1">
        <Link
          to="/dashboard/owner/settings"
          onClick={closeMobile}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
            location.pathname === '/dashboard/owner/settings'
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
          type="button"
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
    </>
  );

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 flex h-full w-64 max-w-[85vw] flex-col gap-2 border-r border-white/10 bg-[#1a1a1a]/95 p-4 pt-16 backdrop-blur-md">
            {sidebarPanel}
          </aside>
        </div>
      )}

      <div
        className={`fixed left-0 top-0 bottom-0 hidden md:flex flex-col gap-2 backdrop-blur-md md:left-6 md:top-32 md:bottom-auto md:pt-4 p-4 border md:border border-white/10 transition-all duration-300 ease-in-out z-30 md:rounded-2xl ${
          isHovered ? 'md:w-64 md:bg-[#1a1a1a]/95' : 'md:w-20 md:bg-white/5'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {sidebarPanel}
      </div>
    </>
  );
}

export default Sidebar;
