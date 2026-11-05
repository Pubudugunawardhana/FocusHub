'use client';

import { useState } from 'react';
import { Link2, Plus, Search, Folder, BarChart2, Eye } from 'lucide-react';
import { AppShell, PageTitle, PrimaryButton, LoadingScreen } from '@/components/app-shell';
import { BundleGrid } from '@/components/item-grids';
import { CreateItemModal } from '@/components/create-item-form';
import { EmptyState } from '@/components/item-card';
import { useItems } from '@/lib/use-items';
import { bundleProgress } from '@/lib/types';

export default function BundlesPage() {
  const items = useItems({ collections: false });
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = items.bundles.filter((b) =>
    `${b.name} ${b.category ?? ''}`.toLowerCase().includes(query.toLowerCase()),
  );
  const totals = items.bundles.reduce(
    (acc, b) => {
      const p = bundleProgress(b);
      return { links: acc.links + p.total, visited: acc.visited + p.done, views: acc.views + (b.views ?? 0) };
    },
    { links: 0, visited: 0, views: 0 },
  );

  return (
    <AppShell>
      <PageTitle
        icon={Link2}
        title="Link Bundles"
        subtitle="Share many links with one link - optional password and self-destruct"
        action={
          <PrimaryButton onClick={() => setCreating(true)}>
            <Plus size={16} /> New Bundle
          </PrimaryButton>
        }
      />

      {items.loading ? (
        <LoadingScreen />
      ) : items.bundles.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No bundles yet"
          text="Create your first bundle to start organizing your links and sharing them as a collection."
          action={
            <PrimaryButton onClick={() => setCreating(true)}>
              <Plus size={16} /> Create First Bundle
            </PrimaryButton>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Link2, value: totals.links, label: 'Total Links', tone: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
              { icon: BarChart2, value: totals.visited, label: 'Links Visited', tone: 'bg-brand-100 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' },
              { icon: Eye, value: totals.views, label: 'Total Views', tone: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' },
            ].map(({ icon: Icon, value, label, tone }) => (
              <div key={label} className="bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tone}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative max-w-sm mb-6">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bundles..."
              className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <BundleGrid items={filtered} onToggleFavorite={items.toggleBundleFavorite} onDelete={items.deleteBundle} />
        </>
      )}

      <CreateItemModal kind="bundle" open={creating} onClose={() => setCreating(false)} />
    </AppShell>
  );
}
