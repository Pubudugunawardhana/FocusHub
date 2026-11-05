import { getMetadata } from '@/lib/metadata';
import { handle, json, requireUserId } from '@/lib/http';

export const GET = handle(async (req) => {
  // Logged-in only, to avoid an open URL-fetching proxy
  await requireUserId();
  const url = new URL(req.url).searchParams.get('url') || '';
  return json(await getMetadata(url));
});
