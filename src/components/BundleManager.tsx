'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trash2, Link as LinkIcon, Plus, Loader2, Heart, LayoutList, LayoutGrid,
  CheckCircle2, PlayCircle, GripVertical, Share2, Lock, Clock, Eye, Settings,
} from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Toast from './Toast';
import ShareModal from './ShareModal';
import BundleSettingsModal, { type BundleSecurity } from './BundleSettingsModal';
import { ConfirmModal } from './confirm-modal';
import { IconRenderer } from '@/lib/icons';
import api from '@/lib/api';

export interface BundleLink {
  id: string;
  url: string;
  title?: string | null;
  description?: string | null;
  favicon?: string | null;
  note?: string | null;
  isWatched?: boolean;
  isEditing?: boolean;
}

export interface BundleData {
  id: string;
  shortId: string;
  name: string;
  description?: string | null;
  category?: string | null;
  icon?: string | null;
  isFavorite: boolean;
  views: number;
  hasPassword?: boolean;
  expiresAt?: string | Date | null;
  links: BundleLink[];
}

const inputCls =
  'w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all';

function Favicon({ src, size }: { src?: string | null; size: number }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div style={{ width: size, height: size }} className="rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
        <LinkIcon size={size * 0.6} className="text-zinc-500" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" style={{ width: size, height: size }} className="rounded-md shadow-sm shrink-0" onError={() => setErr(true)} />;
}

interface ItemProps {
  link: BundleLink;
  isFetching: boolean;
  onChange: (id: string, field: keyof BundleLink, value: unknown) => void;
  onUrlBlur: (id: string, url: string) => void;
  onDone: (id: string) => void;
  onRemove: (id: string) => void;
  onToggleWatched: (id: string) => void;
}

