import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'FocusHub - YouTube Collections & Link Bundles',
  description:
    'Organize and track your YouTube learning, and share many links with one link. Collections, progress tracking, smart notes, password-protected bundles and QR sharing.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
