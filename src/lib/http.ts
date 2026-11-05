import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Returns the logged-in user's id or throws a 401 HttpError. */
export async function requireUserId(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new HttpError(401, 'Unauthorized');
  return id;
}

/** Returns the logged-in user's id, or null for anonymous requests. */
export async function optionalUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function readJson<T = any>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new HttpError(400, 'Invalid JSON body');
  }
}

/** Wrap a route handler: converts HttpError -> JSON { message }, hides internal errors. */
export function handle<Ctx = unknown>(fn: (req: Request, ctx: Ctx) => Promise<Response>) {
  return async (req: Request, ctx: Ctx) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      if (err instanceof HttpError) {
        return NextResponse.json({ message: err.message, error: err.message }, { status: err.status });
      }
      console.error(err);
      return NextResponse.json({ message: 'Server error', error: 'Server error' }, { status: 500 });
    }
  };
}

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
