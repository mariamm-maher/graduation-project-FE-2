import { Clock } from 'lucide-react';

function AvailabilityCard({ profileData, isEditing, onInputChange, onArrayChange }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#C1B6FD]" />
        Availability
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">Status</p>
          {isEditing ? (
            <select
              name="availability"
              value={profileData.availability || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
            >
              <option value="">Select status</option>
              <option value="Available for collaborations">Available for collaborations</option>
              <option value="Limited availability">Limited availability</option>
              <option value="Not accepting new collaborations">Not accepting new collaborations</option>
              <option value="On vacation">On vacation</option>
            </select>
          ) : (
            <p className="text-white">{profileData.availability || 'Not set'}</p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">Response Time</p>
          {isEditing ? (
            <select
              name="responseTime"
              value={profileData.responseTime || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
            >
              <option value="">Select response time</option>
              <option value="Within 1 hour">Within 1 hour</option>
              <option value="Within 24 hours">Within 24 hours</option>
              <option value="Within 48 hours">Within 48 hours</option>
              <option value="Within 3-5 days">Within 3-5 days</option>
            </select>
          ) : (
            <p className="text-white">{profileData.responseTime || 'Not set'}</p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">Preferred Brand Categories</p>
          {isEditing ? (
            <input
              type="text"
              value={profileData.preferredBrands?.join(', ') || ''}
              onChange={(e) => onArrayChange('preferredBrands', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
              placeholder="Fashion, Beauty, Luxury, Tech"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.preferredBrands?.map((brand, idx) => (
                <span key={idx} className="px-3 py-1 bg-[#745CB4]/20 text-[#C1B6FD] rounded-full text-sm">
                  {brand}
                </span>
              )) || <span className="text-gray-400">No preferences set</span>}
            </div>
          )}
        </div>

        {/* Onboarding Status */}
        {!profileData.isOnboarded && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-400">
              ⚠️ Complete your profile to start receiving collaboration requests
            </p>
          </div>
        )}

        {profileData.isOnboarded && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-400">
              ✓ Profile complete and visible to brands
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AvailabilityCard;
