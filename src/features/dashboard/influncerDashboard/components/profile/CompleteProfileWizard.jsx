import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, User, Share2, Users, Briefcase, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../../../stores/authStore';

// Step Components
import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import ProfessionalDetailsCard from './ProfessionalDetailsCard';
import AudienceInsightsCard from './AudienceInsightsCard';
import SocialMediaCard from './SocialMediaCard';

// Using the same sub-components from Profile but wrapping them in a step wizard
// Note: We'll modify their behavior slightly to always be in "editing" mode

const steps = [
    { id: 'personal', title: 'Personal Info', icon: User, description: 'Basic details about you' },
    { id: 'professional', title: 'Professional', icon: Briefcase, description: 'Your niche and content' },
    { id: 'audience', title: 'Audience', icon: Users, description: 'Who follows you' },
    { id: 'social', title: 'Social Media', icon: Share2, description: 'Connect your accounts' },
];

function CompleteProfileWizard() {
    const navigate = useNavigate();
    const { getProfile, isLoading } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Reuse the same profile data structure
    const [profileData, setProfileData] = useState({
        firstName: '', lastName: '', email: '', phone: '', location: '',
        bio: '', image: '', isCompleted: false, completionPercentage: 0,
        socialMediaLinks: {
            instagram: { username: '', followers: '0', verified: false },
            youtube: { username: '', subscribers: '0', verified: false },
            tiktok: { username: '', followers: '0', verified: false },
            twitter: { username: '', followers: '0', verified: false }
        },
        primaryPlatform: 'instagram',
        followersCount: 0, engagementRate: 0,
        categories: [], contentTypes: [], collaborationTypes: [],
        audienceAgeRange: '', audienceGender: '', audienceLocation: '', interests: [],
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
                    ...prev.socialMediaLinks?.[platform],
                    [field]: value
                }
            }
        }));
    };

    const handleImageChange = () => console.log('Upload image');

    const goToNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const goToPrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = async () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Profile Completed:', profileData);
            setIsSaving(false);
            navigate('/dashboard/influencer/profile');
        }, 1500);
    };

    // Render current step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Personal
                return (
                    <div className="space-y-6">
                        <ProfileHeader
                            profileData={profileData}
                            isEditing={true}
                            onInputChange={handleInputChange}
                            onImageChange={handleImageChange}
                        />
                        <PersonalInfoCard
                            profileData={profileData}
                            isEditing={true}
                            onInputChange={handleInputChange}
                        />
                    </div>
                );
            case 1: // Professional
                return (
                    <ProfessionalDetailsCard
                        profileData={profileData}
                        isEditing={true}
                        onInputChange={handleInputChange}
                        onArrayChange={handleArrayChange}
                    />
                );
            case 2: // Audience
                return (
                    <AudienceInsightsCard
                        profileData={profileData}
                        isEditing={true}
                        onInputChange={handleInputChange}
                        onArrayChange={handleArrayChange}
                    />
                );
            case 3: // Social
                return (
                    <SocialMediaCard
                        profileData={profileData}
                        isEditing={true}
                        onSocialMediaChange={handleSocialMediaChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Progress Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Setup Your Profile</h1>
                <p className="text-gray-400 mb-8">Complete the steps below to make your profile standout to brands.</p>

                <div className="flex items-center justify-between relative">
                    {/* Progress Bar Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10 rounded-full" />

                    {/* Active Progress Line */}
                    <motion.div
                        className="absolute top-1/2 left-0 h-1 bg-[#C1B6FD] -z-10 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setCurrentStep(index)}>
                                <motion.div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer z-10 
                    ${isActive ? 'bg-[#745CB4] border-[#C1B6FD] text-white shadow-[0_0_15px_rgba(193,182,253,0.5)]' :
                                            isCompleted ? 'bg-[#745CB4] border-[#745CB4] text-white' :
                                                'bg-[#1a0933] border-white/20 text-gray-500 hover:border-white/40'}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                </motion.div>
                                <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <button
                    onClick={goToPrevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <button
                    onClick={goToNextStep}
                    disabled={isSaving}
                    className="group flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                >
                    <span>{isSaving ? 'Saving...' : currentStep === steps.length - 1 ? 'Complete Profile' : 'Continue'}</span>
                    {!isSaving && (
                        currentStep === steps.length - 1 ?
                            <Check className="w-4 h-4" /> :
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    )}
                </button>
            </div>
        </div>
    );
}

export default CompleteProfileWizard;
