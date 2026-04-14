import { useState, useEffect, useRef } from 'react';
import { Edit2, Save, X, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../../../../../stores/authStore';
import useProfileStore from '../../../../../stores/profileStore';
import uploadService from '../../../../../api/uploadApi';
import { toast } from 'react-toastify';

import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import ProfessionalDetailsCard from './ProfessionalDetailsCard';
import AudienceInsightsCard from './AudienceInsightsCard';
import SocialMediaCard from './SocialMediaCard';

function Profile() {
  const { getProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const fileInputRef = useRef(null);

  // Initialize with default structure
  const [profileData, setProfileData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',

    // InfluencerProfile Schema Fields
    bio: '',
    image: '',
    isCompleted: false,
    completionPercentage: 0,

    // Social Media Links
    socialMediaLinks: {
      instagram: { username: '', followers: '0', verified: false },
      youtube: { username: '', subscribers: '0', verified: false },
      tiktok: { username: '', followers: '0', verified: false },
      twitter: { username: '', followers: '0', verified: false }
    },

    // Primary Platform
    primaryPlatform: 'instagram',

    // Followers & Engagement
    followersCount: 0,
    engagementRate: 0,

    // Categories & Content
    categories: [],
    contentTypes: [],
    collaborationTypes: [],

    // Audience Demographics
    audienceAgeRange: '',
    audienceGender: '',
    audienceLocation: '',
    interests: [],

    // Profile Status
    isOnboarded: false,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getProfile();

        if (response && response.success && response.data) {
          const { user, influencerProfile, completionPercentage } = response.data;

          if (user && influencerProfile) {
            setProfileData(prev => ({
              ...prev,
              firstName: user.firstName || prev.firstName,
              lastName: user.lastName || prev.lastName,
              email: user.email || prev.email,
              phone: user.phone || prev.phone,
              location: influencerProfile.location || prev.location,

              bio: influencerProfile.bio || prev.bio,
              image: influencerProfile.image || prev.image,
              isCompleted: influencerProfile.isCompleted || prev.isCompleted,
              completionPercentage: completionPercentage || 0,

              socialMediaLinks: influencerProfile.socialMediaLinks || prev.socialMediaLinks,

              primaryPlatform: influencerProfile.primaryPlatform || prev.primaryPlatform,
              followersCount: influencerProfile.followersCount || 0,
              engagementRate: influencerProfile.engagementRate || 0,

              categories: influencerProfile.categories || prev.categories,
              contentTypes: influencerProfile.contentTypes || prev.contentTypes,
              collaborationTypes: influencerProfile.collaborationTypes || prev.collaborationTypes,
              interests: influencerProfile.interests || prev.interests,

              audienceAgeRange: influencerProfile.audienceAgeRange || prev.audienceAgeRange,
              audienceGender: influencerProfile.audienceGender || prev.audienceGender,
              audienceLocation: influencerProfile.audienceLocation || prev.audienceLocation,

              isOnboarded: influencerProfile.isOnboarded || prev.isOnboarded,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfileData();
  }, [getProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (fieldName, value) => {
    setProfileData(prev => ({
      ...prev,
      [fieldName]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  const handleSocialMediaChange = (platform, field, value) => {
    setProfileData(prev => ({
      ...prev,
      socialMediaLinks: {
        ...prev.socialMediaLinks,
        [platform]: {
          ...(typeof prev.socialMediaLinks?.[platform] === 'object' && prev.socialMediaLinks?.[platform] !== null
            ? prev.socialMediaLinks[platform]
            : {}),
          [field]: value
        }
      }
    }));
  };

  const handleImageChange = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);

    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    setPreviewImageUrl(previewUrl);
    setProfileData(prev => ({ ...prev, image: previewUrl }));
  };

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  const updateInfluencerProfile = useProfileStore((s) => s.updateInfluencerProfile);

  const handleSave = async () => {
    try {
      const payload = { ...profileData };

      // Two-step save: upload image first, then update profile with uploaded URL.
      if (selectedImageFile) {
        toast.info('Uploading image...', { position: 'top-right' });
        const uploadResponse = await uploadService.uploadImage(selectedImageFile, 'avatar');
        const uploadedImageUrl = uploadResponse?.data?.data?.url;

        if (!uploadedImageUrl) {
          toast.error('Image upload failed. Please try again.', { position: 'top-right' });
          return;
        }

        payload.image = uploadedImageUrl;
      }

      toast.info('Saving profile...', { position: 'top-right' });
      const res = await updateInfluencerProfile(payload);
      if (res && res.success) {
        toast.success('Profile updated', { position: 'top-right' });
        // update local state with normalized profile from store
        const p = res.profile || res.data?.profile || res.data;
        if (p) {
          setProfileData(prev => ({ ...prev, ...p }));
        }
        setSelectedImageFile(null);
        if (previewImageUrl) {
          URL.revokeObjectURL(previewImageUrl);
          setPreviewImageUrl('');
        }
        setIsEditing(false);
      } else {
        toast.error(res?.error || 'Failed to update profile', { position: 'top-right' });
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Save failed';
      toast.error(msg, { position: 'top-right' });
      console.error('Update profile error:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    getProfile();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 relative"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* Subtle background glow for premium feel */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Profile Settings</h1>
          <p className="text-gray-400 mt-1">Manage your personal information and public profile</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </motion.div>
      </div>

      {/* Profile Header Card */}
      <motion.div variants={itemVariants}>
        <ProfileHeader
          profileData={profileData}
          isEditing={isEditing}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        {/* Left/Main Column - Content & Audience (Wider) */}
        <div className="xl:col-span-2 space-y-6">
          <motion.div variants={itemVariants}>
            <ProfessionalDetailsCard
              profileData={profileData}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onArrayChange={handleArrayChange}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <AudienceInsightsCard
              profileData={profileData}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onArrayChange={handleArrayChange}
            />
          </motion.div>
        </div>

        {/* Right Sidebar - Personal & Links (Narrower) */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <PersonalInfoCard
              profileData={profileData}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="xl:sticky xl:top-6">
            <SocialMediaCard
              profileData={profileData}
              isEditing={isEditing}
              onSocialMediaChange={handleSocialMediaChange}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;
