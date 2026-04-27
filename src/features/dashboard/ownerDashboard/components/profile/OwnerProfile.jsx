import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Image,
  Upload,
  Edit,
  Save,
  X,
  CheckCircle2,
  Building2,
  Mail,
  Globe,
  Target,
  Users,
  Briefcase,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import useProfileStore from '../../../../../stores/profileStore';
import useUploadStore from '../../../../../stores/UploadStore';

const COMPANY_SIZE_OPTIONS = [
  'Solo',
  'Small',
  'Mid',
  'Enterprise'
];

const INDUSTRY_OPTIONS = [
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

const PLATFORM_OPTIONS = [
  'Instagram',
  'Facebook',
  'TikTok',
  'YouTube',
  'Google Ads',
  'LinkedIn',
  'Snapchat',
  'Twitter (X)'
];

const TARGET_GENDER_OPTIONS = ['All', 'Male', 'Female'];
const TARGET_AGE_OPTIONS = ['18-24', '25-34', '35-44', '45-54', '55+'];

const POPULAR_COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland',
  'Belgium', 'Austria', 'Ireland', 'Portugal', 'Poland', 'Czech Republic',
  'Hungary', 'Romania', 'Greece', 'Turkey', 'Russia', 'Ukraine', 'India',
  'Pakistan', 'Bangladesh', 'China', 'Japan', 'South Korea', 'Indonesia',
  'Philippines', 'Vietnam', 'Thailand', 'Malaysia', 'Singapore', 'Saudi Arabia',
  'United Arab Emirates', 'Egypt', 'South Africa', 'Nigeria', 'Kenya', 'Brazil',
  'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'New Zealand'
];

const MISSING_FIELD_LABELS = {
  brand_name: 'Brand Name',
  product_or_service: 'Product / Service',
  industry: 'Industry',
  target_market: 'Target Market',
  company_size: 'Company Size',
  unique_selling_point: 'Unique Selling Point',
  competitors: 'Competitors',
  has_previous_campaigns: 'Previous Campaigns',
  previous_campaign_description: 'Previous Campaign Description',
  website: 'Website',
  platforms: 'Platforms',
  image: 'Brand Image',
  'targetAudience.gender': 'Audience Gender',
  'targetAudience.ageRange': 'Audience Age Range',
  'targetAudience.location': 'Audience Location'
};

