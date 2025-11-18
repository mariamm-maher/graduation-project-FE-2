import { LayoutDashboard, Megaphone, Share2, BarChart3, MessageCircle, Settings, LogOut, User, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'campaigns', icon: Megaphone, label: 'Campaigns', path: '/dashboard/campaigns' },
    { id: 'collaborations', icon: Users, label: 'Collaborations', path: '/dashboard/collaborations' },
    { id: 'social', icon: Share2, label: 'Social Media', path: '/dashboard/social-media' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
    { id: 'influencers', icon: MessageCircle, label: 'Influencers', path: '/dashboard/influencers' },
  ];

  return (
    <div 
      className={`fixed left-6 top-32 flex flex-col gap-2 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition-all duration-300 ease-in-out z-50 ${
        isHovered ? 'w-64 bg-[#1a1a1a]/95' : 'w-20 bg-white/5'
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
            <p className="text-sm font-semibold text-white whitespace-nowrap">James Radcliffe</p>
            <p className="text-xs text-gray-400 whitespace-nowrap">james@adsphere.com</p>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
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
  );
}

export default Sidebar;
