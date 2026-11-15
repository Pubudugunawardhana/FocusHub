'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, PlaySquare, Link2, CheckCircle2, Eye, Plus, ArrowRight, Folder } from 'lucide-react';
import { AppShell, PageTitle, LoadingScreen } from '@/components/app-shell';
import { CollectionGrid, BundleGrid } from '@/components/item-grids';
import { CreateItemModal } from '@/components/create-item-form';
import { EmptyState } from '@/components/item-card';
import { useItems } from '@/lib/use-items';
import { bundleProgress } from '@/lib/types';

function Stat({ icon: Icon, value, label, tone }: { icon: React.ElementType; value: number; label: string; tone: string }) {
  return (
    <div className="bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-5 shadow-sm backdrop-blur-xl flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tone}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, href, onNew, newLabel }: { title: string; href: string; onNew: () => void; newLabel: string }) {
  return (
    <div className="flex items-center justify-between mb-5 mt-12">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{title}</h3>
      <div className="flex items-center gap-2">
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={15} /> {newLabel}
        </button>
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function Overview() {
  const items = useItems();
  const [creating, setCreating] = useState<'collection' | 'bundle' | null>(null);

  const totalVideos = items.collections.reduce((s, c) => s + (c.progress?.totalVideos ?? 0), 0);
  const watchedVideos = items.collections.reduce((s, c) => s + (c.progress?.watchedVideos ?? 0), 0);
  const totalLinks = items.bundles.reduce((s, b) => s + bundleProgress(b).total, 0);
  const totalViews = items.bundles.reduce((s, b) => s + (b.views ?? 0), 0);

  return (
    <AppShell>
      <PageTitle icon={LayoutDashboard} title="Overview" subtitle="Your YouTube learning and link bundles in one place" />

      {items.loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={PlaySquare} value={items.collections.length} label="YouTube Collections" tone="bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400" />
            <Stat icon={CheckCircle2} value={watchedVideos} label={`of ${totalVideos} videos watched`} tone="bg-brand-100 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400" />
            <Stat icon={Link2} value={items.bundles.length} label={`Link Bundles · ${totalLinks} links`} tone="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" />
            <Stat icon={Eye} value={totalViews} label="Bundle views" tone="bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400" />
          </div>

          {items.collections.length === 0 && items.bundles.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                icon={Folder}
                title="Nothing here yet"
                text="Start a YouTube collection to track your learning, or create a link bundle to share resources."
                action={
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => setCreating('collection')} className="bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl px-6 py-3 flex items-center gap-2">
                      <PlaySquare size={16} /> New Collection
                    </button>
                    <button onClick={() => setCreating('bundle')} className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl px-6 py-3 flex items-center gap-2">
                      <Link2 size={16} /> New Bundle
                    </button>
                  </div>
                }
              />
            </div>
          ) : (
            <>
              <SectionHeader title="Recent YouTube Collections" href="/dashboard/collections" onNew={() => setCreating('collection')} newLabel="New Collection" />
              {items.collections.length ? (
                <CollectionGrid items={items.collections.slice(0, 4)} onToggleFavorite={items.toggleCollectionFavorite} />
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">No collections yet.</p>
              )}

              <SectionHeader title="Recent Link Bundles" href="/dashboard/bundles" onNew={() => setCreating('bundle')} newLabel="New Bundle" />
              {items.bundles.length ? (
                <BundleGrid items={items.bundles.slice(0, 4)} onToggleFavorite={items.toggleBundleFavorite} />
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">No bundles yet.</p>
              )}
            </>
          )}
        </>
      )}

      <CreateItemModal kind={creating ?? 'collection'} open={creating !== null} onClose={() => setCreating(null)} />
    </AppShell>
  );
}
