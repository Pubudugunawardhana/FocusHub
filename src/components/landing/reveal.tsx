'use client';

import { useEffect, useRef, useState } from 'react';

/** Fades its children up once they scroll into view. CSS in globals.css (.reveal) handles reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li';
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Small uppercase label shown above section headings. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-400">
      <span className="h-px w-6 bg-gradient-to-r from-transparent to-purple-500" />
      {children}
      <span className="h-px w-6 bg-gradient-to-l from-transparent to-purple-500" />
    </span>
  );
}

export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle?: string }) {
  return (
    <Reveal className="text-center mb-14 flex flex-col items-center gap-4">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white max-w-3xl leading-[1.1]">{title}</h2>
      {subtitle && <p className="text-zinc-500 dark:text-zinc-400 max-w-xl text-sm md:text-base">{subtitle}</p>}
    </Reveal>
  );
}
