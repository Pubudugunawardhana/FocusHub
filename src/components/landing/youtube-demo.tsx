"use client";

import { useEffect, useState } from 'react';
import { BarChart3, X, Check, CheckCircle2, Code2, Gamepad2, Heart, LayoutGrid, Music, PlayCircle, PlaySquare, Plus, RotateCcw, Trash2 } from 'lucide-react';

/** Simulated YouTube collection flow (add → categorize → track). Moved unchanged from the landing page. */
export function YoutubeDemo() {
  const [demoStep, setDemoStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [watched, setWatched] = useState(false);

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
    <>
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
                <span className="text-zinc-400 dark:text-zinc-600 mr-1">https://</span>focushub.app/dashboard
              </div>
            </div>

            {/* Dashboard Workspace Mock */}
            <div className="flex flex-col min-h-[450px] bg-zinc-50 dark:bg-black/50 text-zinc-700 dark:text-zinc-300 relative transition-colors duration-300">
              
              {/* Mock Header */}
              <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 transition-colors duration-300">
                <div className="px-6 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                      <PlaySquare size={16} className="text-white fill-white/20" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">FocusHub</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-all flex items-center gap-2 shadow-md hidden sm:flex">
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
                    <LayoutGrid size={24} className="text-brand-500" />
                    Your Collections
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Organize and track your YouTube tutorials</p>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ${demoStep !== 0 ? 'opacity-20 blur-md pointer-events-none' : ''}`}>
                  
                  {/* Card 1 */}
                  <div className="h-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-brand-500/30 dark:hover:border-brand-500/30 transition-all duration-300 backdrop-blur-xl flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center mb-1 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 transition-colors">
                        <Code2 size={22} className="text-zinc-600 dark:text-zinc-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
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
                        <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: '75%', background: 'linear-gradient(90deg, #9333ea, #3b82f6)' }}>
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
                  <div className="h-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-brand-500/30 dark:hover:border-brand-500/30 transition-all duration-300 backdrop-blur-xl flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center mb-1 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 transition-colors">
                        <Music size={22} className="text-zinc-600 dark:text-zinc-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
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
                        <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: '30%', background: 'linear-gradient(90deg, #9333ea, #3b82f6)' }}>
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
                  <div className="h-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-brand-500/30 dark:hover:border-brand-500/30 transition-all duration-300 backdrop-blur-xl flex flex-col relative overflow-hidden group hidden lg:flex">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center mb-1 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 transition-colors">
                        <BarChart3 size={22} className="text-zinc-600 dark:text-zinc-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
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
                        <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: '100%', background: 'linear-gradient(90deg, #9333ea, #3b82f6)' }}>
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
                          <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
                            <PlaySquare size={24} className="fill-brand-100/50 dark:fill-brand-500/10" />
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
                              className="flex-1 bg-brand-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-wait"
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
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-300 dark:bg-brand-500/50"></div>
                          
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
                                      <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold border border-brand-200 dark:border-brand-500/20">
                                        General
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                  <div className="flex items-center gap-2">
                                    <PlayCircle size={16} /> 0 Videos
                                  </div>
                                  <div className="flex items-center gap-2 text-brand-600 dark:text-brand-500">
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
                                  className="flex items-center gap-2 bg-brand-600 text-white font-medium rounded-xl px-4 py-2 hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20"
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
                                <div className="h-full bg-brand-500 w-0"></div>
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
                              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-1000 ease-out relative"
                              style={{ width: watched ? '100%' : '66%' }}
                            >
                              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                            </div>
                          </div>

                          {/* Sub-items list */}
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-600 dark:text-zinc-400">
                              <span className="truncate">1. Machine Learning Fundamentals</span>
                              <span className="text-[10px] flex items-center gap-1 text-zinc-500 font-medium"><Check size={12} className="text-brand-500" /> Done</span>
                            </div>
                            <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-600 dark:text-zinc-400">
                              <span className="truncate">2. Building AI Agents with LangChain</span>
                              <span className="text-[10px] flex items-center gap-1 text-zinc-500 font-medium"><Check size={12} className="text-brand-500" /> Done</span>
                            </div>
                            
                            {/* Interactive watching task */}
                            <div className={`flex items-center justify-between text-xs p-3 rounded-xl border transition-all duration-300 ${
                              watched 
                                ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/20 text-zinc-600 dark:text-zinc-400' 
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
                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2 ${
                                  watched 
                                    ? 'bg-brand-500 border-brand-500 text-white' 
                                    : 'border-zinc-300 dark:border-zinc-500 bg-zinc-50 dark:bg-black group-hover:border-brand-500'
                                }`}>
                                  {watched && <Check size={10} strokeWidth={3} />}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${watched ? 'text-brand-600 dark:text-brand-500' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>
                                  {watched ? 'Watched' : 'Mark'}
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Celebration Banner */}
                        {watched && (
                          <div className="p-4 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-700 dark:text-brand-400 rounded-xl text-center animate-fade-in space-y-1.5 shadow-sm transition-colors duration-300">
                            <p className="font-bold text-sm flex items-center justify-center gap-2">
                              <span>🎉</span> Collection Completed!
                            </p>
                            <p className="text-xs text-brand-600 dark:text-brand-500/80">You&apos;ve mastered AI & Security distraction-free.</p>
                            <button
                              onClick={handleResetDemo}
                              className="mt-3 text-[10px] font-bold text-brand-700 dark:text-white bg-brand-100 dark:bg-white/10 hover:bg-brand-200 dark:hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 mx-auto"
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
    </>
  );
}
