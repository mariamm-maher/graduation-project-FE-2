import { LayoutDashboard, Users, Monitor, Handshake, Settings, LogOut, User, Menu, X, Briefcase, FileText, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../../../stores/authStore';

function Sidebar() {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const getProfile = useAuthStore((s) => s.getProfile);

  useEffect(() => {
    if (!user ) {
      getProfile().catch(() => {});

    }
   
  }, [user, getProfile]);

const menuItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview', path: '/dashboard/admin' },
  { id: 'users', icon: Users, label: 'Users', path: '/dashboard/admin/users' },
  { id: 'sessions', icon: Monitor, label: 'Sessions', path: '/dashboard/admin/sessions' },
  { id: 'campaigns', icon: Briefcase, label: 'Campaigns', path: '/dashboard/admin/campaigns' },
  { id: 'collaborations', icon: Handshake, label: 'Collaborations', path: '/dashboard/admin/collaborations' },
  { id: 'logs', icon: FileText, label: 'Logs', path: '/dashboard/admin/logs' },
  { id: 'announcements', icon: Bell, label: 'Announcements', path: '/dashboard/admin/announcements' },
];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-6 left-4 z-50 md:hidden p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/20 transition-all"
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
        className={`fixed left-3 md:left-6 top-20 md:top-32 flex flex-col gap-2 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition-all duration-300 ease-in-out z-50 ${
          isHovered ? 'w-64 bg-[#1a1a1a]/95' : 'w-20 bg-white/5'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Profile Section */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        {isHovered && (
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-white whitespace-nowrap">{user?.name || user?.fullName || 'Admin'}</p>
            <p className="text-xs text-gray-400 whitespace-nowrap">{user?.email || 'admin@adsphere.com'}</p>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // For dashboard, use exact match. For others, check if pathname starts with the path
          const isActive = item.id === 'dashboard' 
            ? location.pathname === item.path || location.pathname === `${item.path}/`
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg shadow-[#745CB4]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={!isHovered ? item.label : ''}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {isHovered && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-white/10 space-y-1">
        <button 
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          title={!isHovered ? 'Settings' : ''}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {isHovered && (
            <span className="text-sm font-medium whitespace-nowrap">Settings</span>
          )}
        </button>
        <button 
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
          title={!isHovered ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isHovered && (
            <span className="text-sm font-medium whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>
    </div>
    </>
  );
}

export default Sidebar;
