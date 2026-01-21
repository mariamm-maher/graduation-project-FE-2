import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, X, Sparkles } from 'lucide-react';

export default function InfluencerOnboarding({ onComplete, onSkip, userEmail }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    platforms: [],
    primaryPlatform: '',
    followerCount: '',
    engagementRate: '',
    contentNiches: [],
    collaborationTypes: [],
    audienceAge: '',
    location: '',
    bio: ''
  });

  const steps = [
    {
      id: 'platforms',
      title: 'What platforms are you active on?',
      subtitle: 'Select all that apply',
      type: 'multi-select',
      field: 'platforms',
      options: [
        { value: 'instagram', label: 'Instagram', icon: '📸' },
        { value: 'youtube', label: 'YouTube', icon: '📺' },
        { value: 'tiktok', label: 'TikTok', icon: '🎵' },
        { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
        { value: 'facebook', label: 'Facebook', icon: '👥' },
        { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
        { value: 'twitch', label: 'Twitch', icon: '🎮' },
        { value: 'snapchat', label: 'Snapchat', icon: '👻' }
      ]
    },
    {
      id: 'primaryPlatform',
      title: 'What is your primary platform?',
      subtitle: 'Where do you have the most engagement?',
      type: 'single-select',
      field: 'primaryPlatform',
      optionsFromPrevious: 'platforms'
    },
    {
      id: 'followerCount',
      title: 'What is your follower count range?',
      subtitle: 'Select your largest platform',
      type: 'single-select',
      field: 'followerCount',
      options: [
        { value: '0-1k', label: '0 - 1K', icon: '🌱' },
        { value: '1k-10k', label: '1K - 10K', icon: '🌿' },
        { value: '10k-50k', label: '10K - 50K', icon: '🌳' },
        { value: '50k-100k', label: '50K - 100K', icon: '🌲' },
        { value: '100k-500k', label: '100K - 500K', icon: '⭐' },
        { value: '500k-1m', label: '500K - 1M', icon: '🔥' },
        { value: '1m+', label: '1M+', icon: '💎' }
      ]
    },
    {
      id: 'engagementRate',
      title: 'What is your average engagement rate?',
      subtitle: 'Likes + Comments / Followers',
      type: 'single-select',
      field: 'engagementRate',
      options: [
        { value: '0-1', label: '0% - 1%', icon: '📊' },
        { value: '1-3', label: '1% - 3%', icon: '📈' },
        { value: '3-5', label: '3% - 5%', icon: '📊' },
        { value: '5-10', label: '5% - 10%', icon: '📈' },
        { value: '10+', label: '10%+', icon: '🚀' },
        { value: 'not-sure', label: 'Not sure', icon: '🤔' }
      ]
    },
    {
      id: 'contentNiches',
      title: 'What are your content niches?',
      subtitle: 'Select all that apply',
      type: 'multi-select',
      field: 'contentNiches',
      options: [
        { value: 'fashion', label: 'Fashion & Style', icon: '👗' },
        { value: 'beauty', label: 'Beauty & Makeup', icon: '💄' },
        { value: 'fitness', label: 'Fitness & Health', icon: '💪' },
        { value: 'food', label: 'Food & Cooking', icon: '🍳' },
        { value: 'travel', label: 'Travel', icon: '✈️' },
        { value: 'tech', label: 'Technology', icon: '💻' },
        { value: 'gaming', label: 'Gaming', icon: '🎮' },
        { value: 'lifestyle', label: 'Lifestyle', icon: '🌟' },
        { value: 'business', label: 'Business', icon: '💼' },
        { value: 'education', label: 'Education', icon: '📚' },
        { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
        { value: 'parenting', label: 'Parenting', icon: '👶' }
      ]
    },
    {
      id: 'collaborationTypes',
      title: 'What collaboration types interest you?',
      subtitle: 'Select all that apply',
      type: 'multi-select',
      field: 'collaborationTypes',
      options: [
        { value: 'sponsored-posts', label: 'Sponsored Posts', icon: '📸' },
        { value: 'product-reviews', label: 'Product Reviews', icon: '⭐' },
        { value: 'brand-ambassadorship', label: 'Brand Ambassadorship', icon: '🤝' },
        { value: 'affiliate-marketing', label: 'Affiliate Marketing', icon: '💰' },
        { value: 'giveaways', label: 'Giveaways', icon: '🎁' },
        { value: 'event-appearances', label: 'Event Appearances', icon: '🎤' },
        { value: 'content-creation', label: 'Content Creation', icon: '🎨' },
        { value: 'consulting', label: 'Consulting', icon: '💡' }
      ]
    },
    {
      id: 'audienceAge',
      title: 'What is your primary audience age range?',
      subtitle: 'Select the most common age group',
      type: 'single-select',
      field: 'audienceAge',
      options: [
        { value: '13-17', label: '13-17', icon: '👦' },
        { value: '18-24', label: '18-24', icon: '🎓' },
        { value: '25-34', label: '25-34', icon: '💼' },
        { value: '35-44', label: '35-44', icon: '👨‍💼' },
        { value: '45-54', label: '45-54', icon: '👔' },
        { value: '55+', label: '55+', icon: '👴' },
        { value: 'mixed', label: 'Mixed/Diverse', icon: '🌈' }
      ]
    },
    {
      id: 'location',
      title: 'Where is your primary audience located?',
      subtitle: 'Select main region or country',
      type: 'input',
      field: 'location',
      placeholder: 'e.g., United States, Europe, Global'
    },
    {
      id: 'bio',
      title: 'Tell us about yourself (Optional)',
      subtitle: 'Share your story, achievements, or what makes you unique',
      type: 'textarea',
      field: 'bio',
      placeholder: 'Write a brief bio about yourself and your content...',
      optional: true
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log('Onboarding completed:', formData);
    onComplete(formData);
  };

  const handleSkip = () => {
    onSkip();
  };

  const handleMultiSelect = (field, value) => {
    const current = formData[field] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const handleSingleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const isStepValid = () => {
    const step = steps[currentStep];
    if (step.optional) return true;
    
    const value = formData[step.field];
    if (step.type === 'multi-select') {
      return value && value.length > 0;
    }
    return value && value.length > 0;
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Get options for primary platform from selected platforms
  const getPrimaryPlatformOptions = () => {
    if (currentStepData.optionsFromPrevious === 'platforms' && formData.platforms.length > 0) {
      const platformsStep = steps.find(s => s.id === 'platforms');
      return platformsStep.options.filter(opt => formData.platforms.includes(opt.value));
    }
    return currentStepData.options || [];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-[#C1B6FD]" />
          <h2 className="text-3xl font-bold text-white">
            Influencer Profile Setup
          </h2>
        </div>
        <p className="text-gray-400">
          Help us understand you better to match you with the right campaigns
        </p>
        {userEmail && (
          <p className="text-sm text-[#C1B6FD] mt-2">
            {userEmail}
          </p>
        )}
      </motion.div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-[#C1B6FD] font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-8 shadow-2xl shadow-purple-500/10 mb-6"
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-gray-400 mb-6">
            {currentStepData.subtitle}
          </p>

          {/* Multi-select options */}
          {currentStepData.type === 'multi-select' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {currentStepData.options.map((option) => {
                const isSelected = formData[currentStepData.field]?.includes(option.value);
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMultiSelect(currentStepData.field, option.value)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-[#C1B6FD] bg-[#C1B6FD]/10 shadow-lg shadow-[#C1B6FD]/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="text-sm font-medium text-white">{option.label}</div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-5 h-5 text-[#C1B6FD]" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Single-select options */}
          {currentStepData.type === 'single-select' && (
            <div className="space-y-3">
              {getPrimaryPlatformOptions().map((option) => {
                const isSelected = formData[currentStepData.field] === option.value;
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSingleSelect(currentStepData.field, option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      isSelected
                        ? 'border-[#C1B6FD] bg-[#C1B6FD]/10 shadow-lg shadow-[#C1B6FD]/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-2xl">{option.icon}</div>
                    <div className="flex-1 text-left text-white font-medium">{option.label}</div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-[#C1B6FD]" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Text input */}
          {currentStepData.type === 'input' && (
            <input
              type="text"
              value={formData[currentStepData.field] || ''}
              onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
              placeholder={currentStepData.placeholder}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all"
            />
          )}

          {/* Textarea */}
          {currentStepData.type === 'textarea' && (
            <textarea
              value={formData[currentStepData.field] || ''}
              onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
              placeholder={currentStepData.placeholder}
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all resize-none"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
            currentStep === 0
              ? 'opacity-0 pointer-events-none'
              : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <button
          onClick={handleSkip}
          className="px-6 py-3 rounded-xl font-medium text-gray-400 hover:text-white transition-all flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Skip for now
        </button>

        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            isStepValid()
              ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white hover:shadow-lg hover:shadow-[#C1B6FD]/50 hover:scale-[1.02]'
              : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-50'
          }`}
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-center text-xs text-gray-500 mt-6">
        Don't worry, you can always update this information later in your profile
      </p>
    </div>
  );
}
