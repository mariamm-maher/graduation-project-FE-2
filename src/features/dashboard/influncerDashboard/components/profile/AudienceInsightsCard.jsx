import { Users } from 'lucide-react';

function AudienceInsightsCard({ profileData, isEditing, onInputChange, onArrayChange }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-[#C1B6FD]" />
        Audience Insights
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Age Range</label>
          {isEditing ? (
            <select
              name="audienceAgeRange"
              value={profileData.audienceAgeRange || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
            >
              <option value="">Select age range</option>
              <option value="13-17">13-17</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55+">55+</option>
            </select>
          ) : (
            <p className="text-white">{profileData.audienceAgeRange || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Gender Distribution</label>
          {isEditing ? (
            <select
              name="audienceGender"
              value={profileData.audienceGender || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
            >
              <option value="">Select gender distribution</option>
              <option value="Mostly Female (60%+)">Mostly Female (60%+)</option>
              <option value="Mostly Male (60%+)">Mostly Male (60%+)</option>
              <option value="Balanced">Balanced (40-60%)</option>
              <option value="Highly Female (80%+)">Highly Female (80%+)</option>
              <option value="Highly Male (80%+)">Highly Male (80%+)</option>
            </select>
          ) : (
            <p className="text-white">{profileData.audienceGender || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Top Audience Location</label>
          {isEditing ? (
            <input
              type="text"
              name="audienceLocation"
              value={profileData.audienceLocation || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
              placeholder="United States, United Kingdom, etc."
            />
          ) : (
            <p className="text-white">{profileData.audienceLocation || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Audience Interests</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.interests?.join(', ') || ''}
              onChange={(e) => onArrayChange('interests', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
              placeholder="Fashion, Travel, Fitness, Food"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.interests?.map((interest, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  {interest}
                </span>
              )) || <span className="text-gray-400">No interests set</span>}
            </div>
          )}
        </div>

        {/* Visual Stats */}
        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Total Followers</p>
              <p className="text-lg font-bold text-white">{profileData.followersCount?.toLocaleString() || '0'}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Total Reach</p>
              <p className="text-lg font-bold text-[#C1B6FD]">{profileData.stats?.totalReach || '0'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudienceInsightsCard;
