import 'server-only';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { HttpError } from './http';

const nanoid = customAlphabet('346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnopqrstuvwxyz', 5);

export interface LinkInput {
  url: string;
  title?: string | null;
  description?: string | null;
  favicon?: string | null;
  note?: string | null;
  isWatched?: boolean;
}

export interface BundleInput {
  name: string;
  description?: string;
  links?: LinkInput[];
  password?: string;
  expiresIn?: '1h' | '24h' | '7d' | string;
  category?: string;
  icon?: string;
}

const EXPIRY_MS: Record<string, number> = {
  '1h': 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
};

function toLinkRows(links: LinkInput[] = []) {
  return links
    .filter((l) => l && typeof l.url === 'string' && l.url.trim())
    .map((l, index) => ({
      url: l.url.trim(),
      title: l.title || null,
      description: l.description || null,
      favicon: l.favicon || null,
      note: l.note || null,
      isWatched: !!l.isWatched,
      order: index,
    }));
}

function stripPassword<T extends { password: string | null }>(b: T) {
  const { password, ...rest } = b;
  return { ...rest, hasPassword: !!password };
}

export async function createBundle(input: BundleInput, userId: string | null) {
  if (!input?.name?.trim()) throw new HttpError(400, 'Bundle name is required.');

  const pw = input.password?.trim();
  if (pw && pw.length < 4) throw new HttpError(400, 'Password must be at least 4 characters.');
  const hashed = pw ? await bcrypt.hash(pw, 10) : null;
  const ms = input.expiresIn ? EXPIRY_MS[input.expiresIn] : undefined;

  const bundle = await prisma.bundle.create({
    data: {
      shortId: nanoid(),
      name: input.name.trim(),
      description: input.description || null,
      category: input.category || null,
      icon: input.icon || 'Folder',
      password: hashed,
      expiresAt: ms ? new Date(Date.now() + ms) : null,
      userId,
      links: { create: toLinkRows(input.links) },
    },
    include: { links: { orderBy: { order: 'asc' } } },
  });
  return stripPassword(bundle);
}

