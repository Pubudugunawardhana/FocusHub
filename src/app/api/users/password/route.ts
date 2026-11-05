import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { handle, HttpError, json, readJson, requireUserId } from '@/lib/http';

export const PUT = handle(async (req) => {
  const userId = await requireUserId();
  const { currentPassword, newPassword } = await readJson<{ currentPassword?: string; newPassword?: string }>(req);
  if (!newPassword || newPassword.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, 'User not found');

  const ok = await bcrypt.compare(currentPassword || '', user.password);
  if (!ok) throw new HttpError(400, 'Incorrect current password');

  await prisma.user.update({ where: { id: userId }, data: { password: await bcrypt.hash(newPassword, 10) } });
  return json({ success: true, message: 'Password updated successfully' });
});
