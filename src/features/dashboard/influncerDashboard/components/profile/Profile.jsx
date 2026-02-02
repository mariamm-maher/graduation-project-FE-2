import { useState, useEffect } from 'react';
import { Edit2, Save, X, Loader } from 'lucide-react';
import useAuthStore from '../../../../../stores/authStore';

import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import ProfessionalDetailsCard from './ProfessionalDetailsCard';
import AudienceInsightsCard from './AudienceInsightsCard';
import RatesPricingCard from './RatesPricingCard';
import SocialMediaCard from './SocialMediaCard';
import AchievementsCard from './AchievementsCard';
import AvailabilityCard from './AvailabilityCard';

function Profile() {
  const { getProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize with default structure to prevent runtime errors before data load
  const [profileData, setProfileData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    
    // InfluencerProfile Schema Fields
    bio: '',
    image: '', 
    isCompleted: false,
    
    // Social Media Links
    socialMediaLinks: {
      instagram: { username: '', followers: '0', verified: false },
      youtube: { username: '', subscribers: '0', verified: false },
      tiktok: { username: '', followers: '0', verified: false },
      twitter: { username: '', followers: '0', verified: false }
    },
    
    // Primary Platform
    primaryPlatform: 'instagram',
    
    // Followers & Engagement (Default Mocks if missing)
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
    completionPercentage: 0,
    isOnboarded: false,
    
    // Professional Details
    yearsOfExperience: 0,
    languages: [],
    
    // Statistics (Mock defaults)
    stats: {
      totalCampaigns: 0,
      activeCampaigns: 0,
      completedCampaigns: 0,
      totalEarnings: '$0',
      averageRating: 0.0,
      totalReach: '0'
    },
    
    // Achievements
    achievements: [],
    
    // Rates & Pricing
    rates: {
      instagram: { post: '', story: '', reel: '' },
      youtube: { video: '', short: '' },
      tiktok: { video: '', series: '' }
    },
    
    // Availability
    availability: 'Available',
    responseTime: '',
    preferredBrands: []
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getProfile();
        // Expected response structure: { success: true, user: {...}, data: { user: {...}, influencerProfile: {...} } }
        
        if (response && response.success && response.data) {
          const { user, influencerProfile } = response.data;
          
          if (user && influencerProfile) {
            // Map API data to component state
            setProfileData(prev => ({
              ...prev,
              // User Data
              firstName: user.firstName || prev.firstName,
              lastName: user.lastName || prev.lastName,
              email: user.email || prev.email,
              phone: user.phone || prev.phone, // Assuming phone might be on user object
              location: influencerProfile.location || prev.location, // or user.location
              
              // Bio & Profile Info
              bio: influencerProfile.bio || prev.bio,
              image: influencerProfile.profileImage || user.profileImage || prev.image,
              isCompleted: influencerProfile.isCompleted || prev.isCompleted,
              
              // Social Media
              // Ensure we merge with existing structure if API returns partial or matches format
              socialMediaLinks: influencerProfile.socialMediaLinks || prev.socialMediaLinks, 
              
              // Content Info
              primaryPlatform: influencerProfile.primaryPlatform || prev.primaryPlatform,
              
              // Lists
              categories: influencerProfile.niche ? [influencerProfile.niche] : influencerProfile.interests || prev.categories,
              contentTypes: influencerProfile.content || prev.contentTypes,
              interests: influencerProfile.interests || prev.interests,
              
              // Audience - Parsing complex objects if strictly needed, or taking direct values if simplified
              audienceAgeRange: influencerProfile.audienceDemographics?.ageRange || prev.audienceAgeRange,
              audienceLocation: influencerProfile.audienceDemographics?.topLocations?.[0] || prev.audienceLocation,
              
              // Achievements
              achievements: influencerProfile.achievements || prev.achievements,
              
              // Stats / Mapped from previousCollab or stats object if available
              // If API doesn't provide computed stats, we might calculate or keep 0
              stats: {
                ...prev.stats,
                completedCampaigns: influencerProfile.previousCollab ? influencerProfile.previousCollab.length : 0
              }
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
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
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
          ...prev.socialMediaLinks?.[platform],
          [field]: value
        }
      }
    }));
  };

  const handleRateChange = (platform, type, value) => {
    setProfileData(prev => ({
      ...prev,
      rates: {
        ...prev.rates,
        [platform]: {
          ...prev.rates?.[platform],
          [type]: value
        }
      }
    }));
  };

  const handleImageChange = () => {
    // In real app, this would open file picker and upload image
    console.log('Upload profile image');
  };

  const handleSave = () => {
    // Here you would make an API call to save the profile
    console.log('Saving profile:', profileData);
    setIsEditing(false);
    // TODO: API call to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Re-fetch or reset if needed
    getProfile(); 
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage your profile information and settings</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <ProfileHeader 
        profileData={profileData}
        isEditing={isEditing}
        onInputChange={handleInputChange}
        onImageChange={handleImageChange}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <PersonalInfoCard 
            profileData={profileData}
            isEditing={isEditing}
            onInputChange={handleInputChange}
          />

          <ProfessionalDetailsCard 
            profileData={profileData}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            onArrayChange={handleArrayChange}
          />

          <AudienceInsightsCard 
            profileData={profileData}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            onArrayChange={handleArrayChange}
          />

          <RatesPricingCard 
            profileData={profileData}
            isEditing={isEditing}
            onRateChange={handleRateChange}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <SocialMediaCard 
            profileData={profileData}
            isEditing={isEditing}
            onSocialMediaChange={handleSocialMediaChange}
          />

          <AchievementsCard profileData={profileData} />

          <AvailabilityCard 
            profileData={profileData}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            onArrayChange={handleArrayChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;