function SortableLink({ link, isFetching, onChange, onUrlBlur, onDone, onRemove, onToggleWatched }: ItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
    disabled: !!link.isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start gap-3 ${isDragging ? 'opacity-80 shadow-2xl' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className={`p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 touch-none ${link.isEditing ? 'mt-2 cursor-not-allowed opacity-40' : 'cursor-grab active:cursor-grabbing'}`}
        aria-label="Drag to reorder"
      >
        <GripVertical size={20} />
      </button>

      <div className="flex-1 flex flex-col gap-2.5 overflow-hidden">
        {link.isEditing ? (
          <>
            <div
              className={`flex items-center gap-3 bg-zinc-50 dark:bg-black border ${!link.url.trim() ? 'border-rose-500/50' : 'border-black/5 dark:border-white/5'} rounded-xl p-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all`}
            >
              <Favicon src={link.favicon} size={20} />
              <input
                type="text"
                placeholder="URL (e.g. https://react.dev) *"
                value={link.url}
                autoFocus
                onChange={(e) => onChange(link.id, 'url', e.target.value)}
                onBlur={(e) => onUrlBlur(link.id, e.target.value)}
                className="w-full bg-transparent border-none outline-none text-zinc-900 dark:text-white"
              />
              {isFetching && <Loader2 size={16} className="animate-spin text-emerald-500 ml-auto" />}
            </div>
            <input
              type="text"
              placeholder="Title (e.g. React Documentation)"
              value={link.title || ''}
              onChange={(e) => onChange(link.id, 'title', e.target.value)}
              className={inputCls}
            />
            <input
              type="text"
              placeholder="Note (e.g. Start with the Quick Start page)"
              value={link.note || ''}
              onChange={(e) => onChange(link.id, 'note', e.target.value)}
              className={inputCls}
            />
            <div className="flex gap-3 mt-2">
              <button
                className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-semibold rounded-lg px-6 py-2 transition-colors disabled:opacity-50"
                disabled={!link.url.trim()}
                onClick={() => onDone(link.id)}
              >
                Done
              </button>
              <button
                type="button"
                className="text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg transition-colors"
                onClick={() => onRemove(link.id)}
                title="Remove Link"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <Favicon src={link.favicon} size={24} />
              <h4 className="m-0 text-base font-bold text-zinc-900 dark:text-white truncate">{link.title || link.url}</h4>
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 text-sm break-all hover:underline"
            >
              {link.url}
            </a>
            {(link.note || link.description) && (
              <p className="m-0 text-zinc-600 dark:text-zinc-400 text-[13px] leading-relaxed line-clamp-3">
                {link.note || link.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-1">
              <button
                className={`border transition-all flex items-center gap-1.5 font-medium rounded-lg px-3 py-1 text-xs ${
                  link.isWatched
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-white dark:bg-black/50 border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
                onClick={() => onToggleWatched(link.id)}
              >
                <CheckCircle2 size={14} />
                {link.isWatched ? 'Visited' : 'Mark as Visited'}
              </button>
              <button
                className="bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg px-3 py-1 text-xs transition-all"
                onClick={() => onChange(link.id, 'isEditing', true)}
              >
                Edit
              </button>
              <button
                className="bg-white dark:bg-black/50 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-medium rounded-lg px-3 py-1 text-xs transition-all"
                onClick={() => onRemove(link.id)}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const newId = () => `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export default function BundleManager({ initialBundle }: { initialBundle: BundleData }) {
  const [links, setLinks] = useState<BundleLink[]>(initialBundle.links || []);
  const [isFavorite, setIsFavorite] = useState(initialBundle.isFavorite);
  const [fetchingId, setFetchingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [security, setSecurity] = useState<BundleSecurity>({
    hasPassword: !!initialBundle.hasPassword,
    expiresAt: initialBundle.expiresAt ? new Date(initialBundle.expiresAt).toISOString() : null,
  });
  const [now] = useState(() => Date.now());
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const showError = (message: string) => setToast({ message, type: 'error' });

  const saveLinks = async (next: BundleLink[]) => {
    const valid = next
      .filter((l) => l.url && l.url.trim() && !l.isEditing)
      .map(({ url, title, description, favicon, note, isWatched }) => ({ url, title, description, favicon, note, isWatched }));
    try {
      await api.put(`/bundles/${initialBundle.shortId}/links`, { links: valid });
      router.refresh();
    } catch {
      showError('Failed to save links.');
    }
  };

  /** Update local state and persist. */
  const commit = (next: BundleLink[]) => {
    setLinks(next);
    saveLinks(next);
  };

  const handleToggleFavorite = async () => {
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      await api.put(`/bundles/${initialBundle.shortId}`, { isFavorite: next });
    } catch {
      setIsFavorite(!next);
      showError('Failed to update favorite status.');
    }
  };

  const handleDeleteBundle = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/bundles/${initialBundle.shortId}`);
      router.push('/dashboard/bundles');
      router.refresh();
    } catch {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      showError('Failed to delete bundle.');
    }
  };

  const handleAddNewLink = () => {
    setLinks((prev) => [{ id: newId(), url: '', title: '', description: '', favicon: '', note: '', isEditing: true }, ...prev]);
  };

  const updateLink = (id: string, field: keyof BundleLink, value: unknown) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const handleUrlBlur = async (id: string, url: string) => {
    if (!url.trim()) return;
    let validUrl = url.trim();
    if (!/^https?:\/\//i.test(validUrl)) validUrl = 'https://' + validUrl;
    updateLink(id, 'url', validUrl);

    const link = links.find((l) => l.id === id);
    if (link && link.title && link.url === validUrl) return;

    setFetchingId(id);
    try {
      const { data } = await api.get('/metadata', { params: { url: validUrl } });
      setLinks((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                url: validUrl,
                title: l.title || data.title || validUrl,
                description: l.description || data.description || '',
                favicon: data.favicon || '',
              }
            : l,
        ),
      );
    } catch {
      // metadata is optional - keep what the user typed
    } finally {
      setFetchingId(null);
    }
  };

  const finishEditingLink = (id: string) => commit(links.map((l) => (l.id === id ? { ...l, isEditing: false } : l)));
  const removeLink = (id: string) => commit(links.filter((l) => l.id !== id));
  const toggleWatched = (id: string) => commit(links.map((l) => (l.id === id ? { ...l, isWatched: !l.isWatched } : l)));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    commit(arrayMove(links, oldIndex, newIndex));
  };

  const savedLinks = links.filter((l) => !l.isEditing && l.url.trim());
  const watchedCount = savedLinks.filter((l) => l.isWatched).length;
  const progress = savedLinks.length > 0 ? Math.round((watchedCount / savedLinks.length) * 100) : 0;
  const expired = !!security.expiresAt && new Date(security.expiresAt).getTime() < now;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 text-left pb-16 animate-fade-in">
        <div className="bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <IconRenderer iconName={initialBundle.icon || 'Folder'} size={30} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white m-0 tracking-tight">{initialBundle.name}</h1>
                  {initialBundle.category && (
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold rounded-lg">
                      {initialBundle.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-wrap text-zinc-500 dark:text-zinc-400 font-medium text-sm">
                  <span className="flex items-center gap-1.5">
                    <PlayCircle size={16} /> {savedLinks.length} Links
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={16} /> {watchedCount} Completed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye size={16} /> {initialBundle.views} views
                  </span>
                  {security.hasPassword && (
                    <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <Lock size={14} /> Protected
                    </span>
                  )}
                  {security.expiresAt && (
                    <span className={`flex items-center gap-1.5 ${expired ? 'text-rose-500' : 'text-amber-600 dark:text-amber-400'}`}>
                      <Clock size={14} /> {expired ? 'Expired' : `Expires ${new Date(security.expiresAt).toLocaleString()}`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold transition-colors"
              >
                {viewMode === 'list' ? <LayoutGrid size={18} /> : <LayoutList size={18} />}
                <span className="hidden sm:inline">{viewMode === 'list' ? 'Grid' : 'List'}</span>
              </button>
              <button
                onClick={handleToggleFavorite}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold transition-colors"
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-rose-500' : ''} />
                <span className="hidden sm:inline">Favorite</span>
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold transition-colors"
                title="Password & self-destruct"
              >
                <Settings size={18} />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button
                onClick={() => setIsShareOpen(true)}
                disabled={!!expired}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold transition-colors disabled:opacity-50"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={handleAddNewLink}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm"
              >
                <Plus size={18} /> Add Link
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center justify-center p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors"
                title="Delete Bundle"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {initialBundle.description && <p className="text-zinc-600 dark:text-zinc-400 -mt-2">{initialBundle.description}</p>}

          <hr className="border-zinc-100 dark:border-zinc-800" />

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-zinc-500 dark:text-zinc-400">Bundle Progress</span>
              <span className="text-zinc-900 dark:text-white">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="w-full mt-2">
          {links.length === 0 && (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 bg-white/50 dark:bg-zinc-950/50 rounded-[32px] border border-dashed border-zinc-300 dark:border-zinc-700">
              No links added yet. Click &quot;Add Link&quot; to get started.
            </div>
          )}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={links.map((l) => l.id)} strategy={rectSortingStrategy}>
              <div className={viewMode === 'list' ? 'flex flex-col gap-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                {links.map((link) => (
                  <SortableLink
                    key={link.id}
                    link={link}
                    isFetching={fetchingId === link.id}
                    onChange={updateLink}
                    onUrlBlur={handleUrlBlur}
                    onDone={finishEditingLink}
                    onRemove={removeLink}
                    onToggleWatched={toggleWatched}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {isShareOpen && (
        <ShareModal
          bundle={{ ...initialBundle, ...security, links: savedLinks }}
          onClose={() => setIsShareOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <BundleSettingsModal
          shortId={initialBundle.shortId}
          security={security}
          onClose={() => setIsSettingsOpen(false)}
          onSaved={(next) => {
            setSecurity(next);
            setToast({ message: 'Settings saved.', type: 'success' });
            router.refresh();
          }}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBundle}
        isLoading={isDeleting}
        title="Delete Bundle"
        message="Are you sure you want to delete this bundle? This action cannot be undone."
        confirmText="Delete Bundle"
        isDestructive
      />
    </>
  );
}
