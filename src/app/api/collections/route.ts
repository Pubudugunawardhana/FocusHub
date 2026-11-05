import { prisma } from '@/lib/prisma';
import { handle, HttpError, json, readJson, requireUserId } from '@/lib/http';

// Returns collections with progress included (avoids one request per collection)
export const GET = handle(async () => {
  const userId = await requireUserId();
  const [collections, counts] = await Promise.all([
    prisma.collection.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    prisma.video.groupBy({ by: ['collectionId', 'status'], where: { userId }, _count: { _all: true } }),
  ]);

  const result = collections.map((c) => {
    const rows = counts.filter((r) => r.collectionId === c.id);
    const totalVideos = rows.reduce((sum, r) => sum + r._count._all, 0);
    const watchedVideos = rows.find((r) => r.status === 'Watched')?._count._all ?? 0;
    const percentage = totalVideos === 0 ? 0 : Math.round((watchedVideos / totalVideos) * 100);
    return { ...c, progress: { totalVideos, watchedVideos, percentage } };
  });

  return json(result);
});

export const POST = handle(async (req) => {
  const userId = await requireUserId();
  const { name, icon, category } = await readJson<{ name?: string; icon?: string; category?: string }>(req);
  if (!name?.trim()) throw new HttpError(400, 'Collection name is required');

  const collection = await prisma.collection.create({
    data: { name: name.trim(), icon: icon || 'Folder', category: category?.trim() || 'General', userId },
  });
  return json(collection, 201);
});
