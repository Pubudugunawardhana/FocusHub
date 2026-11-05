'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, ArrowRight } from 'lucide-react';
import { verifyPassword } from '@/app/b/[id]/actions';

export default function PasswordPrompt({ bundleId, bundleName }: { bundleId: string; bundleName: string }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const formData = new FormData();
    formData.append('password', password);
    const result = await verifyPassword(bundleId, formData);
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-panel rounded-3xl p-10 max-w-md w-full text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-6">
          <Lock size={32} />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Protected Bundle</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">&quot;{bundleName}&quot; requires a password to view its contents.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full text-center bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Unlock <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
