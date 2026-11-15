import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, PlayCircle, PlaySquare, GripVertical } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail?: string;
  duration?: string;
  status: string;
}

interface SortableListItemProps {
  video: Video;
  onPlay: (youtubeId: string) => void;
  disabled?: boolean;
}

export function SortableListItem({ video, onPlay, disabled }: SortableListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`w-full text-left p-4 rounded-xl border ${isDragging ? 'border-brand-500 shadow-xl bg-white dark:bg-zinc-900 scale-[1.01]' : 'border-black/5 dark:border-white/5 hover:border-brand-500/50 hover:bg-brand-50 dark:hover:bg-brand-500/10'} transition-all flex items-start gap-3 group bg-white dark:bg-zinc-950`}
    >
      {!disabled && (
        <div 
          className="mt-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-grab active:cursor-grabbing p-1"
          {...attributes} 
          {...listeners}
        >
          <GripVertical size={20} />
        </div>
      )}
      
      <button
        onClick={() => onPlay(video.youtubeId)}
        className="flex-1 flex items-start gap-4 text-left group/btn"
      >
        <div className="w-24 h-16 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 overflow-hidden relative border border-black/5 dark:border-white/5">
          {video.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlaySquare size={20} className="text-zinc-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity">
            <PlayCircle className="text-white drop-shadow-md" size={24} />
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center h-full mt-1">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white truncate mb-1 group-hover/btn:text-brand-600 dark:group-hover/btn:text-brand-400 transition-colors">{video.title}</h4>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${video.status === 'Watched' ? 'bg-brand-50 text-brand-600 border-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20' : video.status === 'Watching' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'}`}>{video.status}</span>
            {video.duration && <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Clock size={10} /> {video.duration}</span>}
          </div>
        </div>
      </button>
    </div>
  );
}
