'use client';

import { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';

export default function FaviconImage({ src, size = 32 }: { src?: string | null; size?: number }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-md bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 flex items-center justify-center shrink-0"
      >
        <LinkIcon size={size / 2} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" style={{ width: size, height: size }} className="rounded-md shrink-0" onError={() => setError(true)} />
  );
}
