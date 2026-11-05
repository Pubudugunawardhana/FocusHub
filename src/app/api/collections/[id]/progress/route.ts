import { prisma } from '@/lib/prisma';
import { handle, json, requireUserId } from '@/lib/http';

type Ctx = { params: Promise<{ id: string }> };

export const GET = handle<Ctx>(async (_req, { params }) => {
  const userId = await requireUserId();
  const { id } = await params;

  const [totalVideos, watchedVideos] = await Promise.all([
    prisma.video.count({ where: { collectionId: id, userId } }),
    prisma.video.count({ where: { collectionId: id, userId, status: 'Watched' } }),
  ]);
  const percentage = totalVideos === 0 ? 0 : Math.round((watchedVideos / totalVideos) * 100);

  return json({ totalVideos, watchedVideos, percentage });
});
