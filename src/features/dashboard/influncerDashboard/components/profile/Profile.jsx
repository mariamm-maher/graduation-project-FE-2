import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Award, 
  Edit2, 
  Save, 
  X, 
  Instagram, 
  Youtube, 
  Facebook, 
  Twitter,
  Globe,
  Camera,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Personal Information
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'Los Angeles, CA',
    bio: 'Fashion & Lifestyle Content Creator | 500K+ Followers | Brand Collaborations',
    dateOfBirth: '1995-03-15',
    profileImage: '👩',
    
    // Social Media Accounts
    socialMedia: {
      instagram: { username: '@sarahj_fashion', followers: '284K', verified: true },
      youtube: { username: 'Sarah Johnson', subscribers: '128K', verified: true },
      tiktok: { username: '@sarahj', followers: '456K', verified: false },
      twitter: { username: '@sarahj', followers: '92K', verified: false }
    },
    
    // Professional Details
    category: 'Fashion & Lifestyle',
    niche: ['Fashion', 'Beauty', 'Lifestyle'],
    languages: ['English', 'Spanish'],
    yearsOfExperience: 5,
    
    // Statistics
    stats: {
      totalCampaigns: 24,
      activeCampaigns: 5,
      completedCampaigns: 19,
      totalEarnings: '$125,000',
      averageRating: 4.8,
      totalReach: '2.4M'
    },
    
    // Portfolio & Achievements
    achievements: [
      { title: 'Top Fashion Influencer 2024', year: '2024', platform: 'Instagram' },
      { title: 'Best Collaboration Award', year: '2023', platform: 'YouTube' },
      { title: 'Rising Star', year: '2022', platform: 'TikTok' }
    ],
    
    // Rates & Pricing
    rates: {
      instagram: { post: '$2,500', story: '$800', reel: '$3,200' },
      youtube: { video: '$5,000', short: '$1,500' },
      tiktok: { video: '$2,000', series: '$4,500' }
    },
    
    // Availability
    availability: 'Available for collaborations',
    responseTime: 'Within 24 hours',
    preferredBrands: ['Fashion', 'Beauty', 'Luxury', 'Tech']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the profile
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data (in real app, fetch from API)
  };

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
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-4xl sm:text-5xl shadow-lg">
              {profileData.profileImage}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all">
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50 flex-1"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50 flex-1"
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {profileData.firstName} {profileData.lastName}
                </h2>
              )}
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-semibold text-white">{profileData.stats.averageRating}</span>
                <span className="text-sm text-gray-400">({profileData.stats.completedCampaigns} reviews)</span>
              </div>
            </div>

            {isEditing ? (
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50 resize-none"
                rows="2"
                placeholder="Bio"
              />
            ) : (
              <p className="text-gray-300 mb-4">{profileData.bio}</p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Total Campaigns</p>
                <p className="text-xl font-bold text-white">{profileData.stats.totalCampaigns}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Active</p>
                <p className="text-xl font-bold text-green-400">{profileData.stats.activeCampaigns}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Total Reach</p>
                <p className="text-xl font-bold text-white">{profileData.stats.totalReach}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Total Earnings</p>
                <p className="text-xl font-bold text-[#C1B6FD]">{profileData.stats.totalEarnings}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#C1B6FD]" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-white">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{profileData.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-white">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{profileData.location}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(profileData.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#C1B6FD]" />
              Professional Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Category</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="category"
                    value={profileData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                ) : (
                  <p className="text-white">{profileData.category}</p>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Niche</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.niche.join(', ')}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      niche: e.target.value.split(',').map(n => n.trim())
                    }))}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
                    placeholder="Fashion, Beauty, Lifestyle"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.niche.map((n, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#745CB4]/20 text-[#C1B6FD] rounded-full text-sm">
                        {n}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Years of Experience</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={profileData.yearsOfExperience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                ) : (
                  <p className="text-white">{profileData.yearsOfExperience} years</p>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Languages</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.languages.join(', ')}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      languages: e.target.value.split(',').map(l => l.trim())
                    }))}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.languages.map((lang, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/5 text-white rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rates & Pricing */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#C1B6FD]" />
              Rates & Pricing
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Instagram</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Post</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.rates.instagram.post}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          rates: {
                            ...prev.rates,
                            instagram: { ...prev.rates.instagram, post: e.target.value }
                          }
                        }))}
                        className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                      />
                    ) : (
                      <p className="text-white font-semibold">{profileData.rates.instagram.post}</p>
                    )}
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Story</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.rates.instagram.story}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          rates: {
                            ...prev.rates,
                            instagram: { ...prev.rates.instagram, story: e.target.value }
                          }
                        }))}
                        className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                      />
                    ) : (
                      <p className="text-white font-semibold">{profileData.rates.instagram.story}</p>
                    )}
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Reel</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.rates.instagram.reel}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          rates: {
                            ...prev.rates,
                            instagram: { ...prev.rates.instagram, reel: e.target.value }
                          }
                        }))}
                        className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                      />
                    ) : (
                      <p className="text-white font-semibold">{profileData.rates.instagram.reel}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-2">YouTube</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Video</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.rates.youtube.video}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          rates: {
                            ...prev.rates,
                            youtube: { ...prev.rates.youtube, video: e.target.value }
                          }
                        }))}
                        className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                      />
                    ) : (
                      <p className="text-white font-semibold">{profileData.rates.youtube.video}</p>
                    )}
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Short</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.rates.youtube.short}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          rates: {
                            ...prev.rates,
                            youtube: { ...prev.rates.youtube, short: e.target.value }
                          }
                        }))}
                        className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                      />
                    ) : (
                      <p className="text-white font-semibold">{profileData.rates.youtube.short}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-2">TikTok</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Video</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.rates.tiktok.video}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          rates: {
                            ...prev.rates,
                            tiktok: { ...prev.rates.tiktok, video: e.target.value }
                          }
                        }))}
                        className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                      />
                    ) : (
                      <p className="text-white font-semibold">{profileData.rates.tiktok.video}</p>
                    )}
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Series</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.rates.tiktok.series}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          rates: {
                            ...prev.rates,
                            tiktok: { ...prev.rates.tiktok, series: e.target.value }
                          }
                        }))}
                        className="w-full mt-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                      />
                    ) : (
                      <p className="text-white font-semibold">{profileData.rates.tiktok.series}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Social Media Accounts */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#C1B6FD]" />
              Social Media Accounts
            </h3>
            <div className="space-y-4">
              {/* Instagram */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-pink-400" />
                    <span className="text-white font-semibold">Instagram</span>
                    {profileData.socialMedia.instagram.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={profileData.socialMedia.instagram.username}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        socialMedia: {
                          ...prev.socialMedia,
                          instagram: { ...prev.socialMedia.instagram, username: e.target.value }
                        }
                      }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                      placeholder="Username"
                    />
                    <input
                      type="text"
                      value={profileData.socialMedia.instagram.followers}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        socialMedia: {
                          ...prev.socialMedia,
                          instagram: { ...prev.socialMedia.instagram, followers: e.target.value }
                        }
                      }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                      placeholder="Followers"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-[#C1B6FD]">{profileData.socialMedia.instagram.username}</p>
                    <p className="text-sm text-gray-400">{profileData.socialMedia.instagram.followers} followers</p>
                  </div>
                )}
              </div>

              {/* YouTube */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-400" />
                    <span className="text-white font-semibold">YouTube</span>
                    {profileData.socialMedia.youtube.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={profileData.socialMedia.youtube.username}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        socialMedia: {
                          ...prev.socialMedia,
                          youtube: { ...prev.socialMedia.youtube, username: e.target.value }
                        }
                      }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                    />
                    <input
                      type="text"
                      value={profileData.socialMedia.youtube.subscribers}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        socialMedia: {
                          ...prev.socialMedia,
                          youtube: { ...prev.socialMedia.youtube, subscribers: e.target.value }
                        }
                      }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-[#C1B6FD]">{profileData.socialMedia.youtube.username}</p>
                    <p className="text-sm text-gray-400">{profileData.socialMedia.youtube.subscribers} subscribers</p>
                  </div>
                )}
              </div>

              {/* TikTok */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">TikTok</span>
                  </div>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={profileData.socialMedia.tiktok.username}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        socialMedia: {
                          ...prev.socialMedia,
                          tiktok: { ...prev.socialMedia.tiktok, username: e.target.value }
                        }
                      }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                    />
                    <input
                      type="text"
                      value={profileData.socialMedia.tiktok.followers}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        socialMedia: {
                          ...prev.socialMedia,
                          tiktok: { ...prev.socialMedia.tiktok, followers: e.target.value }
                        }
                      }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C1B6FD]/50"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-[#C1B6FD]">{profileData.socialMedia.tiktok.username}</p>
                    <p className="text-sm text-gray-400">{profileData.socialMedia.tiktok.followers} followers</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C1B6FD]" />
              Achievements
            </h3>
            <div className="space-y-3">
              {profileData.achievements.map((achievement, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold">{achievement.title}</p>
                      <p className="text-sm text-gray-400">{achievement.platform} • {achievement.year}</p>
                    </div>
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Availability</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="availability"
                    value={profileData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                ) : (
                  <p className="text-white">{profileData.availability}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Response Time</p>
                <p className="text-white">{profileData.responseTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Preferred Brands</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.preferredBrands.join(', ')}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      preferredBrands: e.target.value.split(',').map(b => b.trim())
                    }))}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.preferredBrands.map((brand, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#745CB4]/20 text-[#C1B6FD] rounded-full text-sm">
                        {brand}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

