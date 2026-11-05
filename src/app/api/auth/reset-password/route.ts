import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { findUserByValidOtp } from '@/lib/otp';
import { handle, HttpError, json, readJson } from '@/lib/http';

export const POST = handle(async (req) => {
  const { email, otp, newPassword } = await readJson(req);
  if (!newPassword || String(newPassword).length < 6) {
    throw new HttpError(400, 'Password must be at least 6 characters');
  }
  const user = await findUserByValidOtp(email, otp);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: await bcrypt.hash(String(newPassword), 10),
      resetPasswordOtp: null,
      resetPasswordOtpExpires: null,
    },
  });

  return json({ message: 'Password has been reset successfully' });
});
