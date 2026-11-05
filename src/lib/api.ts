import axios from 'axios';

// Same-origin API client. The NextAuth session cookie is sent automatically.
const api = axios.create({ baseURL: '/api' });

export default api;

/** Extracts a user-friendly message from an axios error. */
export function apiError(err: unknown, fallback = 'Something went wrong'): string {
  const e = err as { response?: { data?: { message?: string; error?: string } } };
  return e?.response?.data?.message || e?.response?.data?.error || fallback;
}
