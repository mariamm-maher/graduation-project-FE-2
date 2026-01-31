import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Users, CheckCircle2, ArrowRight, Sparkles, TrendingUp, BarChart3, Zap, Star, Building2, Rocket } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../../stores/authStore';

export default function RoleSelection({ onRoleSelect, onInfluencerNext, onCampaignOwnerNext, onSwitchToLogin, userEmail }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const { selectRole, user, isLoading } = useAuthStore();

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
      gradient: 'from-[#745CB4] via-[#9381C4] to-[#C1B6FD]',
      glowColor: '#C1B6FD',
      bgPattern: 'campaign'
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
      gradient: 'from-purple-600 via-pink-500 to-pink-400',
      glowColor: '#ec4899',
      bgPattern: 'influencer'
    }
  ];

  const handleContinue = async () => {
    if (selectedRole && user?.userId) {
      // Map role to roleId: 1 for campaign_owner, 2 for influencer
      const roleId = selectedRole === 'campaign_owner' ? 1 : 2;
      
      // Call selectRole from authStore
      const result = await selectRole(user.userId, roleId);
      
      if (result.success) {
        // Show success toast
        toast.success('Role assigned successfully! Please sign in to continue.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        
        // Navigate to login page after role selection
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        // Show error toast
        toast.error(result.error || 'Failed to assign role. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }
    }
  };

  return (
    <div className="w-full min-h-[600px] flex flex-col">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8"
      >
 
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
        >
          Choose Your Path
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-lg max-w-md mx-auto"
        >
          Select the role that best describes you
        </motion.p>
        
        {userEmail && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#745CB4]/20 to-[#C1B6FD]/20 border border-[#C1B6FD]/30 rounded-full backdrop-blur-sm"
          >
            <div className="w-2 h-2 bg-[#C1B6FD] rounded-full animate-pulse" />
            <span className="text-sm text-[#C1B6FD] font-medium">{userEmail}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 flex-1">
        {roles.map((role, index) => {
          const Icon = role.icon;
    
          const isSelected = selectedRole === role.id;
          
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.6 + (index * 0.2),
                ease: [0.22, 1, 0.36, 1]
              }}
              onClick={() => setSelectedRole(role.id)}
              className="relative group cursor-pointer"
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute -inset-1 rounded-3xl opacity-75 blur-xl transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${role.glowColor}40, ${role.glowColor}20)`
                }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Card */}
              <div className="relative h-full rounded-3xl overflow-hidden transition-all duration-500 ">
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/80 backdrop-blur-xl" />
                
                {/* Animated gradient overlay */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-10 transition-opacity duration-500`}
                  animate={{ opacity: [0.1, 0.15, 0.1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Content */}
                <div className="relative p-8 h-full flex flex-col">
                  {/* Header with Icon */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="mb-2">
                        <h3 className="text-2xl font-bold text-white mb-1 flex items-center justify-between">
                          <span>{role.title}</span>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0 ml-3"
                          >
                            <Icon className="w-7 h-7 text-white/70 hover:text-white transition-colors duration-300" />
                          </motion.div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                              className="ml-2"
                            >
                              <CheckCircle2 className="w-6 h-6 text-[#C1B6FD]" />
                            </motion.div>
                          )}
                        </h3>
                        <p className="text-sm text-[#C1B6FD] font-medium">{role.subtitle}</p>
                      </div>
                      
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                    
                
                  </div>
                  
                  {/* Features Grid */}
                  <div className="space-y-4 flex-1">
                    {role.features.map((feature, idx) => {
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: 0.8 + (index * 0.15) + (idx * 0.08),
                            duration: 0.5,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          className="flex items-start gap-4 group/item"
                        >
                          <motion.div 
                            className={`relative flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${role.gradient} opacity-90 group-hover/item:opacity-100 transition-all duration-300 shadow-lg`}
                            whileHover={{ scale: 1.2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          >
                            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                            <div className="absolute inset-[6px] rounded-full bg-white opacity-80 group-hover/item:opacity-100 transition-opacity duration-300" />
                          </motion.div>
                          <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors duration-300 leading-relaxed">
                            {feature.text}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 pt-6 border-t border-white/10"
                      >
                        <div className="flex items-center justify-center gap-2 text-[#C1B6FD]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-semibold">Selected</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="space-y-6"
      >
        {/* Continue Button */}
        <div className="relative group/btn">
          {selectedRole && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -inset-1 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-2xl blur-xl opacity-50 group-hover/btn:opacity-75 transition-opacity"
            />
          )}
          
          <motion.button
            whileHover={selectedRole ? { scale: 1.02 } : {}}
            whileTap={selectedRole ? { scale: 0.98 } : {}}
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className={`relative w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              selectedRole && !isLoading
                ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center gap-3">
              <span>{isLoading ? 'Assigning role...' : 'Continue to Next Step'}</span>
              {!isLoading && (
                <motion.div
                  animate={selectedRole ? { x: [0, 4, 0] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              )}
            </span>
          </motion.button>
        </div>
        
        {/* Footer */}
        <div className="text-center space-y-3">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3" />
            <span>You can update your role anytime in settings</span>
          </p>
          
          {onSwitchToLogin && (
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-[#C1B6FD] font-semibold hover:text-white transition-colors duration-300 underline-offset-4 hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
