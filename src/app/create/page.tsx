'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AppShell } from '@/components/app-shell';
import { CreateItemForm } from '@/components/create-item-form';

function CreateInner() {
  const router = useRouter();
  const kind = useSearchParams().get('type') === 'collection' ? 'collection' : 'bundle';
  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in">
      <CreateItemForm kind={kind} onCancel={() => router.back()} />
    </div>
  );
}

export default function CreatePage() {
  return (
    <AppShell>
      <Suspense>
        <CreateInner />
      </Suspense>
    </AppShell>
  );
}
