import { Camera, Star } from 'lucide-react';

function ProfileHeader({ profileData, isEditing, onInputChange, onImageChange }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-4xl sm:text-5xl shadow-lg overflow-hidden">
            {profileData.image ? (
              <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}</span>
            )}
          </div>
          {isEditing && (
            <button 
              onClick={onImageChange}
              className="absolute bottom-0 right-0 p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName || ''}
                  onChange={onInputChange}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50 flex-1"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName || ''}
                  onChange={onInputChange}
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
              <span className="text-lg font-semibold text-white">{profileData.stats?.averageRating || 0}</span>
              <span className="text-sm text-gray-400">({profileData.stats?.completedCampaigns || 0} reviews)</span>
            </div>
          </div>

          {isEditing ? (
            <textarea
              name="bio"
              value={profileData.bio || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50 resize-none mb-4"
              rows="2"
              placeholder="Bio"
            />
          ) : (
            <p className="text-gray-300 mb-4">{profileData.bio}</p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Total Followers</p>
              <p className="text-xl font-bold text-white">{profileData.followersCount?.toLocaleString() || '0'}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Engagement Rate</p>
              <p className="text-xl font-bold text-green-400">{profileData.engagementRate || '0'}%</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Total Reach</p>
              <p className="text-xl font-bold text-white">{profileData.stats?.totalReach || '0'}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Completion</p>
              <p className="text-xl font-bold text-[#C1B6FD]">{profileData.completionPercentage || 0}%</p>
            </div>
          </div>

          {/* Profile Completion Indicator */}
          {profileData.completionPercentage < 100 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Profile Completion</span>
                <span>{profileData.completionPercentage || 0}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] transition-all duration-500"
                  style={{ width: `${profileData.completionPercentage || 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
