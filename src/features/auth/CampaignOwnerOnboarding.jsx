import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, X, Sparkles } from 'lucide-react';

export default function CampaignOwnerOnboarding({ onComplete, onSkip, userEmail }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    brandName: '',
    businessType: '',
    industry: '',
    marketingGoals: [],
    targetAudience: '',
    platforms: [],
    website: ''
  });

  const steps = [
    {
      id: 'brandName',
      title: 'What is your brand name?',
      subtitle: 'Enter your company or brand name',
      type: 'input',
      field: 'brandName',
      placeholder: 'e.g., Acme Inc.'
    },
    {
      id: 'businessType',
      title: 'What type of business are you?',
      subtitle: 'Select the option that best describes your business',
      type: 'single-select',
      field: 'businessType',
      options: [
        { value: 'b2c', label: 'B2C (Business to Consumer)', icon: '🛍️' },
        { value: 'b2b', label: 'B2B (Business to Business)', icon: '🏢' },
        { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
        { value: 'saas', label: 'SaaS/Software', icon: '💻' },
        { value: 'agency', label: 'Agency/Services', icon: '🎯' },
        { value: 'nonprofit', label: 'Non-profit', icon: '❤️' },
        { value: 'startup', label: 'Startup', icon: '🚀' },
        { value: 'enterprise', label: 'Enterprise', icon: '🏛️' }
      ]
    },
    {
      id: 'industry',
      title: 'What industry are you in?',
      subtitle: 'Select your primary industry',
      type: 'single-select',
      field: 'industry',
      options: [
        { value: 'fashion', label: 'Fashion & Apparel', icon: '👗' },
        { value: 'beauty', label: 'Beauty & Cosmetics', icon: '💄' },
        { value: 'health', label: 'Health & Wellness', icon: '💪' },
        { value: 'food', label: 'Food & Beverage', icon: '🍳' },
        { value: 'travel', label: 'Travel & Hospitality', icon: '✈️' },
        { value: 'technology', label: 'Technology', icon: '💻' },
        { value: 'finance', label: 'Finance & Banking', icon: '💰' },
        { value: 'education', label: 'Education', icon: '📚' },
        { value: 'entertainment', label: 'Entertainment & Media', icon: '🎬' },
        { value: 'automotive', label: 'Automotive', icon: '🚗' },
        { value: 'real-estate', label: 'Real Estate', icon: '🏠' },
        { value: 'retail', label: 'Retail', icon: '🏪' }
      ]
    },
    {
      id: 'marketingGoals',
      title: 'What are your primary marketing goals?',
      subtitle: 'Select all that apply',
      type: 'multi-select',
      field: 'marketingGoals',
      options: [
        { value: 'brand-awareness', label: 'Brand Awareness', icon: '📢' },
        { value: 'lead-generation', label: 'Lead Generation', icon: '🎯' },
        { value: 'sales', label: 'Increase Sales', icon: '💰' },
        { value: 'engagement', label: 'Audience Engagement', icon: '💬' },
        { value: 'traffic', label: 'Website Traffic', icon: '🌐' },
        { value: 'social-growth', label: 'Social Media Growth', icon: '📈' },
        { value: 'product-launch', label: 'Product Launch', icon: '🚀' },
        { value: 'reputation', label: 'Brand Reputation', icon: '⭐' }
      ]
    },
    {
      id: 'targetAudience',
      title: 'Describe your target audience (Optional)',
      subtitle: 'Who are you trying to reach?',
      type: 'textarea',
      field: 'targetAudience',
      placeholder: 'e.g., Women aged 25-40 interested in sustainable fashion, urban professionals...',
      optional: true
    },
    {
      id: 'platforms',
      title: 'Which platforms do you use for marketing?',
      subtitle: 'Select all that apply',
      type: 'multi-select',
      field: 'platforms',
      options: [
        { value: 'instagram', label: 'Instagram', icon: '📸' },
        { value: 'facebook', label: 'Facebook', icon: '👥' },
        { value: 'youtube', label: 'YouTube', icon: '📺' },
        { value: 'tiktok', label: 'TikTok', icon: '🎵' },
        { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
        { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
        { value: 'pinterest', label: 'Pinterest', icon: '📌' },
        { value: 'snapchat', label: 'Snapchat', icon: '👻' }
      ]
    },
    {
      id: 'website',
      title: 'What is your website URL? (Optional)',
      subtitle: 'Enter your company website',
      type: 'input',
      field: 'website',
      placeholder: 'e.g., https://www.yourcompany.com',
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
    console.log('Campaign Owner onboarding completed:', formData);
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
            Brand Profile Setup
          </h2>
        </div>
        <p className="text-gray-400">
          Tell us about your brand to help us create better campaigns
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
              {currentStepData.options.map((option) => {
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
