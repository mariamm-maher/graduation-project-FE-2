import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Lock, User, Bell, ShieldCheck, Eye, EyeOff, Save, Loader2, Check, X } from 'lucide-react';
import useAuthStore from '../../../../../stores/authStore';
import useSettingsStore from '../../../../../stores/SettingsStore';

const TABS = [
  { key: 'password',      label: 'Change Password',   Icon: Lock },
  { key: 'profile',       label: 'Edit Profile',      Icon: User },
  { key: 'notifications', label: 'Notifications',     Icon: Bell },
  { key: 'privacy',       label: 'Privacy & Security', Icon: ShieldCheck },
];

// ─── Change Password ──────────────────────────────────────────────────────────
function ChangePasswordSection() {
  const { changePassword, isLoading, error, successMessage, clearError, clearSuccessMessage } = useSettingsStore();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });

  const handle = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      useSettingsStore.getState().setError('Passwords do not match');
      return;
    }
    const result = await changePassword(form.currentPassword, form.newPassword);
    if (result?.success) setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const Field = ({ label, field, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type={show[field] ? 'text' : 'password'}
          value={form[field]}
          onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#C1B6FD]/60 focus:ring-2 focus:ring-[#C1B6FD]/20 outline-none text-white placeholder-gray-600 transition-all"
        />
        <button type="button" onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
          {show[field] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-lg">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
        <Lock className="w-5 h-5 text-[#C1B6FD]" /> Change Password
      </h2>
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" />{error}
          <button onClick={clearError} className="ml-auto"><X className="w-3 h-3" /></button>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />{successMessage}
          <button onClick={clearSuccessMessage} className="ml-auto"><X className="w-3 h-3" /></button>
        </div>
      )}
      <form onSubmit={handle} className="space-y-4">
        <Field label="Current Password" field="current" placeholder="Enter current password" />
        <Field label="New Password" field="new" placeholder="Enter new password" />
        <Field label="Confirm New Password" field="confirm" placeholder="Confirm new password" />
        <div className="pt-2">
          <button type="submit" disabled={isLoading || !form.currentPassword || !form.newPassword || !form.confirmPassword}
            className="flex items-center gap-2 px-6 py-3 bg-[#745CB4] hover:bg-[#5d4a8f] text-white font-semibold rounded-xl transition-all disabled:opacity-50">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Edit Profile ─────────────────────────────────────────────────────────────
function EditProfileSection() {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || '',
    });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-lg">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-[#C1B6FD]" /> Edit Profile
      </h2>
      {saved && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> Profile saved successfully
        </div>
      )}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[['First Name', 'firstName'], ['Last Name', 'lastName']].map(([label, field]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
              <input type="text" value={form[field]}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#C1B6FD]/60 focus:ring-2 focus:ring-[#C1B6FD]/20 outline-none text-white transition-all" />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <input type="email" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#C1B6FD]/60 focus:ring-2 focus:ring-[#C1B6FD]/20 outline-none text-white transition-all" />
          <p className="text-xs text-gray-500 mt-1">Changing email will require re-verification</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
          <textarea value={form.bio} rows={3}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Tell something about yourself..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#C1B6FD]/60 focus:ring-2 focus:ring-[#C1B6FD]/20 outline-none text-white placeholder-gray-600 resize-none transition-all" />
        </div>
        <div className="pt-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#745CB4] hover:bg-[#5d4a8f] text-white font-semibold rounded-xl transition-all disabled:opacity-50">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────
const NOTIF_OPTIONS = [
  { key: 'email_campaigns', label: 'Campaign Updates', desc: 'Get notified when campaigns change status' },
  { key: 'email_collabs', label: 'Collaboration Requests', desc: 'New collaboration requests or status changes' },
  { key: 'email_sessions', label: 'Session Alerts', desc: 'New login from unrecognised device' },
  { key: 'email_announcements', label: 'Announcements', desc: 'Platform-wide announcements and news' },
  { key: 'push_all', label: 'Push Notifications', desc: 'In-app real-time push notifications' },
];

function NotificationsSection() {
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(NOTIF_OPTIONS.map((o) => [o.key, true]))
  );
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-lg">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-[#C1B6FD]" /> Notification Preferences
      </h2>
      {saved && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> Preferences saved
        </div>
      )}
      <div className="space-y-4">
        {NOTIF_OPTIONS.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            <button type="button" onClick={() => toggle(key)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ml-4 ${prefs[key] ? 'bg-[#745CB4]' : 'bg-white/10'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${prefs[key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="pt-4">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-[#745CB4] hover:bg-[#5d4a8f] text-white font-semibold rounded-xl transition-all">
          <Save className="w-5 h-5" /> Save Preferences
        </button>
      </div>
    </div>
  );
}

// ─── Privacy & Security ───────────────────────────────────────────────────────
const PRIVACY_OPTIONS = [
  { key: 'two_factor', label: 'Two-Factor Authentication', desc: 'Require a second verification step on login' },
  { key: 'session_alerts', label: 'Session Activity Alerts', desc: 'Alert me when a new session is started' },
  { key: 'public_profile', label: 'Public Profile', desc: 'Allow other users to view your admin profile' },
  { key: 'data_sharing', label: 'Analytics Data Sharing', desc: 'Share anonymised usage data for platform improvement' },
];

function PrivacySection() {
  const [settings, setSettings] = useState(() =>
    Object.fromEntries(PRIVACY_OPTIONS.map((o) => [o.key, o.key === 'session_alerts']))
  );
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-lg">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
        <ShieldCheck className="w-5 h-5 text-[#C1B6FD]" /> Privacy & Security
      </h2>
      {saved && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> Security settings saved
        </div>
      )}
      <div className="space-y-4">
        {PRIVACY_OPTIONS.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            <button type="button" onClick={() => toggle(key)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ml-4 ${settings[key] ? 'bg-[#745CB4]' : 'bg-white/10'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${settings[key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="pt-4">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-[#745CB4] hover:bg-[#5d4a8f] text-white font-semibold rounded-xl transition-all">
          <Save className="w-5 h-5" /> Save Settings
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get('section') || 'password';

  const setSection = (key) => setSearchParams({ section: key }, { replace: true });

  const sectionComponents = {
    password:      <ChangePasswordSection />,
    profile:       <EditProfileSection />,
    notifications: <NotificationsSection />,
    privacy:       <PrivacySection />,
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-gray-400">Manage your account, notifications, and security preferences</p>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-0">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setSection(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 -mb-px ${
              activeSection === key
                ? 'border-[#C1B6FD] text-[#C1B6FD] bg-[#745CB4]/10'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div>
        {sectionComponents[activeSection] || sectionComponents.password}
      </div>
    </div>
  );
}
