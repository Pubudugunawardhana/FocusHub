'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Link2, Lock, Clock, Copy, Check, Download, ArrowRight, Eye, ExternalLink, GripVertical,
  RotateCcw, Globe, Loader2, Share2, Timer,
} from 'lucide-react';

/**
 * Simulated Link Bundle flow for the landing page.
 * Nothing here talks to the API: it mirrors the real create → share → visitor screens.
 */

const DEMO_PASSWORD = 'demo';
const SHORT_URL = 'focushub.app/b/x7Kp2';

const LINKS = [
  { title: 'React Documentation', url: 'react.dev/learn', note: 'Start with Quick Start', color: 'bg-sky-500', letter: 'R' },
  { title: 'TypeScript Handbook', url: 'typescriptlang.org/docs', note: 'Read "Everyday Types"', color: 'bg-blue-600', letter: 'TS' },
  { title: 'Tailwind CSS Docs', url: 'tailwindcss.com/docs', note: '', color: 'bg-cyan-500', letter: 'T' },
  { title: 'Next.js Learn Course', url: 'nextjs.org/learn', note: 'Free interactive course', color: 'bg-zinc-900 dark:bg-white dark:text-black', letter: 'N' },
];

const EXPIRY_LABEL: Record<string, string> = { none: 'Never', '1h': '1 Hour', '24h': '24 Hours', '7d': '7 Days' };

type Step = 1 | 2 | 3;

function Favicon({ color, letter }: { color: string; letter: string }) {
  return (
    <div className={`w-8 h-8 rounded-lg ${color} text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-sm`}>
      {letter}
    </div>
  );
}

const card = 'bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-2xl shadow-sm';
const smallBtn =
  'flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors';

