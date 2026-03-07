import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';

export default function InfluencerOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const userId = location.state?.userId || user?.userId;

  const [formData, setFormData] = useState({
    // Add influencer-specific fields here
  });

  const handleSubmit = async () => {
    // TODO: Submit to API
    console.log('Submitting influencer onboarding data:', formData);

    toast.success('Onboarding completed successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });

    // Navigate to dashboard
    setTimeout(() => {
      navigate('/dashboard/influencer');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#05060F] to-[#1e1632] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Influencer Onboarding
          </h1>
          <p className="text-gray-400">
            Complete your profile to start collaborating with brands
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center py-12">
            <p className="text-gray-300 mb-6">
              Influencer onboarding questions coming soon...
            </p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="py-3 px-8 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
            >
              Continue to Dashboard
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Skip Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/dashboard/influencer')}
            className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
          >
            Skip for now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
