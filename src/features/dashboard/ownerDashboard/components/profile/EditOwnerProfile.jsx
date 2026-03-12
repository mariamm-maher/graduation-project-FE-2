import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import useProfileStore from '../../../../../stores/profileStore';

export default function EditOwnerProfile() {
  const navigate = useNavigate();
  const ownerProfile = useProfileStore((s) => s.ownerProfile);
  const updateOwnerProfile = useProfileStore((s) => s.updateOwnerProfile);
  const isLoading = useProfileStore((s) => s.isLoading);

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    industry: '',
    location: '',
    description: '',
    website: '',
    phoneNumber: '',
    platformsUsed: [],
    primaryMarketingGoal: '',
    targetAudience: {}
  });

  useEffect(() => {
    if (ownerProfile) {
      setFormData({
        businessName: ownerProfile.businessName || '',
        businessType: ownerProfile.businessType || '',
        industry: ownerProfile.industry || '',
        location: ownerProfile.location || '',
        description: ownerProfile.description || '',
        website: ownerProfile.website || '',
        phoneNumber: ownerProfile.phoneNumber || '',
        platformsUsed: ownerProfile.platformsUsed || [],
        primaryMarketingGoal: ownerProfile.primaryMarketingGoal || '',
        targetAudience: ownerProfile.targetAudience || {}
      });
    }
  }, [ownerProfile]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateOwnerProfile(formData);
    
    if (result.success) {
      toast.success('Profile updated successfully');
      navigate('/dashboard/owner/profile');
    } else {
      toast.error(result.error || 'Failed to update profile');
    }
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-sm text-gray-400">Update your business information</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/owner/profile')}
          className="px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Business Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Business Type</label>
            <input
              type="text"
              value={formData.businessType}
              onChange={(e) => handleChange('businessType', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Industry</label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Primary Marketing Goal</label>
          <input
            type="text"
            value={formData.primaryMarketingGoal}
            onChange={(e) => handleChange('primaryMarketingGoal', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div className="flex gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/owner/profile')}
            className="px-6 py-2 bg-white/5 rounded-lg hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
