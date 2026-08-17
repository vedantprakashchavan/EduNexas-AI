import { useState } from 'react';
import {
  Settings, User, Bell, Shield, Palette, Globe, Database, Save, Check,
  Moon, Sun, Lock, Mail, Smartphone, School
} from 'lucide-react';
import { cn } from '../../lib/utils';

const tabs = [
  { id: 'general', label: 'General', icon: School },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={cn('relative w-10 h-5.5 rounded-full transition-colors duration-200', enabled ? 'bg-[#111111]' : 'bg-[#DCDCDC]')} style={{ height: 22 }}>
      <span className={cn('absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200', enabled ? 'translate-x-5' : 'translate-x-0.5')} style={{ width: 18, height: 18 }} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    schoolName: 'EduNexus International School',
    academicYear: '2025-2026',
    principalName: 'Dr. Anand Krishnamurthy',
    email: 'admin@edunexus.edu.in',
    phone: '+91 80 4567 8901',
    address: '123 Education Lane, Koramangala, Bangalore 560034',
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    attendanceAlerts: true,
    feeReminders: true,
    examResults: true,
    twoFactor: false,
    sessionTimeout: '30',
    darkMode: true,
    compactView: false,
    language: 'en',
  });

  const toggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    setSaved(false);
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2"><Settings className="w-7 h-7 text-[#111111]" /> Settings</h1>
          <p className="text-sm text-[#666666] mt-1">Configure your school platform</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] transition-all">
          {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4 text-white" />} {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab Nav */}
        <div className="space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all', activeTab === tab.id ? 'bg-[#111111] text-white border border-[#111111]' : 'text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7]')}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 rounded-2xl border border-[#EAEAEA] bg-white p-6">
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-[#111111] mb-4">School Information</h2>
              {[
                { label: 'School Name', value: settings.schoolName, key: 'schoolName' },
                { label: 'Academic Year', value: settings.academicYear, key: 'academicYear' },
                { label: 'Principal', value: settings.principalName, key: 'principalName' },
                { label: 'Email', value: settings.email, key: 'email' },
                { label: 'Phone', value: settings.phone, key: 'phone' },
                { label: 'Address', value: settings.address, key: 'address' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">{field.label}</label>
                  <input type="text" defaultValue={field.value} className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-[#111111] mb-4">Your Profile</h2>
              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-[#111111] flex items-center justify-center text-white text-xl font-bold">AK</div>
                <div>
                  <p className="text-[#111111] font-semibold">Admin User</p>
                  <p className="text-sm text-[#8A8A8A]">Super Administrator</p>
                  <button className="text-xs text-[#111111] hover:text-[#333333] mt-1">Change Avatar</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-[#333333] mb-1.5">First Name</label><input type="text" defaultValue="Admin" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" /></div>
                <div><label className="block text-sm font-medium text-[#333333] mb-1.5">Last Name</label><input type="text" defaultValue="User" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" /></div>
              </div>
              <div><label className="block text-sm font-medium text-[#333333] mb-1.5">Email</label><input type="email" defaultValue="admin@edunexus.edu.in" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" /></div>
              <div><label className="block text-sm font-medium text-[#333333] mb-1.5">Phone</label><input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" /></div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-[#111111] mb-4">Notification Preferences</h2>
              {[
                { label: 'Email Notifications', desc: 'Receive updates via email', key: 'emailNotifications', icon: Mail },
                { label: 'SMS Notifications', desc: 'Receive SMS alerts', key: 'smsNotifications', icon: Smartphone },
                { label: 'Push Notifications', desc: 'Browser push notifications', key: 'pushNotifications', icon: Bell },
                { label: 'Attendance Alerts', desc: 'Alert when students are absent', key: 'attendanceAlerts', icon: Bell },
                { label: 'Fee Reminders', desc: 'Auto-send payment reminders', key: 'feeReminders', icon: Bell },
                { label: 'Exam Results', desc: 'Notify parents when results publish', key: 'examResults', icon: Bell },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-[#F7F7F7] hover:bg-[#FAFAFA] border border-transparent hover:border-[#EAEAEA] transition-colors">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#666666]" />
                      <div><p className="text-sm font-medium text-[#111111]">{item.label}</p><p className="text-[11px] text-[#8A8A8A]">{item.desc}</p></div>
                    </div>
                    <ToggleSwitch enabled={settings[item.key as keyof typeof settings] as boolean} onChange={() => toggle(item.key)} />
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-[#111111] mb-4">Security Settings</h2>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F7F7F7]">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-[#666666]" />
                  <div><p className="text-sm font-medium text-[#111111]">Two-Factor Authentication</p><p className="text-[11px] text-[#8A8A8A]">Add an extra layer of security</p></div>
                </div>
                <ToggleSwitch enabled={settings.twoFactor} onChange={() => toggle('twoFactor')} />
              </div>
              <div><label className="block text-sm font-medium text-[#333333] mb-1.5">Session Timeout (minutes)</label>
                <select defaultValue={settings.sessionTimeout} className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]"><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">1 hour</option><option value="120">2 hours</option></select>
              </div>
              <div><label className="block text-sm font-medium text-[#333333] mb-1.5">Change Password</label>
                <div className="space-y-3">
                  <input type="password" placeholder="Current password" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" />
                  <input type="password" placeholder="New password" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-[#111111] mb-4">Appearance</h2>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F7F7F7]">
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-[#666666]" />
                  <div><p className="text-sm font-medium text-[#111111]">Dark Mode</p><p className="text-[11px] text-[#8A8A8A]">Use dark theme (recommended)</p></div>
                </div>
                <ToggleSwitch enabled={settings.darkMode} onChange={() => toggle('darkMode')} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F7F7F7]">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-[#666666]" />
                  <div><p className="text-sm font-medium text-[#111111]">Compact View</p><p className="text-[11px] text-[#8A8A8A]">Reduce spacing for more content</p></div>
                </div>
                <ToggleSwitch enabled={settings.compactView} onChange={() => toggle('compactView')} />
              </div>
              <div><label className="block text-sm font-medium text-[#333333] mb-1.5">Language</label>
                <select defaultValue={settings.language} className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]"><option value="en">English</option><option value="hi">Hindi</option><option value="kn">Kannada</option><option value="ta">Tamil</option></select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
