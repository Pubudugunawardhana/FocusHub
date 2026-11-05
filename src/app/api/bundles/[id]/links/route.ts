import { replaceLinks } from '@/lib/bundles';
import { handle, json, readJson, requireUserId } from '@/lib/http';

type Ctx = { params: Promise<{ id: string }> };

export const PUT = handle<Ctx>(async (req, { params }) => {
  const userId = await requireUserId();
  const { id } = await params;
  const { links } = await readJson<{ links?: unknown }>(req);
  return json(await replaceLinks(id, userId, links as never));
});
