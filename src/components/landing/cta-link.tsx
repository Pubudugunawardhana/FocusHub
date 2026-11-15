'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowRight } from 'lucide-react';

/** Primary call-to-action: dashboard when signed in, sign-up otherwise. */
export function CtaLink({ className = '', guestLabel = 'Start free' }: { className?: string; guestLabel?: string }) {
  const { status } = useSession();
  const authed = status === 'authenticated';
  return (
    <Link
      href={authed ? '/dashboard' : '/register'}
      className={`group h-12 px-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold inline-flex items-center justify-center gap-2 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.45)] dark:shadow-[0_0_40px_-12px_rgba(255,255,255,0.45)] hover:-translate-y-0.5 transition-all ${className}`}
    >
      {authed ? 'Go to Dashboard' : guestLabel}
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
