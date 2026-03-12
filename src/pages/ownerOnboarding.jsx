import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Briefcase, MapPin, FileText, Upload, Globe, 
  Phone, Target, Users, ArrowRight, ArrowLeft, CheckCircle2,
  Image as ImageIcon, X
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';
import uploadService from '../api/uploadApi';

export default function OwnerOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, completeCampaignOwnerOnboarding, isLoading } = useAuthStore();
  const userId = location.state?.userId || user?.userId;

  const [currentStep, setCurrentStep] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    industry: '',
    location: '',
    description: '',
    image: null,
    imagePreview: null,
    imageUrl: null,
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

  const businessTypes = [
    'Startup',
    'Small Business',
    'Brand',
    'Agency',
    'E-commerce',
    'Personal Brand'
  ];

  const industries = [
    'Fashion',
    'Food & Beverage',
    'Technology',
    'Health & Fitness',
    'Beauty & Cosmetics',
    'Education',
    'Travel & Tourism',
    'Gaming',
    'Finance',
    'Other'
  ];

  const platforms = [
    'Instagram',
    'Facebook',
    'TikTok',
    'YouTube',
    'Google Ads',
    'LinkedIn',
    'Snapchat',
    'Twitter (X)'
  ];

  const marketingGoals = [
    'Brand Awareness',
    'Lead Generation',
    'Increase Sales',
    'App Downloads',
    'Community Growth',
    'Product Launch Promotion'
  ];

  const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+'];
  const genders = ['Male', 'Female', 'All'];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTargetAudienceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        [field]: value
      }
    }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      platformsUsed: prev.platformsUsed.includes(platform)
        ? prev.platformsUsed.filter(p => p !== platform)
        : [...prev.platformsUsed, platform]
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null,
      imageUrl: null
    }));
    setImageUploaded(false);
  };

  const handleUploadImage = async () => {
    if (!formData.image) {
      toast.error('Please select an image first');
      return;
    }

    setUploadingImage(true);
    try {
      toast.info('Uploading image to cloud...', { position: 'top-right', autoClose: 2000 });
      
      const uploadResponse = await uploadService.uploadImage(formData.image, 'brandLogo');
      
      if (uploadResponse && uploadResponse.data && uploadResponse.data.data && uploadResponse.data.data.url) {
        const imageUrl = uploadResponse.data.data.url;
        setFormData(prev => ({ ...prev, imageUrl }));
        setImageUploaded(true);
        toast.success('Image uploaded successfully!', { position: 'top-right', autoClose: 2000 });
      } else {
        toast.error('Image upload failed. Please try again.');
      }
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : err?.message || 'Upload failed';
      toast.error(errorMsg, { position: 'top-right' });
      console.error('Upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleNext = () => {
    // Validate current step
    if (!validateStep(currentStep)) return;
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.businessName.trim()) {
          toast.error('Please enter your business name');
          return false;
        }
        return true;
      case 1:
        if (!formData.businessType) {
          toast.error('Please select your business type');
          return false;
        }
        return true;
      case 2:
        if (!formData.industry) {
          toast.error('Please select your industry');
          return false;
        }
        return true;
      case 3:
        if (!formData.location.trim()) {
          toast.error('Please enter your business location');
          return false;
        }
        return true;
      case 4:
        if (!formData.description.trim()) {
          toast.error('Please describe your business');
          return false;
        }
        return true;
      case 5:
        // Image upload is optional
        return true;
      case 6:
        if (formData.website && !isValidUrl(formData.website)) {
          toast.error('Please enter a valid website URL');
          return false;
        }
        return true;
      case 7:
        if (!formData.phoneNumber.trim()) {
          toast.error('Please enter your phone number');
          return false;
        }
        return true;
      case 8:
        if (formData.platformsUsed.length === 0) {
          toast.error('Please select at least one platform');
          return false;
        }
        return true;
      case 9:
        if (!formData.primaryMarketingGoal) {
          toast.error('Please select your primary marketing goal');
          return false;
        }
        return true;
      case 10:
        if (!formData.targetAudience.ageRange || !formData.targetAudience.gender || !formData.targetAudience.location) {
          toast.error('Please complete all target audience fields');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      // Prepare payload with image URL (already uploaded or null)
      const payload = {
        userId,
        businessName: formData.businessName,
        businessType: formData.businessType,
        industry: formData.industry,
        location: formData.location,
        description: formData.description,
        image: formData.imageUrl,
        website: formData.website,
        phoneNumber: formData.phoneNumber,
        platformsUsed: formData.platformsUsed,
        primaryMarketingGoal: formData.primaryMarketingGoal,
        targetAudience: formData.targetAudience
      };

      const res = await completeCampaignOwnerOnboarding(payload);
      if (res && res.success) {
        toast.success(res.message || 'Onboarding completed successfully!', {
          position: 'top-right',
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate('/dashboard/owner');
        }, 1200);
      } else {
        toast.error(res?.error || res?.message || 'Failed to complete onboarding', {
          position: 'top-right',
          autoClose: 4000,
        });
      }
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : err?.message || 'Onboarding failed';
      toast.error(errorMsg, { position: 'top-right' });
    }
  };

  const steps = [
    {
      title: 'Business Name',
      icon: Building2,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            What is your business name?
          </label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            placeholder="Enter your business name"
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
          />
        </div>
      )
    },
    {
      title: 'Business Type',
      icon: Briefcase,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            What type of business do you run?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {businessTypes.map((type) => (
              <motion.button
                key={type}
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
      title: 'Industry',
      icon: Target,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            What industry are you in?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {industries.map((ind) => (
              <motion.button
                key={ind}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChange('industry', ind)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  formData.industry === ind
                    ? 'border-[#C1B6FD] bg-[#C1B6FD]/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                {ind}
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Location',
      icon: MapPin,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            Where is your business located?
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="City / Country"
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
          />
        </div>
      )
    },
    {
      title: 'Description',
      icon: FileText,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            Describe your business
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Tell us about your business, what you do, and what makes you unique..."
            rows={6}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300 resize-none"
          />
        </div>
      )
    },
    {
      title: 'Brand Image',
      icon: ImageIcon,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            Upload your brand logo or business image
          </label>
          {!formData.imagePreview ? (
            <label className="block">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-[#C1B6FD]/50 transition-all duration-300 bg-white/5">
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-white mb-1">Click to upload image</p>
                <p className="text-sm text-gray-400">JPG or PNG, max 5MB</p>
              </div>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-lg bg-white/5"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-300"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                {imageUploaded && (
                  <div className="absolute top-2 left-2 bg-green-500 rounded-full p-2">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              
              {/* Upload Button */}
              {!imageUploaded ? (
                <motion.button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={uploadingImage}
                  whileHover={{ scale: uploadingImage ? 1 : 1.02 }}
                  whileTap={{ scale: uploadingImage ? 1 : 0.98 }}
                  className={`w-full py-3 px-6 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    uploadingImage ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg shadow-[#C1B6FD]/30'
                  }`}
                >
                  {uploadingImage ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload to Cloud
                    </>
                  )}
                </motion.button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-400 bg-green-400/10 rounded-lg py-3 px-6 border border-green-400/30">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Image uploaded successfully!</span>
                </div>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Website',
      icon: Globe,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            What is your website URL?
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://www.yourwebsite.com"
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
          />
        </div>
      )
    },
    {
      title: 'Phone Number',
      icon: Phone,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            What is your business phone number?
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
          />
        </div>
      )
    },
    {
      title: 'Platforms',
      icon: Target,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            Which marketing platforms do you currently use?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {platforms.map((platform) => (
              <motion.button
                key={platform}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePlatformToggle(platform)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  formData.platformsUsed.includes(platform)
                    ? 'border-[#C1B6FD] bg-[#C1B6FD]/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                <span className="flex items-center justify-between">
                  {platform}
                  {formData.platformsUsed.includes(platform) && (
                    <CheckCircle2 className="w-5 h-5 text-[#C1B6FD]" />
                  )}
                </span>
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
          <label className="block text-sm font-medium text-gray-300">
            What is your primary marketing goal?
          </label>
          <div className="grid grid-cols-1 gap-3">
            {marketingGoals.map((goal) => (
              <motion.button
                key={goal}
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
    },
    {
      title: 'Target Audience',
      icon: Users,
      component: (
        <div className="space-y-6">
          <label className="block text-sm font-medium text-gray-300">
            Who is your target audience?
          </label>
          
          {/* Age Range */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Age Range</label>
            <select
              value={formData.targetAudience.ageRange}
              onChange={(e) => handleTargetAudienceChange('ageRange', e.target.value)}
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
            >
              <option value="" className="bg-gray-900">Select age range</option>
              {ageRanges.map((range) => (
                <option key={range} value={range} className="bg-gray-900">
                  {range}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Gender</label>
            <div className="grid grid-cols-3 gap-3">
              {genders.map((gender) => (
                <motion.button
                  key={gender}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTargetAudienceChange('gender', gender)}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    formData.targetAudience.gender === gender
                      ? 'border-[#C1B6FD] bg-[#C1B6FD]/10 text-white'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                  }`}
                >
                  {gender}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Target Location</label>
            <input
              type="text"
              value={formData.targetAudience.location}
              onChange={(e) => handleTargetAudienceChange('location', e.target.value)}
              placeholder="Country or Region"
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
            />
          </div>
        </div>
      )
    }
  ];

  const Icon = steps[currentStep].icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#05060F] to-[#1e1632] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Campaign Owner Onboarding
          </h1>
          <p className="text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </p>
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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Step Icon and Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#745CB4] to-[#C1B6FD] rounded-lg">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {steps[currentStep].title}
            </h2>
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                className="flex-1 py-3 px-6 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isLoading && currentStep === steps.length - 1}
              className={`flex-1 py-3 px-6 text-white rounded-lg shadow-lg shadow-[#C1B6FD]/20 transition-all duration-300 flex items-center justify-center gap-2 ${currentStep === steps.length - 1 ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD]' : 'bg-white/5'} ${isLoading && currentStep === steps.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              {currentStep === steps.length - 1 ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Skip Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/dashboard/owner')}
            className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
          >
            Skip for now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
