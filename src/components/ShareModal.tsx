'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import Papa from 'papaparse';
import { Copy, Check, Download, ExternalLink, X, Share2, Lock, Clock, Globe } from 'lucide-react';

interface ShareLink {
  url: string;
  title?: string | null;
  description?: string | null;
  note?: string | null;
}

interface ShareModalProps {
  bundle: {
    shortId: string;
    name: string;
    description?: string | null;
    hasPassword?: boolean;
    expiresAt?: string | Date | null;
    links: ShareLink[];
  };
  onClose: () => void;
}

function download(content: string, type: string, filename: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const btn =
  'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors';

export default function ShareModal({ bundle, onClose }: ShareModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const bundleUrl = typeof window !== 'undefined' ? `${window.location.origin}/b/${bundle.shortId}` : `/b/${bundle.shortId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(bundleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAsText = () => {
    let txt = `*${bundle.name}*\n\n`;
    if (bundle.description) txt += `${bundle.description}\n\n`;
    bundle.links.forEach((l, i) => {
      txt += `${i + 1}. *${l.title || l.url}*\n${l.url}\n`;
      if (l.note || l.description) txt += `_${l.note || l.description}_\n`;
      txt += '\n';
    });
    txt += `*View Full Bundle:* ${bundleUrl}`;
    if (bundle.hasPassword) txt += `
🔒 Password protected`;
    navigator.clipboard.writeText(txt);
    setTextCopied(true);
    setTimeout(() => setTextCopied(false), 2000);
  };

  const exportCSV = () => {
    const csv = Papa.unparse(
      bundle.links.map((l) => ({ Title: l.title || '', URL: l.url, Note: l.note || '', Description: l.description || '' })),
    );
    download(csv, 'text/csv', `${bundle.name}.csv`);
  };

  const exportTXT = () => {
    let txt = `${bundle.name}\n================\n`;
    if (bundle.description) txt += `${bundle.description}\n\n`;
    bundle.links.forEach((l, i) => {
      txt += `${i + 1}. ${l.title || l.url}\n${l.url}\n`;
      if (l.note || l.description) txt += `Note: ${l.note || l.description}\n`;
      txt += '\n';
    });
    txt += `\nView Full Bundle: ${bundleUrl}`;
    download(txt, 'text/plain', `${bundle.name}.txt`);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
          <Share2 size={22} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Share &quot;{bundle.name}&quot;</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          {bundle.hasPassword
            ? 'People with this link must enter the password to see the links.'
            : 'Anyone with this link can view the bundle.'}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {bundle.hasPassword ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
              <Lock size={12} /> Password protected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              <Globe size={12} /> Public
            </span>
          )}
          {bundle.expiresAt && (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
              <Clock size={12} /> Expires {new Date(bundle.expiresAt).toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-xl p-1.5 pl-4 mb-6">
          <input readOnly value={bundleUrl} className="flex-1 bg-transparent outline-none text-sm font-medium text-emerald-600 dark:text-emerald-400 truncate" />
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="bg-white p-3 rounded-2xl border border-black/10 shrink-0">
            <QRCodeSVG value={bundleUrl} size={140} level="H" />
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <a href={bundleUrl} target="_blank" rel="noopener noreferrer" className={btn}>
              <ExternalLink size={16} /> Open Bundle
            </a>
            <button className={btn} onClick={copyAsText}>
              {textCopied ? <Check size={16} /> : <Copy size={16} />} {textCopied ? 'Copied!' : 'Copy as Text'}
            </button>
            <button className={btn} onClick={exportCSV}>
              <Download size={16} /> Export CSV
            </button>
            <button className={btn} onClick={exportTXT}>
              <Download size={16} /> Export TXT
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
