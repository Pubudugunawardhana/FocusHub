import { prisma } from '@/lib/prisma';
import { handle, HttpError, json, readJson, requireUserId } from '@/lib/http';

const MAX_PICTURE_CHARS = 2_000_000; // ~1.5MB image as base64

export const PUT = handle(async (req) => {
  const userId = await requireUserId();
  const { name, profilePicture } = await readJson<{ name?: string; profilePicture?: string | null }>(req);

  if (profilePicture && (!profilePicture.startsWith('data:image/') || profilePicture.length > MAX_PICTURE_CHARS)) {
    throw new HttpError(400, 'Profile picture must be an image under 1.5MB');
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined && { name: name.trim() || null }),
      ...(profilePicture !== undefined && { image: profilePicture || null }),
    },
  });

  return json({
    message: 'Profile updated successfully',
    user: { id: user.id, email: user.email, name: user.name, profilePicture: user.image },
  });
});

// Cascade deletes remove the user's collections, videos, bundles and links
export const DELETE = handle(async () => {
  const userId = await requireUserId();
  await prisma.user.delete({ where: { id: userId } });
  return json({ message: 'User profile and all associated data deleted successfully' });
});
