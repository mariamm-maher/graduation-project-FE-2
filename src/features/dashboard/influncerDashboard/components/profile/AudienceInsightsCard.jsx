import { useEffect, useRef, useState } from 'react';
import { Users } from 'lucide-react';

function AudienceInsightsCard({ profileData, isEditing, onInputChange, onArrayChange }) {
  const [dropdownOpen, setDropdownOpen] = useState({
    age: false,
    gender: false,
    location: false
  });

  const ageRef = useRef(null);
  const genderRef = useRef(null);
  const locationRef = useRef(null);

  const ageRanges = ['13–17', '18–24', '25–34', '35–44', '45+'];
  const genderOptions = [
    'Mostly Male',
    'Mostly Female',
    'Mixed'
  ];
  const popularCountries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
    'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland',
    'Belgium', 'Austria', 'Ireland', 'Portugal', 'Poland', 'Czech Republic',
    'Hungary', 'Romania', 'Greece', 'Turkey', 'Russia', 'Ukraine', 'India',
    'Pakistan', 'Bangladesh', 'China', 'Japan', 'South Korea', 'Indonesia',
    'Philippines', 'Vietnam', 'Thailand', 'Malaysia', 'Singapore', 'Saudi Arabia',
    'United Arab Emirates', 'Egypt', 'South Africa', 'Nigeria', 'Kenya', 'Brazil',
    'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'New Zealand'
  ];
  const interestsOptions = ['Fashion', 'Technology', 'Gaming', 'Fitness', 'Travel', 'Food', 'Beauty', 'Education'];

  useEffect(() => {
    function handleOutsideClick(e) {
      if (ageRef.current && !ageRef.current.contains(e.target)) {
        setDropdownOpen((prev) => ({ ...prev, age: false }));
      }
      if (genderRef.current && !genderRef.current.contains(e.target)) {
        setDropdownOpen((prev) => ({ ...prev, gender: false }));
      }
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setDropdownOpen((prev) => ({ ...prev, location: false }));
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (name, value) => {
    if (onInputChange) onInputChange({ target: { name, value } });
  };

  const getFilteredCountries = (query) => {
    const q = (query || '').toLowerCase();
    return popularCountries.filter((country) => country.toLowerCase().includes(q));
  };

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
            <div className="relative" ref={ageRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => ({ ...prev, age: !prev.age }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-left focus:outline-none focus:border-[#C1B6FD]/50"
              >
                {profileData.audienceAgeRange || 'Select age range'}
              </button>

              {dropdownOpen.age && (
                <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                  {ageRanges.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        handleSelect('audienceAgeRange', range);
                        setDropdownOpen((prev) => ({ ...prev, age: false }));
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-white">{profileData.audienceAgeRange || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Gender Distribution</label>
          {isEditing ? (
            <div className="relative" ref={genderRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => ({ ...prev, gender: !prev.gender }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-left focus:outline-none focus:border-[#C1B6FD]/50"
              >
                {profileData.audienceGender || 'Select gender distribution'}
              </button>

              {dropdownOpen.gender && (
                <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                  {genderOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        handleSelect('audienceGender', option);
                        setDropdownOpen((prev) => ({ ...prev, gender: false }));
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-white">{profileData.audienceGender || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Top Audience Location</label>
          {isEditing ? (
            <div className="relative" ref={locationRef}>
              <input
                type="text"
                name="audienceLocation"
                value={profileData.audienceLocation || ''}
                onChange={(e) => {
                  if (onInputChange) onInputChange(e);
                  setDropdownOpen((prev) => ({ ...prev, location: true }));
                }}
                onFocus={() => setDropdownOpen((prev) => ({ ...prev, location: true }))}
                placeholder="Search or select a country"
                autoComplete="off"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
              />

              {dropdownOpen.location && (
                <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                  {getFilteredCountries(profileData.audienceLocation).length > 0 ? (
                    getFilteredCountries(profileData.audienceLocation).map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => {
                          handleSelect('audienceLocation', country);
                          setDropdownOpen((prev) => ({ ...prev, location: false }));
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
            <p className="text-white">{profileData.audienceLocation || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Audience Interests</label>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              {interestsOptions.map((interest) => {
                const selected = profileData.interests?.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => {
                      const current = profileData.interests || [];
                      let next;
                      if (current.includes(interest)) {
                        next = current.filter((i) => i !== interest);
                      } else {
                        next = [...current, interest];
                      }
                      if (onArrayChange) onArrayChange('interests', next.join(','));
                    }}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selected
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.interests?.length ? (
                profileData.interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No interests set</span>
              )}
            </div>
          )}
        </div>

   
      
      </div>
    </div>
  );
}

export default AudienceInsightsCard;
