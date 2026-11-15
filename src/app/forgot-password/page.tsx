"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { KeyRound, Layers, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err) {
      interface ApiError {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-zinc-50 dark:bg-black font-sans transition-colors duration-300 px-6">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="absolute top-[-20%] w-[800px] h-[600px] bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-colors duration-300"></div>
      </div>
      {/* Grid Pattern */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none transition-colors duration-300"></div>

      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <Link href="/" className="absolute top-6 left-6 z-50 flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center shadow-md dark:shadow-lg border border-black/5 dark:border-white/10 group-hover:border-black/10 dark:group-hover:border-white/20 transition-colors">
          <Layers size={14} className="text-zinc-800 dark:text-white" />
        </div>
        <span className="font-semibold text-[15px] tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">FocusHub</span>
      </Link>

      <div className="w-full max-w-md bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 glass-panel backdrop-blur-xl transition-colors duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-5 shadow-inner border border-purple-200 dark:border-purple-500/20">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">Reset Password</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Enter your email to receive a 6-digit code</p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-500/20 text-center font-medium shadow-sm">
            {error}
          </div>
        )}
        
        {message && (
          <div className="p-3 mb-6 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 text-sm border border-brand-200 dark:border-brand-500/20 text-center font-medium shadow-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-purple-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 shadow-sm dark:shadow-inner" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-wait" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                'Send Code'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link href="/login" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium flex items-center justify-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
