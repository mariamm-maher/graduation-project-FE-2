import { Briefcase, TrendingUp } from 'lucide-react';

function ProfessionalDetailsCard({ profileData, isEditing, onInputChange, onArrayChange }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-[#C1B6FD]" />
        Professional Details
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Primary Platform</label>
          {isEditing ? (
            <select
              name="primaryPlatform"
              value={profileData.primaryPlatform || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
            >
              <option value="">Select platform</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
            </select>
          ) : (
            <p className="text-white capitalize">{profileData.primaryPlatform || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Categories</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.categories?.join(', ') || ''}
              onChange={(e) => onArrayChange('categories', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
              placeholder="Fashion, Beauty, Lifestyle"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.categories?.map((cat, idx) => (
                <span key={idx} className="px-3 py-1 bg-[#745CB4]/20 text-[#C1B6FD] rounded-full text-sm">
                  {cat}
                </span>
              )) || <span className="text-gray-400">No categories set</span>}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Content Types</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.contentTypes?.join(', ') || ''}
              onChange={(e) => onArrayChange('contentTypes', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
              placeholder="Posts, Stories, Videos, Reels"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.contentTypes?.map((type, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/5 text-white rounded-full text-sm">
                  {type}
                </span>
              )) || <span className="text-gray-400">No content types set</span>}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Collaboration Types</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.collaborationTypes?.join(', ') || ''}
              onChange={(e) => onArrayChange('collaborationTypes', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
              placeholder="Sponsored Posts, Product Reviews, Brand Ambassadorships"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.collaborationTypes?.map((type, idx) => (
                <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  {type}
                </span>
              )) || <span className="text-gray-400">No collaboration types set</span>}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Engagement Rate</label>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <input
                type="number"
                name="engagementRate"
                value={profileData.engagementRate || ''}
                onChange={onInputChange}
                step="0.1"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="0.0"
              />
            ) : (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-white">{profileData.engagementRate || 0}%</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Years of Experience</label>
          {isEditing ? (
            <input
              type="number"
              name="yearsOfExperience"
              value={profileData.yearsOfExperience || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
            />
          ) : (
            <p className="text-white">{profileData.yearsOfExperience || 0} years</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Languages</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.languages?.join(', ') || ''}
              onChange={(e) => onArrayChange('languages', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
              placeholder="English, Spanish, French"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.languages?.map((lang, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/5 text-white rounded-full text-sm">
                  {lang}
                </span>
              )) || <span className="text-gray-400">No languages set</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfessionalDetailsCard;
