import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Link as LinkIcon, ExternalLink, Calendar, Eye, Layers, Clock } from 'lucide-react';
import PasswordPrompt from '@/components/PasswordPrompt';
import FaviconImage from '@/components/FaviconImage';
import { ThemeToggle } from '@/components/theme-toggle';
import { getBundleMeta, getPublicBundle } from '@/lib/bundles';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const bundle = await getBundleMeta(id);
  if (!bundle) return { title: 'Bundle Not Found' };
  return {
    title: `${bundle.name} | FocusHub`,
    description: bundle.description || 'A collection of useful links shared via FocusHub.',
  };
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans transition-colors duration-300 relative">
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="absolute top-[-20%] w-[800px] h-[600px] bg-brand-600/10 dark:bg-brand-600/15 rounded-full blur-[120px]" />
      </div>
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default async function BundlePage({ params }: Props) {
  const { id } = await params;
  const result = await getPublicBundle(id);

  if (result.state === 'not_found') notFound();

  if (result.state === 'expired') {
    return (
      <Shell>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="glass-panel rounded-3xl p-10 max-w-md w-full text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-6">
              <Clock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Bundle Expired</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              &quot;{result.name}&quot; has self-destructed and is no longer available.
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  if (result.state === 'locked') {
    return (
      <Shell>
        <PasswordPrompt bundleId={id} bundleName={result.name} />
      </Shell>
    );
  }

  const { bundle } = result;

  return (
    <Shell>
      <main className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors"
        >
          <Layers size={16} /> Create your own bundle
        </Link>

        <div className="glass-panel rounded-3xl p-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">{bundle.name}</h1>
          {bundle.description && (
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">{bundle.description}</p>
          )}
          <div className="flex flex-wrap gap-5 text-sm text-zinc-500 dark:text-zinc-400 border-t border-black/5 dark:border-white/10 pt-4">
            <span className="flex items-center gap-2">
              <Calendar size={16} /> {new Date(bundle.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <Eye size={16} /> {bundle.views} views
            </span>
            <span className="flex items-center gap-2">
              <LinkIcon size={16} /> {bundle.links.length} links
            </span>
            {bundle.expiresAt && (
              <span className="flex items-center gap-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md">
                <Clock size={14} /> Expires {new Date(bundle.expiresAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {bundle.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card flex gap-5 p-5 no-underline text-inherit"
            >
              <FaviconImage src={link.favicon} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white truncate">{link.title || link.url}</h3>
                  <ExternalLink size={14} className="text-zinc-400 shrink-0" />
                </div>
                {link.description && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{link.description}</p>
                )}
                {link.note && (
                  <div className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    💡 {link.note}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </main>
    </Shell>
  );
}
