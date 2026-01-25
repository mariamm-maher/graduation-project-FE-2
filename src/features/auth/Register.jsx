import { useState, useEffect } from 'react';
import { User, Mail, Lock, ArrowRight, Chrome } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../../stores/authStore';
import RoleSelection from './RoleSelection';
import InfluencerOnboarding from './InfluencerOnboarding';
import CampaignOwnerOnboarding from './CampaignOwnerOnboarding';

export default function Register({ onSwitchToLogin, onStepChange }) {
  const [step, setStep] = useState('register'); // 'register', 'role-selection', 'influencer-onboarding', 'campaign-owner-onboarding'
  const { signup, isLoading, error: authError } = useAuthStore();
  
  // Notify parent about step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, onStepChange]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data in the format expected by the API
    const signupData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    // Call signup from authStore
    const result = await signup(signupData);
    
    if (result.success) {
      console.log('Registration successful:', result);
      
      // Show success toast
      toast.success('Your account is made successfully, choose your role', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      
      // Move to role selection step
      setStep('role-selection');
    } else {
      console.error('Registration failed:', result.error);
      
      // Show error toast
      toast.error(result.error || 'Registration failed. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      
      // Don't proceed to next step on error
    }
  };

  const handleRoleSelect = (role) => {
    console.log('Selected role:', role);
    console.log('Complete registration data:', { ...formData, role });
    // Complete registration for campaign owner
    // Here you would typically make an API call
  };

  const handleInfluencerNext = () => {
    // Navigate to influencer onboarding
    setStep('influencer-onboarding');
  };

  const handleInfluencerOnboardingComplete = (onboardingData) => {
    console.log('Influencer onboarding completed:', onboardingData);
    console.log('Complete registration data:', { 
      ...formData, 
      role: 'influencer',
      profile: onboardingData 
    });
    // Here you would typically make an API call to complete registration
  };

  const handleInfluencerOnboardingSkip = () => {
    console.log('Influencer onboarding skipped');
    console.log('Complete registration data:', { 
      ...formData, 
      role: 'influencer'
    });
    // Here you would typically make an API call to complete registration
  };

  const handleCampaignOwnerNext = () => {
    // Navigate to campaign owner onboarding
    setStep('campaign-owner-onboarding');
  };

  const handleCampaignOwnerOnboardingComplete = (onboardingData) => {
    console.log('Campaign owner onboarding completed:', onboardingData);
    console.log('Complete registration data:', { 
      ...formData, 
      role: 'campaign_owner',
      profile: onboardingData 
    });
    // Here you would typically make an API call to complete registration
  };

  const handleCampaignOwnerOnboardingSkip = () => {
    console.log('Campaign owner onboarding skipped');
    console.log('Complete registration data:', { 
      ...formData, 
      role: 'campaign_owner'
    });
    // Here you would typically make an API call to complete registration
  };

  // Show campaign owner onboarding if step is 'campaign-owner-onboarding'
  if (step === 'campaign-owner-onboarding') {
    return (
      <CampaignOwnerOnboarding 
        onComplete={handleCampaignOwnerOnboardingComplete}
        onSkip={handleCampaignOwnerOnboardingSkip}
        onBack={() => setStep('role-selection')}
        onSwitchToLogin={onSwitchToLogin}
        userEmail={formData.email}
      />
    );
  }

  // Show influencer onboarding if step is 'influencer-onboarding'
  if (step === 'influencer-onboarding') {
    return (
      <InfluencerOnboarding 
        onComplete={handleInfluencerOnboardingComplete}
        onSkip={handleInfluencerOnboardingSkip}
        onBack={() => setStep('role-selection')}
        onSwitchToLogin={onSwitchToLogin}
        userEmail={formData.email}
      />
    );
  }

  // Show role selection if step is 'role-selection'
  if (step === 'role-selection') {
    return (
      <RoleSelection 
        onRoleSelect={handleRoleSelect}
        onInfluencerNext={handleInfluencerNext}
        onCampaignOwnerNext={handleCampaignOwnerNext}
        onSwitchToLogin={onSwitchToLogin}
        userEmail={formData.email}
      />
    );
  }

  // Show registration form
  return (
    <div className="w-full animate-fadeIn">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 animate-slideDown">Create Account</h2>
        <p className="text-gray-400 text-sm animate-slideDown" style={{ animationDelay: '0.1s' }}>Join us and start your journey</p>
        
        {/* Error Message */}
        {authError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{authError}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-2 gap-3 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#C1B6FD] transition-colors duration-300" />
            </div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="w-full pl-11 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300 hover:bg-white/10"
              required
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#C1B6FD] transition-colors duration-300" />
            </div>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full pl-11 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300 hover:bg-white/10"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#C1B6FD] transition-colors duration-300" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full pl-11 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300 hover:bg-white/10"
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#C1B6FD] transition-colors duration-300" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full pl-11 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300 hover:bg-white/10"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white font-semibold py-3.5 rounded-lg hover:shadow-lg hover:shadow-[#C1B6FD]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-2 flex items-center justify-center gap-2 group animate-slideUp disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ animationDelay: '0.4s' }}
        >
          <span>{isLoading ? 'Creating account...' : 'Create account'}</span>
          {!isLoading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />}
        </button>
      </form>

      <div className="flex items-center gap-4 my-6 animate-slideUp" style={{ animationDelay: '0.5s' }}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <span className="text-gray-400 text-sm font-medium">OR</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      <button 
        type="button"
        className="w-full flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg py-3 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group animate-slideUp"
        style={{ animationDelay: '0.6s' }}
      >
        <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
        <span>Continue with Google</span>
      </button>

      <p className="text-center text-xs text-gray-500 mt-6 animate-slideUp" style={{ animationDelay: '0.7s' }}>
        By creating an account, you agree to our{' '}
        <a href="#" className="text-[#C1B6FD] font-semibold hover:text-[#745CB4] transition-colors duration-300 hover:underline">Terms & Service</a>
      </p>

      <p className="text-center mt-4 text-gray-400 animate-slideUp" style={{ animationDelay: '0.8s' }}>
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-[#C1B6FD] font-semibold hover:text-[#745CB4] transition-colors duration-300 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}