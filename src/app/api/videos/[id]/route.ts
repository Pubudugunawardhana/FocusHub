import { prisma } from '@/lib/prisma';
import { handle, HttpError, json, requireUserId } from '@/lib/http';

type Ctx = { params: Promise<{ id: string }> };

export const DELETE = handle<Ctx>(async (_req, { params }) => {
  const userId = await requireUserId();
  const { id } = await params;
  const { count } = await prisma.video.deleteMany({ where: { id, userId } });
  if (!count) throw new HttpError(404, 'Video not found');
  return json({ message: 'Video removed' });
});
