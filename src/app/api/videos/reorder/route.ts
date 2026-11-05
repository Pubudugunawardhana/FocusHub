import { prisma } from '@/lib/prisma';
import { handle, HttpError, json, readJson, requireUserId } from '@/lib/http';

export const PUT = handle(async (req) => {
  const userId = await requireUserId();
  const { orderedIds } = await readJson<{ orderedIds?: string[] }>(req);
  if (!Array.isArray(orderedIds)) throw new HttpError(400, 'Invalid payload');

  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.video.updateMany({ where: { id, userId }, data: { order: index } })),
  );
  return json({ message: 'Videos reordered successfully' });
});
