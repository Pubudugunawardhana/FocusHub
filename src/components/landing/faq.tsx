import { Plus } from 'lucide-react';
import { Reveal, SectionHeading } from './reveal';

const FAQS = [
  {
    q: 'Is FocusHub free?',
    a: 'Yes. Create an account with your email and you can make as many collections and bundles as you like.',
  },
  {
    q: 'How secure are password-protected bundles?',
    a: 'Passwords are hashed with bcrypt and checked on the server. The links are never sent to a visitor until the right password is entered, so they cannot be read from the page source.',
  },
  {
    q: 'What happens when a bundle self-destructs?',
    a: 'After the timer ends (1 hour, 24 hours or 7 days), the share link shows "Bundle Expired" and the links are no longer visible. You still see the bundle in your dashboard and can give it a new timer to bring it back.',
  },
  {
    q: 'Can I add or change a password later?',
    a: 'Yes. Open the bundle and use Settings to add, change or remove the password and the self-destruct timer. Changing the password locks out everyone who unlocked it before.',
  },
  {
    q: 'Do I need a YouTube API key?',
    a: 'No. Without a key, video details come from YouTube oEmbed. Adding a YouTube Data API key also shows how long each video is.',
  },
  {
    q: 'Can I take my links with me?',
    a: 'Yes. Every bundle can be exported as CSV or TXT, copied as formatted text, or shared with a QR code.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="px-6 py-24 scroll-mt-24">
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="FAQ" title="Questions, answered." />
        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 50}>
              <details className="group rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl open:shadow-[0_15px_40px_-20px_rgba(124,58,237,0.35)] open:border-purple-400/30 transition-all">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left font-medium text-zinc-900 dark:text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="shrink-0 w-7 h-7 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-500 transition-transform duration-300 group-open:rotate-45 group-open:text-purple-600 dark:group-open:text-purple-400">
                    <Plus size={14} />
                  </span>
                </summary>
                <p className="px-5 sm:px-6 pb-5 -mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
