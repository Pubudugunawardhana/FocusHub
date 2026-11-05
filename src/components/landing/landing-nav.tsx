'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Layers } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#demo', label: 'Demo' },
  { href: '#faq', label: 'FAQ' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const { status } = useSession();
  const authed = status === 'authenticated';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-3 sm:pt-4">
      <nav
        className={`mx-auto flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? 'max-w-4xl rounded-full border border-black/10 dark:border-white/10 bg-white/75 dark:bg-zinc-950/70 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] pl-4 pr-2 py-2'
            : 'max-w-6xl border border-transparent px-2 py-2'
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-md shadow-purple-500/25">
            <Layers size={15} className="text-white" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-zinc-900 dark:text-white">FocusHub</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {authed ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex h-9 px-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium items-center hover:opacity-90 transition-opacity"
              >
                Dashboard
              </Link>
              <UserMenu />
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block px-3 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                href="/register"
                className="h-9 px-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium flex items-center hover:opacity-90 transition-opacity"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
