'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Folder, BarChart3, Link2, ShieldCheck, Lock, Clock, ArrowRight } from 'lucide-react';
import { Reveal, SectionHeading } from './reveal';

function BentoCard({
  icon: Icon,
  title,
  text,
  className = '',
  delay = 0,
  children,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <article className="group h-full rounded-3xl border border-black/[0.08] dark:border-white/10 bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl p-6 flex flex-col transition-colors duration-300 hover:border-black/15 dark:hover:border-white/20">
        <div className="flex-1 flex items-center justify-center min-h-[140px] mb-6">{children}</div>
        <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-white mb-1.5">
          <Icon size={16} className="text-purple-600 dark:text-purple-400" />
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{text}</p>
      </article>
    </Reveal>
  );
}

const row = 'flex items-center gap-3 rounded-xl border border-black/[0.06] dark:border-white/10 bg-white dark:bg-zinc-900/70 px-3.5 py-2.5';

function CollectionsVisual() {
  const items = [
    { name: 'React Mastery', pct: 75 },
    { name: 'Guitar Lessons', pct: 30 },
    { name: 'Trading Strategies', pct: 100 },
  ];
  return (
    <div className="w-full max-w-md flex flex-col gap-2">
      {items.map((c) => (
        <div key={c.name} className={row}>
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex-1 truncate">{c.name}</span>
          <div className="w-24 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full bg-zinc-900 dark:bg-white" style={{ width: `${c.pct}%` }} />
          </div>
          <span className="w-9 text-right text-xs tabular-nums text-zinc-500">{c.pct}%</span>
        </div>
      ))}
    </div>
  );
}

function ProgressRing() {
  const r = 42;
  const c = 2 * Math.PI * r;
  const pct = 72;
  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" className="stroke-zinc-100 dark:stroke-zinc-800" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          className="stroke-purple-600 dark:stroke-purple-400"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-white">
        {pct}%
      </span>
    </div>
  );
}

function SharingVisual() {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-white p-2 rounded-xl border border-black/10">
        <QRCodeSVG value="https://focushub.app/b/x7Kp2" size={84} level="M" />
      </div>
      <div className="flex flex-col gap-2 text-xs font-medium">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          <Lock size={12} /> Password
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          <Clock size={12} /> Expires in 24h
        </span>
      </div>
    </div>
  );
}

function BundleVisual() {
  const links = ['react.dev/learn', 'typescriptlang.org/docs', 'nextjs.org/learn'];
  return (
    <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-4">
      <div className="flex-1 w-full flex flex-col gap-2">
        {links.map((u) => (
          <div key={u} className={`${row} py-2`}>
            <Link2 size={13} className="text-zinc-400 shrink-0" />
            <span className="text-xs text-zinc-600 dark:text-zinc-300 truncate">{u}</span>
          </div>
        ))}
      </div>
      <ArrowRight size={16} className="text-zinc-300 dark:text-zinc-600 shrink-0 rotate-90 sm:rotate-0" />
      <span className="font-mono text-xs font-semibold px-3 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black whitespace-nowrap">
        focushub.app/b/x7Kp2
      </span>
    </div>
  );
}

export function FeaturesBento() {
  return (
    <section id="features" className="px-6 py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need. Nothing you don't."
          subtitle="A calm place to learn from YouTube, and one link for everything you want to share."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BentoCard
            className="md:col-span-2"
            icon={Folder}
            title="Focused collections"
            text="Group videos into folders and watch without feeds, comments or autoplay. Take timestamped notes as you go."
          >
            <CollectionsVisual />
          </BentoCard>
          <BentoCard
            delay={80}
            icon={BarChart3}
            title="Progress tracking"
            text="Mark videos as you watch and see every collection fill up."
          >
            <ProgressRing />
          </BentoCard>
          <BentoCard
            icon={ShieldCheck}
            title="Private when you need it"
            text="Add a password or a self-destruct timer, and share with a QR code."
          >
            <SharingVisual />
          </BentoCard>
          <BentoCard
            className="md:col-span-2"
            delay={80}
            icon={Link2}
            title="One-link bundles"
            text="Turn any list of URLs into one short link. Titles and icons are fetched for you, and you can export to CSV or TXT."
          >
            <BundleVisual />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
