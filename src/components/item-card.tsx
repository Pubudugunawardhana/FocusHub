'use client';

import Link from 'next/link';
import { Heart, Trash2, PlaySquare, Link2, Lock, Clock } from 'lucide-react';
import { IconRenderer } from '@/lib/icons';
import type { Progress } from '@/lib/types';

interface ItemCardProps {
  kind: 'collection' | 'bundle';
  href: string;
  name: string;
  icon?: string | null;
  category?: string | null;
  isFavorite?: boolean;
  progress: Progress;
  locked?: boolean;
  expired?: boolean;
  expiresAt?: string | null;
  onToggleFavorite: () => void;
  onDelete?: () => void;
}

export function ItemCard({ kind, href, name, icon, category, isFavorite, progress, locked, expired, expiresAt, onToggleFavorite, onDelete }: ItemCardProps) {
  const isVideo = kind === 'collection';
  const stop = (fn?: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn?.();
  };

  return (
    <Link href={href} className="group outline-none">
      <div className={`h-full bg-white dark:bg-black/40 border ${expired ? 'border-rose-300/60 dark:border-rose-500/30' : 'border-black/10 dark:border-white/10'} rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-brand-500/30 transition-all duration-300 backdrop-blur-xl flex flex-col relative overflow-hidden`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 transition-colors">
            <IconRenderer
              iconName={icon || 'Folder'}
              size={22}
              className="text-zinc-600 dark:text-zinc-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={stop(onToggleFavorite)}
              className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'}`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
            </button>
            {onDelete && (
              <button
                onClick={stop(onDelete)}
                className="p-2 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        <h3 className={`text-lg font-bold mb-2 truncate ${expired ? 'text-zinc-400 dark:text-zinc-500 line-through decoration-rose-400/60' : 'text-zinc-900 dark:text-white'}`} title={name}>{name}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${isVideo ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
            {isVideo ? 'YouTube' : 'Links'}
          </span>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            {category || 'Uncategorized'}
          </span>
          {locked && (
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" title="Password protected">
              <Lock size={11} /> Protected
            </span>
          )}
          {expired ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20" title="The share link no longer works">
              <Clock size={11} /> Expired
            </span>
          ) : (
            expiresAt && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" title={`Expires ${new Date(expiresAt).toLocaleString()}`}>
                <Clock size={11} /> {timeLeft(expiresAt)}
              </span>
            )
          )}
        </div>

        <div className="mt-auto pt-8">
          <div className="flex justify-between items-end mb-2 text-sm font-medium">
            <span className="text-zinc-500 dark:text-zinc-400">Progress</span>
            <span className="text-zinc-900 dark:text-white text-lg">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 mb-3 overflow-hidden border border-black/5 dark:border-white/5">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress.percentage}%`, background: 'linear-gradient(90deg, #9333ea, #3b82f6)' }}
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {isVideo ? <PlaySquare size={13} /> : <Link2 size={13} />}
            <span>
              {progress.done} of {progress.total} {isVideo ? 'videos watched' : 'links visited'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/** Short "expires in" label, e.g. "23h left". */
function timeLeft(expiresAt: string) {
  const ms = new Date(expiresAt).getTime() - Date.now();
  const mins = Math.max(1, Math.round(ms / 60000));
  if (mins < 60) return `${mins}m left`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h left`;
  return `${Math.round(hours / 24)}d left`;
}

export function EmptyState({ icon: Icon, title, text, action }: { icon: React.ElementType; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-3xl p-12 shadow-xl flex flex-col items-center justify-center backdrop-blur-xl min-h-[320px]">
      <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center mb-6">
        <Icon size={32} className="text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm text-center">{text}</p>
      {action}
    </div>
  );
}

export const CARD_GRID = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
