import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

function PersonalInfoCard({ profileData, isEditing, onInputChange }) {
  return (
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
              value={profileData.email || ''}
              onChange={onInputChange}
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
              value={profileData.phone || ''}
              onChange={onInputChange}
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
              value={profileData.location || ''}
              onChange={onInputChange}
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
              value={profileData.dateOfBirth || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C1B6FD]/50"
            />
          ) : (
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'Not set'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonalInfoCard;
