import { prisma } from '@/lib/prisma';
import { handle, HttpError, json, readJson, requireUserId } from '@/lib/http';

type Ctx = { params: Promise<{ id: string }> };

export const PUT = handle<Ctx>(async (req, { params }) => {
  const userId = await requireUserId();
  const { id } = await params;
  const { notes } = await readJson<{ notes?: string }>(req);

  const { count } = await prisma.video.updateMany({ where: { id, userId }, data: { notes: String(notes ?? '') } });
  if (!count) throw new HttpError(404, 'Video not found');
  return json(await prisma.video.findUnique({ where: { id } }));
});
