import { useState, useEffect } from 'react';
import RoleSelection from './RoleSelection';
import InfluencerOnboarding from './InfluencerOnboarding';
import CampaignOwnerOnboarding from './CampaignOwnerOnboarding';

export default function Register({ onSwitchToLogin, onStepChange }) {
  const [step, setStep] = useState('register'); // 'register', 'role-selection', 'influencer-onboarding', 'campaign-owner-onboarding'
  
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
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register data:', formData);
    // Move to role selection step
    setStep('role-selection');
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
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8 text-white">Create an account</h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all"
            required
          />


          <input
            type="password"
            name="password"
            value={formData.password || ''}
            onChange={handleChange}
            placeholder="Create a password"
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white font-medium py-3 rounded-lg hover:shadow-lg hover:shadow-[#C1B6FD]/50 hover:scale-[1.02] transition-all duration-300 mt-2"
        >
          Create account
        </button>
      </form>

      <div className="my-6 text-center text-gray-500 text-sm">OR SIGN UP WITH</div>

      <button className="w-full flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg py-3 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
        Google
      </button>

      <p className="text-center text-xs text-gray-500 mt-6">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-[#C1B6FD] underline hover:text-[#745CB4] transition-colors">Terms & Service</a>
      </p>

      <p className="text-center mt-4 text-gray-400">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-[#C1B6FD] underline hover:text-[#745CB4] transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}