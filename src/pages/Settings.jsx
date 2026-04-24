import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Lock,
  Bell,
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Eye,
  EyeOff,
  Globe,
  Save,
  Loader2,
  ChevronRight,
  Mail,
  Smartphone,
  Megaphone,
  MessageSquare,
  FileText,
  Clock,
  Briefcase
} from 'lucide-react';
import useSettingsStore from '../stores/SettingsStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

const TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];

// Toggle Switch Component (defined outside to avoid re-creation during render)
function ToggleSwitch({ checked, onChange, label, description, isLoading }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div className="flex-1 pr-4">
        <h4 className="font-medium text-white">{label}</h4>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
      <button
        onClick={onChange}
        disabled={isLoading}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
          checked ? 'bg-gradient-to-r from-[#C1B6FD] to-[#FF9E9E]' : 'bg-gray-700'
        } disabled:opacity-50`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
            checked ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

// Notification Item Component (defined outside to avoid re-creation during render)
function NotificationItem({ icon: Icon, checked, onChange, label, description, isLoading }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div className="flex items-start gap-4 flex-1 pr-4">
        <div className="p-2 rounded-lg bg-[#C1B6FD]/10">
          <Icon className="w-5 h-5 text-[#C1B6FD]" />
        </div>
        <div>
          <h4 className="font-medium text-white">{label}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        disabled={isLoading}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
          checked ? 'bg-gradient-to-r from-[#C1B6FD] to-[#FF9E9E]' : 'bg-gray-700'
        } disabled:opacity-50`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
            checked ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const {
    settings,
    isLoading,
    error,
    successMessage,
    fetchSettings,
    updateAccountSettings,
    updatePrivacySettings,
    updateNotificationPreferences,
    changePassword,
    exportUserData,
    deleteAccount,
    clearError,
    clearSuccessMessage
  } = useSettingsStore();

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Clear messages when switching tabs
  useEffect(() => {
    clearError();
    clearSuccessMessage();
  }, [activeTab, clearError, clearSuccessMessage]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-8">
      {/* Header */}
      <div className="bg-[#10121f] border-b border-white/10 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-[#C1B6FD] to-[#FF9E9E] bg-clip-text text-transparent"
          >
            Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-2"
          >
            Manage your account settings, privacy, and preferences
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#C1B6FD]/20 to-[#FF9E9E]/20 border border-[#C1B6FD]/30 text-white'
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </motion.div>

          {/* Content Area */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
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
                className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3"
              >
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-400">{successMessage}</p>
                <button
                  onClick={clearSuccessMessage}
                  className="ml-auto p-1 hover:bg-green-500/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-green-400" />
                </button>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === 'account' && (
                <AccountSettings
                  key="account"
                  settings={settings.account}
                  isLoading={isLoading}
                  onUpdate={updateAccountSettings}
                  onChangePassword={changePassword}
                />
              )}
              {activeTab === 'privacy' && (
                <PrivacySettings
                  key="privacy"
                  settings={settings.privacy}
                  isLoading={isLoading}
                  onUpdate={updatePrivacySettings}
                />
              )}
              {activeTab === 'notifications' && (
                <NotificationSettings
                  key="notifications"
                  settings={settings.notifications}
                  isLoading={isLoading}
                  onUpdate={updateNotificationPreferences}
                />
              )}
              {activeTab === 'danger' && (
                <DangerZone
                  key="danger"
                  isLoading={isLoading}
                  onExport={exportUserData}
                  onDelete={deleteAccount}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// =======================
// ACCOUNT SETTINGS TAB
// =======================
function AccountSettings({ settings, isLoading, onUpdate, onChangePassword }) {
  const [formData, setFormData] = useState({
    firstName: settings.firstName || '',
    lastName: settings.lastName || '',
    email: settings.email || ''
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
    if (result.success) {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Profile Info Card */}
      <div className="bg-[#10121f]/50 border border-white/10 rounded-2xl p-6">
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
                className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all outline-none"
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
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all outline-none"
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
      </div>

      {/* Change Password Card */}
      <div className="bg-[#10121f]/50 border border-white/10 rounded-2xl p-6">
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
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all outline-none"
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
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all outline-none"
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
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all outline-none"
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
              className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-[#FF9E9E]/50 text-white font-semibold rounded-xl hover:bg-[#FF9E9E]/10 transition-all disabled:opacity-50"
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

// =======================
// PRIVACY SETTINGS TAB
// =======================
function PrivacySettings({ settings, isLoading, onUpdate }) {
  const [privacy, setPrivacy] = useState(settings);

  const handleToggle = async (key) => {
    const newValue = !privacy[key];
    setPrivacy({ ...privacy, [key]: newValue });
    await onUpdate({ [key]: newValue });
  };

  const handleVisibilityChange = async (value) => {
    setPrivacy({ ...privacy, profileVisibility: value });
    await onUpdate({ profileVisibility: value });
  };

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Profile Visibility Card */}
      <div className="bg-[#10121f]/50 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-[#C1B6FD]" />
          Profile Visibility
        </h2>
        <div className="space-y-3">
          {[
            { value: 'public', label: 'Public', desc: 'Anyone can view your profile' },
            { value: 'connections_only', label: 'Connections Only', desc: 'Only your connections can view your profile' },
            { value: 'private', label: 'Private', desc: 'Your profile is hidden from everyone' },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                privacy.profileVisibility === option.value
                  ? 'border-[#C1B6FD]/50 bg-[#C1B6FD]/5'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value={option.value}
                checked={privacy.profileVisibility === option.value}
                onChange={() => handleVisibilityChange(option.value)}
                className="mt-1 w-4 h-4 accent-[#C1B6FD]"
              />
              <div>
                <h4 className="font-medium">{option.label}</h4>
                <p className="text-sm text-gray-400">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Privacy Toggles Card */}
      <div className="bg-[#10121f]/50 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-[#C1B6FD]" />
          Privacy Options
        </h2>
        <div>
          <ToggleSwitch
            checked={privacy.showEmail}
            onChange={() => handleToggle('showEmail')}
            label="Show Email on Profile"
            description="Allow others to see your email address on your public profile"
            isLoading={isLoading}
          />
          <ToggleSwitch
            checked={privacy.showPhone}
            onChange={() => handleToggle('showPhone')}
            label="Show Phone Number"
            description="Display your phone number on your profile"
            isLoading={isLoading}
          />
          <ToggleSwitch
            checked={privacy.allowSearchByEmail}
            onChange={() => handleToggle('allowSearchByEmail')}
            label="Allow Search by Email"
            description="Let people find you using your email address"
            isLoading={isLoading}
          />
          <ToggleSwitch
            checked={privacy.allowDataCollection}
            onChange={() => handleToggle('allowDataCollection')}
            label="Allow Analytics & Data Collection"
            description="Help us improve by allowing anonymous usage data collection"
            isLoading={isLoading}
          />
          <ToggleSwitch
            checked={privacy.shareActivityStatus}
            onChange={() => handleToggle('shareActivityStatus')}
            label="Show Activity Status"
            description="Display when you were last active"
            isLoading={isLoading}
          />
        </div>
      </div>
    </motion.div>
  );
}

// =======================
// NOTIFICATION SETTINGS TAB
// =======================
function NotificationSettings({ settings, isLoading, onUpdate }) {
  const [notifications, setNotifications] = useState(settings);

  const handleToggle = async (key) => {
    const newValue = !notifications[key];
    setNotifications({ ...notifications, [key]: newValue });
    await onUpdate({ [key]: newValue });
  };

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Email Notifications Card */}
      <div className="bg-[#10121f]/50 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-[#C1B6FD]" />
          Email Notifications
        </h2>
        <div>
          <NotificationItem
            icon={Mail}
            checked={notifications.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
            label="Email Notifications"
            description="Receive notifications via email"
          />
          <NotificationItem
            icon={Briefcase}
            checked={notifications.newCollaborationRequests}
            onChange={() => handleToggle('newCollaborationRequests')}
            label="New Collaboration Requests"
            description="Get notified when someone sends you a collaboration request"
          />
          <NotificationItem
            icon={Clock}
            checked={notifications.collaborationUpdates}
            onChange={() => handleToggle('collaborationUpdates')}
            label="Collaboration Updates"
            description="Receive updates about your ongoing collaborations"
          />
          <NotificationItem
            icon={MessageSquare}
            checked={notifications.messages}
            onChange={() => handleToggle('messages')}
            label="New Messages"
            description="Get notified when you receive a new message"
          />
          <NotificationItem
            icon={FileText}
            checked={notifications.weeklyDigest}
            onChange={() => handleToggle('weeklyDigest')}
            label="Weekly Digest"
            description="Receive a weekly summary of your account activity"
          />
        </div>
      </div>

      {/* Marketing & System Card */}
      <div className="bg-[#10121f]/50 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Megaphone className="w-5 h-5 text-[#FF9E9E]" />
          Marketing & System
        </h2>
        <div>
          <NotificationItem
            icon={Megaphone}
            checked={notifications.marketingEmails}
            onChange={() => handleToggle('marketingEmails')}
            label="Marketing Emails"
            description="Receive promotional offers and updates about new features"
          />
          <NotificationItem
            icon={Smartphone}
            checked={notifications.pushNotifications}
            onChange={() => handleToggle('pushNotifications')}
            label="Push Notifications"
            description="Receive push notifications on your device"
          />
          <NotificationItem
            icon={Bell}
            checked={notifications.systemAnnouncements}
            onChange={() => handleToggle('systemAnnouncements')}
            label="System Announcements"
            description="Important updates about the platform"
          />
        </div>
      </div>
    </motion.div>
  );
}

// =======================
// DANGER ZONE TAB
// =======================
function DangerZone({ isLoading, onExport, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    const result = await onExport();
    if (result.success && result.data) {
      // Download data as JSON
      const dataStr = JSON.stringify(result.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    setIsExporting(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (confirmText !== 'DELETE') {
      useSettingsStore.getState().setError('Please type DELETE to confirm');
      return;
    }
    const result = await onDelete(deletePassword);
    if (result.success) {
      // Account deleted - redirect to login
      window.location.href = '/login';
    }
  };

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Export Data Card */}
      <div className="bg-[#10121f]/50 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-[#C1B6FD]" />
          Export Your Data
        </h2>
        <p className="text-gray-400 mb-6">
          Download a copy of all your personal data, including your profile information,
          campaigns, collaborations, and account history. This may take a few moments to prepare.
        </p>
        <button
          onClick={handleExport}
          disabled={isLoading || isExporting}
          className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-[#C1B6FD]/50 text-white font-semibold rounded-xl hover:bg-[#C1B6FD]/10 transition-all disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          {isExporting ? 'Preparing Export...' : 'Export Data'}
        </button>
      </div>

      {/* Delete Account Card */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-red-400">
          <Trash2 className="w-5 h-5" />
          Delete Account
        </h2>
        <p className="text-gray-400 mb-4">
          <span className="text-red-400 font-semibold">Warning:</span> This action is permanent and cannot be undone.
          All your data, including campaigns, collaborations, and account history will be permanently deleted.
        </p>
        <div className="bg-red-500/10 rounded-xl p-4 mb-6">
          <ul className="text-sm text-red-400 space-y-2">
            <li className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Your profile and all personal data will be deleted
            </li>
            <li className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              All your campaigns will be archived and anonymized
            </li>
            <li className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Active collaborations will be terminated
            </li>
            <li className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              This action cannot be reversed
            </li>
          </ul>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-400 font-semibold rounded-xl hover:bg-red-500/30 transition-all disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
          Delete My Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#10121f] border border-red-500/30 rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Account?</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Please enter your password and type <span className="text-red-400 font-mono">DELETE</span> to permanently delete your account.
            </p>
            <form onSubmit={handleDelete} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#0a0a0a] border border-red-500/30 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Type <span className="text-red-400 font-mono">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-red-500/30 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
                  placeholder="DELETE"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || confirmText !== 'DELETE' || !deletePassword}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete Forever'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
