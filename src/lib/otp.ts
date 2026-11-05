import 'server-only';
import { prisma } from './prisma';
import { HttpError } from './http';

/** Finds the user whose reset OTP matches and hasn't expired, or throws 400. */
export async function findUserByValidOtp(rawEmail: unknown, rawOtp: unknown) {
  const email = String(rawEmail || '').trim().toLowerCase();
  const otp = String(rawOtp || '').trim();
  if (!email || !otp) throw new HttpError(400, 'Please provide email and OTP');

  const user = await prisma.user.findFirst({
    where: { email, resetPasswordOtp: otp, resetPasswordOtpExpires: { gt: new Date() } },
  });
  if (!user) throw new HttpError(400, 'Invalid or expired OTP code');
  return user;
}
