"use client";

import { useEffect, useState, use, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { apiError } from '@/lib/api';
import { ArrowLeft, Plus, Trash2, Loader2, PlayCircle, CheckCircle2, PlaySquare, X, ChevronDown, Check, Heart, List, Search, FileText } from 'lucide-react';
import { AppShell, LoadingScreen } from '@/components/app-shell';
import { IconRenderer } from '@/lib/icons';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableVideoCard } from '@/components/SortableVideoCard';
import { SortableListItem } from '@/components/SortableListItem';
import { SmartNotepad } from '@/components/SmartNotepad';
import YouTube from 'react-youtube';

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail?: string;
  duration?: string;
  status: string;
  notes?: string;
}

interface Collection {
  id: string;
  name: string;
  category?: string;
  icon?: string;
  isFavorite?: boolean;
}

const StatusDropdown = ({ status, onChange }: { status: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ['To Watch', 'Watching', 'Watched'];

  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [isOpen]);

  const baseColor = status === 'Watched' 
    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
    : status === 'Watching'
    ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-black/5 dark:border-white/10';

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${baseColor} hover:brightness-95 dark:hover:brightness-110`}
      >
        {status}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-36 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1.5 flex flex-col gap-0.5">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  status === opt 
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {opt}
                {status === opt && <Check size={14} className="text-emerald-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CollectionDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: 'collection' | 'video'; targetId?: string; title: string }>({ isOpen: false, type: 'collection', title: '' });
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotepad, setShowNotepad] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const router = useRouter();

  const fetchVideos = useCallback(async () => {
    try {
      const res = await api.get(`/collections/${id}/videos`);
      setVideos(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const fetchData = useCallback(async () => {
    try {
      const colRes = await api.get(`/collections/${id}`);
      setCollection(colRes.data);
      await fetchVideos();
    } catch (err) {
      console.error(err);
      router.push('/dashboard/collections');
    } finally {
      setLoading(false);
    }
  }, [id, fetchVideos, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim()) return;
    
    setAdding(true);
    setError('');
    
    try {
      await api.post('/videos', { url: newVideoUrl, collectionId: id });
      setNewVideoUrl('');
      setShowAddModal(false);
      await fetchData(); 
    } catch (err) {
      setError(apiError(err, 'Failed to add video. Check URL.'));
    } finally {
      setAdding(false);
    }
  };

  const updateStatus = async (videoId: string, newStatus: string) => {
    try {
      await api.put(`/videos/${videoId}/status`, { status: newStatus });
      fetchVideos();
    } catch {
      console.error('Failed to update status');
    }
  };

  const handleToggleFavorite = async () => {
    if (!collection) return;
    const newStatus = !collection.isFavorite;
    
    setCollection({ ...collection, isFavorite: newStatus });
    
    try {
      await api.put(`/collections/${id}`, { isFavorite: newStatus });
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      setCollection({ ...collection, isFavorite: !newStatus });
    }
  };

  const confirmDeleteVideo = (videoId: string) => {
    setDeleteModal({ isOpen: true, type: 'video', targetId: videoId, title: 'Are you sure you want to remove this video?' });
  };

  const confirmDeleteCollection = () => {
    setDeleteModal({ isOpen: true, type: 'collection', title: 'Are you sure you want to delete this entire collection?' });
  };

  const executeDelete = async () => {
    try {
      if (deleteModal.type === 'video' && deleteModal.targetId) {
        await api.delete(`/videos/${deleteModal.targetId}`);
        fetchVideos();
      } else if (deleteModal.type === 'collection') {
        await api.delete(`/collections/${id}`);
        router.push('/dashboard/collections');
        return;
      }
      setDeleteModal({ ...deleteModal, isOpen: false });
    } catch {
      console.error('Failed to delete');
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = videos.findIndex((v) => v.id === active.id);
      const newIndex = videos.findIndex((v) => v.id === over.id);

      const newOrderedVideos = arrayMove(videos, oldIndex, newIndex);
      setVideos(newOrderedVideos);

      try {
        await api.put('/videos/reorder', {
          orderedIds: newOrderedVideos.map(v => v.id)
        });
      } catch (err) {
        console.error('Failed to save reorder', err);
      }
    }
  };

  if (loading) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  const total = videos.length;
  const watched = videos.filter(v => v.status === 'Watched').length;
  const progressPercent = total === 0 ? 0 : Math.round((watched / total) * 100);

  return (
    <AppShell>
        <Link
          href="/dashboard/collections"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to collections
        </Link>
        {/* Collection Header Panel */}
        <div className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-3xl p-8 mb-10 shadow-xl backdrop-blur-xl transition-colors duration-300 relative overflow-hidden">
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-50"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {collection?.icon && (
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center">
                    <IconRenderer iconName={collection.icon} size={20} className="text-zinc-600 dark:text-zinc-400" />
                  </div>
                )}
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{collection?.name || 'Collection'}</h2>
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {collection?.category || 'General'}
                </span>
              </div>
              
              <div className="flex items-center gap-5 text-sm font-medium">
                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                  <PlayCircle size={16} /> {total} Videos
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={16} /> {watched} Completed
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0">
              <button 
                onClick={() => setShowListModal(true)}
                className="flex items-center justify-center gap-2 text-sm font-semibold rounded-xl px-5 py-3 transition-all shadow-sm flex-1 sm:flex-none border bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-black/10 dark:border-white/10 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-500/30"
                title="View and Search Video List"
              >
                <List size={16} />
                <span className="sm:hidden md:inline">List View</span>
              </button>
              <button 
                onClick={handleToggleFavorite}
                className={`flex items-center justify-center gap-2 text-sm font-semibold rounded-xl px-5 py-3 transition-all shadow-sm flex-1 sm:flex-none border ${collection?.isFavorite ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-black/10 dark:border-white/10 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-200 dark:hover:border-rose-500/30'}`}
                title={collection?.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart size={16} className={collection?.isFavorite ? 'fill-current' : ''} />
                <span className="sm:hidden md:inline">{collection?.isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>
              <button 
                onClick={() => setShowAddModal(true)} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl px-5 py-3 transition-all flex items-center justify-center gap-2 shadow-md flex-1 sm:flex-none"
              >
                <Plus size={16} /> Add Video
              </button>
              <button 
                onClick={confirmDeleteCollection} 
                className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 text-sm font-semibold rounded-xl px-5 py-3 transition-all flex items-center justify-center gap-2 shadow-sm flex-1 sm:flex-none"
                title="Delete Collection"
              >
                <Trash2 size={16} /> <span className="sm:hidden">Delete</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
            <div className="flex justify-between items-end mb-2 text-sm font-medium">
              <span className="text-zinc-500 dark:text-zinc-400">Collection Progress</span>
              <span className="text-zinc-900 dark:text-white text-lg">{progressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full h-3 overflow-hidden shadow-inner border border-black/5 dark:border-white/5">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #10b981, #059669)' }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-3xl p-12 shadow-xl flex flex-col items-center justify-center backdrop-blur-xl transition-colors duration-300 min-h-[300px]">
            <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center mb-6 shadow-inner">
              <PlaySquare size={32} className="text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">This collection is empty</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm text-center">Paste a YouTube URL to add your first video and start learning.</p>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 text-sm font-semibold rounded-xl px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Plus size={16} /> Add First Video
            </button>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={videos.map(v => v.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {videos.map(video => (
                  <SortableVideoCard 
                    key={video.id} 
                    video={video} 
                    onPlay={setPlayingVideoId}
                    onDelete={confirmDeleteVideo}
                    statusDropdown={
                      <StatusDropdown status={video.status} onChange={(val) => updateStatus(video.id, val)} />
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAddModal(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 border border-emerald-200 dark:border-emerald-500/20">
              <PlaySquare size={24} />
            </div>
            
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Add YouTube Video</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Paste a YouTube link to add it to your collection.</p>
            
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-500/20 flex items-start gap-3">
                <div className="mt-0.5"><X size={16} className="text-red-500" /></div>
                <div>{error}</div>
              </div>
            )}
            
            <form onSubmit={handleAddVideo}>
              <div className="space-y-1.5 mb-8">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">YouTube URL</label>
                <input 
                  type="url" 
                  className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 shadow-sm dark:shadow-inner" 
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  autoFocus
                  required
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-xl px-4 py-3 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
                  disabled={adding}
                >
                  {adding ? (
                    <><Loader2 className="animate-spin" size={18} /> Adding...</>
                  ) : (
                    'Add Video'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <button 
              onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mb-5 border border-red-200 dark:border-red-500/20">
              <Trash2 size={24} />
            </div>
            
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Confirm Deletion</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">{deleteModal.title}</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })} 
                className="flex-1 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-xl px-4 py-3 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all flex items-center justify-center shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideoId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md" 
            onClick={() => setPlayingVideoId(null)}
          ></div>
          <div className="relative w-full h-full max-h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 zoom-in-95 animate-in duration-300">
            <button 
              onClick={() => setPlayingVideoId(null)}
              className="absolute -top-12 right-0 sm:top-16 sm:right-6 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white/70 hover:text-white transition-colors z-[110] backdrop-blur-sm"
            >
              <X size={24} />
            </button>

            {/* Main Video Area */}
            <div className="w-full h-full relative bg-black flex items-center justify-center min-h-[300px]">
              <YouTube
                videoId={playingVideoId}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: { autoplay: 1 }
                }}
                className="absolute inset-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                onReady={(event) => {
                  playerRef.current = event.target;
                }}
              />
            </div>

            {/* Smart Notepad Sidebar */}
            {showNotepad && (
              <div className="absolute top-4 right-4 bottom-4 w-80 md:w-[350px] z-[120] shadow-2xl overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 animate-in slide-in-from-right duration-300">
                <SmartNotepad
                  videoId={videos.find(v => v.youtubeId === playingVideoId)?.id || ''}
                  initialNotes={videos.find(v => v.youtubeId === playingVideoId)?.notes || ''}
                  onSeek={(seconds) => {
                    if (playerRef.current) {
                      playerRef.current.seekTo(seconds);
                    }
                  }}
                  onClose={() => setShowNotepad(false)}
                  onSave={(vidId, newNotes) => {
                    setVideos(prev => prev.map(v => v.id === vidId ? { ...v, notes: newNotes } : v));
                  }}
                  getCurrentTime={async () => {
                    if (playerRef.current && playerRef.current.getCurrentTime) {
                      return await playerRef.current.getCurrentTime();
                    }
                    return 0;
                  }}
                />
              </div>
            )}
          </div>

          {/* Open Smart Notes Button (Fixed at bottom right of screen) */}
          {!showNotepad && (
            <button
              onClick={() => setShowNotepad(true)}
              className="absolute bottom-10 right-6 md:bottom-[56px] md:right-12 z-[120] bg-emerald-600/90 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2.5 border border-emerald-400/30 group"
            >
              <FileText size={18} className="group-hover:animate-pulse" />
              <span className="font-bold text-sm tracking-wide">
                Smart Notes
              </span>
            </button>
          )}
        </div>
      )}

      {/* List View Modal */}
      {showListModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowListModal(false)}>
          <div className="bg-white dark:bg-zinc-950 rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-black/10 dark:border-white/10 relative max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowListModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 pr-10">All Videos in {collection?.name}</h3>
            
            <div className="relative mb-6 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text"
                placeholder="Search videos by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-500"
              />
            </div>
            
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())).map(v => v.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="overflow-y-auto space-y-2 pr-2 custom-scrollbar flex-1 min-h-0">
                  {videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())).map(video => (
                    <SortableListItem
                      key={video.id}
                      video={video}
                      onPlay={(id) => {
                        setPlayingVideoId(id);
                        setShowListModal(false);
                      }}
                      disabled={searchQuery.trim().length > 0}
                    />
                  ))}
                  {videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="text-center py-10">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-3">
                        <Search className="text-zinc-400" size={20} />
                      </div>
                      <p className="text-zinc-500 text-sm font-medium">No videos found matching &quot;{searchQuery}&quot;</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}

    </AppShell>
  );
}
