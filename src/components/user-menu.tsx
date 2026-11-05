'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { LogOut, Heart, Settings, LayoutDashboard } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import api from '@/lib/api';

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // The base64 profile picture is kept out of the session cookie, so load it separately
  useEffect(() => {
    if (status !== 'authenticated') return;
    api
      .get('/auth/me')
      .then((res) => setProfilePicture(res.data.profilePicture || ''))
      .catch(() => {});
    const onUpdate = (e: Event) => setProfilePicture((e as CustomEvent<string>).detail || '');
    window.addEventListener('profile-picture-updated', onUpdate);
    return () => window.removeEventListener('profile-picture-updated', onUpdate);
  }, [status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (status === 'loading') {
    return <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />;
  }

  if (!session) {
    return (
      <Link href="/login" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
        Sign in
      </Link>
    );
  }

  const email = session.user?.email || '';
  const name = session.user?.name || '';
  const displayInitial = (name || email || 'U').charAt(0).toUpperCase();
  const displayName = name || (email ? email.split('@')[0] : 'User');

  const avatar = (big?: boolean) =>
    profilePicture ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
    ) : (
      <span className={big ? 'text-2xl' : 'text-lg'}>{displayInitial}</span>
    );

  const item = 'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all border-2 border-white dark:border-zinc-900 overflow-hidden"
      >
        {avatar()}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 animate-fade-in">
          <div className="p-6 flex flex-col items-center border-b border-black/5 dark:border-white/5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold mb-3 shadow-md border-2 border-white dark:border-zinc-800 overflow-hidden">
              {avatar(true)}
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">Hi, {displayName}!</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 truncate w-full text-center">{email}</p>
          </div>

          <div className="p-2 border-b border-black/5 dark:border-white/5">
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className={item}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link href="/dashboard/favorites" onClick={() => setIsOpen(false)} className={item}>
              <Heart size={18} className="text-rose-500" /> Favorites
            </Link>
            <Link href="/settings" onClick={() => setIsOpen(false)} className={item}>
              <Settings size={18} /> Account Settings
            </Link>
          </div>

          <div className="p-2">
            <button onClick={() => signOut({ callbackUrl: '/' })} className={item}>
              <LogOut size={18} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
