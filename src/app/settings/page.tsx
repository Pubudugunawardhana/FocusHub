"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { AppShell, LoadingScreen } from '@/components/app-shell';
import { Camera, Loader2, Save, KeyRound, CheckCircle2, User, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import api, { apiError } from '@/lib/api';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProfile, setDeletingProfile] = useState(false);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { update } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setName(res.data.name || '');
        setEmail(res.data.email || '');
        setProfilePicture(res.data.profilePicture || '');
      } catch (err) {
        console.error('Error fetching user', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setProfilePicture(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ text: '', type: '' });
    
    try {
      await api.put('/users/profile', { name, profilePicture });
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
      await update({ name });
      window.dispatchEvent(new CustomEvent('profile-picture-updated', { detail: profilePicture }));
    } catch (err) {
      setProfileMsg({ text: apiError(err, 'Failed to update profile'), type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMsg({ text: '', type: '' });
    
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match', type: 'error' });
      setSavingPassword(false);
      return;
    }
    
    try {
      await api.put('/users/password', { currentPassword, newPassword });
      setPasswordMsg({ text: 'Password updated successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ text: apiError(err, 'Failed to update password'), type: 'error' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteProfile = async () => {
    setDeletingProfile(true);
    try {
      await api.delete('/users/profile');
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      console.error('Failed to delete profile', err);
      setDeletingProfile(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  const defaultInitial = name ? name.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U');

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <User className="text-brand-500" size={32} />
            Account Settings
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your profile information and security preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Section */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl transition-colors duration-300 relative overflow-hidden mb-8">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400 opacity-50"></div>
              
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Profile Information</h3>
              
              <form onSubmit={handleProfileSubmit}>
                <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      {profilePicture ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-lg" />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-5xl shadow-lg border-4 border-white dark:border-zinc-800">
                          {defaultInitial}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={32} />
                      </div>
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">
                      Change Picture
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </div>
                  
                  <div className="flex-1 w-full space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        disabled
                        className="w-full bg-zinc-100 dark:bg-zinc-900 border border-transparent text-zinc-500 dark:text-zinc-500 text-sm rounded-xl px-4 py-3 cursor-not-allowed" 
                      />
                      <p className="text-xs text-zinc-500 ml-1">Email cannot be changed.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Display Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-brand-500 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300 shadow-sm" 
                      />
                    </div>
                  </div>
                </div>

                {profileMsg.text && (
                  <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium ${profileMsg.type === 'success' ? 'bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                    {profileMsg.type === 'success' && <CheckCircle2 size={18} />}
                    {profileMsg.text}
                  </div>
                )}

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={savingProfile}
                    className="bg-brand-600 hover:bg-brand-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
            
            {/* Security Section */}
            <div className="bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl transition-colors duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400 opacity-50"></div>
              
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <KeyRound className="text-zinc-400" size={20} />
                Security
              </h3>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-1.5 relative">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword.current ? 'text' : 'password'} 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-brand-500 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300 shadow-sm pr-11" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-brand-500 transition-colors"
                    >
                      {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 relative">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">New Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword.new ? 'text' : 'password'} 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-brand-500 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300 shadow-sm pr-11" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-brand-500 transition-colors"
                      >
                        {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Confirm New Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword.confirm ? 'text' : 'password'} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-brand-500 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300 shadow-sm pr-11" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-brand-500 transition-colors"
                      >
                        {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {passwordMsg.text && (
                  <div className={`p-4 rounded-xl mt-4 flex items-center gap-3 text-sm font-medium ${passwordMsg.type === 'success' ? 'bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                    {passwordMsg.type === 'success' && <CheckCircle2 size={18} />}
                    {passwordMsg.text}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit" 
                    disabled={savingPassword}
                    className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-70 disabled:cursor-not-allowed text-sm font-semibold rounded-xl px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {savingPassword && <Loader2 size={16} className="animate-spin" />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone Section */}
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl p-8 shadow-xl backdrop-blur-xl transition-colors duration-300 relative overflow-hidden mt-8">
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                <AlertTriangle size={20} />
                Danger Zone
              </h3>
              <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-6">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              
              <div className="flex">
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
          
          {/* Info Sidebar */}
          <div className="hidden md:block">
            <div className="bg-white/50 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5 rounded-3xl p-6 text-sm text-zinc-600 dark:text-zinc-400">
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 text-base">Why customize?</h4>
              <p className="mb-4">Adding a profile picture and your name makes FocusHub feel more like home. It helps personalize your learning experience.</p>
              
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 text-base">Security Tips</h4>
              <ul className="list-disc pl-4 space-y-2">
                <li>Use a strong password with a mix of letters, numbers, and symbols.</li>
                <li>Never share your password with anyone.</li>
                <li>Update your password regularly to keep your account secure.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500"></div>
            
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Delete Profile?</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
              Are you sure you want to delete your profile? This action will permanently remove your account, all your collections, and saved videos. This cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingProfile}
                className="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 text-sm font-semibold rounded-xl px-4 py-3 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteProfile}
                disabled={deletingProfile}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-wait"
              >
                {deletingProfile && <Loader2 size={16} className="animate-spin" />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
