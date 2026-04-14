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
  const { user, completeCampaignOwnerOnboarding, isLoading, logout } = useAuthStore();
  const userId = location.state?.userId || user?.userId;

  const [currentStep, setCurrentStep] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState({
    business: false,
    target: false
  });
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
  const popularCountries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
    'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland',
    'Belgium', 'Austria', 'Ireland', 'Portugal', 'Poland', 'Czech Republic',
    'Hungary', 'Romania', 'Greece', 'Turkey', 'Russia', 'Ukraine', 'India',
    'Pakistan', 'Bangladesh', 'China', 'Japan', 'South Korea', 'Indonesia',
    'Philippines', 'Vietnam', 'Thailand', 'Malaysia', 'Singapore', 'Saudi Arabia',
    'United Arab Emirates', 'Egypt', 'South Africa', 'Nigeria', 'Kenya', 'Brazil',
    'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'New Zealand'
  ];

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

  const getFilteredCountries = (query) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return popularCountries.slice(0, 12);
    }

    return popularCountries
      .filter((country) => country.toLowerCase().includes(normalizedQuery))
      .slice(0, 12);
  };

  const openCountryDropdown = (key) => {
    setCountryDropdownOpen((prev) => ({ ...prev, [key]: true }));
  };

  const closeCountryDropdown = (key) => {
    setCountryDropdownOpen((prev) => ({ ...prev, [key]: false }));
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

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit(true);
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

  const handleSubmit = async (skipValidation = false) => {
    if (skipValidation !== true && !validateStep(currentStep)) return;

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

        // logout and redirect to login (match influencer flow)
        try {
          await logout();
        } catch {
          // ignore logout errors
        }

        setTimeout(() => {
          navigate('/login');
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
          <div className="relative">
            <input
              type="text"
              value={formData.location}
              onChange={(e) => {
                handleChange('location', e.target.value);
                openCountryDropdown('business');
              }}
              onFocus={() => openCountryDropdown('business')}
              onBlur={() => setTimeout(() => closeCountryDropdown('business'), 120)}
              placeholder="Search or select a country"
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
            />

            {countryDropdownOpen.business && (
              <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                {getFilteredCountries(formData.location).length > 0 ? (
                  getFilteredCountries(formData.location).map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => {
                        handleChange('location', country);
                        closeCountryDropdown('business');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                    >
                      {country}
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-400">No countries found</p>
                )}
              </div>
            )}
          </div>
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
                  className={`w-full py-3 px-6 bg-[#745CB4] hover:bg-[#9381C4] text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    uploadingImage ? 'opacity-50 cursor-not-allowed' : 'shadow-md shadow-[#745CB4]/20'
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
            <div className="relative">
              <input
                type="text"
                value={formData.targetAudience.location}
                onChange={(e) => {
                  handleTargetAudienceChange('location', e.target.value);
                  openCountryDropdown('target');
                }}
                onFocus={() => openCountryDropdown('target')}
                onBlur={() => setTimeout(() => closeCountryDropdown('target'), 120)}
                placeholder="Search or select a country"
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
              />

              {countryDropdownOpen.target && (
                <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                  {getFilteredCountries(formData.targetAudience.location).length > 0 ? (
                    getFilteredCountries(formData.targetAudience.location).map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => {
                          handleTargetAudienceChange('location', country);
                          closeCountryDropdown('target');
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                      >
                        {country}
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-gray-400">No countries found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
  ];

  const Icon = steps[currentStep].icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#05060F] to-[#1e1632]  flex flex-col items-center justify-center p-4 font-sans text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-3">
            Campaign Owner Onboarding
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            These questions help us personalize your experience and match you with the best influencers for your campaigns.
          </p>
          <div className="mt-4 inline-block px-3 py-1 bg-gray-900 border border-[#745CB4]/30 rounded-full">
            <p className="text-xs text-[#C1B6FD] font-medium tracking-wide">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-8 max-w-2xl mx-auto flex flex-col min-h-[420px]">
          {/* Step Icon and Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-gray-800/80 border border-gray-700/50 rounded-xl">
              <Icon className="w-5 h-5 text-[#C1B6FD]" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {steps[currentStep].title}
            </h2>
          </div>

          {/* Step Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
              >
                {steps[currentStep].component}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-800/50">
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSkip}
                className="px-5 py-2.5 text-gray-400 hover:text-gray-200 transition-colors duration-200 text-sm font-medium"
              >
                Skip
              </button>

              <button
                type="button"
                onClick={currentStep === steps.length - 1 ? () => handleSubmit(false) : handleNext}
                disabled={isLoading && currentStep === steps.length - 1}
                className={`px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 ${
                  currentStep === steps.length - 1 
                    ? 'bg-[#745CB4] hover:bg-[#9381C4] text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-white text-gray-900'
                } ${isLoading && currentStep === steps.length - 1 ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
              >
                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                {currentStep === steps.length - 1 ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Global Skip Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/dashboard/owner')}
            className="text-gray-500 hover:text-gray-300 transition-colors duration-200 text-xs font-medium"
          >
            Skip all onboarding and go to dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
