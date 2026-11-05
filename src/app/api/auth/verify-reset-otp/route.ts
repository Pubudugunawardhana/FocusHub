import { findUserByValidOtp } from '@/lib/otp';
import { handle, json, readJson } from '@/lib/http';

export const POST = handle(async (req) => {
  const { email, otp } = await readJson(req);
  await findUserByValidOtp(email, otp);
  return json({ message: 'OTP verified successfully' });
});