export function BundleDemo() {
  const [step, setStep] = useState<Step>(1);
  const [usePassword, setUsePassword] = useState(true);
  const [expiry, setExpiry] = useState('24h');
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [views, setViews] = useState(0);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!creating) return;
    const t = setTimeout(() => {
      setCreating(false);
      setStep(2);
    }, 900);
    return () => clearTimeout(t);
  }, [creating]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const goTo = (s: Step) => {
    setStep(s);
    if (s === 3) {
      setUnlocked(false);
      setPw('');
      setPwError('');
      setExpired(false);
      if (!usePassword) setViews((v) => v + 1);
    }
  };

  const reset = () => {
    setStep(1);
    setUsePassword(true);
    setExpiry('24h');
    setUnlocked(false);
    setPw('');
    setPwError('');
    setViews(0);
    setExpired(false);
  };

  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.trim() !== DEMO_PASSWORD) {
      setPwError('Incorrect password');
      return;
    }
    setUnlocked(true);
    setViews((v) => v + 1);
  };

  const address = step === 1 ? 'focushub.app/dashboard/bundles' : step === 2 ? 'focushub.app/edit/x7Kp2' : SHORT_URL;
  const showContent = !usePassword || unlocked;

  return (
    <>
      {/* Step navigation */}
      <div role="tablist" className="flex flex-wrap justify-center gap-2 mb-8 w-full max-w-lg mx-auto">
        {([1, 2, 3] as Step[]).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={step === s}
            onClick={() => goTo(s)}
            className={`py-2 px-4 rounded-full text-xs font-semibold border transition-all ${
              step === s
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white shadow-md'
                : 'bg-black/5 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 border-black/10 dark:border-white/10 hover:text-zinc-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            {s === 1 ? '1. Create' : s === 2 ? '2. Share' : '3. Visitor View'}
          </button>
        ))}
      </div>

      {/* Simulated browser */}
      <div className="w-full max-w-5xl mx-auto bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl relative glass-panel">
        <div className="bg-zinc-100/80 dark:bg-zinc-900/50 px-4 py-3 border-b border-black/5 dark:border-white/10 flex items-center gap-4 backdrop-blur-md">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>
          <div className="flex-1 min-w-0 max-w-lg mx-auto bg-white dark:bg-black/50 rounded-lg py-1.5 px-4 border border-black/5 dark:border-white/10 text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center font-mono truncate">
            {step === 3 && usePassword && <Lock size={11} className="mr-1.5 text-indigo-500 shrink-0" />}
            <span className="text-zinc-400 dark:text-zinc-600 mr-1">https://</span>
            <span className="truncate">{address}</span>
          </div>
        </div>

        <div className="min-h-[480px] bg-zinc-50 dark:bg-black/50 text-zinc-700 dark:text-zinc-300 p-5 sm:p-8">
          {/* ---------- Step 1: Create ---------- */}
          {step === 1 && (
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 animate-fade-in">
              <div className={`${card} p-6`}>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <Link2 size={20} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Create Link Bundle</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">Group links into one shareable page.</p>

                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Name</label>
                <div className="mt-1 mb-4 w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-white">
                  Frontend Starter Pack
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                    <Lock size={12} /> Password protect
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={usePassword}
                    onClick={() => setUsePassword(!usePassword)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors ${usePassword ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                  >
                    <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${usePassword ? 'translate-x-4' : ''}`} />
                  </button>
                </div>
                {usePassword && (
                  <div className="mb-4 w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-zinc-900 dark:text-white flex justify-between animate-fade-in">
                    <span>••••</span>
                    <span className="text-[10px] font-sans text-zinc-400">password: &quot;{DEMO_PASSWORD}&quot;</span>
                  </div>
                )}

                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 mb-1.5">
                  <Timer size={12} /> Self-destruct
                </label>
                <div className="grid grid-cols-4 gap-1.5 mb-6">
                  {Object.entries(EXPIRY_LABEL).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setExpiry(value)}
                      className={`py-2 rounded-lg text-[11px] font-semibold border transition-all ${
                        expiry === value
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCreating(true)}
                  disabled={creating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white text-sm font-semibold rounded-xl py-3 flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  {creating ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : <>Create Bundle <ArrowRight size={16} /></>}
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Links · drag to reorder · details fetched automatically</p>
                {LINKS.map((l) => (
                  <div key={l.url} className={`${card} p-3.5 flex items-center gap-3`}>
                    <GripVertical size={16} className="text-zinc-300 dark:text-zinc-600 shrink-0" />
                    <Favicon color={l.color} letter={l.letter} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{l.title}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate">{l.url}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- Step 2: Share ---------- */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className={`${card} p-6 sm:p-8`}>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <Share2 size={18} className="text-emerald-500" /> Share &quot;Frontend Starter Pack&quot;
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {usePassword ? 'People with this link must enter the password.' : 'Anyone with this link can view the bundle.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {usePassword ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Lock size={12} /> Password protected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      <Globe size={12} /> Public
                    </span>
                  )}
                  {expiry !== 'none' && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                      <Clock size={12} /> Self-destructs in {EXPIRY_LABEL[expiry].toLowerCase()}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    <Eye size={12} /> {views} views
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-xl p-1.5 pl-4 mb-6">
                  <span className="flex-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 truncate">https://{SHORT_URL}</span>
                  <button
                    onClick={() => setCopied('link')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                  >
                    {copied === 'link' ? <Check size={14} /> : <Copy size={14} />} {copied === 'link' ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="bg-white p-3 rounded-2xl border border-black/10 shrink-0">
                    <QRCodeSVG value={`https://${SHORT_URL}`} size={124} level="M" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <button className={smallBtn} onClick={() => setCopied('text')}>
                      {copied === 'text' ? <Check size={14} /> : <Copy size={14} />} {copied === 'text' ? 'Copied!' : 'Copy as Text'}
                    </button>
                    <button className={smallBtn} onClick={() => setCopied('csv')}>
                      {copied === 'csv' ? <Check size={14} /> : <Download size={14} />} {copied === 'csv' ? 'Saved!' : 'Export CSV'}
                    </button>
                    <button className={smallBtn} onClick={() => setCopied('txt')}>
                      {copied === 'txt' ? <Check size={14} /> : <Download size={14} />} {copied === 'txt' ? 'Saved!' : 'Export TXT'}
                    </button>
                    <button className={`${smallBtn} !bg-zinc-900 dark:!bg-white !text-white dark:!text-black !border-transparent`} onClick={() => goTo(3)}>
                      <ExternalLink size={14} /> Open as visitor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------- Step 3: Visitor view ---------- */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              {expired ? (
                <div className={`${card} p-10 text-center`}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-5">
                    <Clock size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Bundle Expired</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">&quot;Frontend Starter Pack&quot; has self-destructed and is no longer available.</p>
                  <button onClick={reset} className="text-xs font-semibold px-4 py-2 rounded-full bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 inline-flex items-center gap-1.5 transition-colors">
                    <RotateCcw size={12} /> Reset Demo
                  </button>
                </div>
              ) : !showContent ? (
                <div className={`${card} p-10 text-center`}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-5">
                    <Lock size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Protected Bundle</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                    &quot;Frontend Starter Pack&quot; requires a password. <span className="text-zinc-400">(Try &quot;{DEMO_PASSWORD}&quot;)</span>
                  </p>
                  <form onSubmit={unlock} className="flex flex-col gap-3 max-w-xs mx-auto">
                    <input
                      type="password"
                      value={pw}
                      onChange={(e) => {
                        setPw(e.target.value);
                        setPwError('');
                      }}
                      placeholder="Enter password"
                      aria-label="Demo bundle password"
                      className="w-full text-center bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    {pwError && <p className="text-xs text-rose-600 dark:text-rose-400">{pwError}</p>}
                    <button type="submit" disabled={!pw} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-colors">
                      Unlock <ArrowRight size={16} />
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <div className={`${card} p-6 mb-4`}>
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">Frontend Starter Pack</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Everything you need to start building modern web apps.</p>
                    <div className="flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400 border-t border-black/5 dark:border-white/10 pt-3">
                      <span className="flex items-center gap-1.5"><Eye size={14} /> {views} views</span>
                      <span className="flex items-center gap-1.5"><Link2 size={14} /> {LINKS.length} links</span>
                      {expiry !== 'none' && (
                        <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md">
                          <Clock size={12} /> Expires in {EXPIRY_LABEL[expiry].toLowerCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {LINKS.map((l) => (
                      <div key={l.url} className={`${card} p-4 flex gap-3 items-start hover:-translate-y-0.5 transition-transform`}>
                        <Favicon color={l.color} letter={l.letter} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                            <span className="truncate">{l.title}</span> <ExternalLink size={12} className="text-zinc-400 shrink-0" />
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{l.url}</p>
                          {l.note && (
                            <span className="inline-block mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                              💡 {l.note}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {expiry !== 'none' && (
                    <div className="text-center mt-6">
                      <button
                        onClick={() => setExpired(true)}
                        className="text-xs font-semibold px-4 py-2 rounded-full border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Timer size={12} /> Fast-forward {EXPIRY_LABEL[expiry].toLowerCase()}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
