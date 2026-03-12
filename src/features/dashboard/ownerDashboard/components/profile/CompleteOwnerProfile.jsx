import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Briefcase, Target, ArrowRight, ArrowLeft, CheckCircle2
} from 'lucide-react';
import { toast } from 'react-toastify';
import useProfileStore from '../../../../../stores/profileStore';

export default function CompleteOwnerProfile() {
  const navigate = useNavigate();
  const updateOwnerProfile = useProfileStore((s) => s.updateOwnerProfile);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    industry: '',
    location: '',
    description: '',
    image: null,
    imagePreview: null,
    website: '',
    phoneNumber: '',
    platformsUsed: [],
    primaryMarketingGoal: '',
    targetAudience: {
      ageRange: '',
      gender: '',
      location: ''
    }
  });

  const businessTypes = ['Startup', 'Small Business', 'Brand', 'Agency', 'E-commerce', 'Personal Brand'];
  const marketingGoals = ['Brand Awareness', 'Lead Generation', 'Increase Sales', 'App Downloads', 'Community Growth', 'Product Launch Promotion'];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const result = await updateOwnerProfile(formData);
    
    if (result.success) {
      toast.success('Profile completed successfully!');
      navigate('/dashboard/owner/profile');
    } else {
      toast.error(result.error || 'Failed to complete profile');
    }
  };

  const steps = [
    {
      title: 'Business Name',
      icon: Building2,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">What is your business name?</label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            placeholder="Enter your business name"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
          />
        </div>
      )
    },
    {
      title: 'Business Type',
      icon: Briefcase,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">What type of business do you run?</label>
          <div className="grid grid-cols-2 gap-3">
            {businessTypes.map((type) => (
              <motion.button
                key={type}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChange('businessType', type)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  formData.businessType === type
                    ? 'border-[#C1B6FD] bg-[#C1B6FD]/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Marketing Goal',
      icon: Target,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">What is your primary marketing goal?</label>
          <div className="grid grid-cols-1 gap-3">
            {marketingGoals.map((goal) => (
              <motion.button
                key={goal}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChange('primaryMarketingGoal', goal)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  formData.primaryMarketingGoal === goal
                    ? 'border-[#C1B6FD] bg-[#C1B6FD]/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                {goal}
              </motion.button>
            ))}
          </div>
        </div>
      )
    }
  ];

  const Icon = steps[currentStep].icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="p-6 w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white/5 rounded-2xl p-8 shadow-2xl">
        {/* Step Icon and Title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#745CB4] to-[#C1B6FD] rounded-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{steps[currentStep].title}</h2>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep].component}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 px-6 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}
          
          <button
            type="button"
            onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            {currentStep === steps.length - 1 ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Skip Link */}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => navigate('/dashboard/owner/profile')}
          className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
