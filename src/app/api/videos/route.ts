import { prisma } from '@/lib/prisma';
import { fetchVideoData } from '@/lib/youtube';
import { categorizeVideo } from '@/lib/categorizer';
import { handle, HttpError, json, readJson, requireUserId } from '@/lib/http';

export const POST = handle(async (req) => {
  const userId = await requireUserId();
  const { url, collectionId } = await readJson<{ url?: string; collectionId?: string }>(req);

  const collection = await prisma.collection.findFirst({ where: { id: collectionId || '', userId } });
  if (!collection) throw new HttpError(404, 'Collection not found');

  const videoData = await fetchVideoData(url || '');

  const existing = await prisma.video.findUnique({
    where: { collectionId_youtubeId: { collectionId: collection.id, youtubeId: videoData.youtubeId } },
  });
  if (existing) throw new HttpError(400, 'Video already exists in this collection');

  // Smart collections: auto-set the category if it's still "General"
  if (collection.category === 'General') {
    const suggested = categorizeVideo(videoData.title);
    if (suggested !== 'General') {
      await prisma.collection.update({ where: { id: collection.id }, data: { category: suggested } });
    }
  }

  // New videos go to the end of the list
  const last = await prisma.video.findFirst({
    where: { collectionId: collection.id },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const video = await prisma.video.create({
    data: { ...videoData, collectionId: collection.id, userId, order: (last?.order ?? -1) + 1 },
  });
  return json(video, 201);
});
