'use client';

import { useCallback, useEffect, useState } from 'react';
import api from './api';
import type { BundleItem, CollectionItem } from './types';

/** Loads the user's collections and/or bundles, with optimistic favorite toggling and delete. */
export function useItems({ collections = true, bundles = true } = {}) {
  const [collectionList, setCollections] = useState<CollectionItem[]>([]);
  const [bundleList, setBundles] = useState<BundleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [c, b] = await Promise.all([
        collections ? api.get<CollectionItem[]>('/collections') : Promise.resolve({ data: [] as CollectionItem[] }),
        bundles ? api.get<BundleItem[]>('/bundles') : Promise.resolve({ data: [] as BundleItem[] }),
      ]);
      setCollections(c.data);
      setBundles(b.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [collections, bundles]);

  useEffect(() => {
    // data fetch on mount - setState happens after the await
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const toggleCollectionFavorite = async (id: string) => {
    const current = collectionList.find((c) => c.id === id)?.isFavorite;
    setCollections((list) => list.map((c) => (c.id === id ? { ...c, isFavorite: !current } : c)));
    try {
      await api.put(`/collections/${id}`, { isFavorite: !current });
    } catch {
      setCollections((list) => list.map((c) => (c.id === id ? { ...c, isFavorite: current } : c)));
    }
  };

  const toggleBundleFavorite = async (shortId: string) => {
    const current = bundleList.find((b) => b.shortId === shortId)?.isFavorite;
    setBundles((list) => list.map((b) => (b.shortId === shortId ? { ...b, isFavorite: !current } : b)));
    try {
      await api.put(`/bundles/${shortId}`, { isFavorite: !current });
    } catch {
      setBundles((list) => list.map((b) => (b.shortId === shortId ? { ...b, isFavorite: current } : b)));
    }
  };

  const deleteCollection = async (id: string) => {
    await api.delete(`/collections/${id}`);
    setCollections((list) => list.filter((c) => c.id !== id));
  };

  const deleteBundle = async (shortId: string) => {
    await api.delete(`/bundles/${shortId}`);
    setBundles((list) => list.filter((b) => b.shortId !== shortId));
  };

  return {
    collections: collectionList,
    bundles: bundleList,
    loading,
    reload: load,
    toggleCollectionFavorite,
    toggleBundleFavorite,
    deleteCollection,
    deleteBundle,
  };
}

export const isExpired = (b: BundleItem) => !!b.expiresAt && new Date(b.expiresAt).getTime() < Date.now();
