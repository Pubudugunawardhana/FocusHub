import { prisma } from '@/lib/prisma';
import { handle, HttpError, json, requireUserId } from '@/lib/http';

export const GET = handle(async () => {
  const userId = await requireUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, image: true, createdAt: true },
  });
  if (!user) throw new HttpError(404, 'User not found');
  return json({ ...user, profilePicture: user.image });
});
