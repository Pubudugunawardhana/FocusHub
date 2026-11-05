'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, X } from 'lucide-react';
import { IconRenderer, ICON_OPTIONS } from '@/lib/icons';
import api, { apiError } from '@/lib/api';

const inputCls =
  'w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all';
const labelCls = 'text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1';

interface Props {
  kind: 'collection' | 'bundle';
  onCancel?: () => void;
}

/** Create form for a YouTube collection or a link bundle. Navigates to the new item on success. */
export function CreateItemForm({ kind, onCancel }: Props) {
  const isBundle = kind === 'bundle';
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('Folder');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [expiresIn, setExpiresIn] = useState('none');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || saving) return;
    if (isBundle && password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (isBundle) {
        const { data } = await api.post('/bundles', {
          name,
          icon,
          category: category.trim() || undefined,
          description: description.trim() || undefined,
          password: password || undefined,
          expiresIn: expiresIn === 'none' ? undefined : expiresIn,
          links: [],
        });
        router.push(`/edit/${data.shortId}`);
      } else {
        const { data } = await api.post('/collections', { name, icon, category: category.trim() || undefined });
        router.push(`/collections/${data.id}`);
      }
    } catch (err) {
      setError(apiError(err, `Failed to create ${kind}.`));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 border border-emerald-200 dark:border-emerald-500/20">
        <IconRenderer iconName={icon} size={24} />
      </div>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{isBundle ? 'Create Link Bundle' : 'Create YouTube Collection'}</h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        {isBundle ? 'Group links into one shareable page. You can add links next.' : 'Group YouTube videos and track what you have watched.'}
      </p>

      {error && (
        <div className="p-3 mb-5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-500/20 text-center">
          {error}
        </div>
      )}

      <div className="space-y-1.5 mb-5">
        <label className={labelCls}>Icon</label>
        <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 p-2 bg-zinc-50 dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-xl max-h-32 overflow-y-auto">
          {ICON_OPTIONS.map((iconName) => (
            <button
              key={iconName}
              type="button"
              onClick={() => setIcon(iconName)}
              className={`p-2 rounded-lg flex items-center justify-center transition-all ${icon === iconName ? 'bg-emerald-500 text-white shadow-md scale-110' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
              title={iconName}
            >
              <IconRenderer iconName={iconName} size={18} />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        <label className={labelCls}>Name</label>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. React Mastery, Finance 101" autoFocus required />
      </div>
      <div className="space-y-1.5 mb-4">
        <label className={labelCls}>Category (Optional)</label>
        <input className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Programming, Music, Gaming" />
      </div>

      {isBundle && (
        <>
          <div className="space-y-1.5 mb-4">
            <label className={labelCls}>Description (Optional)</label>
            <textarea className={`${inputCls} resize-y`} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What are these links for?" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Password (Optional)</label>
              <input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Protect this bundle" autoComplete="new-password" />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Self-Destruct</label>
              <select className={`${inputCls} cursor-pointer`} value={expiresIn} onChange={(e) => setExpiresIn(e.target.value)}>
                <option value="none">Never</option>
                <option value="1h">1 Hour</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
              </select>
            </div>
          </div>
          {password && (
            <div className="space-y-1.5 mb-4 animate-fade-in">
              <label className={labelCls}>Confirm Password</label>
              <input
                type="password"
                className={`${inputCls} ${confirmPassword && confirmPassword !== password ? 'border-rose-500/60' : ''}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Type your password again"
                autoComplete="new-password"
              />
            </div>
          )}
        </>
      )}

      <div className="flex gap-3 mt-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-xl px-4 py-3 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
        >
          {saving ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : <>Create <ArrowRight size={16} /></>}
        </button>
      </div>
    </form>
  );
}

export function CreateItemModal({ kind, open, onClose }: { kind: 'collection' | 'bundle'; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
        <CreateItemForm kind={kind} onCancel={onClose} />
      </div>
    </div>
  );
}
