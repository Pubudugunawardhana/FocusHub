export interface Progress {
  percentage: number;
  done: number;
  total: number;
}

export interface CollectionItem {
  id: string;
  name: string;
  category?: string;
  isFavorite?: boolean;
  icon?: string;
  createdAt: string;
  progress?: { percentage: number; totalVideos: number; watchedVideos: number };
}

export interface BundleLinkItem {
  id: string;
  url: string;
  title?: string | null;
  isWatched?: boolean;
}

export interface BundleItem {
  id: string;
  shortId: string;
  name: string;
  category?: string | null;
  isFavorite?: boolean;
  icon?: string | null;
  views: number;
  hasPassword?: boolean;
  expiresAt?: string | null;
  createdAt: string;
  links: BundleLinkItem[];
}

export const collectionProgress = (c: CollectionItem): Progress => ({
  percentage: c.progress?.percentage ?? 0,
  done: c.progress?.watchedVideos ?? 0,
  total: c.progress?.totalVideos ?? 0,
});

export const bundleProgress = (b: BundleItem): Progress => {
  const total = b.links?.length ?? 0;
  const done = b.links?.filter((l) => l.isWatched).length ?? 0;
  return { total, done, percentage: total ? Math.round((done / total) * 100) : 0 };
};
