import crypto from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { handle, HttpError, json, readJson } from '@/lib/http';

export const POST = handle(async (req) => {
  const { email: rawEmail } = await readJson<{ email?: string }>(req);
  const email = String(rawEmail || '').trim().toLowerCase();
  if (!email) throw new HttpError(400, 'Please provide an email');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError(404, 'User not found');

  const otp = crypto.randomInt(100000, 1000000).toString();
  await prisma.user.update({
    where: { id: user.id },
    data: { resetPasswordOtp: otp, resetPasswordOtpExpires: new Date(Date.now() + 15 * 60 * 1000) },
  });

  const message = `You requested a password reset. Your 6-digit reset code is: ${otp}\nThis code is valid for 15 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #9333ea; text-align: center; margin-bottom: 0;">FocusHub</h2>
      <h3 style="color: #333; text-align: center; margin-top: 5px;">Password Reset Request</h3>
      <p style="color: #555;">You are receiving this email because you (or someone else) requested a password reset for your account.</p>
      <p style="color: #555;">Your 6-digit verification code is:</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h1 style="letter-spacing: 5px; color: #111; margin: 0;">${otp}</h1>
      </div>
      <p style="color: #777; font-size: 12px; text-align: center;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
    </div>`;

  try {
    await sendEmail({ email: user.email, subject: 'FocusHub - Password Reset Code', message, html });
  } catch (err) {
    console.error('Email could not be sent', err);
    throw new HttpError(500, 'Email could not be sent');
  }

  return json({ message: 'Password reset instructions sent to email!' });
});