export async function getUserBundles(userId: string) {
  const bundles = await prisma.bundle.findMany({
    where: { userId },
    include: { links: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
  return bundles.map(stripPassword);
}

async function getOwned(shortId: string, userId: string) {
  const bundle = await prisma.bundle.findUnique({ where: { shortId } });
  if (!bundle) throw new HttpError(404, 'Bundle not found');
  if (bundle.userId !== userId) throw new HttpError(403, 'You do not own this bundle');
  return bundle;
}

export async function getOwnedBundle(shortId: string, userId: string) {
  await getOwned(shortId, userId);
  const bundle = await prisma.bundle.findUnique({
    where: { shortId },
    include: { links: { orderBy: { order: 'asc' } } },
  });
  return stripPassword(bundle!);
}

export const MIN_BUNDLE_PASSWORD = 4;

export async function updateBundle(
  shortId: string,
  userId: string,
  data: {
    isFavorite?: boolean;
    name?: string;
    description?: string | null;
    category?: string | null;
    icon?: string;
    /** string = set/change, null = remove, undefined = unchanged */
    password?: string | null;
    /** 'none' = never expires, '1h' | '24h' | '7d' = from now, undefined = unchanged */
    expiresIn?: string;
  },
) {
  await getOwned(shortId, userId);

  let password: string | null | undefined;
  if (data.password === null) {
    password = null;
  } else if (data.password !== undefined) {
    const pw = String(data.password).trim();
    if (pw.length < MIN_BUNDLE_PASSWORD) {
      throw new HttpError(400, `Password must be at least ${MIN_BUNDLE_PASSWORD} characters.`);
    }
    // A new hash also invalidates every existing unlock cookie (the token is tied to the hash)
    password = await bcrypt.hash(pw, 10);
  }

  let expiresAt: Date | null | undefined;
  if (data.expiresIn !== undefined) {
    if (data.expiresIn === 'none') expiresAt = null;
    else if (EXPIRY_MS[data.expiresIn]) expiresAt = new Date(Date.now() + EXPIRY_MS[data.expiresIn]);
    else throw new HttpError(400, 'Invalid expiry option.');
  }

  const updated = await prisma.bundle.update({
    where: { shortId },
    data: {
      ...(data.isFavorite !== undefined && { isFavorite: !!data.isFavorite }),
      ...(data.name !== undefined && data.name.trim() && { name: data.name.trim() }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.category !== undefined && { category: data.category || null }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(password !== undefined && { password }),
      ...(expiresAt !== undefined && { expiresAt }),
    },
  });
  return stripPassword(updated);
}

export async function deleteBundle(shortId: string, userId: string) {
  await getOwned(shortId, userId);
  await prisma.bundle.delete({ where: { shortId } });
  return { success: true };
}

export async function replaceLinks(shortId: string, userId: string, links: LinkInput[]) {
  const bundle = await getOwned(shortId, userId);
  if (!Array.isArray(links)) throw new HttpError(400, 'links must be an array');
  const [, updated] = await prisma.$transaction([
    prisma.link.deleteMany({ where: { bundleId: bundle.id } }),
    prisma.bundle.update({
      where: { shortId },
      data: { links: { create: toLinkRows(links) } },
      include: { links: { orderBy: { order: 'asc' } } },
    }),
  ]);
  return stripPassword(updated);
}

export async function getBundleMeta(shortId: string) {
  return prisma.bundle.findUnique({ where: { shortId }, select: { name: true, description: true } });
}

// ---------- Password-protected bundle access ----------

const unlockCookieName = (shortId: string) => `bundle_pass_${shortId}`;

/** Signed token tied to the bundle's current password hash (changing the password invalidates it). */
function unlockToken(shortId: string, passwordHash: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not set');
  return crypto.createHmac('sha256', secret).update(`${shortId}:${passwordHash}`).digest('hex');
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export type PublicBundleResult =
  | { state: 'not_found' }
  | { state: 'expired'; name: string }
  | { state: 'locked'; name: string }
  | { state: 'ok'; bundle: Awaited<ReturnType<typeof getOwnedBundle>> };

/** Public view: enforces expiry + password on the server, counts a view when content is shown. */
export async function getPublicBundle(shortId: string): Promise<PublicBundleResult> {
  const bundle = await prisma.bundle.findUnique({
    where: { shortId },
    include: { links: { orderBy: { order: 'asc' } } },
  });
  if (!bundle) return { state: 'not_found' };
  if (bundle.expiresAt && bundle.expiresAt.getTime() < Date.now()) return { state: 'expired', name: bundle.name };

  if (bundle.password) {
    const store = await cookies();
    const token = store.get(unlockCookieName(shortId))?.value || '';
    if (!token || !safeEqual(token, unlockToken(shortId, bundle.password))) {
      return { state: 'locked', name: bundle.name };
    }
  }

  await prisma.bundle.update({ where: { shortId }, data: { views: { increment: 1 } } });
  return { state: 'ok', bundle: stripPassword({ ...bundle, views: bundle.views + 1 }) };
}

/** Verifies a bundle password and, on success, sets the httpOnly unlock cookie. */
export async function unlockBundle(shortId: string, password: string) {
  if (!password?.trim()) throw new HttpError(400, 'Password is required');
  const bundle = await prisma.bundle.findUnique({ where: { shortId } });
  if (!bundle) throw new HttpError(404, 'Bundle not found');
  if (!bundle.password) throw new HttpError(400, 'No password set on this bundle');

  const ok = await bcrypt.compare(password.trim(), bundle.password);
  if (!ok) throw new HttpError(403, 'Incorrect password');

  const store = await cookies();
  store.set(unlockCookieName(shortId), unlockToken(shortId, bundle.password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return { success: true };
}
