'use client';

import { useState } from 'react';
import { PlaySquare, Plus, Search } from 'lucide-react';
import { AppShell, PageTitle, PrimaryButton, LoadingScreen } from '@/components/app-shell';
import { CollectionGrid } from '@/components/item-grids';
import { CreateItemModal } from '@/components/create-item-form';
import { EmptyState } from '@/components/item-card';
import { useItems } from '@/lib/use-items';

export default function CollectionsPage() {
  const items = useItems({ bundles: false });
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = items.collections.filter((c) =>
    `${c.name} ${c.category ?? ''}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AppShell>
      <PageTitle
        icon={PlaySquare}
        title="YouTube Collections"
        subtitle="Organize and track your YouTube tutorials"
        action={
          <PrimaryButton onClick={() => setCreating(true)}>
            <Plus size={16} /> New Collection
          </PrimaryButton>
        }
      />

      {items.loading ? (
        <LoadingScreen />
      ) : items.collections.length === 0 ? (
        <EmptyState
          icon={PlaySquare}
          title="No collections yet"
          text="Create your first collection to start organizing YouTube videos and tracking your learning progress."
          action={
            <PrimaryButton onClick={() => setCreating(true)}>
              <Plus size={16} /> Create First Collection
            </PrimaryButton>
          }
        />
      ) : (
        <>
          <div className="relative max-w-sm mb-6">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search collections..."
              className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <CollectionGrid items={filtered} onToggleFavorite={items.toggleCollectionFavorite} onDelete={items.deleteCollection} />
        </>
      )}

      <CreateItemModal kind="collection" open={creating} onClose={() => setCreating(false)} />
    </AppShell>
  );
}
