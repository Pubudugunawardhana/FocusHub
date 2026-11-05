import { prisma } from '@/lib/prisma';
import { handle, HttpError, json, readJson, requireUserId } from '@/lib/http';

type Ctx = { params: Promise<{ id: string }> };

export const GET = handle<Ctx>(async (_req, { params }) => {
  const userId = await requireUserId();
  const { id } = await params;
  const collection = await prisma.collection.findFirst({ where: { id, userId } });
  if (!collection) throw new HttpError(404, 'Collection not found');
  return json(collection);
});

export const PUT = handle<Ctx>(async (req, { params }) => {
  const userId = await requireUserId();
  const { id } = await params;
  const { name, category, isFavorite, icon } = await readJson(req);

  const existing = await prisma.collection.findFirst({ where: { id, userId } });
  if (!existing) throw new HttpError(404, 'Collection not found');

  const collection = await prisma.collection.update({
    where: { id },
    data: {
      ...(name !== undefined && String(name).trim() && { name: String(name).trim() }),
      ...(category !== undefined && { category }),
      ...(isFavorite !== undefined && { isFavorite: !!isFavorite }),
      ...(icon !== undefined && { icon }),
    },
  });
  return json(collection);
});

// Videos are removed by the cascade
export const DELETE = handle<Ctx>(async (_req, { params }) => {
  const userId = await requireUserId();
  const { id } = await params;
  const { count } = await prisma.collection.deleteMany({ where: { id, userId } });
  if (!count) throw new HttpError(404, 'Collection not found');
  return json({ message: 'Collection removed' });
});
