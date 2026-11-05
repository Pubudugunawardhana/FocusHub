'use server';

import { unlockBundle } from '@/lib/bundles';
import { HttpError } from '@/lib/http';

export async function verifyPassword(bundleId: string, formData: FormData) {
  try {
    await unlockBundle(bundleId, String(formData.get('password') || ''));
    return { success: true };
  } catch (err) {
    if (err instanceof HttpError) return { error: err.message };
    console.error('Error verifying password:', err);
    return { error: 'Failed to verify password' };
  }
}
