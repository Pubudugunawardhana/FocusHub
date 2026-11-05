import { FolderPlus, Wand2, Rocket } from 'lucide-react';
import { Reveal, SectionHeading } from './reveal';

const STEPS = [
  {
    icon: FolderPlus,
    title: 'Create a collection or bundle',
    text: 'Start a YouTube collection for something you are learning, or a link bundle for something you want to share.',
  },
  {
    icon: Wand2,
    title: 'Paste videos or links',
    text: 'Titles, thumbnails, descriptions and favicons are fetched for you. Drag items into the order you want.',
  },
  {
    icon: Rocket,
    title: 'Track progress or share',
    text: 'Watch distraction-free and see your progress grow, or send one short link with an optional password and timer.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="How it works" title="From scattered tabs to a plan in three steps." />

        <ol className="relative grid md:grid-cols-3 gap-10 md:gap-8">
          {/* connecting line */}
          <div aria-hidden className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-blue-500/0" />
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 120} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-6">
                <div className="w-14 h-14 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-[0_10px_30px_-12px_rgba(124,58,237,0.45)] flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <s.icon size={22} />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-xs">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
