'use client';

import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'error', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0 && message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border animate-fade-in ${
        type === 'error' ? 'border-rose-500/40' : 'border-emerald-500/40'
      }`}
    >
      {type === 'error' ? (
        <AlertCircle size={20} className="text-rose-500" />
      ) : (
        <CheckCircle size={20} className="text-emerald-500" />
      )}
      <span className="text-sm font-medium text-zinc-900 dark:text-white">{message}</span>
      <button
        onClick={onClose}
        className="ml-3 p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
