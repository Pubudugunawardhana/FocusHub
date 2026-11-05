'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, LayoutDashboard, PlaySquare, Link2, Heart } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/collections', label: 'YouTube Collections', short: 'Videos', icon: PlaySquare },
  { href: '/dashboard/bundles', label: 'Link Bundles', short: 'Bundles', icon: Link2 },
  { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
];

export function Background() {
  return (
    <>
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="absolute top-[-20%] w-[800px] h-[600px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
      </div>
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
    </>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group outline-none">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-300">
        <Layers size={18} className="text-white" />
      </div>
      <div className="hidden sm:block">
        <h1 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          FocusHub
        </h1>
        <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Learning Hub</p>
      </div>
    </Link>
  );
}

export function AppShell({ children, actions }: { children: React.ReactNode; actions?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans transition-colors duration-300 relative">
      <Background />

      <header className="relative z-40 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-3 sm:gap-4">
            {actions}
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {NAV.map(({ href, label, short, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  active
                    ? 'border-brand-500 text-zinc-900 dark:text-white'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Icon size={16} className={active ? 'text-brand-500' : ''} />
                <span className="sm:hidden">{short || label}</span>
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* no z-index here so fixed modals inside can stack above the sticky header */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">{children}</main>
    </div>
  );
}

export function PageTitle({ icon: Icon, title, subtitle, action }: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <Icon size={24} className="text-brand-500" />
          {title}
        </h2>
        {subtitle && <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-brand-600 hover:bg-brand-700 disabled:opacity-70 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-all flex items-center justify-center gap-2 shadow-md ${props.className || ''}`}
    >
      {children}
    </button>
  );
}

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );
}
