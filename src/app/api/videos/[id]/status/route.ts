import { prisma } from '@/lib/prisma';
import { handle, HttpError, json, readJson, requireUserId } from '@/lib/http';

type Ctx = { params: Promise<{ id: string }> };
const STATUSES = ['To Watch', 'Watching', 'Watched'];

export const PUT = handle<Ctx>(async (req, { params }) => {
  const userId = await requireUserId();
  const { id } = await params;
  const { status } = await readJson<{ status?: string }>(req);
  if (!status || !STATUSES.includes(status)) throw new HttpError(400, 'Invalid status');

  const { count } = await prisma.video.updateMany({ where: { id, userId }, data: { status } });
  if (!count) throw new HttpError(404, 'Video not found');
  return json(await prisma.video.findUnique({ where: { id } }));
});
