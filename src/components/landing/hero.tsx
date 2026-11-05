'use client';

import { Sparkles, ChevronRight } from 'lucide-react';
import { CtaLink } from './cta-link';
import { Reveal } from './reveal';

export function Hero() {
  return (
    <section className="relative px-6 pt-36 sm:pt-44 pb-16 overflow-hidden">
      {/* drifting gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div className="animate-blob absolute top-16 left-[12%] w-[420px] h-[420px] rounded-full bg-purple-500/20 dark:bg-purple-600/25 blur-[110px]" />
        <div className="animate-blob absolute top-40 right-[10%] w-[380px] h-[380px] rounded-full bg-blue-500/15 dark:bg-blue-600/20 blur-[110px] [animation-delay:-6s]" />
        <div className="animate-blob absolute top-[420px] left-1/2 w-[340px] h-[340px] rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-[100px] [animation-delay:-12s]" />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        <Reveal>
          <a
            href="#demo"
            className="group inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md pl-1.5 pr-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:border-purple-400/50 transition-colors mb-8"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
              <Sparkles size={10} /> New
            </span>
            Bundle password &amp; self-destruct settings
            <ChevronRight size={13} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="text-[44px] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[84px] font-semibold tracking-[-0.045em] text-zinc-900 dark:text-white mb-6">
            Learn with focus.
            <br />
            <span className="animate-gradient bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 dark:from-purple-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Share in one link.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed">
            Turn YouTube chaos into <span className="text-zinc-900 dark:text-white font-medium">structured collections</span> you
            actually finish, and share any set of links as one{' '}
            <span className="text-zinc-900 dark:text-white font-medium">password-protected bundle</span>.
          </p>
        </Reveal>

        <Reveal delay={240} className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full sm:w-auto">
          <CtaLink className="w-full sm:w-auto" />
          <a
            href="#demo"
            className="group h-12 px-7 rounded-full border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 backdrop-blur-md text-zinc-900 dark:text-white font-medium inline-flex items-center justify-center gap-1.5 hover:bg-white dark:hover:bg-white/10 transition-colors w-full sm:w-auto"
          >
            View live demo
            <ChevronRight size={16} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
