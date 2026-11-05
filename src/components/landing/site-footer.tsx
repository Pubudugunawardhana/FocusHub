import Link from 'next/link';
import { Layers } from 'lucide-react';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#how-it-works', label: 'How it works' },
      { href: '#demo', label: 'Live demo' },
      { href: '#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/login', label: 'Log in' },
      { href: '/register', label: 'Sign up' },
      { href: '/dashboard', label: 'Dashboard' },
    ],
  },
];

const linkCls = 'text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors';

export function SiteFooter() {
  return (
    <footer className="relative border-t border-black/5 dark:border-white/10 bg-zinc-50/80 dark:bg-black/60 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-md shadow-purple-500/25">
              <Layers size={15} className="text-white" />
            </div>
            <span className="font-semibold tracking-tight text-zinc-900 dark:text-white">FocusHub</span>
          </Link>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
            YouTube learning collections and shareable link bundles, in one calm workspace.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">{col.title}</h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith('#') ? (
                    <a href={l.href} className={linkCls}>{l.label}</a>
                  ) : (
                    <Link href={l.href} className={linkCls}>{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-black/5 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-zinc-500">
          <p>© 2026 FocusHub. All rights reserved.</p>
          <p>
            Developed by{' '}
            <a
              href="https://www.linkedin.com/in/pubudu-gunawardhana-mmpg"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Pubudu Gunawardhana
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
