import { deleteBundle, getOwnedBundle, updateBundle } from '@/lib/bundles';
import { handle, json, readJson, requireUserId } from '@/lib/http';

type Ctx = { params: Promise<{ id: string }> };

// Owner view (public view is rendered server-side at /b/[id])
export const GET = handle<Ctx>(async (_req, { params }) => {
  const userId = await requireUserId();
  const { id } = await params;
  return json(await getOwnedBundle(id, userId));
});

export const PUT = handle<Ctx>(async (req, { params }) => {
  const userId = await requireUserId();
  const { id } = await params;
  return json(await updateBundle(id, userId, await readJson(req)));
});

export const DELETE = handle<Ctx>(async (_req, { params }) => {
  const userId = await requireUserId();
  const { id } = await params;
  return json(await deleteBundle(id, userId));
});
