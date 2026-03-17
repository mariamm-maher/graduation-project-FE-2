import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ArrowRight, ArrowLeft, User, MapPin, Image as ImageIcon,
  Instagram, Youtube, Share2, Users, TrendingUp, Grid, Video,
  Handshake, Baby, Globe, Heart, Upload, X, CheckCircle2
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';
import uploadService from '../api/uploadApi';

export default function InfluencerOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, completeInfluencerOnboarding, isLoading } = useAuthStore();
  const userId = location.state?.userId || user?.userId;

  const [currentStep, setCurrentStep] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    image: null,
    imagePreview: null,
    imageUrl: null, // Store Cloudinary URL
    primaryPlatform: '',
    socialMediaLinks: {
      instagram: '',
      tiktok: '',
      youtube: '',
      facebook: '',
      other: ''
    },
    followersCount: '',
    engagementRate: '',
    categories: [],
    contentTypes: [],
    collaborationTypes: [],
    audienceAgeRange: '',
    audienceGender: '',
    audienceLocation: '',
    interests: []
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMediaLinks: { ...prev.socialMediaLinks, [platform]: value }
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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
    setFormData(prev => ({ ...prev, image: null, imagePreview: null, imageUrl: null }));
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
      
      const uploadResponse = await uploadService.uploadImage(formData.image, 'avatar');
      
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
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Prepare payload with image URL (already uploaded or null)
      const payload = {
        userId,
        bio: formData.bio,
        location: formData.location,
        image: formData.imageUrl,
        primaryPlatform: formData.primaryPlatform,
        socialMediaLinks: formData.socialMediaLinks,
        followersCount: formData.followersCount,
        engagementRate: formData.engagementRate,
        categories: formData.categories,
        contentTypes: formData.contentTypes,
        collaborationTypes: formData.collaborationTypes,
        audienceAgeRange: formData.audienceAgeRange,
        audienceGender: formData.audienceGender,
        audienceLocation: formData.audienceLocation,
        interests: formData.interests
      };

      const res = await completeInfluencerOnboarding(payload);
      if (res && res.success) {
        toast.success(res.message || 'Onboarding completed successfully!', {
          position: 'top-right',
          autoClose: 2000,
        });

        // Logout and navigate to login
        await logout();
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        toast.error(res?.error || res?.message || 'Failed to complete onboarding', { position: 'top-right' });
      }
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : err?.message || 'Onboarding failed';
      toast.error(errorMsg, { position: 'top-right' });
    }
  };

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Other'];
  const followerRanges = ['0–5K', '5K–10K', '10K–50K', '50K–100K', '100K+'];
  const engagementRates = ['1%', '2%', '3%', '5%', '10%+'];
  const categories = ['Beauty', 'Fashion', 'Food', 'Fitness', 'Travel', 'Technology', 'Gaming', 'Lifestyle', 'Education'];
  const contentTypes = ['Post', 'Story', 'Reel', 'Short video', 'Long-form video', 'Live stream'];
  const collaborationTypes = ['Sponsored Post', 'Product Review', 'Brand Ambassador', 'Affiliate Marketing', 'Event Appearance'];
  const ageRanges = ['13–17', '18–24', '25–34', '35–44', '45+'];
  const genderOptions = ['Mostly Male', 'Mostly Female', 'Mixed'];
  const interests = ['Fashion', 'Technology', 'Gaming', 'Fitness', 'Travel', 'Food', 'Beauty', 'Education'];

  const steps = [
    {
      title: 'Tell us about yourself',
      icon: User,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">Share your bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="Tell us about your journey as a content creator..."
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 resize-none"
          />
        </div>
      )
    },
    {
      title: 'Location',
      icon: MapPin,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">Where are you located?</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="City, Country"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
          />
        </div>
      )
    },
    {
      title: 'Profile Picture',
      icon: ImageIcon,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">Upload your profile picture</label>
          {formData.imagePreview ? (
            <div className="space-y-4">
              <div className="relative w-40 h-40 mx-auto">
                <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover rounded-full border-4 border-[#C1B6FD]/30" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                {imageUploaded && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 rounded-full p-1">
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
          ) : (
            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[#C1B6FD]/50 transition-colors">
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-300 mb-1">Click to upload</p>
                <p className="text-xs text-gray-500">JPG, PNG (max 5MB)</p>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      )
    },
    {
      title: 'Primary Platform',
      icon: Share2,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">What is your primary platform?</label>
          <div className="grid grid-cols-2 gap-3">
            {platforms.map((platform) => (
              <motion.button
                key={platform}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChange('primaryPlatform', platform)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  formData.primaryPlatform === platform
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                {platform}
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Social Media Links',
      icon: Instagram,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">Add your social media links</label>
          <div className="space-y-3">
            <input
              type="url"
              value={formData.socialMediaLinks.instagram}
              onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
              placeholder="Instagram URL"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
            />
            <input
              type="url"
              value={formData.socialMediaLinks.tiktok}
              onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
              placeholder="TikTok URL"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
            />
            <input
              type="url"
              value={formData.socialMediaLinks.youtube}
              onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
              placeholder="YouTube URL"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
            />
            <input
              type="url"
              value={formData.socialMediaLinks.facebook}
              onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
              placeholder="Facebook URL"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
            />
            <input
              type="url"
              value={formData.socialMediaLinks.other}
              onChange={(e) => handleSocialMediaChange('other', e.target.value)}
              placeholder="Other URL"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Followers Count',
      icon: Users,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">How many followers do you have on your primary platform?</label>
          <div className="grid grid-cols-1 gap-3">
            {followerRanges.map((range) => (
              <motion.button
                key={range}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChange('followersCount', range)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  formData.followersCount === range
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                {range}
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Engagement Rate',
      icon: TrendingUp,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">What is your average engagement rate?</label>
          <div className="grid grid-cols-2 gap-3">
            {engagementRates.map((rate) => (
              <motion.button
                key={rate}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChange('engagementRate', rate)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  formData.engagementRate === rate
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                {rate}
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Content Categories',
      icon: Grid,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">What categories do you create content about?</label>
          <p className="text-xs text-gray-500">Select all that apply</p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMultiSelect('categories', category)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  formData.categories.includes(category)
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Content Formats',
      icon: Video,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">What content formats do you create?</label>
          <p className="text-xs text-gray-500">Select all that apply</p>
          <div className="grid grid-cols-2 gap-3">
            {contentTypes.map((type) => (
              <motion.button
                key={type}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMultiSelect('contentTypes', type)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  formData.contentTypes.includes(type)
                    ? 'border-purple-500 bg-purple-500/10 text-white'
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
      title: 'Collaboration Types',
      icon: Handshake,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">What types of collaborations are you open to?</label>
          <p className="text-xs text-gray-500">Select all that apply</p>
          <div className="grid grid-cols-1 gap-3">
            {collaborationTypes.map((type) => (
              <motion.button
                key={type}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMultiSelect('collaborationTypes', type)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  formData.collaborationTypes.includes(type)
                    ? 'border-purple-500 bg-purple-500/10 text-white'
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
      title: 'Audience Age Range',
      icon: Baby,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">What is your audience age range?</label>
          <div className="grid grid-cols-2 gap-3">
            {ageRanges.map((range) => (
              <motion.button
                key={range}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChange('audienceAgeRange', range)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  formData.audienceAgeRange === range
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                {range}
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Audience Gender',
      icon: Users,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">What is your audience gender?</label>
          <div className="grid grid-cols-1 gap-3">
            {genderOptions.map((option) => (
              <motion.button
                key={option}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChange('audienceGender', option)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  formData.audienceGender === option
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Audience Location',
      icon: Globe,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">Where is most of your audience located?</label>
          <input
            type="text"
            value={formData.audienceLocation}
            onChange={(e) => handleChange('audienceLocation', e.target.value)}
            placeholder="Country / Region"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
          />
        </div>
      )
    },
    {
      title: 'Audience Interests',
      icon: Heart,
      component: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">What are your audience interests?</label>
          <p className="text-xs text-gray-500">Select all that apply</p>
          <div className="grid grid-cols-2 gap-3">
            {interests.map((interest) => (
              <motion.button
                key={interest}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMultiSelect('interests', interest)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  formData.interests.includes(interest)
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                {interest}
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
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#05060F] to-[#1e1632]  flex flex-col items-center justify-center p-4 font-sans text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-3">
            Influencer Onboarding
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            These questions help us personalize your experience and match you with the most suitable brand collaborations.
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
            <h2 className="text-xl font-semibold text-white">{steps[currentStep].title}</h2>
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
                onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
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
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-gray-500 hover:text-gray-300 transition-colors duration-200 text-xs font-medium"
          >
            Skip all onboarding and go to dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
