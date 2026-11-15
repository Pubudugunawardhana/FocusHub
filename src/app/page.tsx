"use client";

import { useState } from 'react';
import { PlaySquare, Link2 } from 'lucide-react';
import { LandingNav } from '@/components/landing/landing-nav';
import { Hero } from '@/components/landing/hero';
import { FeaturesBento } from '@/components/landing/features-bento';
import { HowItWorks } from '@/components/landing/how-it-works';
import { YoutubeDemo } from '@/components/landing/youtube-demo';
import { BundleDemo } from '@/components/landing/bundle-demo';
import { Faq } from '@/components/landing/faq';
import { CtaBanner } from '@/components/landing/cta-banner';
import { SiteFooter } from '@/components/landing/site-footer';
import { Reveal, SectionHeading } from '@/components/landing/reveal';

const DEMO_MODES = [
  { id: 'youtube', label: 'YouTube Collections', icon: PlaySquare, tint: 'text-red-500' },
  { id: 'bundles', label: 'Link Bundles', icon: Link2, tint: 'text-emerald-500' },
] as const;

function DemoSection() {
  const [mode, setMode] = useState<'youtube' | 'bundles'>('youtube');

  return (
    <section id="demo" className="px-6 py-24 scroll-mt-24">
      <SectionHeading
        eyebrow="Live demo"
        title="Try it before you sign up."
        subtitle="Click through both halves of FocusHub in a simulated sandbox. Nothing here touches real data."
      />

      <Reveal className="flex justify-center mb-6">
        <div className="inline-flex p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md">
          {DEMO_MODES.map(({ id, label, icon: Icon, tint }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              aria-pressed={mode === id}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                mode === id
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-md'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Icon size={15} className={mode === id ? tint : ''} />
              {label}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={100}>{mode === 'bundles' ? <BundleDemo /> : <YoutubeDemo />}</Reveal>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative bg-zinc-50 dark:bg-black font-sans selection:bg-purple-500/30 selection:text-purple-900 dark:selection:text-purple-200 transition-colors duration-300 overflow-x-clip">
      {/* Grid pattern, faded towards the edges */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />

      <LandingNav />

      <main className="relative z-10 flex-1 w-full">
        <Hero />
        <FeaturesBento />
        <HowItWorks />
        <DemoSection />
        <Faq />
        <CtaBanner />
      </main>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  );
}
