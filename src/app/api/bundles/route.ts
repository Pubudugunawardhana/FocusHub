import { createBundle, getUserBundles } from '@/lib/bundles';
import { handle, json, optionalUserId, readJson, requireUserId } from '@/lib/http';

export const GET = handle(async () => {
  const userId = await requireUserId();
  return json(await getUserBundles(userId));
});

// Anonymous users may create bundles too; logged-in users own theirs.
export const POST = handle(async (req) => {
  const userId = await optionalUserId();
  const body = await readJson(req);
  return json(await createBundle(body, userId), 201);
});
