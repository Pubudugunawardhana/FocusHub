'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AppShell } from '@/components/app-shell';

export function EditShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <Link
        href="/dashboard/bundles"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to bundles
      </Link>
      {children}
    </AppShell>
  );
}
