'use client';

import { Heart } from 'lucide-react';
import { AppShell, PageTitle, LoadingScreen } from '@/components/app-shell';
import { CollectionGrid, BundleGrid } from '@/components/item-grids';
import { EmptyState } from '@/components/item-card';
import { useItems } from '@/lib/use-items';

export default function FavoritesPage() {
  const items = useItems();
  const collections = items.collections.filter((c) => c.isFavorite);
  const bundles = items.bundles.filter((b) => b.isFavorite);

  return (
    <AppShell>
      <PageTitle icon={Heart} title="Favorites" subtitle="Collections and bundles you have hearted" />

      {items.loading ? (
        <LoadingScreen />
      ) : collections.length === 0 && bundles.length === 0 ? (
        <EmptyState icon={Heart} title="No favorites yet" text="Tap the heart on any collection or bundle to pin it here." />
      ) : (
        <div className="flex flex-col gap-12">
          {collections.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-5">YouTube Collections</h3>
              <CollectionGrid items={collections} onToggleFavorite={items.toggleCollectionFavorite} />
            </section>
          )}
          {bundles.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-5">Link Bundles</h3>
              <BundleGrid items={bundles} onToggleFavorite={items.toggleBundleFavorite} />
            </section>
          )}
        </div>
      )}
    </AppShell>
  );
}
