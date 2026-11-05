'use client';

import { useState } from 'react';
import { ItemCard, CARD_GRID } from './item-card';
import { ConfirmModal } from './confirm-modal';
import { bundleProgress, collectionProgress, type BundleItem, type CollectionItem } from '@/lib/types';
import { isExpired } from '@/lib/use-items';

export function CollectionGrid({ items, onToggleFavorite, onDelete }: {
  items: CollectionItem[];
  onToggleFavorite: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <div className={CARD_GRID}>
        {items.map((c) => (
          <ItemCard
            key={c.id}
            kind="collection"
            href={`/collections/${c.id}`}
            name={c.name}
            icon={c.icon}
            category={c.category}
            isFavorite={c.isFavorite}
            progress={collectionProgress(c)}
            onToggleFavorite={() => onToggleFavorite(c.id)}
            onDelete={onDelete ? () => setToDelete(c.id) : undefined}
          />
        ))}
      </div>
      <ConfirmModal
        isOpen={toDelete !== null}
        onClose={() => !busy && setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete || !onDelete) return;
          setBusy(true);
          try {
            await onDelete(toDelete);
          } finally {
            setBusy(false);
            setToDelete(null);
          }
        }}
        isLoading={busy}
        title="Delete Collection"
        message="This deletes the collection and all of its videos and notes. This action cannot be undone."
        confirmText="Delete Collection"
      />
    </>
  );
}

export function BundleGrid({ items, onToggleFavorite, onDelete }: {
  items: BundleItem[];
  onToggleFavorite: (shortId: string) => void;
  onDelete?: (shortId: string) => Promise<void>;
}) {
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <div className={CARD_GRID}>
        {items.map((b) => (
          <ItemCard
            key={b.shortId}
            kind="bundle"
            href={`/edit/${b.shortId}`}
            name={b.name}
            icon={b.icon}
            category={b.category}
            isFavorite={b.isFavorite}
            progress={bundleProgress(b)}
            locked={b.hasPassword}
            expired={isExpired(b)}
            expiresAt={b.expiresAt}
            onToggleFavorite={() => onToggleFavorite(b.shortId)}
            onDelete={onDelete ? () => setToDelete(b.shortId) : undefined}
          />
        ))}
      </div>
      <ConfirmModal
        isOpen={toDelete !== null}
        onClose={() => !busy && setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete || !onDelete) return;
          setBusy(true);
          try {
            await onDelete(toDelete);
          } finally {
            setBusy(false);
            setToDelete(null);
          }
        }}
        isLoading={busy}
        title="Delete Bundle"
        message="Are you sure you want to delete this bundle? Its share link will stop working. This action cannot be undone."
        confirmText="Delete Bundle"
      />
    </>
  );
}
