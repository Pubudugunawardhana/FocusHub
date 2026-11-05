import { prisma } from '@/lib/prisma';
import { handle, json, requireUserId } from '@/lib/http';

type Ctx = { params: Promise<{ id: string }> };

export const GET = handle<Ctx>(async (_req, { params }) => {
  const userId = await requireUserId();
  const { id } = await params;
  const videos = await prisma.video.findMany({
    where: { collectionId: id, userId },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  return json(videos);
});
