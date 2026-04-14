import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

function PersonalInfoCard({ profileData, isEditing, onInputChange }) {
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');
  const wrapperRef = useRef(null);

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

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setCountryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getFilteredCountries = (q) => {
    const ql = (q || '').toLowerCase();
    return popularCountries.filter((c) => c.toLowerCase().includes(ql));
  };

  const selectCountry = (country) => {
    setCountryQuery('');
    setCountryOpen(false);
    if (onInputChange) onInputChange({ target: { name: 'location', value: country } });
  };

  return (
    <div className={`relative overflow-visible bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 ${countryOpen ? 'z-50' : 'z-10'}`}>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-[#C1B6FD]" />
        Personal Information
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Email</label>
          <div className="flex items-center gap-2 text-white">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{profileData.email}</span>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Location</label>
          {isEditing ? (
            <div className={`relative ${countryOpen ? 'z-50' : 'z-10'}`} ref={wrapperRef}>
              <input
                type="text"
                name="location"
                value={profileData.location || countryQuery}
                onChange={(e) => {
                  setCountryQuery(e.target.value);
                  if (onInputChange) onInputChange(e);
                }}
                onFocus={() => setCountryOpen(true)}
                placeholder="Select country"
                autoComplete="off"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
              />
              {countryOpen && (
                <div className="absolute top-full mt-2 w-full z-[100] bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                  {getFilteredCountries(countryQuery).length > 0 ? (
                    getFilteredCountries(countryQuery).map((country) => (
                      <button
                        key={country}
                        type="button"
                        onMouseDown={() => selectCountry(country)}
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
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{profileData.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonalInfoCard;
