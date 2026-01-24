import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RoleSelection({ onRoleSelect, onInfluencerNext, onCampaignOwnerNext, onSwitchToLogin, userEmail }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'campaign_owner',
      title: 'Campaign Owner',
      description: 'I want to create and manage marketing campaigns',
      icon: Building2,
      features: [
        'Create unlimited campaigns',
        'Access AI campaign generator',
        'Manage influencer collaborations',
        'Track campaign analytics',
        'Budget management tools'
      ],
      gradient: 'from-[#745CB4] to-[#C1B6FD]',
      bgGradient: 'from-[#745CB4]/10 to-[#C1B6FD]/10'
    },
    {
      id: 'influencer',
      title: 'Influencer',
      description: 'I want to collaborate with brands and monetize my content',
      icon: Users,
      features: [
        'Browse campaign opportunities',
        'Showcase your portfolio',
        'Connect with brands',
        'Track your earnings',
        'Grow your influence'
      ],
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      if (selectedRole === 'influencer') {
        // Navigate to influencer onboarding
        onInfluencerNext();
      } else if (selectedRole === 'campaign_owner') {
        // Navigate to campaign owner onboarding
        onCampaignOwnerNext();
      } else {
        // Complete registration
        onRoleSelect(selectedRole);
      }
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Choose Your Role
          </h2>
        </div>
        <p className="text-gray-400">
          Select how you want to use the platform
        </p>
        {userEmail && (
          <p className="text-sm text-[#C1B6FD] mt-2">
            Registering as: {userEmail}
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedRole(role.id)}
              className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
                isSelected
                  ? 'border-[#C1B6FD] shadow-lg shadow-[#C1B6FD]/30 scale-[1.02]'
                  : 'border-white/10 hover:border-white/20 hover:scale-[1.01]'
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${role.bgGradient} opacity-50`} />
              
              {/* Content */}
              <div className="relative p-5 sm:p-6 bg-white/5 backdrop-blur-sm">
                {/* Icon and Title - Side by side */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {role.title}
                    </h3>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#C1B6FD]" />
                      </motion.div>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-6">
                  {role.description}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  {role.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C1B6FD] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Selected overlay */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-[#745CB4]/10 to-[#C1B6FD]/10 pointer-events-none"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Continue Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleContinue}
        disabled={!selectedRole}
        className={`w-full max-w-md mx-auto flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
          selectedRole
            ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] hover:shadow-lg hover:shadow-[#C1B6FD]/50 hover:scale-[1.02] cursor-pointer'
            : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-50'
        }`}
      >
        Continue
        <ArrowRight className="w-5 h-5" />
      </motion.button>

      <div className="text-center mt-6">
        <p className="text-xs text-gray-500 mb-2">
          You can always change your role later in account settings
        </p>
        {onSwitchToLogin && (
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#C1B6FD] underline hover:text-[#745CB4] transition-colors"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
