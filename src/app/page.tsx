"use client";

import Link from 'next/link';
import { 
  PlaySquare, 
  Folder, 
  BarChart3, 
  Layout, 
  Zap, 
  Check, 
  RotateCcw,
  ChevronRight,
  Heart,
  LayoutGrid,
  Code2,
  Music,
  Plus,
  X,
  Gamepad2,
  Trash2,
  CheckCircle2,
  PlayCircle,
  Layers,
  Link2,
  Lock,
  QrCode
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [demoStep, setDemoStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveVideo = () => {
    setIsSaving(true);
  };

  useEffect(() => {
    if (!isSaving) return;
    const timer = setTimeout(() => {
      setIsSaving(false);
      setDemoStep(2);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isSaving]);

  const handleResetDemo = () => {
    setWatched(false);
    setDemoStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-zinc-50 dark:bg-black font-sans selection:bg-purple-500/30 selection:text-purple-900 dark:selection:text-purple-200 transition-colors duration-300">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="absolute top-[-20%] w-[800px] h-[600px] bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-colors duration-300"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-colors duration-300"></div>
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none transition-colors duration-300"></div>

      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/80 dark:bg-black/60 backdrop-blur-xl border-zinc-200 dark:border-white/10 py-3' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center shadow-md dark:shadow-lg border border-black/5 dark:border-white/10 group-hover:border-black/10 dark:group-hover:border-white/20 transition-colors">
              <Layers size={14} className="text-zinc-800 dark:text-white" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">FocusHub</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-5">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="hidden sm:flex h-9 px-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium items-center justify-center hover:scale-105 transition-transform">
                  Dashboard
                </Link>
                <UserMenu />
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium text-sm transition-colors">
                  Log In
                </Link>
                <Link href="/register" className="h-9 px-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium flex items-center justify-center hover:scale-105 transition-transform">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col relative z-10 w-full max-w-6xl mx-auto mt-32 mb-10">
        <section className="px-6 flex flex-col items-center justify-center text-center w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-zinc-600 dark:text-zinc-300 text-xs font-medium mb-8 backdrop-blur-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-default">
            <Zap size={12} className="text-purple-600 dark:text-purple-400" />
            <span>YouTube Collections + Link Bundles</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold tracking-tighter leading-[1.05] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-white/40 max-w-4xl">
            Turn YouTube Chaos into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">Structured Knowledge</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed font-light">
            Curate, organize, and track your progress through educational videos - and share any set of links with a single, password-protectable bundle link.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-24 justify-center items-center w-full sm:w-auto">
            <Link href={isAuthenticated ? "/dashboard" : "/register"} className="h-12 px-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold flex items-center justify-center transition-transform hover:scale-105 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-xl dark:shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] w-full sm:w-auto">
              {isAuthenticated ? "Go to Dashboard" : "Start Organizing Free"}
            </Link>
            <a href="#demo" className="h-12 px-8 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white font-medium flex items-center justify-center backdrop-blur-md transition-colors hover:bg-black/10 dark:hover:bg-white/10 w-full sm:w-auto gap-2 group">
              View Live Demo
              <ChevronRight size={16} className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            </a>
          </div>
        </section>

        {/* Dashboard Mockup Graphic Section */}
        <section id="demo" className="py-12 px-6 w-full scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
              Your Distraction-Free Workspace
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm">
              Experience the FocusHub environment inside our simulated sandbox.
            </p>
          </div>
          
          {/* Demo Step Navigation */}
          <div role="tablist" className="flex flex-wrap justify-center gap-2 mb-8 w-full max-w-lg mx-auto">
            {[0, 1, 2, 3].map((step) => (
              <button
                key={step}
                role="tab"
                aria-selected={demoStep === step}
                aria-controls={step === 0 ? undefined : `demo-step-${step}`}
                onClick={() => {
                  setDemoStep(step);
                  if (step < 3) setWatched(false);
                }}
                className={`py-2 px-4 rounded-full text-xs font-semibold border transition-all text-center ${
                  demoStep === step
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white shadow-md dark:shadow-[0_0_15px_-5px_rgba(255,255,255,0.5)]'
                    : 'bg-black/5 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 border-black/10 dark:border-white/10 hover:text-zinc-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                {step === 0 ? 'Dashboard' : step === 1 ? '1. Add' : step === 2 ? '2. Categorize' : '3. Track'}
              </button>
            ))}
          </div>

          {/* Simulated Browser Frame */}
          <div className="w-full max-w-5xl mx-auto bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl relative glass-panel transition-colors duration-300">
            {/* Browser Header / Controls */}
            <div className="bg-zinc-100/80 dark:bg-zinc-900/50 px-4 py-3 border-b border-black/5 dark:border-white/10 flex items-center gap-4 backdrop-blur-md transition-colors duration-300">
              {/* OS Window Control Dots */}
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
              </div>
              {/* Address Bar */}
              <div className="flex-1 max-w-lg mx-auto bg-white dark:bg-black/50 rounded-lg py-1.5 px-4 border border-black/5 dark:border-white/10 text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center font-mono shadow-sm dark:shadow-inner transition-colors duration-300">
                <span className="text-zinc-400 dark:text-zinc-600 mr-1">https://</span>focustube.app/dashboard
              </div>
            </div>

            {/* Dashboard Workspace Mock */}
            <div className="flex flex-col min-h-[450px] bg-zinc-50 dark:bg-black/50 text-zinc-700 dark:text-zinc-300 relative transition-colors duration-300">
              
              {/* Mock Header */}
              <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 transition-colors duration-300">
                <div className="px-6 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <PlaySquare size={16} className="text-white fill-white/20" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">FocusHub</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-all flex items-center gap-2 shadow-md hidden sm:flex">
                      <Plus size={16} /> New Collection
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 border-2 border-white dark:border-zinc-800 shadow-sm"></div>
                  </div>
                </div>
              </header>

              {/* Mock Main Content */}
              <main className="flex-1 p-8 relative transition-colors duration-300">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <LayoutGrid size={24} className="text-emerald-500" />
                    Your Collections
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Organize and track your YouTube tutorials</p>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ${demoStep !== 0 ? 'opacity-20 blur-md pointer-events-none' : ''}`}>
                  
                  {/* Card 1 */}
                  <div className="h-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-xl flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center mb-1 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
                        <Code2 size={22} className="text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <div className="p-2 rounded-full text-rose-500 bg-rose-50 dark:bg-rose-500/10">
                        <Heart size={20} className="fill-current" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 truncate">React Mastery</h3>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 w-fit">Programming</span>
                    
                    <div className="mt-auto pt-8">
                      <div className="flex justify-between items-end mb-2 text-sm font-medium">
                        <span className="text-zinc-500 dark:text-zinc-400">Progress</span>
                        <span className="text-zinc-900 dark:text-white text-lg">75%</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 mb-3 overflow-hidden shadow-inner border border-black/5 dark:border-white/5">
                        <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: '75%', background: 'linear-gradient(90deg, #10b981, #059669)' }}>
                          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        <PlaySquare size={13} />
                        <span>3 of 4 videos watched</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="h-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-xl flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center mb-1 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
                        <Music size={22} className="text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <div className="p-2 rounded-full text-zinc-400">
                        <Heart size={20} />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 truncate">Guitar Lessons</h3>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 w-fit">Music</span>
                    
                    <div className="mt-auto pt-8">
                      <div className="flex justify-between items-end mb-2 text-sm font-medium">
                        <span className="text-zinc-500 dark:text-zinc-400">Progress</span>
                        <span className="text-zinc-900 dark:text-white text-lg">30%</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 mb-3 overflow-hidden shadow-inner border border-black/5 dark:border-white/5">
                        <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: '30%', background: 'linear-gradient(90deg, #10b981, #059669)' }}>
                          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        <PlaySquare size={13} />
                        <span>3 of 10 videos watched</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 (Hidden on very small screens for balance) */}
                  <div className="h-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-xl flex flex-col relative overflow-hidden group hidden lg:flex">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center mb-1 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
                        <BarChart3 size={22} className="text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <div className="p-2 rounded-full text-zinc-400">
                        <Heart size={20} />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 truncate">Trading Strategies</h3>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 w-fit">Finance</span>
                    
                    <div className="mt-auto pt-8">
                      <div className="flex justify-between items-end mb-2 text-sm font-medium">
                        <span className="text-zinc-500 dark:text-zinc-400">Progress</span>
                        <span className="text-zinc-900 dark:text-white text-lg">100%</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 mb-3 overflow-hidden shadow-inner border border-black/5 dark:border-white/5">
                        <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: '100%', background: 'linear-gradient(90deg, #10b981, #059669)' }}>
                          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        <PlaySquare size={13} />
                        <span>5 of 5 videos watched</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Overlays for Steps */}
                {demoStep !== 0 && (
                  <div className="absolute inset-0 z-50 flex flex-col justify-start items-center p-4 pt-10 overflow-y-auto bg-zinc-100/30 dark:bg-black/40 backdrop-blur-sm">
                    {/* Step 1: Input URL */}
                    {demoStep === 1 && (
                      <div id="demo-step-1" role="tabpanel" className="w-full max-w-md mx-auto animate-fade-in bg-white dark:bg-zinc-950 p-6 rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 backdrop-blur-xl relative">
                        {/* Close button top right */}
                        <button 
                          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 transition-colors"
                          onClick={() => setDemoStep(0)}
                          title="Close"
                        >
                          <X size={16} />
                        </button>
                        
                        <div className="flex flex-col gap-5">
                          {/* Top Icon */}
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                            <PlaySquare size={24} className="fill-emerald-100/50 dark:fill-emerald-500/10" />
                          </div>

                          {/* Title & Subtitle */}
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Add YouTube Video</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Paste a YouTube link to add it to your collection.</p>
                          </div>

                          {/* Input Area */}
                          <div className="space-y-1.5 mt-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">YouTube URL</label>
                            <input
                              type="text"
                              readOnly
                              value="https://youtube.com/watch?v=..."
                              className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm rounded-xl px-4 py-3 outline-none"
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 mt-4">
                            <button
                              onClick={() => setDemoStep(0)}
                              className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveVideo}
                              disabled={isSaving}
                              className="flex-1 bg-emerald-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-wait"
                            >
                              {isSaving ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                  <span>Adding...</span>
                                </>
                              ) : (
                                <span>Add Video</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Categorization (Empty Collection View) */}
                    {demoStep === 2 && (
                      <div id="demo-step-2" role="tabpanel" className="w-full max-w-4xl mx-auto space-y-4 animate-fade-in relative z-50 mb-10">
                        {/* Header Card */}
                        <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-black/5 dark:border-white/10 relative overflow-hidden">
                          {/* Top Border Line */}
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-300 dark:bg-emerald-500/50"></div>
                          
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                              
                              {/* Left side: Icon, Title, Badge, Stats */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-black/5 dark:border-white/5">
                                    <Gamepad2 size={24} className="text-zinc-600 dark:text-zinc-400" />
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Game</h2>
                                      <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-500/20">
                                        General
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                  <div className="flex items-center gap-2">
                                    <PlayCircle size={16} /> 0 Videos
                                  </div>
                                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                                    <CheckCircle2 size={16} /> 0 Completed
                                  </div>
                                </div>
                              </div>

                              {/* Right side: Buttons */}
                              <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-sm">
                                  <Heart size={16} className="text-zinc-400" /> Favorite
                                </button>
                                <button 
                                  onClick={() => setDemoStep(3)}
                                  className="flex items-center gap-2 bg-emerald-600 text-white font-medium rounded-xl px-4 py-2 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20"
                                >
                                  <Plus size={16} /> Add Video
                                </button>
                                <button className="flex items-center justify-center w-10 h-10 border border-rose-200 dark:border-rose-900/50 rounded-xl bg-white dark:bg-black hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors shadow-sm">
                                  <Trash2 size={16} />
                                </button>
                              </div>

                            </div>

                            {/* Progress Bar */}
                            <div className="mt-8 space-y-2">
                              <div className="flex justify-between items-center text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                <span>Collection Progress</span>
                                <span>0%</span>
                              </div>
                              <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-black/5 dark:border-white/5 shadow-inner">
                                <div className="h-full bg-emerald-500 w-0"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Empty State Card */}
                        <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-lg border border-black/5 dark:border-white/10 p-10 flex flex-col items-center justify-center text-center space-y-5">
                          <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-black/5 dark:border-white/5 shadow-sm">
                            <PlaySquare size={32} className="text-zinc-400" />
                          </div>
                          
                          <div className="space-y-2 max-w-sm">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">This collection is empty</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                              Paste a YouTube URL to add your first video and start learning.
                            </p>
                          </div>

                          <button 
                            onClick={() => setDemoStep(3)}
                            className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl px-6 py-3 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md mt-2 hover:-translate-y-0.5"
                          >
                            <Plus size={18} /> Add First Video
                          </button>
                        </div>
                        
                        <div className="text-center pt-2">
                          <button
                            onClick={() => setDemoStep(0)}
                            className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 underline underline-offset-2 transition-colors"
                          >
                            Close Overlay
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Track Completion Progress */}
                    {demoStep === 3 && (
                      <div id="demo-step-3" role="tabpanel" className="w-full max-w-md mx-auto space-y-6 animate-fade-in bg-white/90 dark:bg-zinc-950/90 p-6 rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 backdrop-blur-xl">
                        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                          <div>
                            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Interactive Progress</h3>
                            <p className="text-xs text-zinc-500 mt-1">Track playlists and visualize your learning.</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold tracking-wide uppercase">
                            Path: AI & Security
                          </span>
                        </div>

                        <div className="bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-xl p-5 space-y-5 shadow-md">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                              {watched ? '3 of 3 videos completed' : '2 of 3 videos completed'}
                            </span>
                            <span className="text-xs font-bold text-zinc-900 dark:text-white">
                              {watched ? '100%' : '66%'}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-black/5 dark:border-white/5 shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 ease-out relative"
                              style={{ width: watched ? '100%' : '66%' }}
                            >
                              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                            </div>
                          </div>

                          {/* Sub-items list */}
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-600 dark:text-zinc-400">
                              <span className="truncate">1. Machine Learning Fundamentals</span>
                              <span className="text-[10px] flex items-center gap-1 text-zinc-500 font-medium"><Check size={12} className="text-emerald-500" /> Done</span>
                            </div>
                            <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-600 dark:text-zinc-400">
                              <span className="truncate">2. Building AI Agents with LangChain</span>
                              <span className="text-[10px] flex items-center gap-1 text-zinc-500 font-medium"><Check size={12} className="text-emerald-500" /> Done</span>
                            </div>
                            
                            {/* Interactive watching task */}
                            <div className={`flex items-center justify-between text-xs p-3 rounded-xl border transition-all duration-300 ${
                              watched 
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-zinc-600 dark:text-zinc-400' 
                                : 'bg-white dark:bg-zinc-900 border-black/10 dark:border-white/20 text-zinc-900 dark:text-white shadow-sm'
                            }`}>
                              <span className="font-medium truncate flex-1 pr-3">3. Advanced Cybersecurity & Ethical Hacking</span>
                              
                              <label className="flex items-center gap-2 cursor-pointer select-none flex-shrink-0 group">
                                <input 
                                  type="checkbox"
                                  checked={watched}
                                  onChange={(e) => setWatched(e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-2 ${
                                  watched 
                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                    : 'border-zinc-300 dark:border-zinc-500 bg-zinc-50 dark:bg-black group-hover:border-emerald-500'
                                }`}>
                                  {watched && <Check size={10} strokeWidth={3} />}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${watched ? 'text-emerald-600 dark:text-emerald-500' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>
                                  {watched ? 'Watched' : 'Mark'}
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Celebration Banner */}
                        {watched && (
                          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-center animate-fade-in space-y-1.5 shadow-sm transition-colors duration-300">
                            <p className="font-bold text-sm flex items-center justify-center gap-2">
                              <span>🎉</span> Collection Completed!
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-500/80">You&apos;ve mastered AI & Security distraction-free.</p>
                            <button
                              onClick={handleResetDemo}
                              className="mt-3 text-[10px] font-bold text-emerald-700 dark:text-white bg-emerald-100 dark:bg-white/10 hover:bg-emerald-200 dark:hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 mx-auto"
                            >
                              <RotateCcw size={10} /> Reset Demo
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </main>
            </div>
          </div>
        </section>

        {/* Refined Feature Cards Section */}
        <section className="py-24 px-6 relative z-10 w-full mt-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white transition-colors duration-300">
              Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-400 dark:from-zinc-300 dark:to-zinc-500">learn better</span>.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-sm md:text-base font-light transition-colors duration-300">
              FocusHub replaces addictive recommendation feeds with a dedicated environment engineered for deep work - and makes sharing resources effortless.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="glass-card p-8 flex flex-col min-h-[260px] group">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-black border border-black/5 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm dark:shadow-inner group-hover:border-purple-300 dark:group-hover:border-purple-500/30 group-hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)] dark:group-hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)] transition-all">
                <Folder className="text-zinc-500 dark:text-zinc-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white transition-colors duration-300">Smart Collections</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light transition-colors duration-300">
                Group your saved videos into clean folders. Our automated keyword analyzer automatically flags topics like React, TypeScript, or system design.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 flex flex-col min-h-[260px] group">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-black border border-black/5 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm dark:shadow-inner group-hover:border-blue-300 dark:group-hover:border-blue-500/30 group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)] dark:group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] transition-all">
                <Layout className="text-zinc-500 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white transition-colors duration-300">Distraction-Free UI</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light transition-colors duration-300">
                Say goodbye to sidebars, comments, and autoplays. View your saved videos in a minimized, beautiful UI optimized for absolute concentration.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 flex flex-col min-h-[260px] group">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-black border border-black/5 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm dark:shadow-inner group-hover:border-emerald-300 dark:group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)] dark:group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] transition-all">
                <BarChart3 className="text-zinc-500 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white transition-colors duration-300">Progress Tracking</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light transition-colors duration-300">
                Mark videos as completed and visualize your collection completion rates. Build momentum as you turn playlists into badges of honor.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-6">
            {[
              { icon: Link2, title: 'Shareable Link Bundles', text: 'Collect any URLs into one short link. Titles, descriptions and favicons are fetched automatically, and you can drag to reorder.' },
              { icon: Lock, title: 'Password & Self-Destruct', text: 'Protect a bundle with a password, or let it expire after 1 hour, 24 hours or 7 days. View counts show how often it is opened.' },
              { icon: QrCode, title: 'QR Code & Export', text: 'Share with a QR code, copy everything as formatted text for chats, or export the links as CSV or TXT.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="glass-card p-8 flex flex-col min-h-[240px] group">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-black border border-black/5 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:border-emerald-300 dark:group-hover:border-emerald-500/30 transition-all">
                  <Icon className="text-zinc-500 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white">{title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-black/5 dark:border-white/5 relative z-10 w-full mt-auto bg-zinc-50 dark:bg-black transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-zinc-500 dark:text-zinc-600 text-sm">
          <p>© 2026 FocusHub. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <span>Developed by </span>
            <a href="https://www.linkedin.com/in/pubudu-gunawardhana-mmpg" target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Pubudu Gunawardhana</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
