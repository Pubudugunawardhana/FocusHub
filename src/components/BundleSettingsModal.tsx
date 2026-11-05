'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Settings, X, Lock, LockOpen, Clock, Loader2, Eye, EyeOff } from 'lucide-react';
import api, { apiError } from '@/lib/api';

type PasswordMode = 'keep' | 'set' | 'remove';

export interface BundleSecurity {
  hasPassword: boolean;
  expiresAt: string | null;
}

interface Props {
  shortId: string;
  security: BundleSecurity;
  onClose: () => void;
  onSaved: (next: BundleSecurity) => void;
}

const MIN_PASSWORD = 4;

const inputCls =
  'w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all';
const pillBtn =
  'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors';

const EXPIRY_OPTIONS = [
  { value: 'keep', label: 'Keep current setting' },
  { value: 'none', label: 'Never expire' },
  { value: '1h', label: '1 hour from now' },
  { value: '24h', label: '24 hours from now' },
  { value: '7d', label: '7 days from now' },
];

export default function BundleSettingsModal({ shortId, security, onClose, onSaved }: Props) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<PasswordMode>('keep');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [expiry, setExpiry] = useState('keep');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const expired = !!security.expiresAt && new Date(security.expiresAt).getTime() < now;
  const dirty = mode !== 'keep' || expiry !== 'keep';

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirty || saving) return;
    setError('');

    const body: { password?: string | null; expiresIn?: string } = {};
    if (mode === 'set') {
      if (password.trim().length < MIN_PASSWORD) return setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      if (password !== confirm) return setError('Passwords do not match.');
      body.password = password;
    } else if (mode === 'remove') {
      body.password = null;
    }
    if (expiry !== 'keep') body.expiresIn = expiry;

    setSaving(true);
    try {
      const { data } = await api.put(`/bundles/${shortId}`, body);
      onSaved({ hasPassword: !!data.hasPassword, expiresAt: data.expiresAt ?? null });
      onClose();
    } catch (err) {
      setError(apiError(err, 'Failed to save settings.'));
      setSaving(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={save}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20">
          <Settings size={22} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Bundle Settings</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Control who can open the share link and how long it lives.</p>

        {error && (
          <div className="p-3 mb-5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-500/20 text-center">
            {error}
          </div>
        )}

        {/* Password */}
        <section className="rounded-2xl border border-black/10 dark:border-white/10 p-5 mb-4">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
            <h3 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
              {security.hasPassword ? <Lock size={16} /> : <LockOpen size={16} />} Password
            </h3>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                security.hasPassword
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {security.hasPassword ? 'Protected' : 'Public'}
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            {security.hasPassword
              ? 'Visitors must enter the password to see the links. Changing it signs out everyone who unlocked it before.'
              : 'Anyone with the link can see the links.'}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode(mode === 'set' ? 'keep' : 'set')}
              className={`${pillBtn} ${mode === 'set' ? 'bg-brand-600 border-brand-600 text-white' : 'border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
            >
              {security.hasPassword ? 'Change password' : 'Add password'}
            </button>
            {security.hasPassword && (
              <button
                type="button"
                onClick={() => setMode(mode === 'remove' ? 'keep' : 'remove')}
                className={`${pillBtn} ${mode === 'remove' ? 'bg-rose-600 border-rose-600 text-white' : 'border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20'}`}
              >
                Remove password
              </button>
            )}
          </div>

          {mode === 'set' && (
            <div className="flex flex-col gap-3 mt-4 animate-fade-in">
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className={`${inputCls} pr-11`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={`New password (min ${MIN_PASSWORD} characters)`}
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <input
                type={show ? 'text' : 'password'}
                className={`${inputCls} ${confirm && confirm !== password ? 'border-rose-500/60' : ''}`}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
                autoComplete="new-password"
              />
            </div>
          )}
          {mode === 'remove' && (
            <p className="mt-4 text-sm text-rose-600 dark:text-rose-400 animate-fade-in">
              The bundle will become public when you save.
            </p>
          )}
        </section>

        {/* Expiry */}
        <section className="rounded-2xl border border-black/10 dark:border-white/10 p-5">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
            <h3 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
              <Clock size={16} /> Self-Destruct
            </h3>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                expired
                  ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : security.expiresAt
                    ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {expired ? 'Expired' : security.expiresAt ? 'Timer on' : 'Never'}
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            {expired
              ? `Expired on ${new Date(security.expiresAt!).toLocaleString()}. Pick a new time to bring the link back.`
              : security.expiresAt
                ? `The share link stops working on ${new Date(security.expiresAt).toLocaleString()}.`
                : 'The share link never expires.'}
          </p>
          <select className={`${inputCls} cursor-pointer`} value={expiry} onChange={(e) => setExpiry(e.target.value)}>
            {EXPIRY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </section>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-xl px-4 py-3 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!dirty || saving}
            className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