const formatMissingFieldLabel = (field) => {
  if (!field) return 'Unknown Field';
  if (MISSING_FIELD_LABELS[field]) return MISSING_FIELD_LABELS[field];

  return String(field)
    .replace(/[_.]/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function OwnerProfile() {
  const navigate = useNavigate();
  const fetchOwnerProfile = useProfileStore((s) => s.fetchOwnerProfile);
  const updateOwnerProfile = useProfileStore((s) => s.updateOwnerProfile);
  const ownerProfile = useProfileStore((s) => s.ownerProfile);
  const isLoading = useProfileStore((s) => s.isLoading);
  const fetchOwnerCompletion = useProfileStore((s) => s.fetchOwnerCompletion);
  const uploadFile = useUploadStore((s) => s.uploadFile);
  const uploadProgress = useUploadStore((s) => s.uploadProgress);
  const isUploadingCloud = useUploadStore((s) => s.isLoading);
  const resetUpload = useUploadStore((s) => s.resetUpload);
  const [isEditing, setIsEditing] = useState(false);
  const [completion, setCompletion] = useState(null);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState({
    target: false
  });

  // Dropdown states for selects
  const [companySizeQuery, setCompanySizeQuery] = useState('');
  const [isCompanySizeOpen, setIsCompanySizeOpen] = useState(false);
  const [industryQuery, setIndustryQuery] = useState('');
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [genderQuery, setGenderQuery] = useState('');
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [ageRangeQuery, setAgeRangeQuery] = useState('');
  const [isAgeRangeOpen, setIsAgeRangeOpen] = useState(false);
  const [prevCampaignQuery, setPrevCampaignQuery] = useState('');
  const [isPrevCampaignOpen, setIsPrevCampaignOpen] = useState(false);

  const prevCampaignOptions = [
    { value: 'no', label: 'No' },
    { value: 'yes', label: 'Yes' }
  ];

  const filteredCompanySizes = COMPANY_SIZE_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(companySizeQuery.trim().toLowerCase())
  );
  const filteredIndustries = INDUSTRY_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(industryQuery.trim().toLowerCase())
  );
  const filteredGenders = TARGET_GENDER_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(genderQuery.trim().toLowerCase())
  );
  const filteredAgeRanges = TARGET_AGE_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(ageRangeQuery.trim().toLowerCase())
  );
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [formData, setFormData] = useState({
    brand_name: '',
    product_or_service: '',
    industry: '',
    target_market: [],
    company_size: '',
    unique_selling_point: '',
    competitors: [],
    has_previous_campaigns: false,
    previous_campaign_description: '',
    image: '',
    website: '',
    platforms: [],
    targetAudience: {
      gender: '',
      ageRange: '',
      location: ''
    }
  });

  const buildEditableData = (profile) => ({
    brand_name: profile?.brand_name || '',
    product_or_service: profile?.product_or_service || '',
    industry: profile?.industry || '',
    target_market: Array.isArray(profile?.target_market)
      ? profile.target_market
      : typeof profile?.target_market === 'string' && profile.target_market.trim()
        ? profile.target_market.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
    company_size: profile?.company_size || '',
    unique_selling_point: profile?.unique_selling_point || '',
    competitors: Array.isArray(profile?.competitors) ? profile.competitors : [],
    has_previous_campaigns: Boolean(profile?.has_previous_campaigns),
    previous_campaign_description: profile?.previous_campaign_description || '',
    image: profile?.image || '',
    website: profile?.website || '',
    platforms: Array.isArray(profile?.platforms) ? profile.platforms : [],
    targetAudience: {
      gender: profile?.targetAudience?.gender || '',
      ageRange: profile?.targetAudience?.ageRange || '',
      location: profile?.targetAudience?.location || ''
    }
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTargetAudienceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      targetAudience: {
        ...(prev.targetAudience || {}),
        [field]: value
      }
    }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.platforms) ? prev.platforms : [];
      const next = current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform];

      return {
        ...prev,
        platforms: next
      };
    });
  };

  const getFilteredCountries = (query) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return POPULAR_COUNTRIES.slice(0, 12);
    }

    return POPULAR_COUNTRIES
      .filter((country) => country.toLowerCase().includes(normalizedQuery))
      .slice(0, 12);
  };

  const openCountryDropdown = () => {
    setCountryDropdownOpen({ target: true });
  };

  const closeCountryDropdown = () => {
    setCountryDropdownOpen({ target: false });
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setSelectedImageFile(file);
    setImageUploaded(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result || '');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!selectedImageFile) {
      toast.error('Please choose an image first');
      return;
    }

    const result = await uploadFile(selectedImageFile, 'brandLogo');
    if (!result?.success) {
      toast.error(result?.error || 'Image upload failed');
      return;
    }

    const uploadedUrl =
      result?.data?.url ||
      result?.data?.secure_url ||
      result?.data?.data?.url ||
      '';

    if (!uploadedUrl) {
      toast.error('Image uploaded but URL was not returned');
      return;
    }

    handleInputChange('image', uploadedUrl);
    setImagePreview(uploadedUrl);
    setImageUploaded(true);
    toast.success('Image uploaded to cloud. Click Save Changes to update profile.');
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreview('');
    setImageUploaded(false);
    handleInputChange('image', '');
    resetUpload();
  };

  const handleSave = async () => {
    if (selectedImageFile && !imageUploaded) {
      toast.error('Please upload image to cloud before saving profile');
      return;
    }

    const payload = {
      ...formData,
      target_market: Array.isArray(formData.target_market)
        ? formData.target_market.map((item) => String(item).trim()).filter(Boolean)
        : [],
      platforms: Array.isArray(formData.platforms)
        ? formData.platforms.map((item) => String(item).trim()).filter(Boolean)
        : []
    };

    const result = await updateOwnerProfile(payload);
    if (result?.success) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setSelectedImageFile(null);
      setImagePreview('');
      setImageUploaded(false);
      resetUpload();
      await fetchOwnerProfile();
      const comp = await fetchOwnerCompletion();
      setCompletion(comp?.data ?? comp);
    } else {
      toast.error(result?.error || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (!ownerProfile) {
      setIsEditing(false);
      return;
    }
    setFormData(buildEditableData(ownerProfile));
    setSelectedImageFile(null);
    setImagePreview('');
    setImageUploaded(false);
    resetUpload();
    setIsEditing(false);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchOwnerProfile();
        const comp = await fetchOwnerCompletion();
        setCompletion(comp?.data ?? comp);
      } catch (err) {
        console.error('fetchOwnerProfile error', err);
        toast.error('Failed to load owner profile');
      }
    };

    load();
  }, [fetchOwnerProfile, fetchOwnerCompletion]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!ownerProfile) {
    return (
      <div className="p-6">
        <p className="text-gray-400">No owner profile found.</p>
        <div className="mt-4">
          <button
            onClick={() => navigate('/dashboard/owner')}
            className="px-4 py-2 bg-[#745CB4] text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const {
    image,
    completionPercentage
  } = ownerProfile;

  const profileView = isEditing ? formData : buildEditableData(ownerProfile);
  const activeImage = isEditing ? (imagePreview || formData.image || image) : image;

  const targetAudienceSummary = profileView.targetAudience
    ? {
        gender: profileView.targetAudience.gender || 'N/A',
        ageRange: profileView.targetAudience.ageRange || 'N/A',
        location: profileView.targetAudience.location || 'N/A'
      }
    : { gender: 'N/A', ageRange: 'N/A', location: 'N/A' };

  const missingFields = Array.isArray(completion?.missingFields)
    ? completion.missingFields
    : [];

  return (
    <div className="space-y-8 relative p-6 w-full">
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight"> Profile Settings</h1>
          <p className="text-gray-400 mt-1">Manage your business information and public profile</p>
        </div>
        <div className="flex items-center gap-3">
          {completion && completion.percentage < 100 && (
            <Link 
              to="/dashboard/owner/profile/complete" 
              className="px-5 py-2.5 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete your profile
            </Link>
          )}
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-5 py-2.5 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setFormData(buildEditableData(ownerProfile));
                setSelectedImageFile(null);
                setImagePreview(ownerProfile?.image || '');
                setImageUploaded(false);
                resetUpload();
                setIsEditing(true);
              }}
              className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white transition-all flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          <div className="text-sm text-gray-400">{completionPercentage ?? 0}% complete</div>
        </div>
      </div>

      <div className="rounded-2xl p-6 sm:p-8 bg-white/5 backdrop-blur-md border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#745CB4]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                
                <h2 className="text-2xl font-bold text-white">{profileView.brand_name || 'Brand Name'}</h2>
              </div>
              <p className="text-sm text-gray-400">{profileView.company_size || 'N/A'} • {profileView.industry || 'N/A'}</p>
              <p className="text-sm text-gray-300 mt-2 max-w-2xl">{profileView.unique_selling_point || 'No unique selling point provided.'}</p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
              <User className="w-3.5 h-3.5" />
              {(ownerProfile.status || 'N/A').toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-2 text-xs text-gray-400">
              {ownerProfile.isCompleted ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />}
              Profile {ownerProfile.isCompleted ? 'Completed' : 'Incomplete'}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl text-gray-300">
            <Mail className="w-4 h-4 text-[#C1B6FD]" />
            <span>{ownerProfile.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl text-gray-300">
            <Target className="w-4 h-4 text-[#C1B6FD]" />
            <span>{Array.isArray(profileView.target_market) && profileView.target_market.length > 0 ? profileView.target_market.join(', ') : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl text-gray-300">
            <Globe className="w-4 h-4 text-[#C1B6FD]" />
            <span>{profileView.website || 'N/A'}</span>
          </div>
        </div>
      </div>

      {completion && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-400">Profile Completion</div>
              <div className="flex items-center gap-4 mt-3">
                <div className="w-44">
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD]" style={{ width: `${completion.percentage ?? 0}%` }} />
                  </div>
                </div>
                <div className="text-sm text-gray-200 font-semibold">{completion.percentage ?? 0}%</div>
                <div className="text-xs text-gray-400">{completion.filledFields ?? 0}/{completion.totalFields ?? 0} fields</div>
              </div>
            </div>

            <div className="flex-1 text-right">
              {missingFields.length > 0 ? (
                <div>
                  <div className="text-xs text-gray-400">Missing Fields</div>
                  <div className="mt-2 flex flex-wrap gap-2 justify-end">
                    {missingFields.map((f, i) => (
                      <span key={`${f}-${i}`} className="text-xs px-2 py-1 rounded bg-red-600/20 text-red-300">{formatMissingFieldLabel(f)}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-green-300">All required fields completed</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-2xl p-6 sm:p-8 bg-white/5 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-[#745CB4]" />
              <h2 className="flex-1 text-[11px] font-medium uppercase tracking-widest text-gray-400 pb-3 border-b border-white/10 mb-4">Business Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Brand Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.brand_name}
                    onChange={(e) => handleInputChange('brand_name', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  />
                ) : (
                  <p className="text-sm font-semibold text-white">{profileView.brand_name || 'N/A'}</p>
                )}
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Company Size</p>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={isCompanySizeOpen ? companySizeQuery : (formData.company_size || '')}
                      onChange={(e) => {
                        setCompanySizeQuery(e.target.value);
                        setIsCompanySizeOpen(true);
                      }}
                      onFocus={() => { setCompanySizeQuery(''); setIsCompanySizeOpen(true); }}
                      onBlur={() => setTimeout(() => { setIsCompanySizeOpen(false); setCompanySizeQuery(''); }, 150)}
                      placeholder="Search company sizes"
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
                    />
                    {isCompanySizeOpen && (
                      <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                        <button
                          type="button"
                          onClick={() => {
                            handleInputChange('company_size', '');
                            setCompanySizeQuery('');
                            setIsCompanySizeOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                        >
                          <span className="flex items-center justify-between">
                            Select Company Size
                            {formData.company_size === '' && (
                              <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                            )}
                          </span>
                        </button>
                        {filteredCompanySizes.length > 0 ? (
                          filteredCompanySizes.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                handleInputChange('company_size', option);
                                setCompanySizeQuery('');
                                setIsCompanySizeOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                            >
                              <span className="flex items-center justify-between">
                                {option}
                                {formData.company_size === option && (
                                  <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                                )}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-sm text-gray-400">No options found</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-white">{profileView.company_size || 'N/A'}</p>
                )}
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Industry</p>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={isIndustryOpen ? industryQuery : (formData.industry || '')}
                      onChange={(e) => {
                        setIndustryQuery(e.target.value);
                        setIsIndustryOpen(true);
                      }}
                      onFocus={() => { setIndustryQuery(''); setIsIndustryOpen(true); }}
                      onBlur={() => setTimeout(() => { setIsIndustryOpen(false); setIndustryQuery(''); }, 150)}
                      placeholder="Search industries"
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
                    />
                    {isIndustryOpen && (
                      <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                        <button
                          type="button"
                          onClick={() => {
                            handleInputChange('industry', '');
                            setIndustryQuery('');
                            setIsIndustryOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                        >
                          <span className="flex items-center justify-between">
                            Select Industry
                            {formData.industry === '' && (
                              <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                            )}
                          </span>
                        </button>
                        {filteredIndustries.length > 0 ? (
                          filteredIndustries.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                handleInputChange('industry', option);
                                setIndustryQuery('');
                                setIsIndustryOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                            >
                              <span className="flex items-center justify-between">
                                {option}
                                {formData.industry === option && (
                                  <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                                )}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-sm text-gray-400">No options found</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-white">{profileView.industry || 'N/A'}</p>
                )}
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Product / Service</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.product_or_service}
                    onChange={(e) => handleInputChange('product_or_service', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  />
                ) : (
                  <p className="text-sm font-semibold text-white">{profileView.product_or_service || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Target Market</p>
              {isEditing ? (
                <input
                  type="text"
                  value={Array.isArray(formData.target_market) ? formData.target_market.join(', ') : ''}
                  onChange={(e) =>
                    handleInputChange(
                      'target_market',
                      e.target.value.split(',').map((item) => item.trim()).filter(Boolean)
                    )
                  }
                  placeholder="e.g. Egypt, UAE, MENA"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                />
              ) : (
                <p className="text-sm text-gray-200 leading-relaxed">
                  {Array.isArray(profileView.target_market) && profileView.target_market.length > 0
                    ? profileView.target_market.join(', ')
                    : 'No target market provided.'}
                </p>
              )}
            </div>

            <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Unique Selling Point</p>
              {isEditing ? (
                <textarea
                  value={formData.unique_selling_point}
                  onChange={(e) => handleInputChange('unique_selling_point', e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none"
                />
              ) : (
                <p className="text-sm text-gray-200 leading-relaxed">{profileView.unique_selling_point || 'No unique selling point provided.'}</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-6 sm:p-8 bg-white/5 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-[#745CB4]" />
              <h2 className="flex-1 text-[11px] font-medium uppercase tracking-widest text-gray-400 pb-3 border-b border-white/10 mb-4">Audience Insights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Gender</p>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={isGenderOpen ? genderQuery : (formData.targetAudience?.gender || '')}
                      onChange={(e) => {
                        setGenderQuery(e.target.value);
                        setIsGenderOpen(true);
                      }}
                      onFocus={() => { setGenderQuery(''); setIsGenderOpen(true); }}
                      onBlur={() => setTimeout(() => { setIsGenderOpen(false); setGenderQuery(''); }, 150)}
                      placeholder="Search genders"
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
                    />
                    {isGenderOpen && (
                      <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                        <button
                          type="button"
                          onClick={() => {
                            handleTargetAudienceChange('gender', '');
                            setGenderQuery('');
                            setIsGenderOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                        >
                          <span className="flex items-center justify-between">
                            Select Gender
                            {formData.targetAudience?.gender === '' && (
                              <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                            )}
                          </span>
                        </button>
                        {filteredGenders.length > 0 ? (
                          filteredGenders.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                handleTargetAudienceChange('gender', option);
                                setGenderQuery('');
                                setIsGenderOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                            >
                              <span className="flex items-center justify-between">
                                {option}
                                {formData.targetAudience?.gender === option && (
                                  <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                                )}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-sm text-gray-400">No options found</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-white">{targetAudienceSummary.gender}</p>
                )}
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Age Range</p>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={isAgeRangeOpen ? ageRangeQuery : (formData.targetAudience?.ageRange || '')}
                      onChange={(e) => {
                        setAgeRangeQuery(e.target.value);
                        setIsAgeRangeOpen(true);
                      }}
                      onFocus={() => { setAgeRangeQuery(''); setIsAgeRangeOpen(true); }}
                      onBlur={() => setTimeout(() => { setIsAgeRangeOpen(false); setAgeRangeQuery(''); }, 150)}
                      placeholder="Search age ranges"
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
                    />
                    {isAgeRangeOpen && (
                      <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                        <button
                          type="button"
                          onClick={() => {
                            handleTargetAudienceChange('ageRange', '');
                            setAgeRangeQuery('');
                            setIsAgeRangeOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                        >
                          <span className="flex items-center justify-between">
                            Select Age Range
                            {formData.targetAudience?.ageRange === '' && (
                              <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                            )}
                          </span>
                        </button>
                        {filteredAgeRanges.length > 0 ? (
                          filteredAgeRanges.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                handleTargetAudienceChange('ageRange', option);
                                setAgeRangeQuery('');
                                setIsAgeRangeOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                            >
                              <span className="flex items-center justify-between">
                                {option}
                                {formData.targetAudience?.ageRange === option && (
                                  <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                                )}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-sm text-gray-400">No options found</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-white">{targetAudienceSummary.ageRange}</p>
                )}
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 md:col-span-2">
                <p className="text-xs text-gray-400 mb-1">Location</p>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.targetAudience?.location || ''}
                      onChange={(e) => {
                        handleTargetAudienceChange('location', e.target.value);
                        openCountryDropdown();
                      }}
                      onFocus={openCountryDropdown}
                      onBlur={() => setTimeout(closeCountryDropdown, 120)}
                      placeholder="Search or select a country"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                    />

                    {countryDropdownOpen.target && (
                      <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                        {getFilteredCountries(formData.targetAudience?.location || '').length > 0 ? (
                          getFilteredCountries(formData.targetAudience?.location || '').map((country) => (
                            <button
                              key={country}
                              type="button"
                              onClick={() => {
                                handleTargetAudienceChange('location', country);
                                closeCountryDropdown();
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
                ) : (
                  <p className="text-sm font-semibold text-white">{targetAudienceSummary.location}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl p-6 sm:p-8 bg-white/5 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-[#745CB4]" />
              <h2 className="flex-1 text-[11px] font-medium uppercase tracking-widest text-gray-400 pb-3 border-b border-white/10 mb-4">Personal Info</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-white/5 gap-4">
                <span className="text-gray-400">First Name</span>
                <span className="text-white font-medium text-right">{ownerProfile.firstName || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5 gap-4">
                <span className="text-gray-400">Last Name</span>
                <span className="text-white font-medium text-right">{ownerProfile.lastName || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5 gap-4">
                <span className="text-gray-400">Email</span>
                <span className="text-white font-medium text-right">{ownerProfile.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 gap-4">
                <span className="text-gray-400">Onboarded</span>
                <span className="text-white font-medium text-right">{ownerProfile.isOnboarded ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 sm:p-8 bg-white/5 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-[#745CB4]" />
              <h2 className="flex-1 text-[11px] font-medium uppercase tracking-widest text-gray-400 pb-3 border-b border-white/10 mb-4">Links & Presence</h2>
            </div>

            <div className="w-full h-44 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden mb-4">
              {activeImage ? (
                <img src={activeImage} alt="brand" className="object-contain w-full h-full" />
              ) : (
                <div className="text-gray-500 flex flex-col items-center gap-2">
                  <Image className="w-10 h-10" />
                  <span>No image</span>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="mb-4 space-y-3">
                <label className="block">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <span className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    Choose Image
                  </span>
                </label>

                {selectedImageFile && !imageUploaded && (
                  <button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={isUploadingCloud}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#745CB4] hover:bg-[#9381C4] text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isUploadingCloud ? `Uploading... ${uploadProgress}%` : 'Upload to Cloud'}
                  </button>
                )}

                {imageUploaded && (
                  <div className="flex items-center justify-center gap-2 text-green-300 bg-green-500/10 border border-green-500/30 rounded-lg py-2.5 px-4 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Uploaded to cloud. Save profile to apply.
                  </div>
                )}

                {(selectedImageFile || formData.image) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-colors"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            )}

            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <div className="text-xs text-gray-400">Website</div>
                <div className="truncate">
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  ) : profileView.website ? (
                    <a href={profileView.website} target="_blank" rel="noreferrer" className="text-[#C1B6FD] hover:underline">{profileView.website}</a>
                  ) : <span className="text-gray-500">—</span>}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Previous Campaigns</div>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={isPrevCampaignOpen ? prevCampaignQuery : (prevCampaignOptions.find(p => p.value === (formData.has_previous_campaigns ? 'yes' : 'no'))?.label || '')}
                      onChange={(e) => {
                        setPrevCampaignQuery(e.target.value);
                        setIsPrevCampaignOpen(true);
                      }}
                      onFocus={() => { setPrevCampaignQuery(''); setIsPrevCampaignOpen(true); }}
                      onBlur={() => setTimeout(() => { setIsPrevCampaignOpen(false); setPrevCampaignQuery(''); }, 150)}
                      placeholder="Select option"
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
                    />
                    {isPrevCampaignOpen && (
                      <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                        {prevCampaignOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              handleInputChange('has_previous_campaigns', option.value === 'yes');
                              setPrevCampaignQuery('');
                              setIsPrevCampaignOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                          >
                            <span className="flex items-center justify-between">
                              {option.label}
                              {(formData.has_previous_campaigns ? 'yes' : 'no') === option.value && (
                                <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>{profileView.has_previous_campaigns ? 'Yes' : 'No'}</div>
                )}
              </div>

              <div>
                <div className="text-xs text-gray-400">Previous Campaign Description</div>
                {isEditing ? (
                  <textarea
                    value={formData.previous_campaign_description}
                    onChange={(e) => handleInputChange('previous_campaign_description', e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none"
                  />
                ) : (
                  <div>{profileView.previous_campaign_description || '—'}</div>
                )}
              </div>
            </div>

            <div className="mt-5 bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-xs text-gray-400 mb-2 inline-flex items-center gap-2">
                <Users className="w-4 h-4 text-[#745CB4]" />
                Platforms Used
              </div>
              <div className="mt-1 text-sm text-gray-200">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {PLATFORM_OPTIONS.map((platform) => {
                      const selected = (formData.platforms || []).includes(platform);
                      return (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => handlePlatformToggle(platform)}
                          className={`px-3 py-2 rounded-lg border text-xs text-left transition-all ${
                            selected
                              ? 'border-[#C1B6FD] bg-[#C1B6FD]/10 text-white'
                              : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {platform}
                        </button>
                      );
                    })}
                  </div>
                ) : Array.isArray(profileView.platforms) && profileView.platforms.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileView.platforms.map((platform, index) => (
                      <span key={index} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-200">
                        {platform}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
