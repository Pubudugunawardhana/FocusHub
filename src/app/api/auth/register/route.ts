import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { handle, HttpError, json, readJson } from '@/lib/http';

export const POST = handle(async (req) => {
  const body = await readJson<{ email?: string; password?: string; name?: string }>(req);
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, 'Please provide a valid email');
  if (password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, 'A user with this email already exists.');

  const user = await prisma.user.create({
    data: { email, password: await bcrypt.hash(password, 10), name: body.name?.trim() || null },
  });

  return json({ message: 'User registered successfully.', userId: user.id }, 201);
});
