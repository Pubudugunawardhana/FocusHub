"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { KeyRound, Layers, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

function ResetPasswordForm() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (step === 1) {
      if (!email || !otp) {
        setError('Please provide your email and the 6-digit OTP code.');
        return;
      }
      setLoading(true);
      try {
        const res = await api.post('/auth/verify-reset-otp', { email, otp });
        setMessage(res.data.message);
        setTimeout(() => {
          setMessage('');
          setStep(2);
        }, 1000);
      } catch (err) {
        interface ApiError {
          response?: { data?: { message?: string } };
        }
        const apiError = err as ApiError;
        setError(apiError.response?.data?.message || 'Invalid or expired OTP');
      } finally {
        setLoading(false);
      }
    } else {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setLoading(true);
      try {
        const res = await api.post('/auth/reset-password', { email, otp, newPassword });
        setMessage(res.data.message);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (err) {
        interface ApiError {
          response?: { data?: { message?: string } };
        }
        const apiError = err as ApiError;
        setError(apiError.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 glass-panel backdrop-blur-xl transition-colors duration-300">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-5 shadow-inner border border-purple-200 dark:border-purple-500/20">
          <KeyRound size={26} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
          {step === 1 ? 'Verify Code' : 'Create New Password'}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {step === 1 ? 'Enter the 6-digit code sent to your email' : 'Enter your new password below'}
        </p>
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
        {step === 1 ? (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Email Address</label>
              <input 
                type="email" 
                className={`w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-purple-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 shadow-sm dark:shadow-inner ${emailParam ? 'opacity-70' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly={!!emailParam}
                placeholder="you@example.com"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">6-Digit Code</label>
              <input 
                type="text" 
                className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-purple-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 shadow-sm dark:shadow-inner text-center tracking-widest text-lg font-bold" 
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                required
                maxLength={6}
                placeholder="123456"
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">New Password</label>
              <input 
                type="password" 
                className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-purple-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 shadow-sm dark:shadow-inner" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-purple-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 shadow-sm dark:shadow-inner" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </>
        )}
        
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-wait" 
            disabled={loading || !!message}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>{step === 1 ? 'Verifying...' : 'Resetting...'}</span>
              </>
            ) : (
              step === 1 ? 'Verify Code' : 'Reset Password'
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
  );
}

export default function ResetPasswordPage() {
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

      <Suspense fallback={<div className="p-8"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
