import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Lock,
  Check,
  X,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Mail
} from 'lucide-react';
import useSettingsStore from '../../stores/SettingsStore';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

// =======================
// MAIN SETTINGS PANEL COMPONENT
// =======================
export default function SettingsPanel({ className = '' }) {
  const {
    settings,
    isLoading,
    error,
    successMessage,
    fetchSettings,
    updateAccountSettings,
    changePassword,
    clearError,
    clearSuccessMessage
  } = useSettingsStore();

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
        >
          <X className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={clearError}
            className="ml-auto p-1 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3"
        >
          <Check className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-green-400">{successMessage}</p>
          <button
            onClick={clearSuccessMessage}
            className="ml-auto p-1 hover:bg-green-500/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-green-400" />
          </button>
        </motion.div>
      )}

      {/* Account Settings */}
      <AccountSettings
        settings={settings.account}
        isLoading={isLoading}
        onUpdate={updateAccountSettings}
        onChangePassword={changePassword}
      />
    </div>
  );
}

// =======================
// ACCOUNT SETTINGS TAB
// =======================
function AccountSettings({ settings, isLoading, onUpdate, onChangePassword }) {
  const [formData, setFormData] = useState({
    firstName: settings?.firstName || '',
    lastName: settings?.lastName || '',
    email: settings?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      useSettingsStore.getState().setError('Passwords do not match');
      return;
    }
    const result = await onChangePassword(passwordData.currentPassword, passwordData.newPassword);
    if (result?.success) {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Profile Info Card */}
      {/* <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-[#C1B6FD]" />
          Profile Information
        </h2>
        <form onSubmit={handleAccountUpdate} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all outline-none text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all outline-none text-white"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Changing your email will require re-verification
            </p>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C1B6FD] to-[#FF9E9E] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </form>
      </div> */}

      {/* Change Password Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-[#FF9E9E]" />
          Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all outline-none text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all outline-none text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all outline-none text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-[#FF9E9E]/50 text-white font-semibold rounded-xl hover:bg-[#FF9E9E]/10 transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
