import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Users, CheckCircle2, ArrowRight, Sparkles, TrendingUp, BarChart3, Zap, Star, Building2, Rocket } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../../stores/authStore';

export default function RoleSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState(null);
  const { selectRole, user, isLoading, logout } = useAuthStore();

  // Get user email and userId from navigation state or auth store
  const userEmail = location.state?.userEmail || user?.email || '';
  const userIdFromState = location.state?.userId;

  const roles = [
    {
      id: 'campaign_owner',
      title: 'Campaign Owner',
      subtitle: 'For Brands & Businesses',
      description: 'Launch campaigns, collaborate with influencers, and track your success',
      icon: Crown,

      features: [
        { text: 'Create unlimited campaigns', icon: Rocket },
        { text: 'AI-powered campaign generator', icon: Sparkles },
        { text: 'Influencer collaboration tools', icon: Users },
        { text: 'Advanced analytics dashboard', icon: BarChart3 }
      ],
      activeColor: 'border-[#745CB4]/50',
      activeBg: 'bg-[#745CB4]/5',
      accentText: 'text-[#C1B6FD]',
      gradient: 'from-[#745CB4] to-[#C1B6FD]'
    },
    {
      id: 'influencer',
      title: 'Influencer',
      subtitle: 'For Content Creators',
      description: 'Discover opportunities, grow your brand, and monetize your influence',
      icon: Star,

      features: [
        { text: 'Exclusive campaign opportunities', icon: Zap },
        { text: 'Professional portfolio builder', icon: Star },
        { text: 'Direct brand connections', icon: Building2 }
      ],
      activeColor: 'border-purple-500/50',
      activeBg: 'bg-purple-500/5',
      accentText: 'text-purple-400',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const handleContinue = async () => {
    if (!selectedRole) return;

    // Try to get userId from auth store first, then from navigation state
    let userId = user?.userId || userIdFromState;

    console.log('RoleSelection - Debug:', { 
      userFromStore: user, 
      userIdFromState,
      finalUserId: userId 
    });

    // If no userId in auth store or navigation state, we have a problem
    if (!userId) {
      toast.error('User ID not found. Please try logging in again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      
      // Redirect to login
      navigate('/login');
      return;
    }

    // Map role to roleId: 1 for campaign_owner, 2 for influencer
    const roleId = selectedRole === 'campaign_owner' ? 1 : 2;

    // Call selectRole from authStore
    const result = await selectRole(userId, roleId);

    if (result.success) {
      toast.success("Role assigned successfully! Let's complete your profile", {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
      });

      // Always navigate to appropriate onboarding page based on selected role
      setTimeout(() => {
        if (selectedRole === 'campaign_owner') {
          navigate('/onboarding/campaign-owner', {
            state: {
              userId,
              userEmail
            }
          });
        } else if (selectedRole === 'influencer') {
          navigate('/onboarding/influencer', {
            state: {
              userId,
              userEmail
            }
          });
        }
      }, 600);
    } else {
      // Show error toast
      toast.error(result.error || 'Failed to assign role. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col font-sans">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2 tracking-tight">
          Choose Your Path
        </h2>
        <p className="text-gray-400 text-base max-w-md mx-auto">
          Select the role that best describes your objective
        </p>

        {userEmail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 border border-gray-800 rounded-lg"
          >
            <div className="w-2 h-2 bg-[#C1B6FD] rounded-full" />
            <span className="text-xs text-gray-300 font-medium">{userEmail}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + (index * 0.1),
                ease: 'easeOut'
              }}
              onClick={() => setSelectedRole(role.id)}
              className="relative group cursor-pointer h-full"
            >
              {/* Card */}
              <div 
                className={`relative h-full flex flex-col p-6 rounded-xl border transition-all duration-300 ${
                  isSelected 
                    ? `border-transparent shadow-md ${role.activeBg} ring-1 ring-inset ring-opacity-50 ring-white/10` 
                    : 'border-gray-800 bg-gray-900/40 hover:bg-gray-800/60 hover:border-gray-700'
                }`}
              >
                {/* Active Border Overlay */}
                {isSelected && (
                  <div className={`absolute inset-0 rounded-xl border-2 ${role.activeColor} transition-colors pointer-events-none`} />
                )}

                {/* Content */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                       <div className={`p-2 rounded-lg bg-gray-800/80 border border-gray-700/50 flex-shrink-0 transition-colors ${isSelected ? `text-white bg-gradient-to-br ${role.gradient}` : 'text-gray-400 group-hover:text-gray-200'}`}>
                         <Icon className="w-5 h-5" strokeWidth={2} />
                       </div>
                       <div>
                         <h3 className="text-lg font-semibold text-gray-100 tracking-tight">
                           {role.title}
                         </h3>
                         <p className={`text-xs font-medium ${isSelected ? role.accentText : 'text-gray-500'}`}>{role.subtitle}</p>
                       </div>
                    </div>
                  </div>
                  {/* Selection Indicator */}
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? `border-transparent bg-gradient-to-r ${role.gradient}` : 'border-gray-600 group-hover:border-gray-500'}`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  {role.description}
                </p>

                {/* Features List */}
                <div className="space-y-2.5 flex-1 mt-auto pt-4 border-t border-gray-800/50">
                  {role.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5"
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? role.accentText : 'text-gray-600'}`} />
                      <span className="text-sm text-gray-300 font-medium">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="max-w-md mx-auto w-full space-y-6"
      >
        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
            selectedRole && !isLoading
              ? `bg-gray-100 text-gray-900 hover:bg-white shadow-md active:scale-[0.98]`
              : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50'
          }`}
        >
          {isLoading ? 'Processing...' : 'Continue'}
          {!isLoading && <ArrowRight className="w-5 h-5" strokeWidth={2} />}
        </button>

        {/* Footer info */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-white font-medium hover:text-gray-200 transition-colors hover:underline underline-offset-4"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
