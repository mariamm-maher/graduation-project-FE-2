import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Check, X, Sparkles,
  Camera, Youtube, Music, Twitter, Users, Briefcase, Gamepad2, Ghost,
  Sprout, Leaf, TreePine, TreeDeciduous, Star, Flame, Gem,
  BarChart, TrendingUp, Rocket, HelpCircle,
  Shirt, Sparkles as SparklesIcon, Dumbbell, ChefHat, Plane, Laptop, BookOpen, Film, Baby,
  Handshake, DollarSign, Gift, Mic, Palette, Lightbulb, User, GraduationCap, UserCircle
} from 'lucide-react';

export default function InfluencerOnboarding({ onComplete, onSkip, onBack, onSwitchToLogin, userEmail }) {
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
        { value: 'instagram', label: 'Instagram', icon: Camera },
        { value: 'youtube', label: 'YouTube', icon: Youtube },
        { value: 'tiktok', label: 'TikTok', icon: Music },
        { value: 'twitter', label: 'Twitter/X', icon: Twitter },
        { value: 'facebook', label: 'Facebook', icon: Users },
        { value: 'linkedin', label: 'LinkedIn', icon: Briefcase },
        { value: 'twitch', label: 'Twitch', icon: Gamepad2 },
        { value: 'snapchat', label: 'Snapchat', icon: Ghost }
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
        { value: '0-1k', label: '0 - 1K', icon: Sprout },
        { value: '1k-10k', label: '1K - 10K', icon: Leaf },
        { value: '10k-50k', label: '10K - 50K', icon: TreePine },
        { value: '50k-100k', label: '50K - 100K', icon: TreeDeciduous },
        { value: '100k-500k', label: '100K - 500K', icon: Star },
        { value: '500k-1m', label: '500K - 1M', icon: Flame },
        { value: '1m+', label: '1M+', icon: Gem }
      ]
    },
    {
      id: 'engagementRate',
      title: 'What is your average engagement rate?',
      subtitle: 'Likes + Comments / Followers',
      type: 'single-select',
      field: 'engagementRate',
      options: [
        { value: '0-1', label: '0% - 1%', icon: BarChart },
        { value: '1-3', label: '1% - 3%', icon: TrendingUp },
        { value: '3-5', label: '3% - 5%', icon: BarChart },
        { value: '5-10', label: '5% - 10%', icon: TrendingUp },
        { value: '10+', label: '10%+', icon: Rocket },
        { value: 'not-sure', label: 'Not sure', icon: HelpCircle }
      ]
    },
    {
      id: 'contentNiches',
      title: 'What are your content niches?',
      subtitle: 'Select all that apply',
      type: 'multi-select',
      field: 'contentNiches',
      options: [
        { value: 'fashion', label: 'Fashion & Style', icon: Shirt },
        { value: 'beauty', label: 'Beauty & Makeup', icon: SparklesIcon },
        { value: 'fitness', label: 'Fitness & Health', icon: Dumbbell },
        { value: 'food', label: 'Food & Cooking', icon: ChefHat },
        { value: 'travel', label: 'Travel', icon: Plane },
        { value: 'tech', label: 'Technology', icon: Laptop },
        { value: 'gaming', label: 'Gaming', icon: Gamepad2 },
        { value: 'lifestyle', label: 'Lifestyle', icon: SparklesIcon },
        { value: 'business', label: 'Business', icon: Briefcase },
        { value: 'education', label: 'Education', icon: BookOpen },
        { value: 'entertainment', label: 'Entertainment', icon: Film },
        { value: 'parenting', label: 'Parenting', icon: Baby }
      ]
    },
    {
      id: 'collaborationTypes',
      title: 'What collaboration types interest you?',
      subtitle: 'Select all that apply',
      type: 'multi-select',
      field: 'collaborationTypes',
      options: [
        { value: 'sponsored-posts', label: 'Sponsored Posts', icon: Camera },
        { value: 'product-reviews', label: 'Product Reviews', icon: Star },
        { value: 'brand-ambassadorship', label: 'Brand Ambassadorship', icon: Handshake },
        { value: 'affiliate-marketing', label: 'Affiliate Marketing', icon: DollarSign },
        { value: 'giveaways', label: 'Giveaways', icon: Gift },
        { value: 'event-appearances', label: 'Event Appearances', icon: Mic },
        { value: 'content-creation', label: 'Content Creation', icon: Palette },
        { value: 'consulting', label: 'Consulting', icon: Lightbulb }
      ]
    },
    {
      id: 'audienceAge',
      title: 'What is your primary audience age range?',
      subtitle: 'Select the most common age group',
      type: 'single-select',
      field: 'audienceAge',
      options: [
        { value: '13-17', label: '13-17', icon: User },
        { value: '18-24', label: '18-24', icon: GraduationCap },
        { value: '25-34', label: '25-34', icon: Briefcase },
        { value: '35-44', label: '35-44', icon: Briefcase },
        { value: '45-54', label: '45-54', icon: Shirt },
        { value: '55+', label: '55+', icon: UserCircle },
        { value: 'mixed', label: 'Mixed/Diverse', icon: Palette }
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
    } else if (onBack) {
      // If on first step, go back to role selection
      onBack();
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
    <div className="w-full">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {currentStepData.options.map((option) => {
                const isSelected = formData[currentStepData.field]?.includes(option.value);
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMultiSelect(currentStepData.field, option.value)}
                    className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center min-h-[100px] ${
                      isSelected
                        ? 'border-[#C1B6FD] bg-[#C1B6FD]/10 shadow-lg shadow-[#C1B6FD]/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    {(() => {
                      const IconComponent = option.icon;
                      return (
                        <div className="mb-2">
                          <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-[#C1B6FD]" />
                        </div>
                      );
                    })()}
                    <div className="text-xs sm:text-sm font-medium text-white text-center">{option.label}</div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#C1B6FD]" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Single-select options */}
          {currentStepData.type === 'single-select' && (() => {
            const options = getPrimaryPlatformOptions();
            
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {options.map((option) => {
                  const isSelected = formData[currentStepData.field] === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSingleSelect(currentStepData.field, option.value)}
                      className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center min-h-[100px] ${
                        isSelected
                          ? 'border-[#C1B6FD] bg-[#C1B6FD]/10 shadow-lg shadow-[#C1B6FD]/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      {(() => {
                        const IconComponent = option.icon;
                        return (
                          <div className="mb-2">
                            <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-[#C1B6FD]" />
                          </div>
                        );
                      })()}
                      <div className="text-xs sm:text-sm font-medium text-white text-center">{option.label}</div>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#C1B6FD]" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            );
          })()}

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
          className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 bg-white/5 border border-white/10 text-white hover:bg-white/10"
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

      <div className="text-center mt-6">
        <p className="text-xs text-gray-500 mb-2">
          Don't worry, you can always update this information later in your profile
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
