import { CtaLink } from './cta-link';
import { Reveal } from './reveal';

export function CtaBanner() {
  return (
    <section className="px-6 py-16">
      <Reveal className="max-w-5xl mx-auto">
        <div className="relative rounded-[32px] p-px bg-gradient-to-br from-purple-500/60 via-blue-500/30 to-emerald-400/50 overflow-hidden">
          <div className="relative rounded-[31px] bg-white dark:bg-zinc-950 px-6 py-16 sm:py-20 text-center overflow-hidden">
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-[300px] rounded-full bg-purple-500/20 dark:bg-purple-600/25 blur-[100px]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <div className="relative">
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white mb-4">Ready to focus?</h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
                Build your first collection or share your first bundle in under a minute.
              </p>
              <CtaLink guestLabel="Create your free account" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
